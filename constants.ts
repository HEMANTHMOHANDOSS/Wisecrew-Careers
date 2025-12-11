
import { Department, Job, JobLevel, JobType, BlogPost, TeamMember, QuizQuestion, Assessment } from './types';
import { FileText, Code, Mic, BookOpen } from 'lucide-react';

const COMMON_PERKS = [
  'Real-time mentoring & guidance from industry experts',
  'Hands-on experience with real-world projects',
  'Exposure to professional industry workflows',
  'Opportunity to collaborate with senior developers/designers',
  'Flexible working hours'
];

const INTERNSHIP_PERKS = [
  ...COMMON_PERKS,
  'Internship Completion Certificate',
  'Letter of Recommendation for top performers'
];

const FULLTIME_PERKS = [
  ...COMMON_PERKS,
  'Competitive Salary & Performance Bonuses',
  'Health Insurance & Wellness Benefits',
  'Career Growth & Leadership Opportunities'
];

const STANDARD_HIRING_STEPS = [
  'Application Review',
  'HR Screening Call',
  'Technical Assessment',
  'Technical Interview',
  'Culture Fit Round',
  'Offer Rollout'
];

const INTERNSHIP_HIRING_STEPS = [
  'Application Review',
  'Short Assignment',
  'Technical Interview',
  'Final Discussion',
  'Onboarding'
];

export const JOBS: Job[] = [
  {
    id: 'fe-react-01',
    title: 'Frontend Developer – React.js',
    department: Department.ENGINEERING,
    location: 'Remote',
    type: JobType.FULL_TIME,
    level: JobLevel.MID,
    shortDescription: 'Build modern, responsive web interfaces using React.js and Tailwind CSS.',
    description: 'We are looking for a skilled React.js Developer to join our engineering team. You will be responsible for translating design wireframes into high-quality code and ensuring robust performance across devices.',
    responsibilities: [
      'Develop new user-facing features using React.js.',
      'Build reusable components and front-end libraries for future use.',
      'Translate designs and wireframes into high-quality code.',
      'Optimize components for maximum performance across a vast array of web-capable devices and browsers.',
      'Collaborate with backend developers to integrate RESTful APIs.'
    ],
    requirements: [
      'Strong proficiency in JavaScript, including DOM manipulation and the JavaScript object model.',
      'Thorough understanding of React.js and its core principles.',
      'Experience with popular React.js workflows (such as Flux or Redux).',
      'Familiarity with newer specifications of EcmaScript.',
      'Knowledge of modern authorization mechanisms, such as JSON Web Token.'
    ],
    perks: FULLTIME_PERKS,
    postedDate: '2023-11-01',
    isActive: true,
    hiringSteps: STANDARD_HIRING_STEPS
  },
  {
    id: 'be-node-01',
    title: 'Backend Developer – Node.js',
    department: Department.ENGINEERING,
    location: 'Bangalore / Hybrid',
    type: JobType.FULL_TIME,
    level: JobLevel.MID,
    shortDescription: 'Architect and maintain scalable server-side logic using Node.js.',
    description: 'Join us to build the backbone of our applications. You will work on server-side logic, definition and maintenance of the central database, and ensuring high performance and responsiveness to requests from the front-end.',
    responsibilities: [
      'Integration of user-facing elements developed by front-end developers with server side logic.',
      'Writing reusable, testable, and efficient code.',
      'Design and implementation of low-latency, high-availability, and performant applications.',
      'Implementation of security and data protection.',
      'Integration of data storage solutions (MongoDB, PostgreSQL).'
    ],
    requirements: [
      'Proficiency in Node.js and frameworks available for it (Express, NestJS).',
      'Understanding the nature of asynchronous programming and its quirks and workarounds.',
      'Basic understanding of front-end technologies, such as HTML5, and CSS3.',
      'User authentication and authorization between multiple systems, servers, and environments.',
      'Understanding fundamental design principles behind a scalable application.'
    ],
    perks: FULLTIME_PERKS,
    postedDate: '2023-11-05',
    isActive: true,
    hiringSteps: STANDARD_HIRING_STEPS
  },
  {
    id: 'mobile-flutter-01',
    title: 'Mobile App Developer – Flutter',
    department: Department.ENGINEERING,
    location: 'Remote',
    type: JobType.FULL_TIME,
    level: JobLevel.JUNIOR,
    shortDescription: 'Create cross-platform mobile applications using Flutter.',
    description: 'We are seeking a Flutter Developer to create multi-platform apps for iOS and Android using Google\'s Flutter development framework. You will collaborate with our design and engineering teams to ship new features.',
    responsibilities: [
      'Design and build advanced applications for the Flutter platform.',
      'Collaborate with cross-functional teams to define, design, and ship new features.',
      'Unit-test code for robustness, including edge cases, usability, and general reliability.',
      'Work on bug fixing and improving application performance.',
      'Continuously discover, evaluate, and implement new technologies to maximize development efficiency.'
    ],
    requirements: [
      'Proven software development experience and Android skills development.',
      'Experience with Flutter and Dart is a must.',
      'Experience with third-party libraries and APIs.',
      'Working knowledge of the general mobile landscape, architectures, trends, and emerging technologies.',
      'Solid understanding of the full mobile development life cycle.'
    ],
    perks: FULLTIME_PERKS,
    postedDate: '2023-11-08',
    isActive: true,
    hiringSteps: STANDARD_HIRING_STEPS
  },
  {
    id: 'ui-ux-figma-01',
    title: 'UI/UX Designer – Figma',
    department: Department.DESIGN,
    location: 'Chennai',
    type: JobType.FULL_TIME,
    level: JobLevel.MID,
    shortDescription: 'Design intuitive and beautiful user experiences using Figma.',
    description: 'We are looking for a UI/UX Designer to turn our software into easy-to-use products for our clients. You will gather user requirements, design graphic elements, and build navigation components.',
    responsibilities: [
      'Gather and evaluate user requirements in collaboration with product managers and engineers.',
      'Illustrate design ideas using storyboards, process flows and sitemaps.',
      'Design graphic user interface elements, like menus, tabs and widgets.',
      'Build page navigation buttons and search fields.',
      'Develop UI mockups and prototypes that clearly illustrate how sites function and look like.'
    ],
    requirements: [
      'Proven work experience as a UI/UX Designer or similar role.',
      'Portfolio of design projects.',
      'Knowledge of wireframe tools (e.g. Wireframe.cc and InVision).',
      'Up-to-date knowledge of design software like Adobe Illustrator and Photoshop.',
      'Expert proficiency in Figma.'
    ],
    perks: FULLTIME_PERKS,
    postedDate: '2023-11-10',
    isActive: true,
    hiringSteps: STANDARD_HIRING_STEPS
  },
  {
    id: 'mkt-intern-01',
    title: 'Marketing Intern',
    department: Department.MARKETING,
    location: 'Remote',
    type: JobType.INTERNSHIP,
    level: JobLevel.INTERN,
    shortDescription: 'Gain hands-on experience in digital marketing campaigns.',
    description: 'This is an exciting opportunity for a Marketing Intern to join our team. You will help with daily administrative duties and assist with marketing campaigns and social media monitoring.',
    responsibilities: [
      'Assist with daily administrative duties.',
      'Design and present new social media campaign ideas.',
      'Monitor all social media platforms for trending news, ideas, and feedback.',
      'Prepare detailed promotional presentations.',
      'Help with the planning and hosting of marketing events.'
    ],
    requirements: [
      'Current enrollment in a related BS or Masters degree.',
      'Solid understanding of different marketing techniques.',
      'Excellent verbal and written communication skills.',
      'Familiarity with marketing computer software and online applications (e.g. CRM tools, Online analytics and Google Adwords).',
      'Passion for the marketing industry and its best practices.'
    ],
    perks: INTERNSHIP_PERKS,
    postedDate: '2023-11-15',
    isActive: true,
    isUnpaid: true,
    hiringSteps: INTERNSHIP_HIRING_STEPS
  },
  {
    id: 'sales-tele-01',
    title: 'Telecalling Executive',
    department: Department.SALES,
    location: 'Chennai',
    type: JobType.FULL_TIME,
    level: JobLevel.JUNIOR,
    shortDescription: 'Engage with potential clients and generate leads.',
    description: 'We are looking for an enthusiastic Telecalling Executive to contribute in generating sales for our company. You will be responsible for closing sales deals over the phone and maintaining good customer relationships.',
    responsibilities: [
      'Contact potential or existing customers to inform them about a product or service using scripts.',
      'Answer questions about products or the company.',
      'Ask questions to understand customer requirements and close sales.',
      'Direct prospects to the field sales team when needed.',
      'Enter and update customer information in the database.'
    ],
    requirements: [
      'Proven experience as telesales representative or other sales/customer service role.',
      'Proven track record of successfully meeting sales quota preferably over the phone.',
      'Good knowledge of relevant computer programs (e.g. CRM software) and telephone systems.',
      'Ability to learn about products and services and describe/explain them to prospects.',
      'Excellent communication and interpersonal skills.'
    ],
    perks: FULLTIME_PERKS,
    postedDate: '2023-11-12',
    isActive: true,
    hiringSteps: STANDARD_HIRING_STEPS
  },
  {
    id: 'support-assoc-01',
    title: 'Customer Support Associate',
    department: Department.SUPPORT,
    location: 'Remote',
    type: JobType.FULL_TIME,
    level: JobLevel.JUNIOR,
    shortDescription: 'Provide world-class support to our global user base.',
    description: 'We are looking for a Customer Support Associate to assist our customers with technical problems when using our products and services. Customer Support Associate responsibilities include resolving customer queries, recommending solutions and guiding product users through features and functionalities.',
    responsibilities: [
      'Respond to customer queries in a timely and accurate way, via phone, email or chat.',
      'Identify customer needs and help customers use specific features.',
      'Analyze and report product malfunctions (for example, by testing different scenarios or impersonating users).',
      'Update our internal databases with information about technical issues and useful discussions with customers.',
      'Share feature requests and effective workarounds with team members.'
    ],
    requirements: [
      'Experience as a Customer Support Specialist or similar CS role.',
      'Familiarity with our industry is a plus.',
      'Experience using help desk software and remote support tools.',
      'Understanding of how CRM systems work.',
      'Excellent communication and problem-solving skills.'
    ],
    perks: FULLTIME_PERKS,
    postedDate: '2023-11-14',
    isActive: true,
    hiringSteps: STANDARD_HIRING_STEPS
  },
  {
    id: 'genai-intern-01',
    title: 'Generative AI Intern',
    department: Department.ENGINEERING,
    location: 'Remote',
    type: JobType.INTERNSHIP,
    level: JobLevel.INTERN,
    shortDescription: 'Explore the frontiers of LLMs and Generative AI.',
    description: 'We are seeking a motivated Generative AI Intern to research and implement state-of-the-art AI models. You will work closely with our R&D team to explore applications of LLMs in our products.',
    responsibilities: [
      'Research latest trends in Generative AI and LLMs.',
      'Experiment with OpenAI APIs, LangChain, and other tools.',
      'Build prototypes to demonstrate AI capabilities.',
      'Assist in fine-tuning models for specific use cases.',
      'Document findings and present to the engineering team.'
    ],
    requirements: [
      'Strong foundation in Python and data structures.',
      'Familiarity with machine learning concepts and frameworks (PyTorch/TensorFlow).',
      'Knowledge of NLP and recent advancements in Transformer models.',
      'Curiosity and willingness to learn rapidly.',
      'Projects or coursework related to AI/ML.'
    ],
    perks: INTERNSHIP_PERKS,
    postedDate: '2023-11-18',
    isActive: true,
    isUnpaid: true,
    hiringSteps: INTERNSHIP_HIRING_STEPS
  }
];

export const VALUES = [
  {
    title: 'Innovation',
    description: 'We push boundaries and embrace new technologies to solve complex problems.',
    icon: 'Lightbulb'
  },
  {
    title: 'Integrity',
    description: 'We believe in transparent, honest, and ethical conduct in all our dealings.',
    icon: 'Shield'
  },
  {
    title: 'Excellence',
    description: 'We strive for perfection in every pixel, every line of code, and every interaction.',
    icon: 'Award'
  },
  {
    title: 'Collaboration',
    description: 'We win together. Our diverse team unites to deliver shared success.',
    icon: 'Users'
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Ace Your Technical Interview',
    excerpt: 'Top tips from our engineering leads on how to prepare for coding challenges.',
    image: 'https://picsum.photos/seed/blog1/400/250',
    category: 'Career Advice',
    readTime: '5 min read'
  },
  {
    id: '2',
    title: 'Why We Choose Remote-First',
    excerpt: 'How Wisecrew maintains culture and productivity across different time zones.',
    image: 'https://picsum.photos/seed/blog2/400/250',
    category: 'Culture',
    readTime: '3 min read'
  },
  {
    id: '3',
    title: 'The Future of Glassmorphism',
    excerpt: 'Our design team explores the next evolution of UI trends.',
    image: 'https://picsum.photos/seed/blog3/400/250',
    category: 'Design',
    readTime: '4 min read'
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'CTO',
    image: 'https://picsum.photos/seed/sarah/300/300',
    bio: 'Ex-Google engineer passionate about scalable architecture and mentorship.',
    socials: { linkedin: '#' }
  },
  {
    id: '2',
    name: 'David Kumar',
    role: 'Lead Designer',
    image: 'https://picsum.photos/seed/david/300/300',
    bio: 'Award-winning designer obsessed with micro-interactions and accessibility.',
    socials: { twitter: '#' }
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    role: 'Head of People',
    image: 'https://picsum.photos/seed/elena/300/300',
    bio: 'Building a culture of inclusivity and continuous learning at Wisecrew.',
    socials: { linkedin: '#' }
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "What do you enjoy most?",
    options: [
      { label: "Building logic & algorithms", value: "eng" },
      { label: "Crafting visuals & flows", value: "des" },
      { label: "Analyzing trends & data", value: "mkt" }
    ]
  },
  {
    id: 2,
    question: "Your ideal work environment is...",
    options: [
      { label: "Deep focus with code", value: "eng" },
      { label: "Collaborative brainstorming", value: "des" },
      { label: "Fast-paced & social", value: "mkt" }
    ]
  },
  {
    id: 3,
    question: "Which tool do you prefer?",
    options: [
      { label: "VS Code", value: "eng" },
      { label: "Figma", value: "des" },
      { label: "Google Analytics", value: "mkt" }
    ]
  },
  {
    id: 4,
    question: "You solve problems by...",
    options: [
      { label: "Debugging & Testing", value: "eng" },
      { label: "Sketching & Prototyping", value: "des" },
      { label: "Researching & Strategizing", value: "mkt" }
    ]
  },
  {
    id: 5,
    question: "End goal?",
    options: [
      { label: "A robust, scalable system", value: "eng" },
      { label: "A beautiful user experience", value: "des" },
      { label: "High conversion rates", value: "mkt" }
    ]
  }
];

export const ASSESSMENTS: Assessment[] = [
  {
    id: 'mock-01',
    title: 'Mock Test (MCQ)',
    type: 'MCQ',
    description: 'Test your knowledge with our timed multiple-choice practice quiz.',
    duration: '20 mins',
    questions: 15,
    icon: FileText
  },
  {
    id: 'coding-01',
    title: 'Coding Challenge',
    type: 'Coding',
    description: 'Solve algorithmic problems in our simulated code editor environment.',
    duration: '45 mins',
    questions: 2,
    icon: Code
  },
  {
    id: 'interview-01',
    title: 'Mock Interview',
    type: 'Interview',
    description: 'Practice with common behavioral and technical interview questions.',
    duration: '30 mins',
    icon: Mic
  },
  {
    id: 'guide-01',
    title: 'Interview Guide',
    type: 'Guide',
    description: 'Read our comprehensive guide on how to crack technical interviews at Wisecrew.',
    icon: BookOpen
  }
];
