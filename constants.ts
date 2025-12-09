import { Project, Product, ServiceItem, Brand, BlogPost } from './types';
import { Layout, Globe, Smartphone, Share2, Server, ShoppingBag, Code, Database, Layers } from 'lucide-react';

export const BRAND_NAME = "Peculiar Digital Solutions";
export const SHORT_NAME = "Peculiar Digitals";
export const CONTACT_PHONE = "+2348162000572";
export const WHATSAPP_PHONE = "+2349122533236";
export const EMAIL = "peculiardigitals@gmail.com";
export const FORMSPREE_ENDPOINT = "https://formspree.io/f/myzqokgn";

export const SERVICES_LIST: Record<string, ServiceItem> = {
  website: {
    name: "Website Design",
    subItems: [
      "WordPress Powered", "Joomla Powered", "Wix Powered", "Personal Blogs", 
      "Church Websites", "Club/Association Portals", "Union/Organization Sites", 
      "Career/Portfolio Websites", "Content Creator Sites", "SEO Optimization"
    ]
  },
  webapp: {
    name: "Web Application Development",
    subItems: [
      "School Management System", "Computer-Based Test (CBT)", "Streaming & Video Portal", 
      "School Portal", "Student Result Management", "Admission Systems", 
      "School Finance Systems", "Assignment Portals"
    ]
  },
  mobile: {
    name: "Mobile App Development",
    subItems: [
      "CBT Mobile App", "Task Manager", "TodoList App", "Income Manager"
    ]
  },
  automation: {
    name: "Workflow Automation",
    subItems: ["Zapier Integrations", "Custom Scripts", "Business Logic Automation"]
  },
  social: {
    name: "Social Media Management",
    subItems: ["Content Strategy", "Account Management", "Analytics & Growth"]
  }
};

// Mock Data for Initial Render
export const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Grace High School Portal',
    client: 'Grace High School',
    category: 'WebApp',
    description: 'A comprehensive school management system handling admissions, results, and finance.',
    stack: ['React', 'Node.js', 'PostgreSQL'],
    imageUrl: 'https://picsum.photos/seed/p1/800/600',
    screenshots: [],
    link: '#',
    status: 'Delivered',
    budget: '₦1,500,000',
    deliveryPeriod: '3 Months',
    testimonial: 'Peculiar Digitals transformed how we manage our students. Highly recommended!'
  },
  {
    id: '2',
    title: 'Union Voice Website',
    client: 'National Workers Union',
    category: 'Website',
    description: 'A news and membership portal for the union members to stay updated.',
    stack: ['WordPress', 'PHP', 'Custom Theme'],
    imageUrl: 'https://picsum.photos/seed/p2/800/600',
    screenshots: [],
    status: 'Delivered',
    deliveryPeriod: '4 Weeks'
  },
  {
    id: '3',
    title: 'ExamMaster CBT App',
    client: 'EduTech Solutions',
    category: 'MobileApp',
    description: 'Mobile application for students to practice for national exams.',
    stack: ['React Native', 'Firebase'],
    imageUrl: 'https://picsum.photos/seed/p3/800/600',
    screenshots: [],
    status: 'In Progress'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '101',
    title: 'School Management Kit (Source Code)',
    price: '250000',
    type: 'Source Code',
    description: 'Complete source code for a scalable school portal. PHP/Laravel backend.',
    imageUrl: 'https://picsum.photos/seed/pr1/800/600',
    purchaseLink: '#',
    screenshots: []
  },
  {
    id: '102',
    title: 'Church Website Template',
    price: '50000',
    type: 'Template',
    description: 'Modern, responsive WordPress theme designed specifically for ministries.',
    imageUrl: 'https://picsum.photos/seed/pr2/800/600',
    purchaseLink: '#',
    screenshots: []
  }
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Why Your School Needs a Digital Portal in 2025',
    slug: 'school-portal-importance-2025',
    excerpt: 'Manual record keeping is obsolete. Discover how a management system saves time and money.',
    content: "In the rapidly evolving educational landscape, efficiency is key. Schools relying on paper-based records face significant challenges in data retrieval, result processing, and financial tracking.\n\nA custom School Management System (SMS) solves these problems by centralizing data. Features like automated result computation, online admission processing, and fee tracking not only save administrative hours but also improve transparency with parents.\n\nAt Peculiar Digitals, we build systems that are secure, scalable, and easy to use.",
    coverImage: 'https://picsum.photos/seed/blog1/800/600',
    author: 'AyoJesu Ayonitemi',
    publishedAt: '2024-03-15',
    readTime: '5 min read',
    tags: ['EdTech', 'Management', 'Automation']
  },
  {
    id: '2',
    title: 'Top 5 Automation Tools for Small Businesses',
    slug: 'top-automation-tools',
    excerpt: 'Stop doing repetitive tasks. Here are the best tools to streamline your workflow.',
    content: "Small business owners often wear multiple hats. From marketing to accounting, the workload can be overwhelming. This is where automation comes in.\n\n1. Zapier: Connects your apps and automates workflows.\n2. Slack: Streamlines team communication.\n3. Buffer: Automates social media posting.\n\nIntegrating these tools can free up your time to focus on growth rather than operations.",
    coverImage: 'https://picsum.photos/seed/blog2/800/600',
    author: 'Peculiar Team',
    publishedAt: '2024-03-10',
    readTime: '3 min read',
    tags: ['Productivity', 'Business', 'Tools']
  }
];

export const INITIAL_BRANDS: Brand[] = [
  { id: '1', name: 'Google', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png' },
  { id: '2', name: 'Microsoft', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/2560px-Microsoft_logo_%282012%29.svg.png' },
  { id: '3', name: 'Spotify', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Spotify_logo_with_text.svg/2560px-Spotify_logo_with_text.svg.png' },
  { id: '4', name: 'Slack', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Slack_Technologies_Logo.svg/2560px-Slack_Technologies_Logo.svg.png' },
  { id: '5', name: 'Airbnb', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_B%C3%A9lo.svg/2560px-Airbnb_Logo_B%C3%A9lo.svg.png' },
];

export const TECH_STACK = [
  "React", "Node.js", "WordPress", "Flutter", "React Native", "Next.js", 
  "TailwindCSS", "Supabase", "Laravel", "Python", "SEO", "Analytics",
  "PHP", "MySQL", "PostgreSQL", "CodeIgniter",
  "React", "Node.js", "WordPress", "Flutter", "React Native", "Next.js" // Duplicated for seamless loop
];