import { 
  AttendeeRecord, 
  VolunteerMember, 
  IncidentRecord, 
  ParkingZone, 
  VipGuest, 
  CommercialStall, 
  SponsorRecord, 
  BroadcastAlert 
} from '../types/ops';

export const INITIAL_PARKING_ZONES: ParkingZone[] = [
  {
    id: 'zone-a',
    name: 'North Ground - Lot A',
    vehicleType: '4-Wheelers (Cars/SUVs)',
    capacity: 250,
    currentCount: 84,
    marshalsAssigned: ['Kiran Paul (Lead)', 'David Raj', 'Siddharth V.'],
    status: 'available'
  },
  {
    id: 'zone-b',
    name: 'East Compound - Lot B',
    vehicleType: '2-Wheelers (Bikes/Scooters)',
    capacity: 500,
    currentCount: 215,
    marshalsAssigned: ['Immanuel K. (Lead)', 'Joshua N.', 'Arun G.'],
    status: 'available'
  },
  {
    id: 'zone-vip',
    name: 'Backstage Driveway',
    vehicleType: 'VIP & Ministry Vehicles',
    capacity: 35,
    currentCount: 12,
    marshalsAssigned: ['Samson V. (VIP Escort Marshall)'],
    status: 'available'
  },
  {
    id: 'zone-bus',
    name: 'South Avenue Layby',
    vehicleType: 'Buses & Shuttles',
    capacity: 15,
    currentCount: 6,
    marshalsAssigned: ['Benny M.', 'Christopher T.'],
    status: 'available'
  }
];

export const INITIAL_VOLUNTEERS: VolunteerMember[] = [
  // 1. Gate Security & Scanning
  {
    id: 'vol-1',
    code: 'VOL-GT-01',
    fullName: 'Sarah Thomas',
    phone: '+91 98480 12301',
    department: 'Gate Security & Scanning',
    role: 'Gate 1 Lead & Scanner Op',
    isLead: true,
    shift: 'Main Event Peak (14:00 - 21:00)',
    checkedIn: true,
    checkedInAt: '13:45',
    assignedZone: 'Gate 1 - North Arch'
  },
  {
    id: 'vol-2',
    code: 'VOL-GT-02',
    fullName: 'Rohan Matthew',
    phone: '+91 98480 12302',
    department: 'Gate Security & Scanning',
    role: 'Gate 1 Fast Lane Scanner',
    isLead: false,
    shift: 'Main Event Peak (14:00 - 21:00)',
    checkedIn: true,
    checkedInAt: '13:52',
    assignedZone: 'Gate 1 - North Arch'
  },
  {
    id: 'vol-3',
    code: 'VOL-GT-03',
    fullName: 'Hannah Cherian',
    phone: '+91 98480 12303',
    department: 'Gate Security & Scanning',
    role: 'Gate 2 South Scanner',
    isLead: true,
    shift: 'Main Event Peak (14:00 - 21:00)',
    checkedIn: true,
    checkedInAt: '14:05',
    assignedZone: 'Gate 2 - South Ground'
  },
  {
    id: 'vol-4',
    code: 'VOL-GT-04',
    fullName: 'Joshua Philip',
    phone: '+91 98480 12304',
    department: 'Gate Security & Scanning',
    role: 'Gate 3 VIP Pass Verifier',
    isLead: false,
    shift: 'All Day Core',
    checkedIn: true,
    checkedInAt: '11:30',
    assignedZone: 'Gate 3 - VIP Backstage'
  },

  // 2. Ushers & Crowd Flow
  {
    id: 'vol-5',
    code: 'VOL-US-01',
    fullName: 'Daniel Joseph',
    phone: '+91 98480 12305',
    department: 'Ushers & Crowd Flow',
    role: 'Head Usher - Ground Center',
    isLead: true,
    shift: 'Main Event Peak (14:00 - 21:00)',
    checkedIn: true,
    checkedInAt: '13:30',
    assignedZone: 'Main Ground Front Rows A-M'
  },
  {
    id: 'vol-6',
    code: 'VOL-US-02',
    fullName: 'Ruth George',
    phone: '+91 98480 12306',
    department: 'Ushers & Crowd Flow',
    role: 'Balcony & Wing Marshall',
    isLead: false,
    shift: 'Main Event Peak (14:00 - 21:00)',
    checkedIn: false,
    assignedZone: 'East Ground Seating Block'
  },

  // 3. Stage, AV & Production
  {
    id: 'vol-7',
    code: 'VOL-AV-01',
    fullName: 'Andrew Samuel',
    phone: '+91 98480 12307',
    department: 'Stage, AV & Production',
    role: 'FOH Sound Engineer & Tech Lead',
    isLead: true,
    shift: 'All Day Core',
    checkedIn: true,
    checkedInAt: '09:15',
    assignedZone: 'Central FOH Sound Mix Console'
  },
  {
    id: 'vol-8',
    code: 'VOL-AV-02',
    fullName: 'Priya Benjamin',
    phone: '+91 98480 12308',
    department: 'Stage, AV & Production',
    role: 'Stage Manager & Mic Tech',
    isLead: false,
    shift: 'All Day Core',
    checkedIn: true,
    checkedInAt: '10:00',
    assignedZone: 'Stage Left Wing'
  },

  // 4. VIP & Minister Hospitality
  {
    id: 'vol-9',
    code: 'VOL-VP-01',
    fullName: 'Grace Abraham',
    phone: '+91 98480 12309',
    department: 'VIP & Minister Hospitality',
    role: 'Keynote Pastor Escort',
    isLead: true,
    shift: 'Main Event Peak (14:00 - 21:00)',
    checkedIn: true,
    checkedInAt: '13:00',
    assignedZone: 'Green Room Suite 1'
  },
  {
    id: 'vol-10',
    code: 'VOL-VP-02',
    fullName: 'Marcus Varma',
    phone: '+91 98480 12310',
    department: 'VIP & Minister Hospitality',
    role: 'Guest Artists Concierge',
    isLead: false,
    shift: 'Main Event Peak (14:00 - 21:00)',
    checkedIn: true,
    checkedInAt: '13:10',
    assignedZone: 'Green Room Suite 2'
  },

  // 5. Emergency & Medical First-Aid
  {
    id: 'vol-11',
    code: 'VOL-MD-01',
    fullName: 'Dr. Rebecca Stephen',
    phone: '+91 98480 12311',
    department: 'Emergency & Medical First-Aid',
    role: 'Medical Command Lead (MD)',
    isLead: true,
    shift: 'All Day Core',
    checkedIn: true,
    checkedInAt: '12:00',
    assignedZone: 'Medical Post East Pavilion'
  },

  // 6. Stalls & Market Coordination
  {
    id: 'vol-12',
    code: 'VOL-ST-01',
    fullName: 'Jonathan Paul',
    phone: '+91 98480 12312',
    department: 'Stalls & Market Coordination',
    role: 'Stall Courtyard Marshall',
    isLead: true,
    shift: 'All Day Core',
    checkedIn: true,
    checkedInAt: '11:00',
    assignedZone: 'Stalls Courtyard Row A-C'
  },

  // 7. Parking & Ground Traffic
  {
    id: 'vol-13',
    code: 'VOL-PK-01',
    fullName: 'Kiran Paul',
    phone: '+91 98480 12313',
    department: 'Parking & Ground Traffic',
    role: 'Head Parking Marshall',
    isLead: true,
    shift: 'Main Event Peak (14:00 - 21:00)',
    checkedIn: true,
    checkedInAt: '13:20',
    assignedZone: 'North Ground - Lot A'
  },

  // 8. Media, Photo & Broadcast
  {
    id: 'vol-14',
    code: 'VOL-ME-01',
    fullName: 'Stephen Rao',
    phone: '+91 98480 12314',
    department: 'Media, Photo & Broadcast',
    role: 'Broadcast Director & Livestream Tech',
    isLead: true,
    shift: 'All Day Core',
    checkedIn: true,
    checkedInAt: '12:30',
    assignedZone: 'Production OB Van'
  }
];

export const INITIAL_VIPS: VipGuest[] = [
  {
    id: 'vip-1',
    name: 'Rev. Dr. Emmanuel Sundaram',
    role: 'Keynote Pastor',
    churchOrOrg: 'Alliance of Telugu Churches & Regional Ministries',
    scheduledArrivalTime: '17:15',
    soundcheckTime: '17:35',
    stageTime: '19:15',
    escortVolunteerName: 'Grace Abraham',
    escortPhone: '+91 98480 12309',
    greenRoomId: 'Green Room Suite 1',
    dietaryNotes: 'Vegetarian, hot water with lemon',
    status: 'in-green-room'
  },
  {
    id: 'vip-2',
    name: 'Evg. Sarah David & Band',
    role: 'Headliner Worship Band',
    churchOrOrg: 'Awaken Revival Worship',
    scheduledArrivalTime: '16:00',
    soundcheckTime: '16:30',
    stageTime: '18:15',
    escortVolunteerName: 'Marcus Varma',
    escortPhone: '+91 98480 12310',
    greenRoomId: 'Green Room Suite 2',
    dietaryNotes: '8 band members, sandwiches & warm beverages',
    status: 'backstage-ready'
  },
  {
    id: 'vip-3',
    name: 'Bishop Arthur Moses',
    role: 'Dignitary',
    churchOrOrg: 'Church of South India (CSI) Diocese',
    scheduledArrivalTime: '17:45',
    stageTime: '18:50',
    escortVolunteerName: 'Joshua Philip',
    escortPhone: '+91 98480 12304',
    greenRoomId: 'Green Room Suite 1',
    status: 'expected'
  },
  {
    id: 'vip-4',
    name: 'Faith Commune United Choir (60 Singers)',
    role: 'Headliner Worship Band',
    churchOrOrg: 'Faith Commune Inter-Denominational',
    scheduledArrivalTime: '15:00',
    soundcheckTime: '15:30',
    stageTime: '18:00',
    escortVolunteerName: 'Priya Benjamin',
    escortPhone: '+91 98480 12308',
    greenRoomId: 'Choral Hall East',
    status: 'backstage-ready'
  }
];

export const INITIAL_STALLS: CommercialStall[] = [
  {
    id: 'stall-1',
    stallNumber: 'A-01',
    businessName: 'Grace & Glory Christian Apparel',
    category: 'clothing',
    contactPerson: 'David K. Mathew',
    phone: '+91 99881 22345',
    rentAmount: 8500,
    paymentStatus: 'paid',
    powerRequiredKw: 1.5,
    powerInspected: true,
    fireSafetyCleared: true,
    vendorPassesIssued: 3,
    status: 'open',
    notes: 'Premium corner stall near Gate 1 entrance walkway.'
  },
  {
    id: 'stall-2',
    stallNumber: 'A-02',
    businessName: 'Olive Branch Artisans (Handmade Jewellery)',
    category: 'jewellery',
    contactPerson: 'Ruth Daniel',
    phone: '+91 99881 22346',
    rentAmount: 7500,
    paymentStatus: 'paid',
    powerRequiredKw: 0.8,
    powerInspected: true,
    fireSafetyCleared: true,
    vendorPassesIssued: 2,
    status: 'open',
    notes: 'Needs spotlights for display cabinet.'
  },
  {
    id: 'stall-3',
    stallNumber: 'B-01',
    businessName: 'Harvest Bakehouse & Specialty Coffee',
    category: 'food-eateries',
    contactPerson: 'Stephen Kurian',
    phone: '+91 99881 22347',
    rentAmount: 12000,
    paymentStatus: 'paid',
    powerRequiredKw: 4.5,
    powerInspected: true,
    fireSafetyCleared: true,
    vendorPassesIssued: 4,
    status: 'open',
    notes: 'Espresso machine + 2 electrical warmers. Connected to Phase 2 distribution.'
  },
  {
    id: 'stall-4',
    stallNumber: 'B-02',
    businessName: 'Deccan Rolls & Street Grills',
    category: 'food-eateries',
    contactPerson: 'Farhan & Simon',
    phone: '+91 99881 22348',
    rentAmount: 12000,
    paymentStatus: 'partial',
    powerRequiredKw: 2.0,
    powerInspected: true,
    fireSafetyCleared: true,
    vendorPassesIssued: 4,
    status: 'open',
    notes: 'Commercial LPG permit verified. Dedicated 4kg ABC Fire extinguisher placed.'
  },
  {
    id: 'stall-5',
    stallNumber: 'C-01',
    businessName: 'Living Word Scriptures & Study Bibles',
    category: 'books-merch',
    contactPerson: 'Pastor Joseph Rao',
    phone: '+91 99881 22349',
    rentAmount: 6000,
    paymentStatus: 'paid',
    powerRequiredKw: 0.5,
    powerInspected: true,
    fireSafetyCleared: true,
    vendorPassesIssued: 2,
    status: 'open',
    notes: 'Ministry discounted stall rate.'
  }
];

export const INITIAL_SPONSORS: SponsorRecord[] = [
  {
    id: 'sp-1',
    brandName: 'Bethany Health Network',
    tier: 'Title Sponsor',
    contactPerson: 'Dr. Philip Mark',
    contactPhone: '+91 91234 56789',
    deliverables: [
      { id: 'd-1', task: '30s LED Video Ad every 45 mins on main screens', completed: true, assignedTeam: 'Media/AV' },
      { id: 'd-2', task: 'Stage MC verbal recognition (3 mentions)', completed: true, assignedTeam: 'Stage Ops' },
      { id: 'd-3', task: 'Premium 20x10 Health Checkup Booth in Pavilion', completed: true, assignedTeam: 'Stall Team' },
      { id: 'd-4', task: 'Logo on 2,000 attendee physical wristbands/passes', completed: true, assignedTeam: 'IT Ops' }
    ]
  },
  {
    id: 'sp-2',
    brandName: 'Agape Global University',
    tier: 'Platinum',
    contactPerson: 'Dean Samuel Isaac',
    contactPhone: '+91 91234 56790',
    deliverables: [
      { id: 'd-5', task: '15s Static Logo display between worship sets', completed: false, assignedTeam: 'Media/AV' },
      { id: 'd-6', task: 'Youth Career Guidance Booth near Gate 2', completed: true, assignedTeam: 'Stall Team' },
      { id: 'd-7', task: 'Sponsor brochure insert in VIP welcome kits', completed: true, assignedTeam: 'Hospitality' }
    ]
  }
];

export const INITIAL_INCIDENTS: IncidentRecord[] = [
  {
    id: 'inc-1',
    title: 'Gate 1 Queue Congestion due to sudden group arrival',
    category: 'crowd',
    priority: 'P2-HIGH',
    location: 'Gate 1 - North Main Arch',
    description: 'A bus with 45 youth from Secunderabad arrived simultaneously. Lines spreading onto pavement.',
    status: 'investigating',
    reportedBy: 'Sarah Thomas (Gate 1 Lead)',
    assignedTo: 'Daniel Joseph (Head Usher)',
    reportedAt: '16:05',
    resolutionNotes: 'Opened Lane 3 fast-scan and dispatched 4 ushers to pre-scan QR codes.'
  },
  {
    id: 'inc-2',
    title: 'Minor sprain near East Basketball court layby',
    category: 'medical',
    priority: 'P3-MEDIUM',
    location: 'Near East Stall Row',
    description: 'Attendee slipped on gravel. Needs ice pack and elastic bandage.',
    status: 'resolved',
    reportedBy: 'Jonathan Paul',
    assignedTo: 'Dr. Rebecca Stephen',
    reportedAt: '15:20',
    resolvedAt: '15:38',
    resolutionNotes: 'Bandaged and attendee resting in first-aid tent. Fit to continue.'
  }
];

export const INITIAL_BROADCASTS: BroadcastAlert[] = [
  {
    id: 'bc-1',
    message: 'Soundcheck completed on schedule. Main auditorium gates open at 17:00 sharp. All volunteers take your designated posts.',
    targetAudience: 'all',
    urgency: 'normal',
    sentBy: 'Command Center Director',
    sentAt: '16:00'
  }
];

// Initial attendees for high-performance testing and immediate gate scanning
export const INITIAL_ATTENDEES: AttendeeRecord[] = [
  {
    id: 'att-1',
    ticketId: 'FC-W26-1042',
    name: 'Jonathan Richards',
    email: 'jonathan.r@gmail.com',
    phone: '+91 98765 43210',
    ageGroup: '21-25',
    denomination: 'Baptist',
    homeChurch: 'Calvary Baptist Fellowship, Secunderabad',
    passCount: 2,
    checkedIn: true,
    checkedInAt: '15:15',
    checkedInBy: 'Sarah Thomas',
    gate: 'gate-1',
    interests: ['worship-music', 'youth-leadership'],
    registeredAt: '2026-10-24 14:20'
  },
  {
    id: 'att-2',
    ticketId: 'FC-W26-1043',
    name: 'Seraphina Gomez',
    email: 'seraphina.g@outlook.com',
    phone: '+91 98765 43211',
    ageGroup: '16-20',
    denomination: 'Catholic',
    homeChurch: 'St. Marys Basilica',
    passCount: 3,
    checkedIn: false,
    interests: ['creative-arts', 'prayer'],
    registeredAt: '2026-10-25 09:12'
  },
  {
    id: 'att-3',
    ticketId: 'FC-W26-1044',
    name: 'Abraham Lincoln',
    email: 'abraham.l@gmail.com',
    phone: '+91 98765 43212',
    ageGroup: '26-35',
    denomination: 'Pentecostal',
    homeChurch: 'Hebron Assembly Hyderabad',
    passCount: 1,
    checkedIn: false,
    interests: ['tech-av', 'volunteer'],
    isVolunteerOptIn: true,
    registeredAt: '2026-10-25 11:30'
  },
  {
    id: 'att-4',
    ticketId: 'FC-W26-1045',
    name: 'Priscilla Samuel',
    email: 'priscilla.s@yahoo.com',
    phone: '+91 98765 43213',
    ageGroup: '21-25',
    denomination: 'Methodist',
    homeChurch: 'Wesley Centenary Methodist Church',
    passCount: 2,
    checkedIn: true,
    checkedInAt: '15:45',
    checkedInBy: 'Hannah Cherian',
    gate: 'gate-2',
    interests: ['worship-music', 'evangelism'],
    registeredAt: '2026-10-26 18:05'
  },
  {
    id: 'att-5',
    ticketId: 'FC-W26-1046',
    name: 'Timothy Kurian',
    email: 'timothy.k@gmail.com',
    phone: '+91 98765 43214',
    ageGroup: '16-20',
    denomination: 'CSI (Church of South India)',
    homeChurch: 'St. George Church, Abids',
    passCount: 4,
    checkedIn: false,
    interests: ['youth-leadership', 'prayer'],
    registeredAt: '2026-10-27 10:14'
  }
];
