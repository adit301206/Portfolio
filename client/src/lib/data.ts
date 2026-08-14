/*
 * NOVA Portfolio data — source of truth for the console.
 * Mirrors https://github.com/adit301206.
 * Style: Orbital Command (see ideas.md).
 */
export const PROFILE = {
  name: "Adit Kapadiya",
  handle: "adit301206",
  github: "https://github.com/adit301206",
  email: "aditkapadiya1230@gmail.com",
  bio: "I am an IT student, learning new things and aspire to become a Data Scientist.",
  tagline: "Engineering Intelligence",
  avatar: "https://avatars.githubusercontent.com/u/214822554?v=4",
  stats: {
    commits: 143,
    prs: 34,
    repos: 9,
    followers: 11,
  },
  stack: [
    "Python",
    "JavaScript",
    "TypeScript",
    "React",
    "Three.js",
    "Node.js",
    "Express",
    "Django",
    "Flask",
    "PostgreSQL",
    "MongoDB",
    "TensorFlow",
    "PyTorch",
    "Scikit-Learn",
    "Pandas",
    "Plotly",
    "Docker",
    "Git",
  ],
  focus: ["Artificial Intelligence", "Backend Engineering", "Data Science"],
};

export interface Project {
  id: string;
  name: string;
  handle: string;
  category: "AI" | "Web" | "Data" | "Backend";
  status: "LIVE" | "DEV" | "ARCHIVE";
  date: string;
  description: string;
  detail: string;
  highlights: string[];
  tech: string[];
  url: string;
  readme?: string;
  /** Screenshot images rendered on the console (hosted, permanent). */
  screenshots?: string[];
  /** Live demo URL shown in an iframe inside Mission Briefing. */
  liveUrl?: string;
}

export const PROJECTS: Project[] = [
  {
    id: "neurocity",
    name: "NeuroCity",
    handle: "adit301206/NeuroCity",
    category: "AI",
    status: "LIVE",
    date: "2026.08",
    description:
      "Smart City Digital Twin — a cognitive metropolitan operating system unifying traffic, energy grid, and civic grievance systems into one command center.",
    detail:
      "A 3-tier distributed architecture: React + Three.js frontend, Node/Express gateway, and a Django AI brain running YOLOv8, scikit-learn energy forecasting, and NLP-driven grievance classification. Built as a production-ready Semester 4 major project.",
    highlights: [
      "Real-time deep learning inference at sub-second latency",
      "ML-based solar energy yield prediction",
      "NLP triage for citizen grievance tickets",
      "MongoDB Atlas cloud backend with JWT gateway",
    ],
    tech: ["React", "Vite", "Three.js", "Tailwind v4", "Node.js", "Express", "MongoDB", "Django DRF", "YOLOv8", "PyTorch", "Scikit-Learn"],
    url: "https://github.com/adit301206/NeuroCity",
    screenshots: ["/manus-storage/neurocity-ui-console_dff5e326.png"],
    readme:
      "Modern metropolitan centers suffer from severe urban management fragmentation. NeuroCity resolves these critical limitations by unifying disjointed municipal infrastructures into a single, unified, and highly interactive digital twin command center. Operating as a cognitive metropolitan operating system, NeuroCity combines real-time deep learning inference, machine learning energy predictions, and NLP-driven grievance classification into an ultra-premium dashboard.",
  },
  {
    id: "prepwise",
    name: "PrepWise",
    handle: "adit301206/PrepWise",
    category: "Web",
    status: "LIVE",
    date: "2026.02",
    description:
      "Adaptive exam preparation platform with an AI tutor — quizzes that adjust difficulty to performance and explain mistakes in conversation.",
    detail:
      "A full-stack learning engine with Supabase Auth, PostgreSQL on Supabase, Flask backend, and Google Gemini AI integration for instant conversational explanations. Includes a teacher console and daily-study-momentum tracking.",
    highlights: [
      "Adaptive engine shifts quiz difficulty (Easy → Hard) from performance history",
      "Google Gemini AI explains every wrong answer conversationally",
      "Analytics dashboard charting strong and weak topics",
      "Teacher console for question banks and student insights",
    ],
    tech: ["Flask", "PostgreSQL", "Supabase Auth", "Gemini AI", "HTML/CSS/JS", "Jinja2", "Matplotlib"],
    url: "https://github.com/adit301206/PrepWise",
    screenshots: ["/manus-storage/prepwise-ui-console_5e15b5ea.png"],
    readme:
      "PrepWise is an intelligent, adaptive exam preparation platform designed to help students master subjects through personalized quizzes and detailed analytics. It features a dynamic learning engine that adjusts question difficulty based on performance and provides AI-powered explanations for mistakes.",
  },
  {
    id: "creditwise",
    name: "CreditWise",
    handle: "adit301206/CreditWise_Loan_System",
    category: "Data",
    status: "DEV",
    date: "2026.07",
    description:
      "End-to-end ML pipeline predicting loan approval from applicant demographics, financial history, and credit characteristics.",
    detail:
      "Preprocessing, exploratory data analysis, feature engineering, and model training on a 20-column loan applicant dataset to identify creditworthy applicants — mitigating default risk while streamlining approvals.",
    highlights: [
      "Full ML pipeline: EDA → feature engineering → training",
      "20-column applicant dataset with credit scoring signals",
      "Risk-based approval classification",
      "Deployment-ready trained model",
    ],
    tech: ["Python", "Pandas", "NumPy", "Scikit-Learn", "Jupyter"],
    url: "https://github.com/adit301206/CreditWise_Loan_System",
    screenshots: ["/manus-storage/creditwise-ui-console_c6bb5df3.png"],
    readme:
      "An end-to-end Machine Learning pipeline to predict loan approval status based on applicant demographics, financial history, and loan characteristics. This project implements data preprocessing, exploratory data analysis, feature engineering, and model training to identify creditworthy applicants, thereby mitigating the risk of default while streamlining the approval process.",
  },
  {
    id: "housing",
    name: "California Housing",
    handle: "adit301206/CaliforniaHousingPrices_MachineLearning",
    category: "Data",
    status: "DEV",
    date: "2026.04",
    description:
      "Housing price prediction journey from linear regression to Random Forest — achieving R² 0.835 with geospatial insight across California.",
    detail:
      "Log-transformed skewed price data, engineered features, and mapped coastal 'price belts' with Plotly. Discovered income is the strongest predictor (0.68 correlation) and proximity to the ocean sets a massive price floor.",
    highlights: [
      "R² 0.835 with Random Forest Regressor",
      "Logarithmic transform stabilized skewed price data",
      "Geospatial Plotly 'Price Belt' maps of the coastline",
      "Improved over linear regression's 0.67 baseline",
    ],
    tech: ["Python", "Pandas", "NumPy", "Scikit-Learn", "Plotly", "Seaborn"],
    url: "https://github.com/adit301206/CaliforniaHousingPrices_MachineLearning",
    screenshots: ["/manus-storage/housing-ui-console_2fde6bd5.png"],
    readme:
      "This project explores the factors influencing housing prices in California. It demonstrates a complete data science pipeline, including geospatial visualization, feature engineering, and advanced regression techniques.",
  },
  {
    id: "sms",
    name: "Student Management System",
    handle: "adit301206/Handling_Students-Learning_Django",
    category: "Backend",
    status: "DEV",
    date: "2026.07",
    description:
      "Django-based marks and profile management platform with role-based access for students and faculty, plus a versioned REST API with JWT.",
    detail:
      "Supports profile images, marks tracking with automatic grade classification, and faculty-restricted PATCH endpoints. The DRF API ships v1 and v2 with a custom grade field and Simple JWT roles.",
    highlights: [
      "Role-based access: students view, faculty administer",
      "API versioning v1 → v2 with custom grade calculation",
      "JWT auth with roles embedded in token payload",
      "Pillow-backed profile picture uploads",
    ],
    tech: ["Django 6", "DRF", "Simple JWT", "SQLite", "Pillow"],
    url: "https://github.com/adit301206/Handling_Students-Learning_Django",
    screenshots: ["/manus-storage/sms-ui-console_c78a669f.png"],
    readme:
      "A Django-based Student Marks and Profile Management application designed for educational institutes. It supports role-based access control (Students vs. Faculty) via both a dynamic Web UI and a RESTful API.",
  },
  {
    id: "f1",
    name: "F1 Project",
    handle: "adit301206/F1_Project",
    category: "Web",
    status: "LIVE",
    date: "2026.06",
    description:
      "An active JavaScript web build — an ongoing mission with telemetry still streaming.",
    detail:
      "An interactive JavaScript web project, actively developed with the latest pushes streaming in August 2026. A live experiment in front-end craft.",
    highlights: [
      "Active development — latest push August 2026",
      "Vanilla JavaScript craftsmanship",
      "Interactive front-end experiments",
    ],
    tech: ["JavaScript", "HTML", "CSS"],
    url: "https://github.com/adit301206/F1_Project",
    readme: "An active JavaScript web project under continuous development.",
  },
];

export const TIMELINE = [
  { year: "2025", event: "First commit logged. GitHub console initialized." },
  { year: "2026.02", event: "PrepWise launches — adaptive learning engine with Gemini AI tutor." },
  { year: "2026.04", event: "California Housing study — R² 0.835 achieved." },
  { year: "2026.06", event: "NeuroCity mission begins — digital twin architecture." },
  { year: "2026.07", event: "CreditWise + Student Management System deployed from the console." },
  { year: "2026.08", event: "NeuroCity reaches production-ready status. Telemetry green." },
];
