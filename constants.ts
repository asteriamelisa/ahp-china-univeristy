
import { Criterion, University } from './types';

export const CRITERIA: Criterion[] = [
  { 
    id: 'C1', 
    name: 'Global Rank', 
    type: 'benefit', 
    description: 'QS/THE World University Ranking.',
    defaultWeight: 0.25 
  },
  { 
    id: 'C2', 
    name: 'Subject Rank', 
    type: 'benefit', 
    description: 'Ranking for Computer Science / IT.',
    defaultWeight: 0.20 
  },
  { 
    id: 'C3', 
    name: 'Tuition Fee', 
    type: 'cost', 
    description: 'Annual tuition fee in RMB.',
    defaultWeight: 0.15 
  },
  { 
    id: 'C4', 
    name: 'Living Cost (CPI)', 
    type: 'cost', 
    description: 'City Price Index. Lower is cheaper.',
    defaultWeight: 0.15 
  },
  { 
    id: 'C5', 
    name: 'English Programs', 
    type: 'benefit', 
    description: 'Number of relevant English-taught Master programs.',
    defaultWeight: 0.10 
  },
  { 
    id: 'C6', 
    name: 'Intl. Students %', 
    type: 'benefit', 
    description: 'Percentage of international students.',
    defaultWeight: 0.15 
  },
];

export const UNIVERSITIES: University[] = [
  {
    id: 'A1',
    name: 'Universitas A1',
    city: 'Beijing',
    description: 'A leading institution for engineering and computer science, located in the Haidian District of Beijing.',
    logoUrl: '',
    rankGlobal: 14, 
    rankSubject: 5, 
    tuition: 33000, 
    cpiIndex: 85, 
    englishPrograms: 8, 
    intlStudentPercent: 12, 
    website: '#',
    references: {}
  },
  {
    id: 'A2',
    name: 'Universitas A2',
    city: 'Beijing',
    description: 'A major research university known for its humanities and science programs, with a picturesque campus.',
    logoUrl: '',
    rankGlobal: 12, 
    rankSubject: 18, 
    tuition: 29000, 
    cpiIndex: 85, 
    englishPrograms: 6, 
    intlStudentPercent: 16, 
    website: '#',
    references: {}
  },
  {
    id: 'A3',
    name: 'Universitas A3',
    city: 'Shanghai',
    description: 'This university in Shanghai is renowned for its liberal arts and international atmosphere.',
    logoUrl: '',
    rankGlobal: 34, 
    rankSubject: 45, 
    tuition: 35000, 
    cpiIndex: 80, 
    englishPrograms: 15, 
    intlStudentPercent: 20, 
    website: '#',
    references: {}
  },
  {
    id: 'A4',
    name: 'Universitas A4',
    city: 'Hangzhou',
    description: 'Located in the scenic city of Hangzhou, known for innovation and entrepreneurship.',
    logoUrl: '',
    rankGlobal: 42, 
    rankSubject: 25, 
    tuition: 28000, 
    cpiIndex: 60, 
    englishPrograms: 4, 
    intlStudentPercent: 15, 
    website: '#',
    references: {}
  },
  {
    id: 'A5',
    name: 'Universitas A5',
    city: 'Shanghai',
    description: 'Famous for its engineering focus and rich history, located in the dynamic city of Shanghai.',
    logoUrl: '',
    rankGlobal: 46, 
    rankSubject: 28, 
    tuition: 32000, 
    cpiIndex: 80, 
    englishPrograms: 5, 
    intlStudentPercent: 11, 
    website: '#',
    references: {}
  },
  {
    id: 'A6',
    name: 'Universitas A6',
    city: 'Hefei',
    description: 'A national research university in Hefei, focused heavily on science and technology.',
    logoUrl: '',
    rankGlobal: 94, 
    rankSubject: 55, 
    tuition: 20000, 
    cpiIndex: 40, 
    englishPrograms: 2, 
    intlStudentPercent: 5, 
    website: '#',
    references: {}
  },
  {
    id: 'A7',
    name: 'Universitas A7',
    city: 'Nanjing',
    description: 'One of the oldest and most prestigious universities in China, located in the ancient capital.',
    logoUrl: '',
    rankGlobal: 130, 
    rankSubject: 80, 
    tuition: 24000, 
    cpiIndex: 50, 
    englishPrograms: 3, 
    intlStudentPercent: 8, 
    website: '#',
    references: {}
  },
  {
    id: 'A8',
    name: 'Universitas A8',
    city: 'Guangzhou',
    description: 'A preeminent research, academic and cultural center and the premier location for talent development in South China.',
    logoUrl: '',
    rankGlobal: 150, 
    rankSubject: 95, 
    tuition: 30000, 
    cpiIndex: 75, 
    englishPrograms: 4, 
    intlStudentPercent: 9, 
    website: '#',
    references: {}
  },
  {
    id: 'A9',
    name: 'Universitas A9',
    city: 'Wuhan',
    description: 'Known for having one of the most beautiful campuses in China, especially during cherry blossom season.',
    logoUrl: '',
    rankGlobal: 190, 
    rankSubject: 90, 
    tuition: 26000, 
    cpiIndex: 48, 
    englishPrograms: 4, 
    intlStudentPercent: 9, 
    website: '#',
    references: {}
  },
  {
    id: 'A10',
    name: 'Universitas A10',
    city: 'Wuhan',
    description: 'A leading research university known for STEM and high quality education standards.',
    logoUrl: '',
    rankGlobal: 170, 
    rankSubject: 70, 
    tuition: 28000, 
    cpiIndex: 48, 
    englishPrograms: 3, 
    intlStudentPercent: 7, 
    website: '#',
    references: {}
  },
];

// Random Index for Consistency Check (n=1 to 10)
export const RANDOM_INDEX = [0, 0, 0.58, 0.9, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49];
