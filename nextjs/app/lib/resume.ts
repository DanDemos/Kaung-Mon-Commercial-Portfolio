/** Recruiter-facing resume copy for `/resume`. */

export type ResumeEntry = {
  title: string;
  org: string;
  dates: string;
  body?: string;
  bullets?: string[];
};

export const RESUME_EDUCATION: ResumeEntry[] = [
  {
    title: "Business Computing, BSc Hons",
    org: "University of Greenwich",
    dates: "2019–2020",
    body: "Business models, strategy, and problem-solving across computing and commercial contexts.",
  },
  {
    title: "Higher National Diploma (HND) in Computing: Software Development",
    org: "SQA International",
    dates: "2017–2019",
    body: "Programming foundations and software development life cycles.",
  },
  {
    title: "Business Computing & HND courses",
    org: "KMD Institute",
    dates: "2017–2020",
    body: "Attendance location for the Greenwich and SQA programmes above.",
  },
  {
    title: "High school",
    org: "BEHS Thuwunna",
    dates: "2006–2016",
    body: "Distinction in English.",
  },
];

export const RESUME_EXPERIENCE: ResumeEntry[] = [
  {
    title: "System Administrator",
    org: "Myan Pro Solutions",
    dates: "2020–2021",
    bullets: [
      "Shipped 6 website projects for clients.",
      "Built 3 cross-platform React Native apps.",
      "Delivered 2 Facebook chatbots.",
      "Led system analysis and client meetings.",
      "Trained teammates on the tools we used.",
    ],
  },
  {
    title: "Freelancing",
    org: "Freelance projects",
    dates: "2021–2022",
    body: "Took project requests from clients and shipped websites and product UI.",
  },
];
