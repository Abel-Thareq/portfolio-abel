export interface Project {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  role: string;
  category: string;
  technologies: string[];
  summary: string;
  problem: string;
  contributions: string[];
  keyFeatures: string[];
  isAcademic?: boolean;
  intellectualProperty?: string;
  links?: {
    label: string;
    url: string;
  }[];
}

export interface ExperienceItem {
  id: string;
  period: string;
  role: string;
  company: string;
  location: string;
  description: string;
  contributions: string[];
  technologies: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  abbreviation: string;
  degree: string;
  period: string;
  grade?: string;
  specialization?: string;
  logo: string;
  description: string;
  highlights: string[];
}

export interface CertificationItem {
  id: string;
  year: string;
  title: string;
  issuer: string;
  type: "copyright" | "certification" | "course";
  description?: string;
}

export const personalInfo = {
  name: "Abel Thareq",
  roleHeadline: "Software Engineer",
  location: "Magelang, Central Java, Indonesia",
  timezone: "GMT+7",
  email: "abelthareq@gmail.com",
  socials: {
    linkedin: "https://linkedin.com/in/abelthareq",
    website: "https://4bel.framer.website",
    github: "https://github.com/abelthareq",
  },
  heroStatement: "Building practical digital products and information systems with structured thinking, data, and software.",
  aboutStory: [
    "I started from an Electrical Engineering background at Universitas Tidar, specializing in Computer Systems & Information. Through academic projects, data-related initiatives, and practical development, I found my passion in translating complex real-world requirements into clean, dependable software.",
    "My focus centers around frontend engineering and structured information systems—building responsive user interfaces, implementing multi-level approval workflows, and working with data patterns. I believe the most valuable software balances technical reliability with clarity and human usability."
  ],
  pillars: [
    {
      title: "Frontend Engineering",
      description: "Translating complex workflows and interface designs into responsive, resilient web and mobile applications using modern React and Flutter ecosystems.",
      skills: ["React.js", "React 19", "Vite", "Flutter", "Dart", "Tailwind CSS", "Vanilla CSS"]
    },
    {
      title: "Information Systems & Workflows",
      description: "Architecting structured business processes, role-based access control (RBAC), multi-stage approvals, and administrative document flows.",
      skills: ["Procurement Workflows", "RBAC & Permissions", "Master Data Management", "Budget Periods", "Audit & Validation"]
    },
    {
      title: "Data & Problem Solving",
      description: "Analyzing system data, handling datasets, building structured pipelines, and turning data requirements into actionable insights.",
      skills: ["PostgreSQL", "SQL", "Python", "Data Management", "RESTful APIs", "Git"]
    }
  ]
};

export const educations: EducationItem[] = [
  {
    id: "untidar",
    institution: "Universitas Tidar",
    abbreviation: "UNTIDAR",
    degree: "Bachelor's Degree in Electrical Engineering",
    period: "Jun 2022 – Jul 2026",
    grade: "3.55 / 4.00",
    specialization: "Computer Systems & Information",
    logo: "/logos/untidar.png",
    description: "Specialized in Computer Systems & Information. Active in software development, practical information systems (SiBMN), and data engineering initiatives.",
    highlights: [
      "Specialization in Computer Systems & Information",
      "Lead frontend developer for university procurement system (SiBMN)",
      "Published copyright for WSN Data Management System (2025)"
    ]
  },
  {
    id: "smanca",
    institution: "SMAN 1 Candimulyo",
    abbreviation: "SMANCA",
    degree: "Senior High School — Science Major (MIPA)",
    period: "Jul 2019 – May 2022",
    grade: "83.13",
    logo: "/logos/smanca.png",
    description: "Majored in Natural Sciences (MIPA). Consistently ranked among the top 5 students in class and participated in academic competitions.",
    highlights: [
      "Final Grade: 83.13",
      "Consistently ranked Top 5 in class",
      "Mathematics Olympiad team (OSN)",
      "Superior score on psychological IQ assessment"
    ]
  },
  {
    id: "spenadaca",
    institution: "SMPN 2 Candimulyo",
    abbreviation: "SPENADACA",
    degree: "Junior High School",
    period: "Jul 2016 – May 2019",
    grade: "84.00",
    logo: "/logos/spenadaca.png",
    description: "Achieved top academic standing and active participation in language & storytelling extracurriculars.",
    highlights: [
      "Final Grade: 84.00",
      "Consistently ranked Top 3 in class",
      "Top 15 ranking in National Examination (UN) across all parallel classes",
      "School representative in English Storytelling competition"
    ]
  }
];

export const projects: Project[] = [
  {
    id: "sibmn",
    number: "01",
    title: "SiBMN",
    subtitle: "Sistem Informasi Barang Milik Negara",
    role: "Frontend Developer",
    category: "Information System · Procurement Workflow",
    technologies: ["React 19", "Vite", "Vanilla CSS", "SweetAlert2", "RESTful API"],
    summary: "A web-based enterprise information system developed to streamline and manage the entire procurement submission and asset governance process across work units within Universitas Tidar.",
    problem: "University departments handled procurement proposals through fragmented and manual paper-heavy pipelines, leading to slow approval turnaround, limited status visibility, and administrative bottleneck.",
    contributions: [
      "Engineered responsive user interfaces for central dashboards, proposal submissions, authentication, and administrative modules.",
      "Implemented multi-level approval workflows adapting to distinct user roles and hierarchy levels.",
      "Developed comprehensive Role & Permission management along with budget period controls.",
      "Built dynamic master data management interfaces for inventory catalogs and asset classification.",
      "Integrated frontend seamlessly with backend RESTful APIs, adding form validation and intuitive loading states."
    ],
    keyFeatures: [
      "Multi-stage proposal submission & verification",
      "Dynamic Role-Based Access Control (RBAC)",
      "Budget period lockdown and quota tracking",
      "Official document issuance & status auditing",
      "Reusable UI components with zero external bloated design libraries"
    ]
  },
  {
    id: "ppob",
    number: "02",
    title: "PPOB Digital Payment Platform",
    subtitle: "Multi-Service Bill & Digital Goods Application",
    role: "Frontend Developer",
    category: "Mobile Application · Payment Services",
    technologies: ["Flutter", "Dart", "PostgreSQL", "RESTful API", "Git"],
    summary: "A comprehensive digital payment application enabling seamless transactions for essential public utilities, digital bills, and daily financial services.",
    problem: "End users required a unified, high-speed, and reliable interface to handle diverse utility billing and digital asset transactions with instant confirmation and transaction history.",
    contributions: [
      "Built feature modules for PDAM, electricity tokens, BPJS health insurance, e-money top-ups, game vouchers, and digital shops.",
      "Translated high-fidelity UI/UX mockups into fluid, high-performance Flutter mobile views.",
      "Integrated secure REST API endpoints with robust error handling and network status resilience.",
      "Collaborated actively in cross-functional sprints with backend engineers, UI/UX designers, QC testers, and project managers."
    ],
    keyFeatures: [
      "Real-time bill inquiries & multi-channel payment flows",
      "Instant top-up processing for major e-wallet providers",
      "Structured transaction history & downloadable digital receipts",
      "Optimized state management for low-latency navigation"
    ]
  },
  {
    id: "wsn-system",
    number: "03",
    title: "WSN Data Management System",
    subtitle: "Wireless Sensor Network Data Hub",
    role: "Developer & Researcher",
    category: "Data Management · Sensor Systems",
    technologies: ["Python", "Data Management", "Sensor Networks", "SQL"],
    summary: "A specialized data management system designed to ingest, process, and structure telemetry streams originating from Wireless Sensor Networks (WSN).",
    intellectualProperty: "Registered Copyright (Hak Cipta) — 2025",
    problem: "Wireless sensor topologies generate continuous, asynchronous data streams that require efficient ingestion pipelines, validation, and structured storage for reliable downstream analysis.",
    contributions: [
      "Architected Python-based data ingestion routines for asynchronous sensor payloads.",
      "Implemented data cleansing, normalization, and relational storage schemas.",
      "Secured formal Intellectual Property Copyright (2025) for the system design and implementation."
    ],
    keyFeatures: [
      "Automated sensor stream parsing & telemetry logging",
      "Fault-tolerant data buffering for packet drop recovery",
      "Structured query interfaces for time-series analysis",
      "Formal IP protection & academic benchmarking"
    ]
  },
  {
    id: "simkar",
    number: "04",
    title: "SIMKAR",
    subtitle: "Sistem Informasi Manajemen Kehadiran & Pelaporan Kerja",
    role: "System Concept & Developer",
    category: "Academic Research · Decision Support System",
    technologies: ["Laravel", "Next.js", "Relational Database", "AHP", "ARAS"],
    isAcademic: true,
    summary: "An academic research information system combining employee attendance tracking, daily work activity reporting, and multi-criteria decision-making algorithms (AHP & ARAS) for objective performance evaluation.",
    problem: "Conventional attendance systems record only presence without evaluating qualitative work deliverables, making objective employee appraisal difficult for organizational leadership.",
    contributions: [
      "Formulated system architecture integrating daily reporting with decision support algorithms.",
      "Implemented Analytic Hierarchy Process (AHP) for weight calculation and ARAS for performance ranking.",
      "Engineered administrative dashboards for attendance verification and workload analytics."
    ],
    keyFeatures: [
      "Daily activity & work output tracking",
      "Dual-algorithm evaluation engine (AHP + ARAS)",
      "Team-level work delegation and review workflows",
      "Automated performance ranking & analytics summary"
    ]
  }
];

export const experiences: ExperienceItem[] = [
  {
    id: "untidar-webdev",
    period: "Feb 2026 – Jul 2026",
    role: "Web Developer",
    company: "Universitas Tidar",
    location: "Magelang, Indonesia",
    description: "Led the frontend engineering of the university's central asset procurement and governance platform (SiBMN).",
    contributions: [
      "Engineered frontend modules for procurement proposals, multi-tier approvals, role permissions, and budget allocation.",
      "Created structured stateful forms with comprehensive client-side validation and responsive dashboards.",
      "Integrated with university REST APIs to guarantee accurate document issuance and real-time proposal tracking."
    ],
    technologies: ["React 19", "Vite", "Vanilla CSS", "RESTful API", "SweetAlert2"]
  },
  {
    id: "techmedia-programmer",
    period: "Aug 2025 – Jan 2026",
    role: "Programmer / Frontend Developer",
    company: "Techmedia Academy",
    location: "Indonesia",
    description: "Developed mobile and web application features across client projects, focusing on digital payment services and interactive platforms.",
    contributions: [
      "Built multi-utility payment modules (PDAM, Electricity, BPJS, E-Money, Game Top-Up) in Flutter.",
      "Collaborated in agile development cycles with backend, UI/UX, QA, and project management teams.",
      "Conducted code testing, resolved edge-case rendering bugs, and maintained repository standards via Git."
    ],
    technologies: ["Flutter", "Dart", "PostgreSQL", "RESTful API", "Git"]
  }
];

export const certifications: CertificationItem[] = [
  {
    id: "cert-wsn-copyright",
    year: "2025",
    title: "Hak Cipta (Copyright): WSN Data Management System with Python",
    issuer: "Direktorat Jenderal Kekayaan Intelektual (DJKI) RI",
    type: "copyright",
    description: "Official Intellectual Property protection for the design and implementation of a Wireless Sensor Network data management framework."
  },
  {
    id: "cert-data-eng",
    year: "2025",
    title: "Fundamental of Data Engineering",
    issuer: "Ministry of Communication and Digital Affairs (Komdigi RI)",
    type: "certification",
    description: "Comprehensive training covering data pipelines, relational architectures, and ETL foundations."
  },
  {
    id: "cert-power-bi",
    year: "2025",
    title: "Start Your Data Journey with Power BI",
    issuer: "Professional Data Analytics Series",
    type: "course",
    description: "Data visualization, DAX calculations, and interactive business dashboard reporting."
  },
  {
    id: "cert-business-analytics",
    year: "2025",
    title: "Business Analytics with Excel & Career Skills",
    issuer: "Digital Talent Scholarship (DTS) 2025",
    type: "course",
    description: "Statistical modeling, spreadsheet data analysis, and professional data analytics competencies."
  }
];
