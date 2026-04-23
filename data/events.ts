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
];
