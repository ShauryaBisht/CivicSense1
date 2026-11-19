import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_ISSUES, INITIAL_NOTIFICATIONS } from '../data/mockIssues';
import {
  fetchIssuesFromBackend,
  createIssueInBackend,
  updateIssueInBackend,
  fetchNotificationsFromBackend,
  markNotificationsReadInBackend,
  seedIssuesToBackend,
  subscribeToIssuesRealtime,
  fromDbIssue
} from '../services/civicBackend';

const CivicContext = createContext();

const LOCAL_STORAGE_KEY = 'civicfix_issues_bengaluru_v1';
const NOTIFICATIONS_KEY = 'civicfix_notifications_bengaluru_v1';
const THEME_KEY = 'civicfix_theme_preference';
const OFFLINE_QUEUE_KEY = 'civicfix_offline_queue_v1';
const KARMA_KEY = 'civicfix_user_karma_v1';

export function CivicProvider({ children }) {
  // Theme State: 'light' | 'dark'
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored === 'dark' || stored === 'light') {
        return stored;
      }
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch (e) {
      console.warn('Failed to read theme preference from storage', e);
    }
    return 'light';
  });

  // Online / Offline PWA state
  const [isOnline, setIsOnline] = useState(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));
  const [offlineQueue, setOfflineQueue] = useState(() => {
    try {
      const stored = localStorage.getItem(OFFLINE_QUEUE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  // Backend connection status
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Civic Karma Profile State
  const [userKarma, setUserKarma] = useState(() => {
    try {
      const stored = localStorage.getItem(KARMA_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return {
      points: 135,
      reportsCount: 2,
      endorsementsCount: 7,
      verificationsCount: 1,
      badges: ['ward_watchdog', 'community_champion']
    };
  });

  // Modal States
  const [receiptIssue, setReceiptIssue] = useState(null);
  const [isKarmaModalOpen, setIsKarmaModalOpen] = useState(false);

  // Sync Karma to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(KARMA_KEY, JSON.stringify(userKarma));
    } catch (e) {}
  }, [userKarma]);

  // Sync Offline Queue
  useEffect(() => {
    try {
      localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(offlineQueue));
    } catch (e) {}
  }, [offlineQueue]);

  // Award Karma Points Helper
  const awardKarma = (actionType, extraPoints = 0) => {
    setUserKarma((prev) => {
      let addPts = extraPoints;
      let newReports = prev.reportsCount;
      let newEndorsements = prev.endorsementsCount;
      let newVerifications = prev.verificationsCount;

      if (actionType === 'report') {
        addPts = addPts || 50;
        newReports += 1;
      } else if (actionType === 'endorse') {
        addPts = addPts || 10;
        newEndorsements += 1;
      } else if (actionType === 'verify') {
        addPts = addPts || 30;
        newVerifications += 1;
      }

      const newBadges = [...prev.badges];
      if (newReports >= 2 && !newBadges.includes('ward_watchdog')) newBadges.push('ward_watchdog');
      if (newEndorsements >= 5 && !newBadges.includes('community_champion')) newBadges.push('community_champion');
      if (newVerifications >= 1 && !newBadges.includes('ground_auditor')) newBadges.push('ground_auditor');
      if (newReports >= 5 && !newBadges.includes('civic_sentinel')) newBadges.push('civic_sentinel');

      return {
        points: prev.points + addPts,
        reportsCount: newReports,
        endorsementsCount: newEndorsements,
        verificationsCount: newVerifications,
        badges: newBadges
      };
    });
  };

  // 1. Issues State (Initialize from localStorage or default dataset)
  const [issues, setIssues] = useState(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse issues from localStorage', e);
    }
    return INITIAL_ISSUES;
  });

  // 2. Notifications State
  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem(NOTIFICATIONS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse notifications', e);
    }
    return INITIAL_NOTIFICATIONS;
  });

  // 3. User Role: 'citizen' or 'admin'
  const [role, setRole] = useState('citizen');

  // 4. View Mode: 'feed' | 'map' | 'admin' | 'wards'
  const [activeTab, setActiveTab] = useState('feed');

  // 5. Selected issue for viewing details
  const [selectedIssue, setSelectedIssue] = useState(null);

  // 6. Selected issue for admin management drawer
  const [selectedForManage, setSelectedForManage] = useState(null);

  // 7. Report an Issue modal open/close
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // 8. Filters State
  const [filter, setFilter] = useState({
    search: '',
    category: 'All',
    urgency: 'All',
    status: 'All',
    sortBy: 'upvotes',
    radiusKm: 15
  });

  // 9. Toast notifications system
  const [toasts, setToasts] = useState([]);

  // Fetch live backend data from Supabase on mount & setup Realtime listeners
  useEffect(() => {
    let isMounted = true;

    async function loadBackendData() {
      try {
        const backendIssues = await fetchIssuesFromBackend();
        if (backendIssues && backendIssues.length > 0 && isMounted) {
          setIssues(backendIssues);
          setIsBackendConnected(true);
        }

        const backendNotifs = await fetchNotificationsFromBackend();
        if (backendNotifs && backendNotifs.length > 0 && isMounted) {
          setNotifications(backendNotifs);
        }
      } catch (err) {
        console.warn('Backend load notice:', err);
      }
    }

    loadBackendData();

    // Subscribe to real-time changes from other users / officials
    const unsubscribe = subscribeToIssuesRealtime((payload) => {
      if (!isMounted) return;
      if (payload.eventType === 'INSERT' && payload.new) {
        const incoming = fromDbIssue(payload.new);
        setIssues((prev) => {
          if (prev.some((i) => i.id === incoming.id)) return prev;
          return [incoming, ...prev];
        });
      } else if (payload.eventType === 'UPDATE' && payload.new) {
        const updated = fromDbIssue(payload.new);
        setIssues((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
      } else if (payload.eventType === 'DELETE' && payload.old) {
        setIssues((prev) => prev.filter((i) => i.id !== payload.old.id));
      }
    });

    return () => {
      isMounted = false;
      unsubscribe?.();
    };
  }, []);

  // Online / Offline Listeners & Queue Flush
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Flush offline queue to municipal backend
      try {
        const stored = localStorage.getItem(OFFLINE_QUEUE_KEY);
        const queued = stored ? JSON.parse(stored) : [];
        if (queued.length > 0) {
          setIssues((prev) => [...queued, ...prev]);
          setOfflineQueue([]);
          localStorage.removeItem(OFFLINE_QUEUE_KEY);
          queued.forEach((item) => createIssueInBackend(item));
          addToast(`Synced ${queued.length} offline grievances to municipal dispatch backend!`, 'success');
        } else {
          addToast('Internet restored. Live dispatch feed active.', 'info');
        }
      } catch (e) {}
    };

    const handleOffline = () => {
      setIsOnline(false);
      addToast('Offline Mode: Grievance submissions will be stored locally and synced when connection resumes.', 'warning');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, theme);
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
        root.setAttribute('data-theme', 'dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        root.setAttribute('data-theme', 'light');
        root.style.colorScheme = 'light';
      }
    } catch (e) {
      console.error('Failed to apply theme class', e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Persist issues to localStorage backup
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(issues));
    } catch (e) {
      console.error('Failed to save issues to localStorage', e);
    }
  }, [issues]);

  // Persist notifications on change
  useEffect(() => {
    try {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    } catch (e) {
      console.error('Failed to save notifications', e);
    }
  }, [notifications]);

  // Sync selectedIssue with latest state when issues change
  useEffect(() => {
    if (selectedIssue) {
      const updated = issues.find((i) => i.id === selectedIssue.id);
      if (updated) setSelectedIssue(updated);
    }
  }, [issues]);

  const addToast = (message, type = 'info') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Add new issue from Report Wizard
  const addIssue = (newIssueData) => {
    const randomTicketNum = Math.floor(1000 + Math.random() * 9000);
    const ticketId = `#CIVIC-${randomTicketNum}`;
    const id = 'issue-' + Date.now();
    const nowIso = new Date().toISOString();

    const createdIssue = {
      id,
      ticketId,
      title: newIssueData.title,
      description: newIssueData.description,
      category: newIssueData.category,
      urgency: newIssueData.urgency || 'Medium',
      status: 'Submitted',
      location: {
        lat: newIssueData.location?.lat || 12.9716,
        lng: newIssueData.location?.lng || 77.5946,
        address: newIssueData.location?.address || 'MG Road / City Center, Bengaluru',
        neighborhood: newIssueData.location?.neighborhood || 'Central Bengaluru',
        landmark: newIssueData.location?.landmark || ''
      },
      mediaUrl: newIssueData.mediaUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      beforePhotoUrl: newIssueData.mediaUrl,
      afterPhotoUrl: '',
      reportedAt: nowIso,
      updatedAt: nowIso,
      reporter: {
        name: newIssueData.reporter?.name || (newIssueData.isAnonymous ? 'Anonymous Citizen' : 'Civic Member'),
        contact: newIssueData.reporter?.contact || '',
        isAnonymous: !!newIssueData.isAnonymous,
        userId: newIssueData.reporter?.userId || null
      },
      upvotes: 1,
      hasUpvoted: true,
      department: newIssueData.department || 'BBMP Road Infrastructure',
      assignedTeam: null,
      eta: 'Awaiting triage & scheduling',
      timeline: [
        {
          id: 'tl-' + Date.now(),
          status: 'Submitted',
          timestamp: nowIso,
          title: 'Issue Logged by Citizen',
          description: 'Ticket received and queued for automated category triage and municipal dispatch.',
          actor: newIssueData.isAnonymous ? 'Anonymous Citizen' : (newIssueData.reporter?.name || 'Citizen'),
          role: 'Citizen'
        }
      ],
      comments: [],
      triageMetadata: newIssueData.triageMetadata || newIssueData.aiMetadata || {
        confidence: 94,
        detectedKeywords: ['citizen report'],
        reasoning: 'Automated triage verified submission location and context parameters.'
      }
    };

    if (!isOnline) {
      setOfflineQueue((prev) => [createdIssue, ...prev]);
      addToast(`Offline: Issue ${ticketId} stored locally. It will auto-sync when connection restores.`, 'warning');
    } else {
      setIssues((prev) => [createdIssue, ...prev]);
      addToast(`Issue ${ticketId} successfully submitted! Tracking is now active.`, 'success');
      // Sync to live Supabase backend
      createIssueInBackend(createdIssue);
    }

    awardKarma('report', 50);
    return createdIssue;
  };

  // Upvote issue
  const upvoteIssue = (issueId) => {
    setIssues((prev) =>
      prev.map((item) => {
        if (item.id === issueId) {
          const isUpvoted = !item.hasUpvoted;
          const delta = isUpvoted ? 1 : -1;
          const newVotes = Math.max(0, item.upvotes + delta);
          if (isUpvoted) {
            awardKarma('endorse', 10);
          }
          addToast(
            isUpvoted
              ? `Endorsed ${item.ticketId}! Priority boosted in municipal queue.`
              : `Removed endorsement from ${item.ticketId}.`,
            'info'
          );

          const updated = {
            ...item,
            upvotes: newVotes,
            hasUpvoted: isUpvoted
          };

          // Update backend row
          updateIssueInBackend(issueId, updated);
          return updated;
        }
        return item;
      })
    );
  };

  // Add community comment
  const addComment = (issueId, content, authorName = 'Civic Resident') => {
    if (!content.trim()) return;

    const newComment = {
      id: 'c-' + Date.now(),
      author: role === 'admin' ? `${authorName} (Municipal Ops)` : authorName,
      avatar: role === 'admin'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      timestamp: new Date().toISOString(),
      content: content.trim(),
      isOfficial: role === 'admin'
    };

    setIssues((prev) =>
      prev.map((item) => {
        if (item.id === issueId) {
          const updated = {
            ...item,
            comments: [...(item.comments || []), newComment]
          };
          updateIssueInBackend(issueId, updated);
          return updated;
        }
        return item;
      })
    );

    addToast('Comment published to community thread.', 'success');
  };

  // Admin updates status
  const updateIssueStatus = (issueId, newStatus, officialNote = '', newEta = '') => {
    const nowIso = new Date().toISOString();

    setIssues((prev) =>
      prev.map((item) => {
        if (item.id === issueId) {
          const timelineEntry = {
            id: 'tl-' + Date.now(),
            status: newStatus,
            timestamp: nowIso,
            title: `Status changed to ${newStatus}`,
            description: officialNote || `Official status updated by Municipal Command.`,
            actor: 'Municipal Command Center',
            role: 'Department Head'
          };

          const updatedIssue = {
            ...item,
            status: newStatus,
            updatedAt: nowIso,
            eta: newEta || item.eta,
            timeline: [...item.timeline, timelineEntry]
          };

          updateIssueInBackend(issueId, updatedIssue);
          return updatedIssue;
        }
        return item;
      })
    );

    addToast(`Ticket status updated to "${newStatus}".`, 'success');
  };

  // Reassign Department / Crew
  const reassignIssue = (issueId, department, teamName, leadWorker, contactNumber) => {
    const nowIso = new Date().toISOString();

    setIssues((prev) =>
      prev.map((item) => {
        if (item.id === issueId) {
          const timelineEntry = {
            id: 'tl-' + Date.now(),
            status: 'Assigned',
            timestamp: nowIso,
            title: `Dispatched to ${teamName || department}`,
            description: `Assigned lead: ${leadWorker || 'Field Supervisor'} (${contactNumber || 'Dispatched via Radio'}).`,
            actor: 'Operations Logistics',
            role: 'Department Head'
          };

          const updated = {
            ...item,
            department: department || item.department,
            status: item.status === 'Submitted' ? 'Assigned' : item.status,
            assignedTeam: {
              name: teamName || 'Regional Maintenance Unit',
              leadWorker: leadWorker || 'Duty Lead',
              contactNumber: contactNumber || '+91 98450 12345'
            },
            updatedAt: nowIso,
            timeline: [...item.timeline, timelineEntry]
          };

          updateIssueInBackend(issueId, updated);
          return updated;
        }
        return item;
      })
    );

    addToast(`Issue reassigned to ${department}. Work order updated.`, 'success');
  };

  // Submit Proof of Work (Resolves issue)
  const submitProofOfWork = (issueId, afterPhotoUrl, resolutionSummary) => {
    const nowIso = new Date().toISOString();

    setIssues((prev) =>
      prev.map((item) => {
        if (item.id === issueId) {
          const timelineEntry = {
            id: 'tl-' + Date.now(),
            status: 'Resolved',
            timestamp: nowIso,
            title: 'Proof of Work Verified & Completed',
            description: resolutionSummary || 'Field crew completed maintenance and uploaded verification media.',
            actor: item.assignedTeam?.leadWorker || 'Municipal Field Team',
            role: 'Field Team'
          };

          const updated = {
            ...item,
            status: 'Resolved',
            afterPhotoUrl: afterPhotoUrl || 'https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=900&q=80',
            eta: 'Completed',
            updatedAt: nowIso,
            timeline: [...item.timeline, timelineEntry]
          };

          updateIssueInBackend(issueId, updated);
          return updated;
        }
        return item;
      })
    );

    addToast('Proof of work logged! Issue marked as Resolved.', 'success');
  };

  // Citizen verification and rating
  const rateResolution = (issueId, rating, feedbackText, isResolvedConfirmed) => {
    const nowIso = new Date().toISOString();

    setIssues((prev) =>
      prev.map((item) => {
        if (item.id === issueId) {
          const feedback = {
            rating,
            feedbackText,
            isResolvedConfirmed,
            citizenName: item.reporter.isAnonymous ? 'Citizen Reviewer' : item.reporter.name,
            timestamp: nowIso
          };

          let newStatus = item.status;
          let timelineEntries = [...item.timeline];

          if (!isResolvedConfirmed) {
            newStatus = 'Under Review';
            timelineEntries.push({
              id: 'tl-' + Date.now(),
              status: 'Under Review',
              timestamp: nowIso,
              title: 'Citizen Flagged Issue Persists',
              description: `Citizen reported: "${feedbackText}". Reopened for inspection audit.`,
              actor: feedback.citizenName,
              role: 'Citizen'
            });
            addToast('Feedback submitted: Ticket flagged as persisting for municipal re-audit.', 'warning');
          } else {
            timelineEntries.push({
              id: 'tl-' + Date.now(),
              status: 'Resolved',
              timestamp: nowIso,
              title: `Citizen Verified Resolution (${rating} Stars)`,
              description: `"${feedbackText || 'Resolution verified by community.'}"`,
              actor: feedback.citizenName,
              role: 'Citizen'
            });
            awardKarma('verify', 30);
            addToast(`Thank you! Verified with a ${rating}-star rating. +30 Civic Karma earned!`, 'success');
          }

          const updated = {
            ...item,
            status: newStatus,
            feedback,
            updatedAt: nowIso,
            timeline: timelineEntries
          };

          updateIssueInBackend(issueId, updated);
          return updated;
        }
        return item;
      })
    );
  };

  // Reset to default demo data and seed backend
  const resetToDefaultData = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(NOTIFICATIONS_KEY);
    setIssues(INITIAL_ISSUES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSelectedIssue(null);
    setSelectedForManage(null);
    seedIssuesToBackend(INITIAL_ISSUES);
    addToast('Reset platform to initial dataset and synchronized with backend.', 'info');
  };

  const markNotifsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    markNotificationsReadInBackend();
  };

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  return (
    <CivicContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        isOnline,
        offlineQueue,
        isBackendConnected,
        userKarma,
        awardKarma,
        receiptIssue,
        setReceiptIssue,
        isKarmaModalOpen,
        setIsKarmaModalOpen,
        issues,
        notifications,
        unreadNotifCount,
        markNotifsRead,
        role,
        setRole,
        activeTab,
        setActiveTab,
        selectedIssue,
        setSelectedIssue,
        selectedForManage,
        setSelectedForManage,
        isReportModalOpen,
        setIsReportModalOpen,
        filter,
        setFilter,
        addIssue,
        upvoteIssue,
        addComment,
        updateIssueStatus,
        reassignIssue,
        submitProofOfWork,
        rateResolution,
        resetToDefaultData,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </CivicContext.Provider>
  );
}

export function useCivic() {
  const context = useContext(CivicContext);
  if (!context) {
    throw new Error('useCivic must be used within a CivicProvider');
  }
  return context;
}
