
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
    description: 'A comprehensive research university in Beijing, ranked among the top in Asia and the world for Engineering and Computer Science.',
    logoUrl: '',
    rankGlobal: 17, 
    rankSubject: 15, 
    tuition: 39000, 
    cpiIndex: 38, 
    englishPrograms: 8, 
    intlStudentPercent: 4, 
    website: '#',
    references: {
      'C1': 'https://www.topuniversities.com/',
      'C2': 'https://www.humanresourcesonline.net/',
      'C3': 'https://ac.cs.tsinghua.edu.cn/',
      'C4': 'https://www.numbeo.com/',
      'C5': 'https://www.mastersportal.com/',
      'C6': 'https://www.tsinghua.edu.cn/'
    }
  },
  {
    id: 'A2',
    name: 'Universitas A2',
    city: 'Beijing',
    description: 'A major research university in Beijing known for its science programs and beautiful campus grounds.',
    logoUrl: '',
    rankGlobal: 14, 
    rankSubject: 11, 
    tuition: 50000, 
    cpiIndex: 38, 
    englishPrograms: 6, 
    intlStudentPercent: 15, 
    website: '#',
    references: {
      'C1': 'https://www.topuniversities.com/',
      'C2': 'https://www.numbeo.com/',
      'C3': 'https://cs.pku.edu.cn/',
      'C4': 'https://www.numbeo.com/',
      'C5': 'https://cs.pku.edu.cn/',
      'C6': 'https://www.topuniversities.com/'
    }
  },
  {
    id: 'A3',
    name: 'Universitas A3',
    city: 'Shanghai',
    description: 'This university in Shanghai is renowned for its liberal arts and international atmosphere.',
    logoUrl: '',
    rankGlobal: 30, 
    rankSubject: 58, 
    tuition: 28000, 
    cpiIndex: 75, 
    englishPrograms: 10, 
    intlStudentPercent: 9, 
    website: '#',
    references: {
      'C1': 'https://www.topuniversities.com/',
      'C2': 'https://www.timeshighereducation.com/',
      'C3': 'https://www.applyforchina.com/',
      'C4': 'https://www.numbeo.com/',
      'C5': 'https://www.fudan.edu.cn/en/'
    }
  },
  {
    id: 'A4',
    name: 'Universitas A4',
    city: 'Hangzhou',
    description: 'Located in the scenic city of Hangzhou, known for innovation and entrepreneurship.',
    logoUrl: '',
    rankGlobal: 49, 
    rankSubject: 32, 
    tuition: 22800, 
    cpiIndex: 34.19, 
    englishPrograms: 10, 
    intlStudentPercent: 5, 
    website: '#',
    references: {
      'C1': 'https://www.topuniversities.com/',
      'C2': 'https://www.timeshighereducation.com/',
      'C3': 'https://www.elumv.com/',
      'C4': 'https://www.numbeo.com/'
    }
  },
  {
    id: 'A5',
    name: 'Universitas A5',
    city: 'Shanghai',
    description: 'Famous for its engineering focus and rich history, located in the dynamic city of Shanghai.',
    logoUrl: '',
    rankGlobal: 47, 
    rankSubject: 33, 
    tuition: 28900, 
    cpiIndex: 75, 
    englishPrograms: 10, 
    intlStudentPercent: 11, 
    website: '#',
    references: {
      'C1': 'https://www.topuniversities.com/',
      'C2': 'https://www.timeshighereducation.com/',
      'C3': 'https://ji.sjtu.edu.cn/',
      'C6': 'https://www.timeshighereducation.com/'
    }
  },
  {
    id: 'A6',
    name: 'Universitas A6',
    city: 'Hefei',
    description: 'A national research university in Hefei, focused heavily on science and technology.',
    logoUrl: '',
    rankGlobal: 51, 
    rankSubject: 52, 
    tuition: 30000, 
    cpiIndex: 40, 
    englishPrograms: 10, 
    intlStudentPercent: 5, 
    website: '#',
    references: {
      'C1': 'https://www.timeshighereducation.com/',
      'C2': 'https://www.timeshighereducation.com/',
      'C3': 'https://en.ustc.edu.cn/',
      'C6': 'https://www.timeshighereducation.com/'
    }
  },
  {
    id: 'A7',
    name: 'Universitas A7',
    city: 'Nanjing',
    description: 'One of the oldest and most prestigious universities in China, located in the ancient capital.',
    logoUrl: '',
    rankGlobal: 103, 
    rankSubject: 66, 
    tuition: 28000, 
    cpiIndex: 50, 
    englishPrograms: 5, 
    intlStudentPercent: 10, 
    website: '#',
    references: {
      'C1': 'https://www.topuniversities.com/',
      'C2': 'https://www.timeshighereducation.com/',
      'C3': 'https://hwxy.nju.edu.cn/',
      'C6': 'https://www.timeshighereducation.com/'
    }
  },
  {
    id: 'A8',
    name: 'Universitas A8',
    city: 'Guangzhou',
    description: 'A preeminent research, academic and cultural center and the premier location for talent development in South China.',
    logoUrl: '',
    rankGlobal: 318, 
    rankSubject: 225, 
    tuition: 27000, 
    cpiIndex: 42, 
    englishPrograms: 5, 
    intlStudentPercent: 5, 
    website: '#',
    references: {
      'C1': 'https://www.topuniversities.com/',
      'C2': 'https://www.timeshighereducation.com/',
      'C3': 'https://iso.sysu.edu.cn/en/node/1473',
      'C4': 'https://www.numbeo.com/'
    }
  },
  {
    id: 'A9',
    name: 'Universitas A9',
    city: 'Wuhan',
    description: 'Known for having one of the most beautiful campuses in China, especially during cherry blossom season.',
    logoUrl: '',
    rankGlobal: 194, 
    rankSubject: 138, 
    tuition: 26500, 
    cpiIndex: 41, 
    englishPrograms: 5, 
    intlStudentPercent: 6, 
    website: '#',
    references: {
      'C1': 'https://www.topuniversities.com/',
      'C2': 'https://www.timeshighereducation.com/',
      'C3': 'http://admission.whu.edu.cn/',
      'C6': 'https://www.timeshighereducation.com/'
    }
  },
  {
    id: 'A10',
    name: 'Universitas A10',
    city: 'Wuhan',
    description: 'A leading research university known for STEM and high quality education standards.',
    logoUrl: '',
    rankGlobal: 308, 
    rankSubject: 76, 
    tuition: 28500, 
    cpiIndex: 41, 
    englishPrograms: 5, 
    intlStudentPercent: 5, 
    website: '#',
    references: {
      'C1': 'https://www.topuniversities.com/',
      'C2': 'https://www.timeshighereducation.com/',
      'C3': 'https://iso.hust.edu.cn/',
      'C6': 'https://www.timeshighereducation.com/'
    }
  },
];

// Random Index for Consistency Check (n=1 to 10)
export const RANDOM_INDEX = [0, 0, 0.58, 0.9, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49];
