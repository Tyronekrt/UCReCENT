import type {
  BudgetItem,
  GalleryImage,
  PartnerEntry,
  TimelineMilestone,
  UpdatePost,
} from "@/types";

/**
 * SINGLE SOURCE OF TRUTH for all public website content.
 *
 * Every fact below is drawn from the supplied project material:
 * - "LAST DRAFT Usao_Community_Library_Concept_Note.docx" (primary)
 * - "Concept Note-Usao Library_August 2026.docx"
 * - "FINAL USAO Partnerships Letters.docx" (includes explicit verification notes)
 * - "Book Aid Itnl Request.docx", "USAO Partnerships Option 1/2.docx"
 * - "Oganizations to reach out to.docx"
 * - Supplied WhatsApp community images + UCReCENT brand board
 *
 * CONTENT RULE: never invent payment numbers, social accounts, statistics,
 * donor names, testimonials, or construction progress. Anything uncertain is
 * marked "to-verify" or "planned" and surfaced in the UI with careful wording.
 */

export const SITE = {
  name: "UCReCENT",
  shortName: "UCReCENT",
  brand: "UCReCENT",
  tagline: "Read... Learn... Grow... Succeed",
  initiative: "An Initiative of Building a Library",
  logo: "/images/logo-ucrecent.png",
  logoMono: "/images/logo-ucrecent-mono.png",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://usaolibrary.example.org",
  location: {
    sublocation: "Usao Sublocation",
    division: "Mbita East Division",
    constituency: "Mbita Constituency",
    county: "Homa Bay County",
    country: "Kenya",
    full: "Usao Sublocation, Mbita East Division, Mbita Constituency, Homa Bay County, Kenya",
  },
  contact: {
    director: "Dr. Benard Oloo, PhD",
    directorRole: "Director, UCReCENT Initiative Team",
    directorNote: "Lecturer, Egerton University (as stated in Concept Note)",
    phoneDisplay: "+254 725 817 520",
    phoneHref: "tel:+254725817520",
    email: "olooo.odhiambo@gmail.com",
  },
  vision:
    "A community in Usao where every learner has access to books, a safe place to study, and the opportunity to read, learn, grow and succeed.",
  mission:
    "To establish and sustain a community-owned library that expands access to books and study space, strengthens literacy and academic performance, and builds a lasting culture of reading and lifelong learning in Usao and surrounding communities.",
  goal: "To establish a thriving community library that improves literacy, strengthens academic performance, and expands lifelong learning opportunities for the people of Usao and surrounding communities.",
} as const;

export const OBJECTIVES: string[] = [
  "Provide safe and quiet reading and study space for 100+ users.",
  "Promote a strong reading culture among children, youth and adults.",
  "Build and maintain a collection of up to 10,000 books.",
  "Train and build the capacity of local library staff through Egerton University Library.",
  "Ensure long-term sustainability through community land donation and alumni-led governance.",
  "Strengthen partnerships with KNLS, publishers and diaspora supporters for books, technical support and resource mobilization.",
];

export const PHASE_ONE = {
  description:
    "A lean, functional mabati-and-wood structure on community-donated land, with shelving for up to 10,000 books, seating for 100 users, and a small librarian's office with basic security, ventilation and lighting.",
  targetKes: 500_000,
  capacityBooks: 10_000,
  capacitySeats: 100,
  initialBooks: 1_000,
  initialBooksNote:
    "The Concept Note identifies The Reading Culture as providing the first 1,000 books. Formal commitment and delivery terms are to be confirmed — see verification list.",
  launchDatePlanned: "7 October 2026",
  launchDateNote:
    "Planned date stated in the Concept Note. Reconfirm readiness before presenting it as firm.",
  fullFunctionality: {
    estimateKes: 4_300_000,
    sizeSqm: 144,
    ratePerSqm: 30_000,
    note: "Full-functionality estimate for a 144 sqm facility at KES 30,000 per sqm.",
  },
} as const;

export const BUDGET: BudgetItem[] = [
  { item: "Site preparation and minor groundwork", costKes: 40_000 },
  { item: "Mabati-and-wood structure", costKes: 220_000 },
  { item: "Roofing, doors, windows and basic finishing", costKes: 90_000 },
  { item: "Shelving for up to 10,000 books", costKes: 60_000 },
  { item: "Seating for 100 users", costKes: 45_000 },
  { item: "Small office setup", costKes: 25_000 },
  { item: "Basic lighting and fittings", costKes: 10_000 },
  { item: "Community launch and opening activities", costKes: 5_000 },
  { item: "Contingency", costKes: 5_000 },
];

export const TIMELINE: TimelineMilestone[] = [
  { milestone: "Community mobilization, committee formation & site confirmation", period: "Aug 2026" },
  { milestone: "Resource mobilization & partner coordination", period: "Aug – Sep 2026" },
  { milestone: "Phase 1 construction (mabati-and-wood structure)", period: "Sep 2026" },
  { milestone: "Book stocking, cataloguing & staff recruitment", period: "Sep 2026" },
  { milestone: "Official launch & activation of reading programmes", period: "7 Oct 2026 (planned)" },
  { milestone: "Monitoring, review & sustainability planning", period: "Ongoing from Oct 2026" },
];

export const BENEFICIARIES = {
  direct: [
    "Pupils of Usao, Usungu, Ngodhe and Uwi Primary Schools",
    "Students of Usao, Ngodhe and Otieno Kajwang' Secondary Schools and Nyamaji Secondary School",
    "Youth, teachers, parents and community members seeking evening and weekend study space",
  ],
  indirect: [
    "The wider Mbita East community, through improved literacy, stronger civic space and greater access to information and knowledge resources",
  ],
} as const;

export const BOARD: { name: string; note: string }[] = [
  { name: "Dr. Benard Oloo (PhD)", note: "Director — confirm title before publication" },
  { name: "Pastor Paul Misaki", note: "Board member — confirm role" },
  { name: "Mwalimu Okongo", note: "Board member — confirm full name and role" },
  { name: "Mr. Orato Benard", note: "Board member — confirm role" },
  { name: "Mr. Moses Kefa", note: "Board member — confirm role" },
  { name: "Mr. Benard Zedekia", note: "Board member — confirm role" },
  { name: "Mr. Moses Mark", note: "Board member — confirm role" },
  { name: "Nahashon", note: "ICT Director — confirm full name" },
];

/**
 * Partner status model — the single most important trust feature of V1.
 * "named-collaborator" = identified in the Concept Note as a collaborator/stakeholder.
 *   This is NOT a confirmed formal partnership; wording on the site must say so.
 * "being-engaged" = an outreach letter was prepared; no confirmed relationship.
 * Individual champions' roles/affiliations are all to be verified.
 */
export const COLLABORATORS: PartnerEntry[] = [
  {
    name: "Egerton University Library",
    category: "Academic / professional",
    role: "Training and internship support for the librarian; collection-management guidance.",
    status: "to-verify",
    statusNote: "Identified in Concept Note as strategic collaborator. Confirm terms before calling it confirmed.",
  },
  {
    name: "The Reading Culture",
    category: "Literacy / books",
    role: "Identified as providing the first 1,000 books to seed the collection.",
    status: "to-verify",
    statusNote: "Confirm whether the 1,000 books are formally committed, plus selection and delivery terms.",
  },
  {
    name: "Kenya National Library Service (KNLS) — National and Nakuru",
    category: "Public library",
    role: "Technical guidance on standards, cataloguing, collection organization and user services.",
    status: "to-verify",
    statusNote: "Confirm appropriate focal office (Homa Bay vs Nakuru vs National) before dispatch.",
  },
  {
    name: "Kenyan Diaspora in Ireland",
    category: "Diaspora",
    role: "Resource mobilization, book drives, introductions and visibility.",
    status: "to-verify",
    statusNote: "Confirm intended coordinating group and contact structure.",
  },
];

export const ORGANISATIONS_BEING_ENGAGED: PartnerEntry[] = [
  {
    name: "Book Aid International",
    category: "Books / publishing",
    role: "Being approached for suitable book donations, collection guidance and in-country distribution advice.",
    status: "to-verify",
    statusNote: "Outreach prepared Aug 2026. No confirmed partnership — do not present as a partner.",
  },
  {
    name: "East African Educational Publishers",
    category: "Books / publishing",
    role: "Being approached for donated or discounted educational, children's and East African literary titles.",
    status: "to-verify",
    statusNote: "Outreach prepared Aug 2026. No confirmed partnership.",
  },
  {
    name: "Macmillan Library / Moran Publishers",
    category: "Books / publishing",
    role: "Being approached for educational, reference and children's titles.",
    status: "to-verify",
    statusNote: "Confirm brand/contact (Macmillan vs Moran) — outreach prepared, not confirmed.",
  },
  {
    name: "National Literacy Trust",
    category: "Literacy",
    role: "Being approached for literacy-programme guidance.",
    status: "to-verify",
    statusNote: "Verify international remit. Outreach prepared, not confirmed.",
  },
  {
    name: "BookTrust",
    category: "Literacy",
    role: "Being approached for children's reading guidance.",
    status: "to-verify",
    statusNote: "Verify suitable contact (press inbox may not be appropriate). Not confirmed.",
  },
  {
    name: "The Reading Agency",
    category: "Literacy",
    role: "Being approached for community reading-programme guidance.",
    status: "to-verify",
    statusNote: "Outreach prepared, not confirmed.",
  },
  {
    name: "Education Endowment Foundation (EEF)",
    category: "Education / research",
    role: "Being approached for evidence and monitoring guidance only (no funding assumed).",
    status: "to-verify",
    statusNote: "Clarify non-UK project fit. Not confirmed.",
  },
  {
    name: "Libraries Connected",
    category: "Library professional",
    role: "Being approached for community-library knowledge exchange.",
    status: "to-verify",
    statusNote: "Outreach prepared, not confirmed.",
  },
  {
    name: "Learn with a Librarian",
    category: "Library / learning",
    role: "Being approached for practical librarian resources.",
    status: "to-verify",
    statusNote: "Confirm the organisation and remit. Not confirmed.",
  },
  {
    name: "CILIP — the library and information association",
    category: "Library professional",
    role: "Being approached for professional knowledge exchange.",
    status: "to-verify",
    statusNote: "Outreach prepared, not confirmed. No funding assumed.",
  },
  {
    name: "Kenya Library Association (KLA)",
    category: "Library professional",
    role: "Being approached for mentorship and technical guidance.",
    status: "to-verify",
    statusNote: "Verify current office contacts. Not confirmed.",
  },
  {
    name: "Kenya National Chamber of Commerce and Industry (via Ms. Ruth Muthoni)",
    category: "Business network",
    role: "Being approached for business-community and CSR introductions.",
    status: "to-verify",
    statusNote: "Do not use a title for Ms. Muthoni until confirmed. Not confirmed.",
  },
  {
    name: "Homa Bay County Government",
    category: "County government",
    role: "County-level coordination being explored; no endorsement or funding presumed.",
    status: "to-verify",
    statusNote: "Verify Hon. Elijah Munga's role/portfolio and the correct CECM office.",
  },
];

export const INDIVIDUAL_CHAMPIONS: PartnerEntry[] = [
  {
    name: "Ms. Ruth Muthoni",
    category: "Individual champion",
    role: "Business-community connector (affiliation to be verified).",
    status: "to-verify",
    statusNote: "Confirm current role and affiliation before publication.",
  },
  {
    name: "Ms. Mina Kagram",
    category: "Individual champion",
    role: "Strategic champion (role to be verified).",
    status: "to-verify",
    statusNote: "Confirm identity and affiliation.",
  },
  {
    name: "Ms. Cecilia Waweru",
    category: "Individual champion",
    role: "Strategic champion (role to be verified).",
    status: "to-verify",
    statusNote: "Confirm identity and affiliation.",
  },
  {
    name: "Prof. Rose Odhiambo",
    category: "Academic champion",
    role: "Academic guidance (affiliation to be verified).",
    status: "to-verify",
    statusNote: "Confirm current affiliation.",
  },
  {
    name: "Eng. Nick Airo",
    category: "Technical champion",
    role: "Technical advice (role to be verified).",
    status: "to-verify",
    statusNote: "Confirm current role.",
  },
  {
    name: "Scholarstica Odhiambo",
    category: "Individual champion",
    role: "Community champion (role to be verified).",
    status: "to-verify",
    statusNote: "Confirm identity and preferred channel.",
  },
  {
    name: "Esther Muinde",
    category: "Individual champion",
    role: "Strategic champion (role to be verified).",
    status: "to-verify",
    statusNote: "Confirm identity (spelling variation 'Ester' in source).",
  },
];

export const SUPPORT_NEEDS: { title: string; description: string }[] = [
  {
    title: "Financial support",
    description: "Fund construction, books or operations at any level. Payment details are shared directly with confirmed supporters — contact the project team.",
  },
  {
    title: "Books",
    description: "Age-appropriate books in English and Kiswahili: storybooks, readers, reference books, and African and East African literary works for children, youth and adults.",
  },
  {
    title: "Building materials",
    description: "Mabati, timber, cement, roofing, doors, windows, paint or fittings to help raise the Phase 1 structure.",
  },
  {
    title: "Solar / energy",
    description: "Solar lighting and power systems that extend safe study hours into the evening where electricity access is limited.",
  },
  {
    title: "ICT equipment",
    description: "Desktops, laptops and technical volunteer support to open the door to digital learning in future phases.",
  },
  {
    title: "Connectivity",
    description: "WiFi connectivity and newspaper, journal and media subscriptions that keep readers informed and connected.",
  },
  {
    title: "Professional skills",
    description: "Library practice, teaching, engineering, branding, web development and other expertise that strengthens the project.",
  },
  {
    title: "Volunteering",
    description: "Reading-club facilitation, study-session support, book drives, launch activities and community mobilization.",
  },
  {
    title: "Other support",
    description: "Fencing, furniture, transport, advocacy or anything else you believe could help — tell the team what you have in mind.",
  },
];

export const GALLERY: GalleryImage[] = [
  {
    src: "/images/brand-ucrecent-board.jpg",
    alt: "UCReCENT brand board showing the UCReCENT logo, colour palette and t-shirt designs beside Lake Victoria",
    caption: "UCReCENT brand identity — Read… Learn… Grow… Succeed",
    category: "Brand",
  },
  {
    src: "/images/design-front-view.jpg",
    alt: "Architectural rendering — front view of the proposed UCReCENT library",
    caption: "Proposed library — front view (architectural rendering)",
    category: "Designs",
  },
  {
    src: "/images/design-interior.jpg",
    alt: "Architectural rendering — interior reading and seating area of the proposed library",
    caption: "Proposed reading and seating area (architectural rendering)",
    category: "Designs",
  },
  {
    src: "/images/design-office.jpg",
    alt: "Architectural rendering — proposed administrator and librarian office",
    caption: "Proposed administrator / librarian's office (architectural rendering)",
    category: "Designs",
  },
  {
    src: "/images/design-views.jpg",
    alt: "Architectural rendering — different views of the proposed UCReCENT library building",
    caption: "Proposed building — different views (architectural rendering)",
    category: "Designs",
  },
  {
    src: "/images/community-book-handover-1.jpg",
    alt: "Community member receiving early learning books during a book handover",
    caption: "Early book mobilization — handover with community members (2026)",
    category: "Community",
  },
  {
    src: "/images/community-book-handover-2.jpg",
    alt: "Box of English and Kiswahili homework books prepared for the community collection",
    caption: "Homework and revision books being organized for learners",
    category: "Community",
  },
  {
    src: "/images/community-book-handover-3.jpg",
    alt: "Volunteers with boxes of donated books for Usao learners",
    caption: "Volunteers supporting early book mobilization",
    category: "Community",
  },
  {
    src: "/images/community-engagement-1.jpg",
    alt: "Community engagement around the UCReCENT initiative",
    caption: "Community engagement — building ownership for the library",
    category: "Community",
  },
  {
    src: "/images/community-engagement-2.jpg",
    alt: "Stakeholders meeting in support of UCReCENT",
    caption: "Stakeholder meeting in support of the initiative",
    category: "Community",
  },
];

export const UPDATES: UpdatePost[] = [
  {
    slug: "concept-note-finalised",
    title: "Concept Note finalised and partnership outreach begins",
    date: "2026-08-19",
    category: "Planning",
    coverImage: "/images/design-views.jpg",
    coverAlt: "Architectural rendering — different views of the proposed UCReCENT library building",
    excerpt:
      "The UCReCENT Concept Note was finalised, setting Phase 1 at KES 500,000 on community-donated land, with tailored partnership letters prepared.",
    body: [
      "The UCReCENT Initiative Team finalised the project Concept Note in August 2026.",
      "The Concept Note confirms the Phase 1 plan — a mabati-and-wood structure with shelving for up to 10,000 books and seating for 100 users — and a target cost ceiling of KES 500,000.",
      "Tailored partnership and collaboration letters were prepared for book publishers, literacy organisations, library professional bodies, diaspora networks and county stakeholders. Each recipient is approached for a contribution matching its strengths; no partnership is presented as confirmed until terms are agreed.",
    ],
  },
  {
    slug: "phase-one-plan",
    title: "Phase 1 plan: a lean library the community can open quickly",
    date: "2026-08-15",
    category: "Phase 1",
    coverImage: "/images/design-front-view.jpg",
    coverAlt: "Architectural rendering — front view of the proposed UCReCENT library",
    excerpt:
      "Phase 1 focuses on functionality and early access: community-donated land, an affordable structure, shelving for 10,000 books and seating for 100 users.",
    body: [
      "Phase 1 is deliberately lean so the community can begin using the library as soon as possible.",
      "The community donates the land. Construction uses mabati-and-wood options commonly used in rural Kenya, with basic security, ventilation and lighting.",
      "The first 1,000 books identified in the Concept Note (via The Reading Culture, terms to be confirmed) will seed the collection, which is planned to grow toward 10,000 books.",
    ],
  },
  {
    slug: "launch-date-announced",
    title: "Planned official launch: 7 October 2026",
    date: "2026-08-10",
    category: "Launch",
    coverImage: "/images/design-interior.jpg",
    coverAlt: "Architectural rendering — interior reading and seating area of the proposed library",
    excerpt:
      "The official launch is planned for 7 October 2026, followed by reading clubs, weekend study sessions and holiday reading programmes.",
    body: [
      "The Concept Note sets the official launch for 7 October 2026, subject to implementation readiness.",
      "After launch, the library plans to activate reading clubs, weekend study sessions and holiday reading programmes for children, youth and adults.",
      "The project committee will track construction milestones, books catalogued and circulated, membership, attendance and programme participation.",
    ],
  },
];

export function getUpdate(slug: string): UpdatePost | undefined {
  return UPDATES.find((u) => u.slug === slug);
}

export const FAQS: { q: string; a: string }[] = [
  {
    q: "Where will the library be built?",
    a: "In Usao Sublocation, Mbita East Division, Mbita Constituency, Homa Bay County, Kenya — on land donated by the community.",
  },
  {
    q: "What will Phase 1 include?",
    a: "A mabati-and-wood structure with shelving for up to 10,000 books, seating for 100 users and a small librarian's office, with basic security, ventilation and lighting.",
  },
  {
    q: "How much does Phase 1 cost?",
    a: "Phase 1 is designed to remain within a ceiling of KES 500,000. The community donates the land, which keeps the project affordable.",
  },
  {
    q: "How can I support the project?",
    a: "Through financial sponsorship, building materials, books, solar equipment, ICT support or volunteering. Because no public payment details have been published, please use the Support the Project enquiry form or contact the project team directly — payment details are shared directly with confirmed supporters.",
  },
  {
    q: "Are the listed organisations confirmed partners?",
    a: "No. The Concept Note names collaborators and stakeholders, and outreach letters have been prepared — but no formal partnership should be presented as confirmed until terms are agreed. This website clearly separates named collaborators from organisations being engaged.",
  },
];

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/project", label: "Our Project" },
  { href: "/impact", label: "Impact" },
  { href: "/get-involved", label: "Get Involved" },
  { href: "/updates", label: "Updates" },
  { href: "/gallery", label: "Gallery" },
  { href: "/partners", label: "Partners" },
  { href: "/contact", label: "Contact" },
] as const;

export function formatKes(n: number): string {
  return `KES ${n.toLocaleString("en-KE")}`;
}
