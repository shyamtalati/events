export type Tag =
  | 'Networking'
  | 'Recruiting'
  | 'Workshop'
  | 'Speaker'
  | 'Social'
  | 'Competition';

export type Event = {
  slug: string;
  title: string;
  startsAt: string;
  endsAt?: string;
  location: string;
  hostOrg: string;
  tags: Tag[];
  description: string;
  rsvpUrl?: string;
};

export const events: Event[] = [
  {
    slug: 'dcg-non-traditional-paths-into-consulting-2026-04-23',
    title: 'Non-Traditional Paths Into Consulting',
    startsAt: '2026-04-23T18:00:00-04:00',
    endsAt: '2026-04-23T19:15:00-04:00',
    location: 'LeBow Hall 106',
    hostOrg: 'Drexel Consulting Group',
    tags: ['Speaker', 'Networking'],
    description:
      'DCG hosts Susan Stinson, Senior Director at Alvarez & Marsal, to discuss alternative routes into consulting and practical early-career guidance.',
    rsvpUrl: 'https://dragonlink.drexel.edu',
  },
  {
    slug: 'ready-set-hired-alumni-interview-tips-2026-05-06',
    title: 'Ready, Set, Hired: Alumni Interview Tips',
    startsAt: '2026-05-06T17:00:00-04:00',
    endsAt: '2026-05-06T18:00:00-04:00',
    location: 'LeBow Hall (see event page for room details)',
    hostOrg: 'LeBow College of Business',
    tags: ['Speaker', 'Recruiting'],
    description:
      'LeBow alumni share interview prep strategies, common mistakes, and what recruiters expect from business students entering internship and full-time cycles.',
    rsvpUrl:
      'https://www.lebow.drexel.edu/event/2026/05/06/ready-set-hired-alumni-interview-tips?lor=1&utm_source=mass_mailer&utm_medium=email&utm_content=2007926&utm_campaign=uni_targeted_emails',
  },
  {
    slug: 'lebow-finance-networking-night-2026-04-28',
    title: 'LeBow Finance Networking Night',
    startsAt: '2026-04-28T18:00:00-04:00',
    endsAt: '2026-04-28T20:00:00-04:00',
    location: 'Gerri C. LeBow Hall, Atrium',
    hostOrg: 'LeBow Finance Society',
    tags: ['Networking', 'Recruiting'],
    description:
      'Meet alumni and recruiters from regional investment firms, commercial banks, and consulting teams. Bring your resume and prepare a quick intro.',
    rsvpUrl: 'https://example.com/lebow-networking-night',
  },
  {
    slug: 'dufa-spring-stock-pitch-2026-04-30',
    title: 'DUFA Spring Stock Pitch Showcase',
    startsAt: '2026-04-30T17:30:00-04:00',
    endsAt: '2026-04-30T19:30:00-04:00',
    location: 'Academic Building 208',
    hostOrg: 'Drexel University Finance Association',
    tags: ['Competition', 'Speaker'],
    description:
      'Finalist teams present long ideas to a panel of buy-side professionals. Open to all students interested in equities and valuation.',
    rsvpUrl: 'https://example.com/dufa-stock-pitch',
  },
  {
    slug: 'bennett-thrasher-recruiting-coffee-chat-2026-05-01',
    title: 'Bennett Thrasher Recruiting Coffee Chat',
    startsAt: '2026-05-01T12:00:00-04:00',
    location: 'LeBow Hall, 3rd Floor Lounge',
    hostOrg: 'LeBow Undergraduate Career Services',
    tags: ['Recruiting', 'Networking'],
    description:
      'Informal coffee chat with advisory and tax recruiters focused on internships and full-time analyst roles for business majors.',
    rsvpUrl: 'https://example.com/bennett-thrasher-chat',
  },
  {
    slug: 'excel-for-finance-bootcamp-2026-05-04',
    title: 'Excel for Finance Bootcamp',
    startsAt: '2026-05-04T18:30:00-04:00',
    endsAt: '2026-05-04T20:00:00-04:00',
    location: 'LeBow Hall 240',
    hostOrg: 'LeBow Student Success',
    tags: ['Workshop'],
    description:
      'Hands-on workshop covering three-statement modeling foundations, lookup functions, and formatting for interview-ready templates.',
    rsvpUrl: 'https://example.com/excel-bootcamp',
  },
  {
    slug: 'women-in-finance-panel-2026-05-06',
    title: 'Women in Finance Alumni Panel',
    startsAt: '2026-05-06T17:00:00-04:00',
    endsAt: '2026-05-06T18:15:00-04:00',
    location: 'Bossone Research Center 302',
    hostOrg: 'LeBow Women in Business',
    tags: ['Speaker', 'Networking'],
    description:
      'Alumni from asset management, FP&A, and private credit share practical advice on internship strategy and early-career positioning.',
    rsvpUrl: 'https://example.com/women-finance-panel',
  },
  {
    slug: 'wall-street-prep-technical-interview-lab-2026-05-07',
    title: 'Technical Interview Lab: Valuation & Accounting',
    startsAt: '2026-05-07T19:00:00-04:00',
    endsAt: '2026-05-07T20:30:00-04:00',
    location: 'Virtual (Zoom)',
    hostOrg: 'Drexel Investment Group',
    tags: ['Workshop', 'Recruiting'],
    description:
      'Practice common technical interview prompts with upperclass mentors, including enterprise value bridges and accounting walk-throughs.',
    rsvpUrl: 'https://example.com/technical-interview-lab',
  },
  {
    slug: 'fintech-founders-fireside-2026-05-10',
    title: 'Fintech Founders Fireside Chat',
    startsAt: '2026-05-10T18:00:00-04:00',
    endsAt: '2026-05-10T19:00:00-04:00',
    location: 'URBN Center 146',
    hostOrg: 'Baiada Institute',
    tags: ['Speaker', 'Social'],
    description:
      'Two Philadelphia fintech founders discuss launching in regulated markets, fundraising in 2026, and hiring students for product internships.',
    rsvpUrl: 'https://example.com/fintech-fireside',
  },
  {
    slug: 'resume-review-sprint-2026-05-12',
    title: 'Finance Resume Review Sprint',
    startsAt: '2026-05-12T16:00:00-04:00',
    endsAt: '2026-05-12T18:00:00-04:00',
    location: 'LeBow Hall Career Suite',
    hostOrg: 'LeBow Undergraduate Career Services',
    tags: ['Recruiting', 'Workshop'],
    description:
      'Drop in for 15-minute resume edits with peer advisors and employer-facing staff before summer internship deadlines.',
    rsvpUrl: 'https://example.com/resume-review-sprint',
  },
  {
    slug: 'drexel-case-crackdown-2026-05-13',
    title: 'Case Crackdown: Consulting + Corporate Finance',
    startsAt: '2026-05-13T18:30:00-04:00',
    endsAt: '2026-05-13T20:00:00-04:00',
    location: 'Gerri C. LeBow Hall 122',
    hostOrg: 'Drexel Consulting Group',
    tags: ['Competition', 'Workshop'],
    description:
      'Team-based mini-case challenge focused on market sizing, pricing strategy, and capital allocation decisions.',
    rsvpUrl: 'https://example.com/case-crackdown',
  },
  {
    slug: 'cfa-society-asset-management-night-2026-05-15',
    title: 'CFA Society Asset Management Night',
    startsAt: '2026-05-15T17:30:00-04:00',
    endsAt: '2026-05-15T20:00:00-04:00',
    location: 'Center City Campus, Room CCI 101',
    hostOrg: 'Drexel University Finance Association',
    tags: ['Networking', 'Speaker'],
    description:
      'Local portfolio managers and research analysts host a moderated panel followed by small-group networking sessions.',
    rsvpUrl: 'https://example.com/cfa-asset-management-night',
  },
  {
    slug: 'spring-analyst-mixer-2026-05-18',
    title: 'Spring Analyst Mixer',
    startsAt: '2026-05-18T18:00:00-04:00',
    endsAt: '2026-05-18T19:30:00-04:00',
    location: '33rd Street Plaza',
    hostOrg: 'LeBow Finance Society',
    tags: ['Social', 'Networking'],
    description:
      'End-of-term outdoor mixer for students entering co-op and internship cycles. Casual setting, professional dress optional.',
    rsvpUrl: 'https://example.com/spring-analyst-mixer',
  },
  {
    slug: 'private-equity-101-2026-05-20',
    title: 'Private Equity 101',
    startsAt: '2026-05-20T18:00:00-04:00',
    endsAt: '2026-05-20T19:15:00-04:00',
    location: 'Academic Building 115',
    hostOrg: 'Drexel Investment Group',
    tags: ['Speaker', 'Workshop'],
    description:
      'Introductory session on deal structures, value creation plans, and recruiting pathways from undergraduate programs.',
    rsvpUrl: 'https://example.com/private-equity-101',
  },
  {
    slug: 'scdc-graduate-students-resume-drop-ins-2026-04-28',
    title: 'Graduate Students Resume Drop-Ins',
    startsAt: '2026-04-28T13:00:00-04:00',
    endsAt: '2026-04-28T14:00:00-04:00',
    location: 'Virtual (Zoom - register on Handshake)',
    hostOrg: 'Steinbright Career Development Center',
    tags: ['Workshop', 'Recruiting'],
    description:
      'Need help with your resume? Drop in for a virtual Steinbright session to get quick answers and resume feedback.',
    rsvpUrl: 'https://drexel.joinhandshake.com/edu/events/1924685',
  },
  {
    slug: 'scdc-graduate-student-career-questions-drop-in-2026-05-05',
    title: 'Graduate Student Career Questions Drop-In',
    startsAt: '2026-05-05T15:00:00-04:00',
    endsAt: '2026-05-05T16:00:00-04:00',
    location: 'Virtual (Zoom - register on Handshake)',
    hostOrg: 'Steinbright Career Development Center',
    tags: ['Workshop'],
    description:
      'Bring career-related questions to this one-hour Zoom drop-in with Senior Career Counselor Ken Bohrer.',
    rsvpUrl: 'https://drexel.joinhandshake.com/edu/events/1932261',
  },
  {
    slug: 'scdc-pennoni-information-session-2026-05-05',
    title: 'Pennoni Information Session',
    startsAt: '2026-05-05T15:00:00-04:00',
    endsAt: '2026-05-05T16:00:00-04:00',
    location: 'Hagerty Library L14 Classroom',
    hostOrg: 'Steinbright Career Development Center',
    tags: ['Recruiting', 'Networking'],
    description:
      "Pennoni visits campus to discuss civil engineering work in Philadelphia, company culture, and student opportunities, followed by informal Q&A.",
    rsvpUrl: 'https://app.joinhandshake.com/edu/events/1941796',
  },
  {
    slug: 'scdc-resume-review-day-2026-05-06',
    title: 'Resume Review Day',
    startsAt: '2026-05-06T13:00:00-04:00',
    endsAt: '2026-05-06T15:00:00-04:00',
    location: 'Virtual (Zoom - register on Handshake)',
    hostOrg: 'Steinbright Career Development Center',
    tags: ['Workshop', 'Recruiting'],
    description:
      'Join a Steinbright employer partner for a 15-minute resume review before A-Round opens. Students of all graduation years are welcome.',
    rsvpUrl: 'https://drexel.joinhandshake.com/edu/events/1923980',
  },
  {
    slug: 'scdc-helix-electric-info-session-2026-05-06',
    title: 'Helix Electric Co-Op Program and Company Info Session',
    startsAt: '2026-05-06T16:00:00-04:00',
    endsAt: '2026-05-06T17:00:00-04:00',
    location: 'Virtual (register on Handshake for link)',
    hostOrg: 'Steinbright Career Development Center',
    tags: ['Recruiting', 'Networking'],
    description:
      'Learn about Helix Electric co-op opportunities, project engineer roles, company culture, and fall/winter recruiting paths.',
    rsvpUrl: 'https://app.joinhandshake.com/edu/events/1928018',
  },
  {
    slug: 'scdc-resume-review-day-2026-05-07',
    title: 'Resume Review Day',
    startsAt: '2026-05-07T10:00:00-04:00',
    endsAt: '2026-05-07T12:00:00-04:00',
    location: 'Virtual (Zoom - register on Handshake)',
    hostOrg: 'Steinbright Career Development Center',
    tags: ['Workshop', 'Recruiting'],
    description:
      'Join a Steinbright employer partner for a 15-minute resume review before A-Round opens. Students of all graduation years are welcome.',
    rsvpUrl: 'https://drexel.joinhandshake.com/edu/events/1923989',
  },
  {
    slug: 'scdc-resume-in-a-rush-2026-05-07',
    title: 'Resume in a Rush',
    startsAt: '2026-05-07T12:00:00-04:00',
    endsAt: '2026-05-07T16:00:00-04:00',
    location: 'Rush Building Room 101',
    hostOrg: 'Steinbright Career Development Center',
    tags: ['Workshop', 'Recruiting'],
    description:
      'Drop in for a 15-minute in-person resume review with Steinbright partners and get 1:1 feedback on a hard copy or laptop.',
    rsvpUrl: 'https://drexel.joinhandshake.com/edu/events/1936702',
  },
  {
    slug: 'scdc-graduate-students-resume-drop-ins-2026-05-12',
    title: 'Graduate Students Resume Drop-Ins',
    startsAt: '2026-05-12T13:00:00-04:00',
    endsAt: '2026-05-12T14:00:00-04:00',
    location: 'Virtual (Zoom - register on Handshake)',
    hostOrg: 'Steinbright Career Development Center',
    tags: ['Workshop', 'Recruiting'],
    description:
      'Need help with your resume? Drop in for a virtual Steinbright session to get quick answers and resume feedback.',
    rsvpUrl: 'https://drexel.joinhandshake.com/edu/events/1924692',
  },
  {
    slug: 'scdc-senior-series-ace-that-interview-2026-05-14',
    title: 'Senior Series: Ace That Interview!',
    startsAt: '2026-05-14T12:00:00-04:00',
    endsAt: '2026-05-14T13:00:00-04:00',
    location: 'Virtual (Zoom - register on Handshake)',
    hostOrg: 'Steinbright Career Development Center',
    tags: ['Workshop', 'Recruiting'],
    description:
      "Learn how to prepare, engage, and impress your interviewers in this senior-focused workshop led by Steinbright's Senior Career Counselor.",
    rsvpUrl: 'https://drexel.joinhandshake.com/edu/events/1920241',
  },
  {
    slug: 'scdc-grad-school-your-way-2026-05-15',
    title: 'Grad School, Your Way: Exploring Different Routes to Advanced Degrees',
    startsAt: '2026-05-15T15:00:00-04:00',
    endsAt: '2026-05-15T16:30:00-04:00',
    location: 'Bentley Hall, 2nd Floor',
    hostOrg: 'Steinbright Career Development Center',
    tags: ['Workshop', 'Speaker'],
    description:
      'Hosted by UREP and Steinbright, this session demystifies PhD paths, school research, and how advanced-degree applications differ across program types.',
    rsvpUrl: 'https://drexel.joinhandshake.com/edu/events/1932485',
  },
  {
    slug: 'scdc-graduate-student-interviewing-techniques-2026-05-16',
    title: 'Graduate Student Interviewing Techniques',
    startsAt: '2026-05-16T14:00:00-04:00',
    endsAt: '2026-05-16T15:00:00-04:00',
    location: 'Virtual (Zoom - register on Handshake)',
    hostOrg: 'Steinbright Career Development Center',
    tags: ['Workshop', 'Recruiting'],
    description:
      'Practice answering common interview questions and learn how to prepare more confidently for upcoming job interviews.',
    rsvpUrl: 'https://drexel.joinhandshake.com/edu/events/1932321',
  },
  {
    slug: 'scdc-graduate-students-resume-drop-ins-2026-05-19',
    title: 'Graduate Students Resume Drop-Ins',
    startsAt: '2026-05-19T11:00:00-04:00',
    endsAt: '2026-05-19T12:00:00-04:00',
    location: 'Virtual (Zoom - register on Handshake)',
    hostOrg: 'Steinbright Career Development Center',
    tags: ['Workshop', 'Recruiting'],
    description:
      'Need help with your resume? Drop in for a virtual Steinbright session to get quick answers and resume feedback.',
    rsvpUrl: 'https://drexel.joinhandshake.com/edu/events/1924692',
  },
  {
    slug: 'scdc-graduate-students-resume-drop-ins-2026-05-26',
    title: 'Graduate Students Resume Drop-Ins',
    startsAt: '2026-05-26T13:00:00-04:00',
    endsAt: '2026-05-26T14:00:00-04:00',
    location: 'Virtual (Zoom - register on Handshake)',
    hostOrg: 'Steinbright Career Development Center',
    tags: ['Workshop', 'Recruiting'],
    description:
      'Need help with your resume? Drop in for a virtual Steinbright session to get quick answers and resume feedback.',
    rsvpUrl: 'https://drexel.joinhandshake.com/edu/events/1924750',
  },
  {
    slug: 'scdc-writing-an-effective-resume-2026-05-28',
    title: 'Graduate Student Writing an Effective Resume',
    startsAt: '2026-05-28T14:00:00-04:00',
    endsAt: '2026-05-28T15:00:00-04:00',
    location: 'Virtual (Zoom - register on Handshake)',
    hostOrg: 'Steinbright Career Development Center',
    tags: ['Workshop', 'Recruiting'],
    description:
      'Learn how to create a resume that gets through quick employer scans and applicant-screening tools and earns you an interview.',
    rsvpUrl: 'https://drexel.joinhandshake.com/edu/events/1932338',
  },
  {
    slug: 'scdc-senior-series-negotiate-your-offer-2026-05-29',
    title: 'Senior Series: Negotiate Your Offer',
    startsAt: '2026-05-29T12:00:00-04:00',
    endsAt: '2026-05-29T13:00:00-04:00',
    location: 'Virtual (Zoom - register on Handshake)',
    hostOrg: 'Steinbright Career Development Center',
    tags: ['Workshop', 'Recruiting'],
    description:
      'Learn how to research your market value and improve your negotiation strategy for a stronger offer.',
    rsvpUrl: 'https://drexel.joinhandshake.com/edu/events/1920407',
  },
];
