import { ConcertTicket, EventItem, RealTalkQuestion } from '../types';

export const CONCERT_DETAILS = {
  title: "ARISE: Worship Concert 2026",
  subTitle: "A generation called to arise, to shine, and to worship. — Isaiah 60:1",
  scripture: "Arise, shine, for your light has come, and the glory of the Lord rises upon you. — Isaiah 60:1",
  date: "Saturday, November 28, 2026",
  shortDate: "28.11.2026",
  city: "Hyderabad (HYD)",
  time: "6:00 PM onwards (Doors open at 5:00 PM)",
  venue: "Hyderabad Central Arena (Venue details releasing soon)",
  address: "Hyderabad, Telangana",
  collaboration: "Faith Commune x East Hyderabad Revival",
  totalCapacity: 3000,
  initialClaimed: 2240,
  entryFee: "Free Admission (Pass Required)",
  description: "The anticipation is building. Hyderabad, get ready for a night of worship! A generation called to arise, to shine, and to worship. Something is stirring. Something is rising. Bringing together 3,000 youth, singers from other churches, and worshippers across every denomination under one roof.",
  lineup: [
    {
      name: "Faith Commune Worship Band",
      church: "Faith Commune Inter-Denominational",
      role: "Lead Worship Collective",
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
      bio: "Uniting youth across Hyderabad colleges and tech corridors for anthemic praise."
    },
    {
      name: "East Hyderabad Revival Choir",
      church: "East Hyderabad Revival Alliance",
      role: "Gospel Vocals & Choir Ensemble",
      image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80",
      bio: "Collaborating with Faith Commune to ignite a spiritual awakening among youth."
    },
    {
      name: "Guest Singers from Regional Churches",
      church: "Multi-Church Collective (HYD)",
      role: "Inter-Church Vocal Alliance",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
      bio: "Singers and musicians representing Baptist, Catholic, Pentecostal, and Independent fellowships across Hyderabad."
    },
    {
      name: "Hyderabad Youth Acoustic & Strings",
      church: "United Church Fellowship",
      role: "Orchestral Strings & Keys",
      image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80",
      bio: "Atmospheric praise arrangements and intimate acoustic worship."
    }
  ],
  guidelines: [
    "Date: 28 November 2026 (28.11.2026) in Hyderabad.",
    "Presented by Faith Commune in collaboration with East Hyderabad Revival.",
    "Theme verse: Isaiah 60:1 — 'For your light has come, and the glory of the Lord rises upon you.'",
    "Show your digital QR pass on mobile at the entrance.",
    "Youth from all churches, denominations, and seekers are warmly welcomed."
  ]
};

export const INITIAL_TICKETS: ConcertTicket[] = [
  {
    ticketId: "FC-W26-1042",
    name: "Jonathan Richards",
    email: "jonathan.r@gmail.com",
    phone: "+1 555-019-2831",
    ageGroup: "21-25",
    denomination: "Baptist",
    passCount: 2,
    registeredAt: "2026-10-24 14:20",
    checkedIn: true,
    checkedInAt: "17:15",
    isVolunteerOptIn: false
  },
  {
    ticketId: "FC-W26-1043",
    name: "Seraphina Gomez",
    email: "seraphina.g@outlook.com",
    phone: "+1 555-018-7712",
    ageGroup: "16-20",
    denomination: "Catholic",
    passCount: 3,
    registeredAt: "2026-10-25 09:12",
    checkedIn: false,
    isVolunteerOptIn: true
  },
  {
    ticketId: "FC-W26-1044",
    name: "Marcus Vance",
    email: "marcus.vance@techcorp.io",
    phone: "+1 555-012-9904",
    ageGroup: "26-30",
    denomination: "Non-Denominational",
    passCount: 1,
    registeredAt: "2026-10-26 18:45",
    checkedIn: true,
    checkedInAt: "17:32",
    isVolunteerOptIn: false
  },
  {
    ticketId: "FC-W26-1045",
    name: "Priscilla Anand",
    email: "priscilla.a@uni.edu",
    phone: "+1 555-014-4421",
    ageGroup: "21-25",
    denomination: "Pentecostal",
    passCount: 4,
    registeredAt: "2026-10-27 11:05",
    checkedIn: false,
    isVolunteerOptIn: false
  },
  {
    ticketId: "FC-W26-1046",
    name: "Ethan Wright",
    email: "ethan.w@gmail.com",
    phone: "+1 555-013-6821",
    ageGroup: "16-20",
    denomination: "Exploring / None",
    passCount: 1,
    registeredAt: "2026-10-28 16:30",
    checkedIn: false,
    isVolunteerOptIn: false
  }
];

export const UPCOMING_EVENTS: EventItem[] = [
  {
    id: "evt-01",
    title: "ARISE: Worship Concert 2026 (Hyderabad)",
    category: "worship",
    date: "Sat, Nov 28, 2026",
    time: "6:00 PM onwards",
    venue: "Hyderabad Central Arena (Venue details soon)",
    locationType: "in-person",
    description: "Faith Commune in collaboration with East Hyderabad Revival presents ARISE 2026. 'For your light has come, and the glory of the Lord rises upon you' — Isaiah 60:1. Expecting 3,000 youth from all churches.",
    speakers: [
      { name: "Faith Commune Band", role: "Worship Leader", churchOrOrg: "Faith Commune", avatar: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=200&q=80" },
      { name: "East Hyd Revival", role: "Choir Lead", churchOrOrg: "East Hyderabad Revival", avatar: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=200&q=80" }
    ],
    capacity: 3000,
    attendeesCount: 2240,
    status: "filling-fast",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
    tags: ["Concert", "ARISE2026", "Hyderabad", "Free"]
  },
  {
    id: "evt-02",
    title: "Cracking Tech & Securing High-Paying Jobs in 2026",
    category: "tech",
    date: "Sat, Nov 14, 2026",
    time: "4:00 PM – 6:30 PM",
    venue: "Faith Commune Loft & Discord Live",
    locationType: "hybrid",
    description: "Hands-on tech talk breaking down software engineering interviews, AI tools in recruitment, portfolio secrets, and maintaining Christian integrity in cutthroat corporate fields.",
    speakers: [
      { name: "Darren Chen", role: "Senior Principal Eng at Stripe", churchOrOrg: "Faith Commune Tech Guild", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" },
      { name: "Rachel Adams", role: "Tech Recruiter & Coach", churchOrOrg: "Ex-Google Talent Partner", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80" }
    ],
    capacity: 250,
    attendeesCount: 218,
    status: "filling-fast",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
    tags: ["Career", "Resume Review", "Tech", "Mentorship"]
  },
  {
    id: "evt-03",
    title: "Faith in the Marketplace: Ethical Business & Startup Grit",
    category: "business",
    date: "Thu, Nov 19, 2026",
    time: "7:00 PM – 9:00 PM",
    venue: "The Nexus Glass Atrium, 5th Floor",
    locationType: "in-person",
    description: "Honest boardroom talk: how to raise funds without selling your soul, dealing with toxic bosses, building fair compensation, and letting your work be your worship.",
    speakers: [
      { name: "Timothy Mathew", role: "Founder & CEO, Veloce Health", churchOrOrg: "Presbyterian Young Adults", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" }
    ],
    capacity: 120,
    attendeesCount: 94,
    status: "upcoming",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
    tags: ["Business", "Startups", "Networking", "Ethics"]
  },
  {
    id: "evt-04",
    title: "Real Talk: When Churches Disappoint & Faith Hits Reality",
    category: "open-forum",
    date: "Tue, Dec 01, 2026",
    time: "6:30 PM – 8:45 PM",
    venue: "Coffee & Scripture Commune, Bay St.",
    locationType: "in-person",
    description: "An unmoderated, guilt-free circle where youth discuss church hurt, dating struggles, mental health medications, and deconstruction without anyone shaming you.",
    speakers: [
      { name: "Dr. Alicia Vance", role: "Licensed Adolescent Psychologist", churchOrOrg: "Faith Commune Wellness Circle", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80" }
    ],
    capacity: 80,
    attendeesCount: 78,
    status: "filling-fast",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
    tags: ["Safe Space", "Mental Health", "Unfiltered", "Real Talk"]
  },
  {
    id: "evt-05",
    title: "Acoustic Roof Jam & Hot Chocolate Fellowship",
    category: "youth",
    date: "Sat, Dec 05, 2026",
    time: "5:30 PM – 8:30 PM",
    venue: "Skyline Rooftop Terrace, Midtown",
    locationType: "in-person",
    description: "Casual hangout! Bring your guitar, cajon, or just your warm hoodie. Sing spontaneous covers, share life updates, and meet new friends.",
    speakers: [
      { name: "Sam & Joy", role: "Youth Coordinators", churchOrOrg: "Faith Commune", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80" }
    ],
    capacity: 150,
    attendeesCount: 88,
    status: "upcoming",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
    tags: ["Casual", "Acoustic", "Community", "Free Coffee"]
  }
];

export const INITIAL_QUESTIONS: RealTalkQuestion[] = [
  {
    id: "q-1",
    question: "I work 60-hour weeks in tech and feel totally empty. Traditional church leaders tell me to 'pray harder', but how do I actually set spiritual boundaries without losing my promotion?",
    topic: "career",
    upvotes: 42,
    timestamp: "2 days ago",
    answered: true,
    answerExcerpt: "Spiritual burnout isn't lack of prayer; it's often poor stewardship of body and time. God created Sabbath not as a punishment, but as a boundary against Pharaoh-like slave masters. We have a dedicated mentorship track on negotiating corporate boundaries.",
    answeredBy: "Darren Chen (Senior Principal Eng)"
  },
  {
    id: "q-2",
    question: "Is taking anti-depressants or seeing a secular therapist a sign of weak faith? My traditional pastor said I just need deliverance.",
    topic: "mental-health",
    upvotes: 68,
    timestamp: "3 days ago",
    answered: true,
    answerExcerpt: "Absolutely not. Seeking clinical mental healthcare is no more a lack of faith than getting a cast for a broken arm. God works through medicine, neuroscience, and empathetic therapy. Faith Commune stands firmly with medical truth and counseling.",
    answeredBy: "Dr. Alicia Vance (Clinical Psychologist)"
  },
  {
    id: "q-3",
    question: "My church tells me that Christians from other denominations are 'compromised'. Why are we so divided, and how does Faith Commune bridge this without arguing over doctrines?",
    topic: "doubt-faith",
    upvotes: 55,
    timestamp: "1 week ago",
    answered: true,
    answerExcerpt: "Jesus prayed in John 17:21 'that they all may be one'. We center on Jesus Christ, love, and salvation. We celebrate diverse worship traditions—whether liturgical, charismatic, or silent contemplation—as facets of one diamond.",
    answeredBy: "Inter-Church Youth Council"
  },
  {
    id: "q-4",
    question: "Dating in 2026: Dating apps feel shallow, and church singles meets feel forced and awkward. How do young Christians navigate genuine romance without cheesy cliches?",
    topic: "relationships",
    upvotes: 37,
    timestamp: "4 days ago",
    answered: false
  },
  {
    id: "q-5",
    question: "How do I secure an internship when ATS filters reject 200 of my resumes? Can someone in the community actually review my GitHub and CV?",
    topic: "career",
    upvotes: 29,
    timestamp: "Yesterday",
    answered: true,
    answerExcerpt: "Yes! Submit your resume via the Tech Mentorship tab on this site. Our senior engineers in the commune review resumes every Tuesday and do mock technical screens.",
    answeredBy: "Faith Commune Tech Guild"
  }
];

export const DENOMINATIONS_LIST = [
  "Baptist",
  "Pentecostal / Charismatic",
  "Catholic",
  "Methodist",
  "Presbyterian / Reformed",
  "Church of South India (CSI)",
  "Church of North India (CNI)",
  "Anglican / Episcopal",
  "Orthodox / Mar Thoma",
  "Non-Denominational / Independent",
  "Seventh-day Adventist",
  "None / Exploring / Seeking Truth"
];

export const DENOMINATION_STATS = [
  { name: "Non-Denominational", count: 780, color: "#fbbf24" },
  { name: "Pentecostal", count: 640, color: "#a855f7" },
  { name: "Baptist", count: 520, color: "#06b6d4" },
  { name: "Catholic", count: 460, color: "#f43f5e" },
  { name: "Methodist / Presby", count: 320, color: "#10b981" },
  { name: "CSI / CNI / Mar Thoma", count: 290, color: "#38bdf8" },
  { name: "Exploring / Seekers", count: 230, color: "#f97316" }
];

export const MENTORS_LIST = [
  {
    name: "Darren Chen",
    role: "Senior Principal Engineer at Stripe",
    track: "Tech & Coding",
    specialty: "System Design, Career Growth, Balancing FAANG with Faith",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
  },
  {
    name: "Rachel Adams",
    role: "Talent Director & Career Strategist",
    track: "Job Securing & HR",
    specialty: "ATS optimization, Mock Interviews, Salary Negotiation",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
  },
  {
    name: "Timothy Mathew",
    role: "Founder & CEO, Veloce Health",
    track: "Startups & Business",
    specialty: "Venture Capital, Ethical Enterprise, Youth Leadership",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
  },
  {
    name: "Dr. Alicia Vance",
    role: "Clinical Adolescent Psychologist",
    track: "Mental Wellness",
    specialty: "Anxiety, Career Burnout, Church Trauma Recovery",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80"
  }
];

export const TESTIMONIALS = [
  {
    quote: "I thought my love for coding and my faith were two separate worlds. At Faith Commune, a senior engineer gave me a mock interview that helped me land my dream junior role, while praying over my career anxieties. There is nothing like this anywhere else.",
    name: "Kevin George",
    role: "Junior Fullstack Dev (Ex-Student)",
    denomination: "Baptist",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
  },
  {
    quote: "As someone who grew up Catholic, entering a non-traditional community felt intimidating at first. But Faith Commune respects my liturgical roots while bringing the warmest, most vibrant youth worship I've ever experienced.",
    name: "Maria Fernandez",
    role: "Biomedical Researcher",
    denomination: "Catholic",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
  },
  {
    quote: "When I had panic attacks about unemployment, traditional elders told me I lacked faith. The Real Talk forum at Faith Commune gave me clinical guidance, real brotherhood, and zero guilt. That literally saved my life.",
    name: "Joshua Ray",
    role: "Graphic Designer",
    denomination: "Pentecostal",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80"
  }
];
