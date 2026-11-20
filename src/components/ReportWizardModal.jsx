import React, { useState, useEffect, useMemo } from 'react';
import { useCivic } from '../context/CivicContext';
import { useAuth } from '../context/AuthContext';
import { analyzeIssueContent } from '../utils/triageEngine';
import { findNearbySimilarIssues } from '../utils/geoUtils';
import InteractiveMap from './InteractiveMap';
import {
  X,
  Upload,
  MapPin,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Camera,
  Navigation,
  Sparkles,
  User,
  Zap,
  ThumbsUp,
  Printer,
  FileCheck2,
  CopyCheck
} from 'lucide-react';

export default function ReportWizardModal({ isOpen, onClose }) {
  const {
    addIssue,
    setSelectedIssue,
    issues,
    upvoteIssue,
    setReceiptIssue,
    addToast,
    categories,
    urgencies,
    sampleImages
  } = useCivic();
  const { user, profile, openLogin } = useAuth();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedIssue, setSubmittedIssue] = useState(null);
  const [dismissedDuplicateId, setDismissedDuplicateId] = useState(null);

  // Form State
  const [mediaUrl, setMediaUrl] = useState(sampleImages?.[0]?.url || '');
  const [imageFileName, setImageFileName] = useState('');
  const [location, setLocation] = useState({
    lat: 12.9352,
    lng: 77.6245,
    address: '80 Feet Road, 5th Block, Koramangala',
    neighborhood: 'Koramangala'
  });
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Infrastructure');
  const [urgency, setUrgency] = useState('Medium');
  const [triageNote, setTriageNote] = useState(null);
  const [reporterName, setReporterName] = useState(profile?.fullName || '');
  const [reporterContact, setReporterContact] = useState(profile?.phone || profile?.email || '');
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Detect nearby similar active issues (Smart Deduplication)
  const nearbyDuplicates = useMemo(() => {
    if (step < 2) return [];
    return findNearbySimilarIssues(location, category, issues, 300);
  }, [location, category, issues, step]);

  const primaryDuplicate = nearbyDuplicates.find((d) => d.id !== dismissedDuplicateId);

  const handleEndorseDuplicate = (duplicate) => {
    upvoteIssue(duplicate.id);
    onClose();
    setSelectedIssue(duplicate);
    addToast(`Endorsed existing issue ${duplicate.ticketId} (+10 Karma). Priority escalated!`, 'success');
  };

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setTitle('');
      setDescription('');
      setCategory('Infrastructure');
      setUrgency('Medium');
      setTriageNote(null);
      setSubmittedIssue(null);
      setMediaUrl(sampleImages?.[0]?.url || '');
      setImageFileName('');
      setReporterName(profile?.fullName || '');
      setReporterContact(profile?.phone || profile?.email || '');
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  if (!user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
        <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 text-center">
          <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center mb-4">
            <User className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            Authentication Required
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
            You must be signed in with your civic account to report grievances, upload geo-tagged photos, and track resolution progress.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onClose();
                openLogin();
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-md shadow-blue-500/20 cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle local image file upload preview
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFileName(file.name);
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setMediaUrl(uploadEvent.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Run keyword-based category classifier
  const handleAutoDetect = () => {
    if (!title.trim() && !description.trim()) {
      alert('Please enter a title or description first to auto-classify.');
      return;
    }
    const result = analyzeIssueContent(title, description);
    setCategory(result.category);
    setUrgency(result.urgency);
    setTriageNote(
      `Classification matched: ${result.category} (${result.urgency} Urgency). Keywords detected: ${result.detectedKeywords.join(', ')}`
    );
  };

  // Handle final submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      addToast('You must be signed in to submit an issue.', 'error');
      openLogin();
      return;
    }
    setIsSubmitting(true);

    setTimeout(() => {
      const created = addIssue({
        title: title || 'Civic Issue Report',
        description: description || 'Reported by local resident.',
        category,
        urgency,
        location,
        mediaUrl,
        reporter: {
          name: isAnonymous ? 'Anonymous Resident' : (reporterName || profile?.fullName || 'Citizen'),
          contact: isAnonymous ? '' : (reporterContact || profile?.phone || profile?.email || ''),
          isAnonymous,
          userId: user?.id || null
        }
      });

      setIsSubmitting(false);
      setSubmittedIssue(created);
      setStep(5); // Step 5 is Success Screen
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto transition-opacity">
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700/80 overflow-hidden flex flex-col my-auto max-h-[92vh] transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="p-4 bg-slate-900 dark:bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg leading-tight">
                Report a Municipal Grievance
              </h2>
              <p className="text-[11px] text-slate-400">
                Lodge civic issue with ward public works
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Step Progress Header */}
        {step <= 4 && (
          <div className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700/70 px-4 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <div className={`flex items-center gap-1.5 ${step === 1 ? 'text-blue-600 dark:text-blue-400 font-bold' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>1</span>
              <span>Photo</span>
            </div>
            <span className="text-slate-300 dark:text-slate-600">→</span>
            <div className={`flex items-center gap-1.5 ${step === 2 ? 'text-blue-600 dark:text-blue-400 font-bold' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>2</span>
              <span>Location</span>
            </div>
            <span className="text-slate-300 dark:text-slate-600">→</span>
            <div className={`flex items-center gap-1.5 ${step === 3 ? 'text-blue-600 dark:text-blue-400 font-bold' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 3 ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>3</span>
              <span>Details</span>
            </div>
            <span className="text-slate-300 dark:text-slate-600">→</span>
            <div className={`flex items-center gap-1.5 ${step === 4 ? 'text-blue-600 dark:text-blue-400 font-bold' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 4 ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>4</span>
              <span>Review</span>
            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-slate-800 dark:text-slate-200">
          
          {/* STEP 1: PHOTO / MEDIA */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  Step 1: Upload Incident Photo
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  A clear photograph helps ward response engineers immediately assess required equipment and crew size.
                </p>
              </div>

              {/* Photo Preview Box */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900/60 aspect-video flex items-center justify-center relative">
                {mediaUrl ? (
                  <img
                    src={mediaUrl}
                    alt="Issue Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-slate-400 p-4">
                    <Camera className="w-8 h-8 mx-auto mb-1 text-slate-300 dark:text-slate-600" />
                    <span className="text-xs">No image selected</span>
                  </div>
                )}
              </div>

              {/* File Upload Input */}
              <div className="border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 text-center bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-900/80 transition-colors">
                <label className="cursor-pointer block text-xs font-semibold text-blue-600 dark:text-blue-400">
                  <Upload className="w-4 h-4 mx-auto mb-1.5" />
                  <span>Choose file from your device</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                {imageFileName && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Selected file: {imageFileName}
                  </p>
                )}
              </div>

              {/* Preset Sample Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Or select sample test incident:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(sampleImages || []).map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setMediaUrl(preset.url)}
                      className={`text-xs p-2 rounded-lg border text-left truncate transition-all cursor-pointer ${
                        mediaUrl === preset.url
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-200 font-bold shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: LOCATION */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  Step 2: Pinpoint Ward Location on Map
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Click on the map or drag the marker to set the exact position.
                </p>
              </div>

              {/* Interactive Picker Map */}
              <div className="h-60 sm:h-64 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs">
                <InteractiveMap
                  mode="picker"
                  selectedLocation={location}
                  onLocationSelect={(newLoc) => setLocation(newLoc)}
                  height="100%"
                />
              </div>

              {/* Location Text Input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Street Address / Landmark
                  </label>
                  <input
                    type="text"
                    value={location.address}
                    onChange={(e) => setLocation({ ...location, address: e.target.value })}
                    placeholder="e.g. 80 Feet Road, Near Sony World Signal"
                    className="w-full border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/30 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Ward / Locality
                  </label>
                  <input
                    type="text"
                    value={location.neighborhood}
                    onChange={(e) => setLocation({ ...location, neighborhood: e.target.value })}
                    placeholder="e.g. Koramangala, Indiranagar, HSR Layout"
                    className="w-full border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/30 focus:outline-none"
                  />
                </div>
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <span>Coordinates: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
                <span className="text-blue-600 dark:text-blue-400 font-semibold">GPS Geo-Tagged</span>
              </div>

              {/* Smart Duplicate Grievance Alert */}
              {primaryDuplicate && (
                <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl p-3.5 space-y-2.5 animate-in fade-in transition-all">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                      <span className="font-bold text-amber-950 dark:text-amber-200 text-xs">
                        Nearby Existing Grievance Found ({primaryDuplicate.distanceMeters}m away)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDismissedDuplicateId(primaryDuplicate.id)}
                      className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      Dismiss
                    </button>
                  </div>

                  <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-amber-200 dark:border-amber-900/60">
                    {primaryDuplicate.mediaUrl && (
                      <img
                        src={primaryDuplicate.mediaUrl}
                        alt=""
                        className="w-12 h-12 rounded object-cover flex-shrink-0 border border-slate-200 dark:border-slate-700"
                      />
                    )}
                    <div className="min-w-0 flex-1 text-xs">
                      <div className="flex items-center gap-1.5 font-mono font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                        <span>{primaryDuplicate.ticketId}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500 font-sans">{primaryDuplicate.category}</span>
                      </div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {primaryDuplicate.title}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        📍 {primaryDuplicate.location.address}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1 text-xs">
                    <span className="text-[11px] text-amber-900 dark:text-amber-300">
                      Already logged with <strong>{primaryDuplicate.upvotes || 0} citizen endorsements</strong>.
                    </span>
                    <button
                      type="button"
                      onClick={() => handleEndorseDuplicate(primaryDuplicate)}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Endorse Existing (+10 Karma)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: DETAILS & CATEGORIZATION */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  Step 3: Issue Details & Categorization
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Provide a concise title and description. You can click "Auto-Suggest Category" to scan your report for relevant keywords.
                </p>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Issue Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Severe pothole causing vehicular damage near 4th Cross"
                  className="w-full border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/30 focus:outline-none"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Detailed Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue, approximate size, immediate danger, and duration..."
                  className="w-full border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/30 focus:outline-none"
                  required
                />
              </div>

              {/* Keyword Classifier Helper */}
              <div className="bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="text-xs text-blue-900 dark:text-blue-200">
                  <span className="font-bold">Automated Category Matcher: </span>
                  <span className="text-[11px] text-blue-800/80 dark:text-blue-300/80">
                    Parse problem keywords to auto-select Category and Urgency.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleAutoDetect}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap self-start sm:self-center shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Auto-Suggest Category</span>
                </button>
              </div>

              {triageNote && (
                <div className="text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 p-2.5 rounded-lg flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{triageNote}</span>
                </div>
              )}

              {/* Category & Urgency Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/30 focus:outline-none cursor-pointer"
                  >
                    {(categories || []).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Urgency Level
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="w-full border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/30 focus:outline-none cursor-pointer"
                  >
                    {(urgencies || []).map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Reporter Info */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Citizen Contact Info
                  </span>
                  <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Submit Anonymously</span>
                  </label>
                </div>

                {!isAnonymous && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      className="border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                    />
                    <input
                      type="text"
                      placeholder="Email or Phone Number"
                      value={reporterContact}
                      onChange={(e) => setReporterContact(e.target.value)}
                      className="border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW & SUBMIT */}
          {step === 4 && (
            <div className="space-y-4 text-xs">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  Step 4: Confirm Your Grievance Submission
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Confirm the details below before submitting to municipal dispatch.
                </p>
              </div>

              <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-slate-50 dark:bg-slate-900/50 space-y-3">
                <div className="flex items-start gap-3.5">
                  {mediaUrl && (
                    <img
                      src={mediaUrl}
                      alt="Thumbnail"
                      className="w-20 h-20 object-cover rounded-lg border border-slate-300 dark:border-slate-700 flex-shrink-0"
                    />
                  )}
                  <div className="space-y-1">
                    <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {title || 'Untitled Complaint'}
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 line-clamp-2">
                      {description || 'No description provided.'}
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-2.5 py-0.5 rounded-full font-semibold text-[10px]">
                        {category}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        urgency === 'Emergency' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300' :
                        urgency === 'High' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                      }`}>
                        {urgency} Priority
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-200 dark:border-slate-700/60 space-y-1.5 text-slate-600 dark:text-slate-400 text-xs">
                  <div><strong>Location:</strong> {location.address} ({location.neighborhood})</div>
                  <div><strong>Citizen Contact:</strong> {isAnonymous ? 'Anonymous Citizen' : (reporterName || 'Citizen')}</div>
                </div>
              </div>

              <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 rounded-xl border border-blue-200 dark:border-blue-800 text-xs flex items-center gap-2">
                <span className="text-base">ℹ️</span>
                <span>Upon submission, this complaint will receive a unique <strong>#CIVIC Ticket ID</strong> and will be visible on the public feed and map.</span>
              </div>
            </div>
          )}

          {/* STEP 5: SUCCESS SCREEN */}
          {step === 5 && submittedIssue && (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Grievance Registered Successfully!
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Your ticket has been recorded and submitted to municipal ward engineers.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl p-4 max-w-sm mx-auto text-left space-y-2.5 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700/60">
                  <span className="text-slate-500 dark:text-slate-400">Tracking Ticket ID:</span>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-sm">
                    {submittedIssue.ticketId}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Category:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{submittedIssue.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Priority:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{submittedIssue.urgency}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Initial Status:</span>
                  <span className="font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded">
                    {submittedIssue.status}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setReceiptIssue(submittedIssue);
                  }}
                  className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 font-semibold text-xs px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-300 dark:border-slate-600"
                >
                  <Printer className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Official Receipt Slip</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedIssue(submittedIssue);
                    onClose();
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  View Ticket Timeline →
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Buttons */}
        {step <= 4 && (
          <div className="p-3.5 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700/70 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-semibold px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 3 && (!title.trim() || !description.trim())) {
                    alert('Please enter both Title and Description before continuing.');
                    return;
                  }
                  setStep(step + 1);
                }}
                className="flex items-center gap-1.5 text-xs text-white bg-blue-600 hover:bg-blue-700 font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <span>Next Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="flex items-center gap-1.5 text-xs text-white bg-emerald-600 hover:bg-emerald-700 font-bold px-4 py-2 rounded-lg shadow-sm disabled:opacity-50 transition-colors cursor-pointer"
              >
                <span>{isSubmitting ? 'Registering...' : 'Submit Grievance'}</span>
                <CheckCircle className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
