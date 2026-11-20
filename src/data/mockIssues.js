export const INITIAL_ISSUES = [
  {
    id: "issue-1",
    ticketId: "#CIVIC-8492",
    title: "Deep Crater Pothole Damaging Car Suspensions & Two-Wheelers",
    description: "Substantial pothole near Sony World signal on 80 Feet Road. Multiple two-wheeler riders and auto rickshaws have suffered wheel rim damage and near-falls. Exposed gravel and broken asphalt aggregate.",
    category: "Infrastructure",
    urgency: "High",
    status: "In Progress",
    location: {
      lat: 12.9352,
      lng: 77.6245,
      address: "80 Feet Road, 5th Block, Koramangala",
      neighborhood: "Koramangala",
      landmark: "Near Sony World Signal Junction"
    },
    mediaUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=900&q=80",
    beforePhotoUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=900&q=80",
    afterPhotoUrl: "",
    reportedAt: "2026-10-01T09:30:00Z",
    updatedAt: "2026-10-02T14:15:00Z",
    reporter: {
      name: "Rahul Sharma",
      contact: "rahul.sharma@example.com",
      isAnonymous: false
    },
    upvotes: 47,
    hasUpvoted: false,
    department: "BBMP Road Infrastructure",
    assignedTeam: {
      name: "BBMP Ward 151 Road Repair Crew",
      leadWorker: "AEE Suresh Gowda",
      contactNumber: "+91 98450 49921"
    },
    eta: "Today by 4:00 PM",
    timeline: [
      {
        id: "t1-1",
        status: "Submitted",
        timestamp: "2026-10-01T09:30:00Z",
        title: "Issue Reported by Citizen",
        description: "Citizen logged pothole report with photos and GPS pin in Koramangala.",
        actor: "Rahul Sharma",
        role: "Citizen"
      },
      {
        id: "t1-2",
        status: "Under Review",
        timestamp: "2026-10-01T11:00:00Z",
        title: "BBMP Triage Inspection",
        description: "Ward engineer verified heavy traffic volume on 80 Feet Road. Work order sanctioned.",
        actor: "BBMP Control Room",
        role: "Municipal System"
      },
      {
        id: "t1-3",
        status: "Assigned",
        timestamp: "2026-10-02T08:30:00Z",
        title: "Work Order Dispatched",
        description: "Assigned to BBMP Ward 151 Asphalt Rapid Crew with hot-mix supply.",
        actor: "AEE South Zone",
        role: "Department Head"
      },
      {
        id: "t1-4",
        status: "In Progress",
        timestamp: "2026-10-02T14:15:00Z",
        title: "Road Patchwork Commenced",
        description: "Traffic barricades placed, surface milling underway.",
        actor: "AEE Suresh Gowda",
        role: "Field Team"
      }
    ],
    comments: [
      {
        id: "c1-1",
        author: "Kavitha R.",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
        timestamp: "2026-10-01T12:45:00Z",
        content: "Nearly took a fall on my scooter here yesterday! Thanks for reporting, Rahul."
      },
      {
        id: "c1-2",
        author: "BBMP Works Desk",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
        timestamp: "2026-10-02T08:35:00Z",
        content: "Asphalt patch truck dispatched. One lane diverted temporarily until 4 PM."
      }
    ],
    triageMetadata: {
      confidence: 96,
      detectedKeywords: ["pothole", "punctured tires", "suspensions", "broken asphalt", "crater"],
      reasoning: "High traffic street hazard detected on Koramangala arterial road."
    }
  },
  {
    id: "issue-2",
    ticketId: "#CIVIC-8501",
    title: "Burst BWSSB Water Pipe Flooding Road & Pedestrian Footpath",
    description: "High-pressure clean water supply pipeline ruptured beneath pavement slabs. Water has flooded the crosswalk and is leaking toward shop basements near Indiranagar metro.",
    category: "Water & Drainage",
    urgency: "Emergency",
    status: "Assigned",
    location: {
      lat: 12.9719,
      lng: 77.6412,
      address: "100 Feet Road, near 12th Main Junction",
      neighborhood: "Indiranagar",
      landmark: "Near Indiranagar Metro Station"
    },
    mediaUrl: "https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=900&q=80",
    beforePhotoUrl: "https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=900&q=80",
    afterPhotoUrl: "",
    reportedAt: "2026-10-02T06:10:00Z",
    updatedAt: "2026-10-02T07:05:00Z",
    reporter: {
      name: "Ananya Rao",
      contact: "ananya.rao@example.com",
      isAnonymous: false
    },
    upvotes: 68,
    hasUpvoted: true,
    department: "BWSSB (Water Supply & Sewerage)",
    assignedTeam: {
      name: "BWSSB East Division Hydraulics Unit",
      leadWorker: "Executive Engineer Ramesh Kumar",
      contactNumber: "+91 99001 38819"
    },
    eta: "Emergency Team ETA: 25 mins",
    timeline: [
      {
        id: "t2-1",
        status: "Submitted",
        timestamp: "2026-10-02T06:10:00Z",
        title: "Emergency Water Leak Logged",
        description: "Reported flooding near Indiranagar commercial shops.",
        actor: "Ananya Rao",
        role: "Citizen"
      },
      {
        id: "t2-2",
        status: "Under Review",
        timestamp: "2026-10-02T06:18:00Z",
        title: "BWSSB Control Room Escalation",
        description: "Triggered emergency alert for main line shut-off valve.",
        actor: "BWSSB Hotline",
        role: "Municipal System"
      },
      {
        id: "t2-3",
        status: "Assigned",
        timestamp: "2026-10-02T07:05:00Z",
        title: "Line Shut-Off Crew Dispatched",
        description: "Hydraulics Unit dispatched with isolation valve keys.",
        actor: "BWSSB Central Control",
        role: "Department Head"
      }
    ],
    comments: [
      {
        id: "c2-1",
        author: "Karthik V.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
        timestamp: "2026-10-02T06:30:00Z",
        content: "Water pressure in 12th Main buildings has dropped completely. Please fix urgently!"
      }
    ],
    triageMetadata: {
      confidence: 99,
      detectedKeywords: ["burst water main", "geyser", "flooding", "basement", "high-pressure"],
      reasoning: "Potable water loss and flooding hazard in high density commercial zone."
    }
  },
  {
    id: "issue-3",
    ticketId: "#CIVIC-8340",
    title: "Overflowing Garbage Blackspot Attracting Stray Animals",
    description: "Public roadside waste collection point in Sector 1 has not been cleared for 4 days. Wet waste spilling onto sidewalk, attracting strays and creating severe odor for nearby residents.",
    category: "Sanitation",
    urgency: "Medium",
    status: "Resolved",
    location: {
      lat: 12.9116,
      lng: 77.6389,
      address: "27th Main Road, Sector 1, HSR Layout",
      neighborhood: "HSR Layout",
      landmark: "Behind BDA Complex HSR Layout"
    },
    mediaUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=900&q=80",
    beforePhotoUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=900&q=80",
    afterPhotoUrl: "https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=900&q=80",
    reportedAt: "2026-09-28T14:00:00Z",
    updatedAt: "2026-09-29T16:30:00Z",
    reporter: {
      name: "Priya Patel",
      contact: "priya.p@example.com",
      isAnonymous: false
    },
    upvotes: 34,
    hasUpvoted: false,
    department: "BBMP Solid Waste Management (SWM)",
    assignedTeam: {
      name: "HSR Sector 1 Auto Tipper & Sanitation Squad",
      leadWorker: "Health Inspector Ravi Shankar",
      contactNumber: "+91 94480 71200"
    },
    eta: "Completed",
    timeline: [
      {
        id: "t3-1",
        status: "Submitted",
        timestamp: "2026-09-28T14:00:00Z",
        title: "Report Submitted",
        description: "Citizen reported garbage accumulation and health hazard.",
        actor: "Priya Patel",
        role: "Citizen"
      },
      {
        id: "t3-2",
        status: "Assigned",
        timestamp: "2026-09-29T08:00:00Z",
        title: "Compactor Route Scheduled",
        description: "Scheduled for morning priority compactor truck clearance.",
        actor: "BBMP SWM Logistics",
        role: "Department Head"
      },
      {
        id: "t3-3",
        status: "In Progress",
        timestamp: "2026-09-29T14:15:00Z",
        title: "Waste Cleared and Area Bleached",
        description: "Compactor truck on site. Lime powder sprayed.",
        actor: "Inspector Ravi Shankar",
        role: "Field Team"
      },
      {
        id: "t3-4",
        status: "Resolved",
        timestamp: "2026-09-29T16:30:00Z",
        title: "Site Cleared and Sanitized",
        description: "Blackspot cleared, waste hauled to processing plant, dustbins repositioned.",
        actor: "Inspector Ravi Shankar",
        role: "Field Team"
      }
    ],
    comments: [
      {
        id: "c3-1",
        author: "Ravi Shankar (BBMP SWM)",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
        timestamp: "2026-09-29T16:35:00Z",
        content: "Spot completely cleared and disinfected with bleaching powder. Residents requested not to dump after 10 AM.",
        isOfficial: true
      }
    ],
    feedback: {
      rating: 5,
      feedbackText: "Super fast response from BBMP team! Area is fully cleared and clean.",
      isResolvedConfirmed: true,
      citizenName: "Priya Patel",
      timestamp: "2026-09-29T18:00:00Z"
    },
    triageMetadata: {
      confidence: 94,
      detectedKeywords: ["trash bins", "overflowing", "garbage bags", "rodents", "spilling"],
      reasoning: "Classified as BBMP SWM sanitation request. Medium urgency."
    }
  },
  {
    id: "issue-4",
    ticketId: "#CIVIC-8519",
    title: "BESCOM Electric Pole Knocked Down With Dangling Live Wires",
    description: "Streetlight electric pole knocked by delivery truck near Hope Farm junction. Base cover missing, revealing exposed live wires at eye-level. Total darkness at night along pedestrian crossing near school.",
    category: "Electrical",
    urgency: "Emergency",
    status: "Under Review",
    location: {
      lat: 12.9860,
      lng: 77.7340,
      address: "ITPL Main Road, Hope Farm Junction",
      neighborhood: "Whitefield",
      landmark: "Near Whitefield Post Office & School"
    },
    mediaUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=900&q=80",
    beforePhotoUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=900&q=80",
    afterPhotoUrl: "",
    reportedAt: "2026-10-02T19:40:00Z",
    updatedAt: "2026-10-02T20:10:00Z",
    reporter: {
      name: "Karthik Venkatesh",
      contact: "karthik.v@example.com",
      isAnonymous: false
    },
    upvotes: 82,
    hasUpvoted: true,
    department: "BESCOM (Electricity Supply & Streetlights)",
    assignedTeam: {
      name: "BESCOM Whitefield Substation Emergency Crew",
      leadWorker: "Lineman Manjunath B.",
      contactNumber: "+91 98860 94432"
    },
    eta: "Under Immediate Dispatch",
    timeline: [
      {
        id: "t4-1",
        status: "Submitted",
        timestamp: "2026-10-02T19:40:00Z",
        title: "Emergency Hazard Reported",
        description: "Citizen reported exposed live electric wires near school crossing.",
        actor: "Karthik Venkatesh",
        role: "Citizen"
      },
      {
        id: "t4-2",
        status: "Under Review",
        timestamp: "2026-10-02T20:10:00Z",
        title: "BESCOM 1912 Emergency Alert Dispatched",
        description: "Priority escalated to Emergency. Lineman dispatched for power isolation.",
        actor: "BESCOM Helpline 1912",
        role: "Municipal System"
      }
    ],
    comments: [
      {
        id: "c4-1",
        author: "Prasad K.",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80",
        timestamp: "2026-10-02T20:25:00Z",
        content: "We placed caution tape around the pole. School starts at 8 AM, please isolate power immediately!"
      }
    ],
    triageMetadata: {
      confidence: 98,
      detectedKeywords: ["broken streetlight", "exposed wiring", "live wires", "elementary school", "darkness"],
      reasoning: "Critical electrocution hazard adjacent to school zone. Automatically flagged Emergency."
    }
  },
  {
    id: "issue-5",
    ticketId: "#CIVIC-8450",
    title: "Stormwater Drain Clogged With Silt & Plastic Causing Waterlogging",
    description: "Side drain grate on 16th Main Road is completely choked with construction debris and single-use plastic. Even 15 minutes of rain causes knee-deep waterlogging across bus stop.",
    category: "Water & Drainage",
    urgency: "Medium",
    status: "In Progress",
    location: {
      lat: 12.9166,
      lng: 77.6101,
      address: "16th Main Road, near Udupi Garden Signal",
      neighborhood: "BTM Layout 2nd Stage",
      landmark: "Near BTM Lake Outer Perimeter"
    },
    mediaUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80",
    beforePhotoUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80",
    afterPhotoUrl: "",
    reportedAt: "2026-10-01T15:20:00Z",
    updatedAt: "2026-10-02T11:00:00Z",
    reporter: {
      name: "Deepa Nair",
      contact: "deepa.nair@example.com",
      isAnonymous: false
    },
    upvotes: 29,
    hasUpvoted: false,
    department: "BWSSB (Water Supply & Sewerage)",
    assignedTeam: {
      name: "BWSSB Jetting Machine & De-silting Squad",
      leadWorker: "Tech Raghavendra",
      contactNumber: "+91 97410 63118"
    },
    eta: "Tomorrow by 11:00 AM",
    timeline: [
      {
        id: "t5-1",
        status: "Submitted",
        timestamp: "2026-10-01T15:20:00Z",
        title: "Clogged Drain Logged",
        description: "Submitted with photos of street pooling at BTM Layout bus stop.",
        actor: "Deepa Nair",
        role: "Citizen"
      },
      {
        id: "t5-2",
        status: "Under Review",
        timestamp: "2026-10-01T18:00:00Z",
        title: "Sanctioned for High Pressure Jetting",
        description: "Scheduled for suction machine deployment.",
        actor: "BBMP Stormwater Cell",
        role: "Department Head"
      },
      {
        id: "t5-3",
        status: "In Progress",
        timestamp: "2026-10-02T11:00:00Z",
        title: "Suction Vehicle on Site",
        description: "Desilting crew clearing clogged culvert.",
        actor: "Tech Raghavendra",
        role: "Field Team"
      }
    ],
    comments: [],
    triageMetadata: {
      confidence: 93,
      detectedKeywords: ["storm drain", "clogged", "tree debris", "pooling", "wheelchair ramp"],
      reasoning: "Accessibility blockage and water retention risk in BTM Layout."
    }
  },
  {
    id: "issue-6",
    ticketId: "#CIVIC-8290",
    title: "Broken Children's Swing Chain & Damaged Slide in BBMP Park",
    description: "Central swing set chain is severed and dangling with sharp jagged links in Madhavan Park. Toddler slide has a cracked fiberglass edge. Children attempting to climb damaged structure.",
    category: "Parks & Recreation",
    urgency: "High",
    status: "Resolved",
    location: {
      lat: 12.9299,
      lng: 77.5826,
      address: "Madhavan Park, 10th Main, Jayanagar 3rd Block",
      neighborhood: "Jayanagar",
      landmark: "Children's Play Section near East Gate"
    },
    mediaUrl: "https://images.unsplash.com/photo-1575783970733-1aaedde1db74?auto=format&fit=crop&w=900&q=80",
    beforePhotoUrl: "https://images.unsplash.com/photo-1575783970733-1aaedde1db74?auto=format&fit=crop&w=900&q=80",
    afterPhotoUrl: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=900&q=80",
    reportedAt: "2026-09-25T11:15:00Z",
    updatedAt: "2026-09-27T17:00:00Z",
    reporter: {
      name: "Sneha Murthy",
      contact: "sneha.m@example.com",
      isAnonymous: false
    },
    upvotes: 53,
    hasUpvoted: true,
    department: "BBMP Horticulture & Parks",
    assignedTeam: {
      name: "Jayanagar Ward Parks Maintenance Crew",
      leadWorker: "Officer Srinivas K.",
      contactNumber: "+91 98455 42390"
    },
    eta: "Completed",
    timeline: [
      {
        id: "t6-1",
        status: "Submitted",
        timestamp: "2026-09-25T11:15:00Z",
        title: "Playground Hazard Logged",
        description: "Severed swing chain reported in Madhavan Park.",
        actor: "Sneha Murthy",
        role: "Citizen"
      },
      {
        id: "t6-2",
        status: "Assigned",
        timestamp: "2026-09-26T09:00:00Z",
        title: "Replacement Hardware Ordered",
        description: "Heavy duty zinc-plated chains and rubber seats requisitioned.",
        actor: "BBMP Horticulture South",
        role: "Department Head"
      },
      {
        id: "t6-3",
        status: "In Progress",
        timestamp: "2026-09-27T10:00:00Z",
        title: "Welding & Installation Underway",
        description: "Chains replaced and load-tested.",
        actor: "Officer Srinivas K.",
        role: "Field Team"
      },
      {
        id: "t6-4",
        status: "Resolved",
        timestamp: "2026-09-27T17:00:00Z",
        title: "Certified Safe for Kids",
        description: "New safety coated chains and smooth slide patch installed.",
        actor: "Officer Srinivas K.",
        role: "Field Team"
      }
    ],
    comments: [
      {
        id: "c6-1",
        author: "Officer Srinivas K. (BBMP)",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80",
        timestamp: "2026-09-27T17:05:00Z",
        content: "Swings and slides have been repaired and inspected. Safe for children to play.",
        isOfficial: true
      }
    ],
    feedback: {
      rating: 5,
      feedbackText: "The new swings are solid and safe. My kids are happy playing here again!",
      isResolvedConfirmed: true,
      citizenName: "Sneha Murthy",
      timestamp: "2026-09-28T10:12:00Z"
    },
    triageMetadata: {
      confidence: 95,
      detectedKeywords: ["playground", "swing", "broken chain", "jagged metal", "children"],
      reasoning: "Injury risk for children in public municipal park."
    }
  },
  {
    id: "issue-7",
    ticketId: "#CIVIC-8534",
    title: "Crash Guardrail Bent Into Fast Lane On Outer Ring Road Flyover",
    description: "Central median steel crash barrier crumpled into lane after midnight tempo accident near Bellandur flyover. Missing reflector studs create severe hazard during night hours.",
    category: "Public Safety",
    urgency: "High",
    status: "Submitted",
    location: {
      lat: 12.9293,
      lng: 77.6748,
      address: "Outer Ring Road (ORR) Flyover, Bellandur Junction",
      neighborhood: "Bellandur",
      landmark: "Near Ecospace Tech Park Flyover Descent"
    },
    mediaUrl: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=900&q=80",
    beforePhotoUrl: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=900&q=80",
    afterPhotoUrl: "",
    reportedAt: "2026-10-03T02:45:00Z",
    updatedAt: "2026-10-03T02:45:00Z",
    reporter: {
      name: "Anonymous Citizen",
      isAnonymous: true
    },
    upvotes: 19,
    hasUpvoted: false,
    department: "Bengaluru Traffic Police & Road Safety",
    assignedTeam: null,
    eta: "Pending review",
    timeline: [
      {
        id: "t7-1",
        status: "Submitted",
        timestamp: "2026-10-03T02:45:00Z",
        title: "Report Submitted via Mobile App",
        description: "Report filed anonymously with photo capture on ORR Bellandur.",
        actor: "Anonymous Citizen",
        role: "Citizen"
      }
    ],
    comments: [],
    triageMetadata: {
      confidence: 92,
      detectedKeywords: ["guardrail", "accident", "blind spot", "night driving", "buckling"],
      reasoning: "Flyover vehicular speed corridor with damaged median barrier."
    }
  },
  {
    id: "issue-8",
    ticketId: "#CIVIC-8540",
    title: "Gulmohar Tree Branch Resting on BESCOM Transformer Lines",
    description: "Large dry gulmohar branch leaning directly on 11kV distribution line opposite Malleshwaram market. With gusty pre-monsoon winds, there is immediate risk of sparking or power outage.",
    category: "Infrastructure",
    urgency: "Medium",
    status: "Under Review",
    location: {
      lat: 12.9996,
      lng: 77.5709,
      address: "8th Cross Road, Sampige Road",
      neighborhood: "Malleshwaram",
      landmark: "Opposite Malleshwaram Market"
    },
    mediaUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=900&q=80",
    beforePhotoUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=900&q=80",
    afterPhotoUrl: "",
    reportedAt: "2026-10-03T05:15:00Z",
    updatedAt: "2026-10-03T06:00:00Z",
    reporter: {
      name: "Arvind Swamy",
      contact: "arvind.swamy@example.com",
      isAnonymous: false
    },
    upvotes: 14,
    hasUpvoted: false,
    department: "BBMP Forest Cell & Tree Maintenance",
    assignedTeam: null,
    eta: "Awaiting tree pruning crew schedule",
    timeline: [
      {
        id: "t8-1",
        status: "Submitted",
        timestamp: "2026-10-03T05:15:00Z",
        title: "Tree Hazard Reported",
        description: "Citizen reported branch strain on power lines in Malleshwaram.",
        actor: "Arvind Swamy",
        role: "Citizen"
      },
      {
        id: "t8-2",
        status: "Under Review",
        timestamp: "2026-10-03T06:00:00Z",
        title: "Referred to BBMP Forest Cell & BESCOM",
        description: "Joint inspection scheduled for tree branch trimming with hydraulic bucket truck.",
        actor: "BESCOM Malleshwaram",
        role: "Municipal System"
      }
    ],
    comments: [],
    triageMetadata: {
      confidence: 89,
      detectedKeywords: ["tree limbs", "power cables", "overhead", "sparking", "windy weather"],
      reasoning: "Electrical line interference by heavy vegetation."
    }
  }
];

export const DEPARTMENTS = [
  "BBMP Road Infrastructure",
  "BBMP Solid Waste Management (SWM)",
  "BWSSB (Water Supply & Sewerage)",
  "BESCOM (Electricity Supply & Streetlights)",
  "Bengaluru Traffic Police & Road Safety",
  "BBMP Horticulture & Parks",
  "BBMP Forest Cell & Tree Maintenance"
];

export const CATEGORIES = [
  "Infrastructure",
  "Sanitation",
  "Electrical",
  "Water & Drainage",
  "Public Safety",
  "Parks & Recreation"
];

export const URGENCIES = ["Low", "Medium", "High", "Emergency"];

export const STATUSES = [
  "Submitted",
  "Under Review",
  "Assigned",
  "In Progress",
  "Resolved"
];

export const SAMPLE_PRESET_IMAGES = [
  {
    label: "Pothole / Road Damage",
    category: "Infrastructure",
    url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80"
  },
  {
    label: "Water Main Leak",
    category: "Water & Drainage",
    url: "https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=800&q=80"
  },
  {
    label: "Overflowing Garbage",
    category: "Sanitation",
    url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80"
  },
  {
    label: "Damaged Streetlight",
    category: "Electrical",
    url: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80"
  },
  {
    label: "Broken Park Equipment",
    category: "Parks & Recreation",
    url: "https://images.unsplash.com/photo-1575783970733-1aaedde1db74?auto=format&fit=crop&w=800&q=80"
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "Emergency Alert Dispatched",
    message: "Live wire reported on ITPL Main Road near Hope Farm, Whitefield (#CIVIC-8519). BESCOM emergency lineman dispatched.",
    timestamp: "10 mins ago",
    type: "high_priority",
    read: false,
    ticketId: "#CIVIC-8519"
  },
  {
    id: "notif-2",
    title: "Road Repair In Progress",
    message: "BBMP Ward 151 Road Repair Crew has started patch work on 80 Feet Road, Koramangala (#CIVIC-8492).",
    timestamp: "45 mins ago",
    type: "status_update",
    read: false,
    ticketId: "#CIVIC-8492"
  },
  {
    id: "notif-3",
    title: "Resolution Confirmed",
    message: "Garbage blackspot on 27th Main, HSR Layout (#CIVIC-8340) verified cleared by resident Priya Patel.",
    timestamp: "Yesterday",
    type: "community",
    read: true,
    ticketId: "#CIVIC-8340"
  }
];

export const DEFAULT_WARDS = [
  {
    id: 'ward-151',
    name: 'Ward 151: Koramangala',
    zone: 'South Zone',
    neighborhood: 'Koramangala',
    slaHoursAvg: 18,
    leadEngineer: 'AEE Suresh Gowda',
    wardOffice: '80 Feet Road, 5th Block'
  },
  {
    id: 'ward-174',
    name: 'Ward 174: HSR Layout',
    zone: 'Bommanahalli Zone',
    neighborhood: 'HSR Layout',
    slaHoursAvg: 22,
    leadEngineer: 'AEE Venkatesh Murthy',
    wardOffice: '27th Main Road, Sector 1'
  },
  {
    id: 'ward-134',
    name: 'Ward 134: Jayanagar',
    zone: 'South Zone',
    neighborhood: 'Jayanagar',
    slaHoursAvg: 16,
    leadEngineer: 'AEE Ramesh Kumar',
    wardOffice: '10th Main, 3rd Block'
  },
  {
    id: 'ward-85',
    name: 'Ward 85: Indiranagar',
    zone: 'East Zone',
    neighborhood: 'Indiranagar',
    slaHoursAvg: 26,
    leadEngineer: 'AEE Radhakrishna',
    wardOffice: '100 Feet Road, HAL 2nd Stage'
  },
  {
    id: 'ward-45',
    name: 'Ward 45: Malleshwaram',
    zone: 'West Zone',
    neighborhood: 'Malleshwaram',
    slaHoursAvg: 20,
    leadEngineer: 'AEE S. Narayana',
    wardOffice: 'Sampige Road, 8th Cross'
  },
  {
    id: 'ward-83',
    name: 'Ward 83: Whitefield / ITPL',
    zone: 'Mahadevapura Zone',
    neighborhood: 'Whitefield',
    slaHoursAvg: 34,
    leadEngineer: 'AEE Manjunath B.',
    wardOffice: 'ITPL Main Road, Hope Farm'
  },
  {
    id: 'ward-160',
    name: 'Ward 160: Outer Ring Road',
    zone: 'Mahadevapura Zone',
    neighborhood: 'Outer Ring Road',
    slaHoursAvg: 30,
    leadEngineer: 'AEE Anand Rao',
    wardOffice: 'Bellandur EcoSpace Junction'
  }
];

export const DEFAULT_TEAMS = [
  { id: 'team-bbmp-151', name: 'BBMP Ward 151 Road Repair Crew', lead: 'AEE Suresh Gowda', phone: '+91 98450 49921', dept: 'BBMP Road Infrastructure' },
  { id: 'team-bbmp-swm', name: 'BBMP SWM Auto Tipper & Sanitation Squad', lead: 'Inspector Ravi Shankar', phone: '+91 94480 71200', dept: 'BBMP Solid Waste Management (SWM)' },
  { id: 'team-bwssb-pipe', name: 'BWSSB Cauvery Pipe & Jetting Unit', lead: 'Engineer Ramesh Kumar', phone: '+91 99001 38819', dept: 'BWSSB (Water Supply & Sewerage)' },
  { id: 'team-bescom-qrv', name: 'BESCOM Quick Response Vehicle (QRV)', lead: 'Lineman Manjunath B.', phone: '+91 98860 94432', dept: 'BESCOM (Electricity Supply & Streetlights)' }
];
