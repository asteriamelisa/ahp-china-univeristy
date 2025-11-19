
import React, { useState, useEffect, useMemo } from 'react';
import { UserRole, University, Criterion, AhpResult, UniversityScore } from './types';
import { CRITERIA, UNIVERSITIES } from './constants';
import { calculateAhp, getCriterionScore } from './services/ahpService';

// --- Icons ---
const Icons = {
  University: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
  Chart: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>,
  List: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  Matrix: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>,
  User: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  LogOut: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Check: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Image: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  ArrowLeft: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Sliders: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>,
  Edit: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Save: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
  Trash: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
};

// --- Types & Enums ---
enum View {
  LANDING,
  LOGIN,
  DASHBOARD,
  UNIVERSITY_LIST,
  UNIVERSITY_DETAIL,
  CRITERIA_LIST,
  STUDENT_PREFERENCES, // New simple rating view
  PAIRWISE_COMPARISON, // Admin only AHP
  MANAGE_UNIVERSITIES, // Admin manage data
  RESULTS,
  ADMIN_DASHBOARD
}

// --- Components ---

const Button = ({ onClick, children, variant = 'primary', className = '', disabled = false }: any) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-primary text-white hover:bg-blue-700 shadow-md hover:shadow-lg",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    outline: "border-2 border-primary text-primary hover:bg-blue-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    success: "bg-green-600 text-white hover:bg-green-700 shadow-md"
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`}>
      {children}
    </button>
  );
};

const Card = ({ children, className = '', onClick }: any) => (
  <div onClick={onClick} className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow ${className}`}>
    {children}
  </div>
);

// --- Main Application ---

const App = () => {
  const [view, setView] = useState<View>(View.LANDING);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.GUEST);
  
  // Data State
  const [universities, setUniversities] = useState<University[]>(UNIVERSITIES);
  const [criteria, setCriteria] = useState<Criterion[]>(CRITERIA);
  const [selectedUniId, setSelectedUniId] = useState<string | null>(null);
  
  // AHP State (For Admin)
  const [ahpMatrix, setAhpMatrix] = useState<number[][]>([]);
  const [ahpResult, setAhpResult] = useState<AhpResult | null>(null);

  // Simple Student Preferences State
  const [studentRatings, setStudentRatings] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    CRITERIA.forEach(c => initial[c.id] = 3); // Default Moderate
    return initial;
  });

  // Final Active Weights (from either AHP or Simple Ratings)
  const [activeWeights, setActiveWeights] = useState<Record<string, number> | null>(null);
  
  // Initialize Matrix
  useEffect(() => {
    const n = criteria.length;
    const initialMatrix = Array(n).fill(0).map(() => Array(n).fill(1));
    setAhpMatrix(initialMatrix);
  }, [criteria]);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    if (role === UserRole.ADMIN) {
      setView(View.ADMIN_DASHBOARD);
    } else {
      setView(View.DASHBOARD);
    }
  };

  const handleLogout = () => {
    setUserRole(UserRole.GUEST);
    setView(View.LANDING);
    setActiveWeights(null);
  };

  // --- AHP Logic (Admin) ---
  const handleMatrixChange = (row: number, col: number, value: number) => {
    const newMatrix = ahpMatrix.map(r => [...r]);
    newMatrix[row][col] = value;
    newMatrix[col][row] = 1 / value;
    setAhpMatrix(newMatrix);
  };

  const calculateAhpWeights = () => {
    const result = calculateAhp(ahpMatrix, criteria.map(c => c.id));
    setAhpResult(result);
    setActiveWeights(result.weights); // Set active weights for results
    setView(View.RESULTS);
  };

  // --- Simple Preference Logic (Student) ---
  const handleRatingChange = (id: string, rating: number) => {
    setStudentRatings(prev => ({ ...prev, [id]: rating }));
  };

  const calculateSimpleWeights = () => {
    const totalScore = Object.values(studentRatings).reduce((a, b) => a + b, 0);
    const weights: Record<string, number> = {};
    
    Object.entries(studentRatings).forEach(([id, rating]) => {
      weights[id] = rating / totalScore;
    });

    setActiveWeights(weights);
    setView(View.RESULTS);
  };

  // --- Views ---

  const LandingPage = () => (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="p-6 flex justify-between items-center">
        <div className="text-2xl font-bold text-primary flex items-center gap-2">
          <Icons.University /> UniSelect China
        </div>
        <Button variant="primary" onClick={() => setView(View.LOGIN)}>Login</Button>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center p-8 max-w-4xl mx-auto relative z-10">
        <h1 className="text-5xl font-bold text-slate-800 mb-6">
          Master's Degree Selection Decision Support System
        </h1>
        <p className="text-xl text-secondary mb-10 max-w-2xl">
          Empowering students to choose the best university in China using intelligent decision analysis.
        </p>
        <div className="flex gap-4">
          <Button onClick={() => setView(View.LOGIN)}>Get Started</Button>
          <Button variant="secondary" onClick={() => {
            setUserRole(UserRole.GUEST);
            setView(View.UNIVERSITY_LIST);
          }}>Explore Universities</Button>
        </div>
        <div className="mt-20 opacity-20 absolute bottom-0 pointer-events-none -z-10">
           <svg width="800" height="400" viewBox="0 0 800 400">
             <path d="M0,300 Q400,400 800,300" stroke="#2E67F8" strokeWidth="2" fill="none"/>
             <path d="M0,320 Q400,420 800,320" stroke="#2E67F8" strokeWidth="2" fill="none" opacity="0.5"/>
           </svg>
        </div>
      </main>
    </div>
  );

  const LoginPage = () => (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center mb-8 text-slate-800">Welcome Back</h2>
        <div className="space-y-4">
          <button onClick={() => handleLogin(UserRole.STUDENT)} className="w-full p-4 border-2 border-gray-100 rounded-xl hover:border-primary hover:bg-blue-50 transition-all flex items-center gap-4 group">
            <div className="bg-blue-100 p-3 rounded-full group-hover:bg-blue-200 text-primary">
              <Icons.User />
            </div>
            <div className="text-left">
              <div className="font-semibold text-slate-800">Student / Decision Maker</div>
              <div className="text-sm text-slate-500">Customize preferences & find universities</div>
            </div>
          </button>
          <button onClick={() => handleLogin(UserRole.ADMIN)} className="w-full p-4 border-2 border-gray-100 rounded-xl hover:border-primary hover:bg-blue-50 transition-all flex items-center gap-4 group">
            <div className="bg-purple-100 p-3 rounded-full group-hover:bg-purple-200 text-purple-600">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            </div>
            <div className="text-left">
              <div className="font-semibold text-slate-800">Administrator</div>
              <div className="text-sm text-slate-500">Manage data & perform AHP analysis</div>
            </div>
          </button>
        </div>
        <div className="mt-6 text-center">
           <button onClick={() => setView(View.LANDING)} className="text-sm text-slate-400 hover:text-slate-600">Back to Home</button>
        </div>
      </Card>
    </div>
  );

  // --- Student View Components ---

  const StudentDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="col-span-1 md:col-span-2 bg-gradient-to-r from-primary to-blue-600 text-white border-none">
        <h2 className="text-3xl font-bold mb-2">Welcome, Student!</h2>
        <p className="opacity-90">Start your journey to finding the perfect Master's program.</p>
      </Card>
      
      <div className="space-y-4">
        <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setView(View.STUDENT_PREFERENCES)}>
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg text-primary"><Icons.Sliders /></div>
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">STEP 1</span>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Customize Preferences</h3>
          <p className="text-secondary text-sm">Set your targets (e.g. "Tuition below 40k") to get personalized recommendations.</p>
        </Card>
        
        <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setView(View.UNIVERSITY_LIST)}>
           <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg text-primary"><Icons.List /></div>
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">EXPLORE</span>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Browse Universities</h3>
          <p className="text-secondary text-sm">Explore top Chinese universities and view detailed statistics.</p>
        </Card>
      </div>

      <div className="space-y-4">
        <Card className={`cursor-pointer hover:border-primary transition-colors ${!activeWeights ? 'opacity-60' : ''}`} onClick={() => activeWeights && setView(View.RESULTS)}>
           <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg text-primary"><Icons.Chart /></div>
            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">STEP 2</span>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">View My Rankings</h3>
          <p className="text-secondary text-sm">See which university matches your preferences based on your ratings.</p>
          {!activeWeights && <div className="mt-2 text-xs text-orange-500 font-medium">Set preferences first</div>}
        </Card>
         <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setView(View.CRITERIA_LIST)}>
           <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg text-primary"><Icons.Check /></div>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Criteria Info</h3>
          <p className="text-secondary text-sm">Understand the factors: Global Rank, Tuition, CPI, etc.</p>
        </Card>
      </div>
    </div>
  );

  const StudentPreferences = () => {
    // Specific labels for each criterion to guide the student
    // Value 1 = Low Priority/Lenient. Value 5 = High Priority/Strict.
    const criterionOptions: Record<string, { val: number, label: string }[]> = {
      'C1': [ // Global Rank (Cost)
        { val: 1, label: "> 200" },
        { val: 2, label: "101 - 200" },
        { val: 3, label: "51 - 100" },
        { val: 4, label: "11 - 50" },
        { val: 5, label: "Top 10" }
      ],
      'C2': [ // Subject Rank (Cost)
        { val: 1, label: "> 200" },
        { val: 2, label: "101 - 200" },
        { val: 3, label: "51 - 100" },
        { val: 4, label: "21 - 50" },
        { val: 5, label: "Top 20" }
      ],
      'C3': [ // Tuition (Cost)
        { val: 1, label: "≥ 80k" },
        { val: 2, label: "60k - 79k" },
        { val: 3, label: "40k - 59k" },
        { val: 4, label: "25k - 39k" },
        { val: 5, label: "< 25k" }
      ],
      'C4': [ // CPI (Cost)
        { val: 1, label: "≥ 75" },
        { val: 2, label: "65 - 74" },
        { val: 3, label: "55 - 64" },
        { val: 4, label: "45 - 54" },
        { val: 5, label: "< 45" }
      ],
      'C5': [ // English Programs (Benefit)
        { val: 1, label: "1" },
        { val: 2, label: "2" },
        { val: 3, label: "3" },
        { val: 4, label: "4" },
        { val: 5, label: "5+" }
      ],
      'C6': [ // Intl Students (Benefit)
        { val: 1, label: "< 10%" },
        { val: 2, label: "10 - 14%" },
        { val: 3, label: "15 - 19%" },
        { val: 4, label: "20 - 24%" },
        { val: 5, label: "≥ 25%" }
      ]
    };

    // Calculate preview weights for visualization
    const total = Object.values(studentRatings).reduce((a, b) => a + b, 0);
    
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
           <h2 className="text-3xl font-bold text-slate-800 mb-2">Set Your Target Preferences</h2>
           <p className="text-secondary max-w-2xl mx-auto">
             Select the specific range you are looking for. 
             <br/>
             Selecting a <strong>stricter target</strong> (e.g., "Top 10", "Cheap Tuition") tells the system that this factor is <strong>Highly Important</strong>.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {criteria.map(c => {
              const options = criterionOptions[c.id] || [
                 { val: 1, label: "Not Important" }, { val: 5, label: "Very Important" }
              ];

              return (
                <div key={c.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-lg font-bold text-slate-800">{c.name}</h3>
                      <span className={`text-xs font-semibold px-2 py-1 rounded uppercase ${c.type === 'benefit' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {c.type}
                      </span>
                    </div>
                    <p className="text-sm text-secondary">{c.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400 font-medium mb-2 px-1">
                     <span>Low Priority / Lenient</span>
                     <span>High Priority / Strict</span>
                  </div>

                  <div className="grid grid-cols-5 gap-1">
                    {options.map((opt) => (
                      <button
                        key={opt.val}
                        onClick={() => handleRatingChange(c.id, opt.val)}
                        className={`py-3 px-1 rounded-lg text-xs md:text-sm font-medium transition-all h-full flex items-center justify-center text-center leading-tight break-words
                          ${studentRatings[c.id] === opt.val 
                            ? 'bg-primary text-white shadow-md ring-2 ring-offset-1 ring-primary' 
                            : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100'}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="md:col-span-1">
            <div className="sticky top-24 space-y-4">
              <Card className="bg-blue-50 border-blue-100">
                <h3 className="font-bold text-slate-800 mb-4">Your Priorities</h3>
                <div className="space-y-3">
                   {criteria.map(c => {
                     const weight = studentRatings[c.id] / total;
                     const currentVal = studentRatings[c.id];
                     const currentLabel = criterionOptions[c.id]?.find(o => o.val === currentVal)?.label;

                     return (
                       <div key={c.id}>
                         <div className="flex justify-between text-xs mb-1 text-slate-700">
                           <span>{c.name}</span>
                           <span className="font-bold text-blue-600">{currentLabel}</span>
                         </div>
                         <div className="h-2 bg-white rounded-full overflow-hidden border border-blue-100">
                           <div 
                             className="h-full bg-primary rounded-full transition-all duration-300" 
                             style={{ width: `${weight * 100}%` }} 
                           />
                         </div>
                       </div>
                     );
                   })}
                </div>
                <Button className="w-full mt-6" onClick={calculateSimpleWeights}>
                   <Icons.Chart /> Calculate Rankings
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const UniversityList = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Universities</h2>
        <div className="text-sm text-secondary">{universities.length} Institutions</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {universities.map(uni => (
          <Card key={uni.id} className="flex flex-col h-full hover:-translate-y-1 transition-transform p-6">
            <div className="flex items-start justify-between mb-4">
               <div className="flex items-center gap-4">
                 <div>
                    <h3 className="text-xl font-bold text-slate-800">{uni.name}</h3>
                    <p className="text-sm text-blue-600 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block"></span>
                      {uni.city}
                    </p>
                 </div>
               </div>
            </div>
            
            <div className="flex-1 mb-6">
              <p className="text-slate-600 leading-relaxed">{uni.description}</p>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">Global Rank #{uni.rankGlobal}</span>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">Tuition ¥{uni.tuition.toLocaleString()}</span>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">Eng. Programs: {uni.englishPrograms}</span>
            </div>

            <Button variant="outline" className="w-full justify-center mt-auto" onClick={() => { setSelectedUniId(uni.id); setView(View.UNIVERSITY_DETAIL); }}>
              View Details
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );

  const UniversityDetail = () => {
    const uni = universities.find(u => u.id === selectedUniId);
    if (!uni) return <div>Not found</div>;

    return (
      <div className="max-w-4xl mx-auto">
         <Button variant="secondary" className="mb-6" onClick={() => setView(View.UNIVERSITY_LIST)}>
           <Icons.ArrowLeft /> Back to List
         </Button>
         
         <Card className="p-8">
           <div className="flex items-start justify-between mb-6">
             <div>
               <h1 className="text-3xl font-bold text-slate-800 mb-2">{uni.name}</h1>
               <p className="text-xl text-blue-600 flex items-center gap-2">
                 <span className="inline-block w-2 h-2 rounded-full bg-blue-600"></span> {uni.city}, China
               </p>
             </div>
           </div>
           
           <p className="text-slate-600 leading-relaxed mb-8 text-lg">{uni.description}</p>
           
           <h3 className="font-bold text-lg mb-4 border-b pb-2">Key Metrics</h3>
           <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
             <div className="p-4 bg-slate-50 rounded-lg">
               <div className="text-xs text-secondary uppercase font-bold tracking-wider mb-1">Global Rank</div>
               <div className="text-2xl font-bold text-slate-800">#{uni.rankGlobal}</div>
             </div>
             <div className="p-4 bg-slate-50 rounded-lg">
               <div className="text-xs text-secondary uppercase font-bold tracking-wider mb-1">Subject Rank</div>
               <div className="text-2xl font-bold text-slate-800">#{uni.rankSubject}</div>
             </div>
             <div className="p-4 bg-slate-50 rounded-lg">
               <div className="text-xs text-secondary uppercase font-bold tracking-wider mb-1">Tuition (Year)</div>
               <div className="text-2xl font-bold text-slate-800">¥{uni.tuition.toLocaleString()}</div>
             </div>
             <div className="p-4 bg-slate-50 rounded-lg">
               <div className="text-xs text-secondary uppercase font-bold tracking-wider mb-1">CPI Index</div>
               <div className="text-2xl font-bold text-slate-800">{uni.cpiIndex}</div>
             </div>
             <div className="p-4 bg-slate-50 rounded-lg">
               <div className="text-xs text-secondary uppercase font-bold tracking-wider mb-1">English Programs</div>
               <div className="text-2xl font-bold text-slate-800">{uni.englishPrograms}</div>
             </div>
             <div className="p-4 bg-slate-50 rounded-lg">
               <div className="text-xs text-secondary uppercase font-bold tracking-wider mb-1">Intl. Students</div>
               <div className="text-2xl font-bold text-slate-800">{uni.intlStudentPercent}%</div>
             </div>
           </div>
         </Card>
      </div>
    );
  };

  // --- ADMIN ONLY VIEWS ---

  const AdminDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-start gap-6">
           <div className="bg-primary/10 p-4 rounded-full text-primary">
             <Icons.User />
           </div>
           <div>
             <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome, Administrator</h2>
             <p className="text-slate-600 leading-relaxed max-w-3xl">
               This <strong>Decision Support System (DSS)</strong> uses the <strong>Analytic Hierarchy Process (AHP)</strong> to help students select the best Master's Degree program in China. As an admin, your role is to maintain data accuracy and provide expert criteria weightings.
             </p>
           </div>
        </div>
      </div>

      {/* Step-by-Step Guide */}
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="bg-slate-800 text-white text-xs px-2 py-1 rounded">GUIDE</span> 
          System Workflow
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <Card className="relative overflow-hidden border-t-4 border-t-blue-500">
            <div className="absolute -right-4 -top-4 text-9xl text-slate-50 opacity-50 font-bold select-none">1</div>
            <div className="relative z-10">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mb-4">1</div>
              <h4 className="text-lg font-bold text-slate-800 mb-2">Manage Data</h4>
              <p className="text-sm text-slate-600 mb-4">
                Input raw data for universities (Tuition, Ranking, etc.). The system automatically normalizes this into a <strong>1-5 Score</strong>.
              </p>
              <Button variant="secondary" className="w-full text-xs" onClick={() => setView(View.MANAGE_UNIVERSITIES)}>
                Go to Data Mgmt
              </Button>
            </div>
          </Card>

          {/* Step 2 */}
          <Card className="relative overflow-hidden border-t-4 border-t-purple-500">
             <div className="absolute -right-4 -top-4 text-9xl text-slate-50 opacity-50 font-bold select-none">2</div>
             <div className="relative z-10">
              <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold mb-4">2</div>
              <h4 className="text-lg font-bold text-slate-800 mb-2">AHP Weighting</h4>
              <p className="text-sm text-slate-600 mb-4">
                Use the <strong>Pairwise Comparison Matrix</strong> to compare criteria importance (e.g., Cost vs Quality). The system calculates mathematical weights using the Saaty Scale.
              </p>
              <Button variant="secondary" className="w-full text-xs" onClick={() => setView(View.PAIRWISE_COMPARISON)}>
                Go to AHP Matrix
              </Button>
             </div>
          </Card>

          {/* Step 3 */}
          <Card className="relative overflow-hidden border-t-4 border-t-green-500">
             <div className="absolute -right-4 -top-4 text-9xl text-slate-50 opacity-50 font-bold select-none">3</div>
             <div className="relative z-10">
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold mb-4">3</div>
              <h4 className="text-lg font-bold text-slate-800 mb-2">Generate Results</h4>
              <p className="text-sm text-slate-600 mb-4">
                The system combines the <strong>Score Levels</strong> (from Step 1) with the <strong>Weights</strong> (from Step 2) to produce a final ranking of universities.
              </p>
              <div className="text-xs bg-slate-100 p-2 rounded text-center text-slate-500">
                Viewed in "Results" page
              </div>
             </div>
          </Card>
        </div>
      </div>

      {/* Detailed Concepts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-800 mb-3">What is AHP?</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              The <strong>Analytic Hierarchy Process</strong> is a method to derive ratio scales from paired comparisons. It allows you to say "Criterion A is extremely more important than Criterion B". 
              <br/><br/>
              The system checks your <strong>Consistency Ratio (CR)</strong>. If CR &lt; 0.1, your judgments are consistent. If not, you should adjust the matrix.
            </p>
         </div>
         <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-800 mb-3">Scoring Logic (1-5)</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              To ensure fair comparison, all raw data (e.g., "30,000 RMB") is converted to a standard 1-5 scale:
              <ul className="list-disc ml-4 mt-2 space-y-1">
                <li><strong>5 (Excellent):</strong> Very cheap tuition, Top 10 rank, etc.</li>
                <li><strong>1 (Poor):</strong> Expensive tuition, Low rank, etc.</li>
              </ul>
            </p>
         </div>
      </div>
    </div>
  );

  const ManageUniversities = () => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<University | null>(null);

    const handleEditClick = (uni: University) => {
      setEditingId(uni.id);
      setEditForm({ ...uni });
    };

    const handleSave = () => {
      if (editForm) {
        const updatedList = universities.map(u => u.id === editForm.id ? editForm : u);
        setUniversities(updatedList);
        setEditingId(null);
        setEditForm(null);
      }
    };

    const handleChange = (field: keyof University, value: any) => {
      if (editForm) {
        setEditForm({ ...editForm, [field]: value });
      }
    };

    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
           <h2 className="text-2xl font-bold text-slate-800">Manage Universities & Data Levels</h2>
           <Button variant="secondary" onClick={() => setView(View.ADMIN_DASHBOARD)}><Icons.ArrowLeft /> Back to Dashboard</Button>
        </div>

        <div className="space-y-4">
          {universities.map(uni => {
            const isEditing = editingId === uni.id;
            
            return (
              <Card key={uni.id} className={`transition-all ${isEditing ? 'ring-2 ring-primary' : ''}`}>
                {!isEditing ? (
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-lg text-slate-800">{uni.name}</h3>
                      <p className="text-sm text-secondary">{uni.city} • Rank #{uni.rankGlobal} • ¥{uni.tuition.toLocaleString()}</p>
                    </div>
                    <div className="flex gap-3">
                      {/* Displaying Calculated Levels Preview */}
                      <div className="hidden md:flex gap-2 mr-6">
                        {criteria.map(c => {
                          const rawVal = (() => {
                             if (c.id === 'C1') return uni.rankGlobal;
                             if (c.id === 'C2') return uni.rankSubject;
                             if (c.id === 'C3') return uni.tuition;
                             if (c.id === 'C4') return uni.cpiIndex;
                             if (c.id === 'C5') return uni.englishPrograms;
                             return uni.intlStudentPercent;
                          })();
                          const score = getCriterionScore(c.id, rawVal);
                          return (
                            <div key={c.id} className="flex flex-col items-center w-8">
                              <span className="text-[10px] text-slate-400 font-bold">{c.id}</span>
                              <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${score >= 4 ? 'bg-green-100 text-green-700' : score <= 2 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {score}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                      <Button variant="secondary" onClick={() => handleEditClick(uni)}>
                        <Icons.Edit /> Edit Data
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex justify-between border-b pb-4">
                      <h3 className="font-bold text-lg text-primary">Editing {uni.name}</h3>
                      <div className="flex gap-2">
                        <Button variant="secondary" onClick={() => setEditingId(null)}>Cancel</Button>
                        <Button variant="success" onClick={handleSave}><Icons.Save /> Save Changes</Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase mb-1">University Name</label>
                         <input className="w-full p-2 border rounded" value={editForm?.name} onChange={(e) => handleChange('name', e.target.value)} />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase mb-1">City</label>
                         <input className="w-full p-2 border rounded" value={editForm?.city} onChange={(e) => handleChange('city', e.target.value)} />
                      </div>
                      <div className="md:col-span-2">
                         <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                         <textarea className="w-full p-2 border rounded" rows={2} value={editForm?.description} onChange={(e) => handleChange('description', e.target.value)} />
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <Icons.Chart /> Criterion Data & Calculated Levels (1-5)
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                          { id: 'C1', label: 'Global Rank', field: 'rankGlobal' },
                          { id: 'C2', label: 'Subject Rank', field: 'rankSubject' },
                          { id: 'C3', label: 'Tuition (RMB)', field: 'tuition' },
                          { id: 'C4', label: 'CPI Index', field: 'cpiIndex' },
                          { id: 'C5', label: 'English Programs', field: 'englishPrograms' },
                          { id: 'C6', label: 'Intl. Students %', field: 'intlStudentPercent' },
                        ].map((item) => {
                          // @ts-ignore
                          const val = editForm?.[item.field];
                          const score = getCriterionScore(item.id, Number(val));
                          return (
                            <div key={item.id} className="relative">
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{item.label}</label>
                              <div className="flex items-center gap-2">
                                <input 
                                  type="number" 
                                  className="w-full p-2 border rounded" 
                                  value={val} 
                                  onChange={(e) => handleChange(item.field as keyof University, Number(e.target.value))} 
                                />
                                <div className={`flex flex-col items-center justify-center w-12 h-10 rounded border ${score >= 4 ? 'bg-green-100 border-green-200 text-green-700' : score <= 2 ? 'bg-red-100 border-red-200 text-red-700' : 'bg-yellow-100 border-yellow-200 text-yellow-700'}`}>
                                   <span className="text-[10px] leading-none uppercase font-bold opacity-60">Lvl</span>
                                   <span className="font-bold text-lg leading-none">{score}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <p className="text-xs text-slate-400 mt-4 text-right">
                        *The "Level" (1-5) is automatically calculated from the raw value based on predefined ranges.
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  const PairwiseComparison = () => {
    return (
      <div className="max-w-6xl mx-auto">
         <div className="flex items-center justify-between mb-6">
           <div>
             <h2 className="text-2xl font-bold text-slate-800">Pairwise Comparison Matrix</h2>
             <p className="text-sm text-secondary">Evaluate the relative importance of criteria using the strict Saaty Scale (1-9).</p>
           </div>
           <Button variant="secondary" onClick={() => setView(View.ADMIN_DASHBOARD)}><Icons.ArrowLeft /> Back to Dashboard</Button>
         </div>
         
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
           {/* Main Matrix Section */}
           <div className="lg:col-span-8 space-y-6">
             <Card className="overflow-hidden border-0 shadow-md p-0">
                <div className="bg-slate-800 p-4 text-white flex justify-between items-center">
                   <h3 className="font-bold">Comparison Input</h3>
                   <Button variant="outline" className="text-xs border-white text-white hover:bg-slate-700" onClick={() => {
                     const n = criteria.length;
                     setAhpMatrix(Array(n).fill(0).map(() => Array(n).fill(1)));
                     setAhpResult(null);
                   }}>Reset All to 1</Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-xs border-b border-slate-200">
                      <tr>
                        <th className="p-4 min-w-[120px]">Criteria</th>
                        {criteria.map(c => (
                          <th key={c.id} className="p-4 text-center min-w-[100px] border-l border-slate-200" title={c.name}>
                            {c.id}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {criteria.map((rowC, i) => (
                        <tr key={rowC.id} className="hover:bg-blue-50 transition-colors odd:bg-white even:bg-slate-50/50">
                          <td className="p-4 font-bold text-slate-700 border-r border-slate-200">
                            <span className="text-primary mr-2">{rowC.id}</span>
                            {rowC.name}
                          </td>
                          {criteria.map((colC, j) => (
                            <td key={`${rowC.id}-${colC.id}`} className="p-2 border-l border-slate-200 text-center relative">
                              {i === j ? (
                                <div className="flex items-center justify-center">
                                   <div className="w-12 py-1 bg-slate-200 text-slate-400 font-bold rounded text-xs text-center">1</div>
                                </div>
                              ) : i < j ? (
                                <select 
                                  className="w-full p-2 bg-white border border-blue-200 rounded text-xs focus:ring-2 focus:ring-primary focus:border-primary outline-none font-medium shadow-sm"
                                  value={ahpMatrix[i][j]}
                                  onChange={(e) => handleMatrixChange(i, j, Number(e.target.value))}
                                >
                                  <optgroup label="Row is More Important">
                                    <option value="9">9 - Extreme</option>
                                    <option value="8">8 - Intermediate</option>
                                    <option value="7">7 - Very Strong</option>
                                    <option value="6">6 - Intermediate</option>
                                    <option value="5">5 - Strong</option>
                                    <option value="4">4 - Intermediate</option>
                                    <option value="3">3 - Moderate</option>
                                    <option value="2">2 - Intermediate</option>
                                  </optgroup>
                                  <option value="1" className="font-bold">1 - Equal Importance</option>
                                  <optgroup label="Column is More Important">
                                    <option value="0.5">1/2 - Intermediate</option>
                                    <option value="0.3333">1/3 - Moderate</option>
                                    <option value="0.25">1/4 - Intermediate</option>
                                    <option value="0.2">1/5 - Strong</option>
                                    <option value="0.1667">1/6 - Intermediate</option>
                                    <option value="0.1429">1/7 - Very Strong</option>
                                    <option value="0.125">1/8 - Intermediate</option>
                                    <option value="0.1111">1/9 - Extreme</option>
                                  </optgroup>
                                </select>
                              ) : (
                                <div className="flex items-center justify-center">
                                   <div className="w-full py-1 bg-slate-100 text-slate-500 rounded text-xs text-center">
                                      {ahpMatrix[i][j] < 1 ? `1/${Math.round(1/ahpMatrix[i][j])}` : ahpMatrix[i][j].toFixed(2)}
                                   </div>
                                </div>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             </Card>
           </div>
           
           {/* Sidebar: Legend & Actions */}
           <div className="lg:col-span-4 space-y-6">
             <div className="sticky top-24">
               <Card className="bg-gradient-to-br from-white to-slate-50 border-slate-200 mb-4">
                 <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                   <Icons.Matrix /> Saaty Scale Legend
                 </h3>
                 <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 bg-white rounded border border-slate-100 shadow-sm">
                      <span className="font-bold text-slate-700">1</span>
                      <span className="text-slate-500">Equal Importance</span>
                    </div>
                    <div className="flex justify-between p-2 bg-white rounded border border-slate-100 shadow-sm">
                      <span className="font-bold text-slate-700">3</span>
                      <span className="text-slate-500">Moderate Importance</span>
                    </div>
                    <div className="flex justify-between p-2 bg-white rounded border border-slate-100 shadow-sm">
                      <span className="font-bold text-slate-700">5</span>
                      <span className="text-slate-500">Strong Importance</span>
                    </div>
                    <div className="flex justify-between p-2 bg-white rounded border border-slate-100 shadow-sm">
                      <span className="font-bold text-slate-700">7</span>
                      <span className="text-slate-500">Very Strong Importance</span>
                    </div>
                    <div className="flex justify-between p-2 bg-white rounded border border-slate-100 shadow-sm">
                      <span className="font-bold text-slate-700">9</span>
                      <span className="text-slate-500">Extreme Importance</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 italic px-1">
                      * Values 2, 4, 6, 8 represent intermediate judgments.
                    </p>
                 </div>
               </Card>

               <Card className="bg-white border-slate-200">
                 <Button className="w-full mb-4 py-3 shadow-lg" onClick={calculateAhpWeights}>
                   <Icons.Chart /> Calculate Weights
                 </Button>

                 {ahpResult && (
                   <div className="animate-fade-in">
                     <div className={`p-4 rounded-lg mb-4 border ${ahpResult.isConsistent ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                       <div className="flex justify-between items-center mb-1">
                         <span className="text-xs font-bold uppercase opacity-70">Consistency Ratio (CR)</span>
                         <span className={`text-lg font-bold ${ahpResult.isConsistent ? 'text-green-700' : 'text-red-700'}`}>
                           {ahpResult.consistencyRatio.toFixed(4)}
                         </span>
                       </div>
                       <p className="text-xs">
                         {ahpResult.isConsistent 
                           ? <span className="text-green-700 flex items-center gap-1"><Icons.Check /> Consistent Matrix</span>
                           : <span className="text-red-700 flex items-center gap-1">⚠️ Inconsistent (>0.1)</span>}
                       </p>
                     </div>
                     
                     <h3 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wide">Derived Weights</h3>
                     <div className="space-y-3">
                       {criteria.map(c => (
                         <div key={c.id}>
                           <div className="flex justify-between text-xs mb-1">
                             <span className="font-medium text-slate-600">{c.name}</span>
                             <span className="font-bold text-primary">{(ahpResult.weights[c.id] * 100).toFixed(1)}%</span>
                           </div>
                           <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                             <div 
                               className="h-full bg-primary rounded-full transition-all duration-500" 
                               style={{ width: `${ahpResult.weights[c.id] * 100}%` }} 
                             />
                           </div>
                         </div>
                       ))}
                     </div>
                     <Button className="w-full mt-6" variant="secondary" onClick={() => setView(View.RESULTS)}>
                        Apply & View Results
                     </Button>
                   </div>
                 )}
               </Card>
             </div>
           </div>
         </div>
      </div>
    );
  };

  const ResultsPage = () => {
    if (!activeWeights) return <div className="text-center p-10">Please define your preferences or run an analysis first.</div>;

    // Calculate final scores based on 1-5 scale logic using ACTIVE WEIGHTS
    const scores: UniversityScore[] = universities.map(uni => {
      let totalScore = 0;
      const breakdown: Record<string, number> = {};
      
      criteria.forEach(c => {
         const rawVal = (() => {
            switch(c.id) {
             case 'C1': return uni.rankGlobal;
             case 'C2': return uni.rankSubject;
             case 'C3': return uni.tuition;
             case 'C4': return uni.cpiIndex;
             case 'C5': return uni.englishPrograms;
             case 'C6': return uni.intlStudentPercent;
             default: return 0;
           }
         })();

         // Get score from 1-5 based on ranges
         const scoreVal = getCriterionScore(c.id, rawVal);
         
         // Weighted Score using activeWeights
         const weightedScore = scoreVal * (activeWeights[c.id] || 0);
         
         breakdown[c.id] = weightedScore;
         totalScore += weightedScore;
      });

      return { universityId: uni.id, totalScore, breakdown };
    });

    const sortedScores = [...scores].sort((a, b) => b.totalScore - a.totalScore);

    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800">Top Recommended Universities</h2>
          <p className="text-secondary">Ranked based on your specific priorities and our 5-point scoring model.</p>
          {userRole === UserRole.ADMIN && (
             <span className="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">Admin AHP Weights Active</span>
          )}
        </div>
        
        <div className="flex justify-center gap-4 mb-6">
           <Button variant="secondary" onClick={() => {
              // If admin, go to Matrix. If student, go to Preferences.
              if (userRole === UserRole.ADMIN) setView(View.PAIRWISE_COMPARISON);
              else setView(View.STUDENT_PREFERENCES);
           }}>
             <Icons.Sliders /> Adjust Priorities
           </Button>
           {userRole === UserRole.ADMIN && (
              <Button variant="outline" onClick={() => setView(View.ADMIN_DASHBOARD)}>Back to Dashboard</Button>
           )}
        </div>

        <div className="space-y-6">
          {sortedScores.map((score, idx) => {
            const uni = universities.find(u => u.id === score.universityId)!;
            return (
              <Card key={uni.id} className={`flex flex-col gap-4 p-6 ${idx === 0 ? 'border-2 border-primary bg-blue-50/30' : ''}`}>
                <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full font-bold text-lg ${idx === 0 ? 'bg-yellow-400 text-white shadow-md' : 'bg-slate-200 text-slate-600'}`}>
                      {idx + 1}
                    </div>
                    {/* Image removed */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">{uni.name}</h3>
                            <p className="text-sm text-secondary mb-1">{uni.city}</p>
                        </div>
                        <div className="text-right">
                            <span className="block text-2xl font-bold text-primary">{score.totalScore.toFixed(2)}</span>
                            <span className="text-xs text-secondary uppercase font-bold">Score</span>
                        </div>
                      </div>
                    </div>
                </div>

                <div className="pl-16">
                    <p className="text-slate-600 text-sm mb-4">{uni.description}</p>
                    
                    <div className="bg-white/50 rounded-lg p-3 border border-gray-100">
                       <div className="flex justify-between text-xs mb-2 text-gray-500 uppercase font-bold tracking-wider">
                         <span>Score Breakdown</span>
                       </div>
                       <div className="flex h-3 rounded-full overflow-hidden bg-gray-200">
                         {criteria.map((c, i) => (
                           <div 
                             key={c.id} 
                             className={`h-full ${['bg-blue-500','bg-green-500','bg-purple-500','bg-orange-500','bg-red-500','bg-teal-500'][i]}`}
                             style={{ width: `${(score.breakdown[c.id] / score.totalScore) * 100}%` }}
                             title={`${c.name}: ${score.breakdown[c.id].toFixed(2)}`}
                           />
                         ))}
                       </div>
                       <div className="flex flex-wrap gap-2 mt-2">
                          {criteria.map((c, i) => (
                              <div key={c.id} className="flex items-center text-[10px] text-secondary">
                                 <div className={`w-2 h-2 rounded-full mr-1 ${['bg-blue-500','bg-green-500','bg-purple-500','bg-orange-500','bg-red-500','bg-teal-500'][i]}`}></div>
                                 {c.name}
                              </div>
                          ))}
                       </div>
                    </div>
                </div>
                
                <div className="pl-16 flex gap-3">
                     <Button variant="outline" className="text-sm py-1" onClick={() => { setSelectedUniId(uni.id); setView(View.UNIVERSITY_DETAIL); }}>View Details</Button>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-center pt-8">
          <Button variant="secondary" onClick={() => window.print()}>Export Report (Print/PDF)</Button>
        </div>
      </div>
    );
  };

  const CriteriaList = () => (
    <div className="max-w-4xl mx-auto">
       <h2 className="text-2xl font-bold text-slate-800 mb-6">Evaluation Criteria & Scoring Rules</h2>
       <div className="grid grid-cols-1 gap-4">
         {criteria.map(c => (
           <Card key={c.id}>
             <div className="flex justify-between items-start mb-2">
               <h3 className="text-lg font-bold">{c.name} ({c.id})</h3>
               <div className="flex gap-2">
                <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${c.type === 'benefit' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                  {c.type}
                </span>
               </div>
             </div>
             <p className="text-secondary text-sm mb-4">{c.description}</p>
             
             {/* Quick view of scoring logic per criterion */}
             <div className="text-xs bg-slate-50 p-3 rounded border border-slate-100">
               <strong>Scoring Rule (1-5 Scale):</strong>
               {c.id === 'C1' && " 1-10(5), 11-50(4), 51-100(3), 101-200(2), >200(1)"}
               {c.id === 'C2' && " 1-20(5), 21-50(4), 51-100(3), 101-200(2), >200(1)"}
               {c.id === 'C3' && " <25k(5), 25-40k(4), 40-60k(3), 60-80k(2), >80k(1)"}
               {c.id === 'C4' && " <45(5), 45-54(4), 55-64(3), 65-74(2), >75(1)"}
               {c.id === 'C5' && " >=5(5), 4(4), 3(3), 2(2), 1(1)"}
               {c.id === 'C6' && " >=25%(5), 20-24%(4), 15-19%(3), 10-14%(2), <10%(1)"}
             </div>
           </Card>
         ))}
       </div>
    </div>
  );

  // --- Layout Wrapper ---
  const Layout = ({ children }: any) => (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-surface border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-primary text-xl cursor-pointer" onClick={() => setView(View.LANDING)}>
            <Icons.University /> UniSelect
          </div>
          <nav className="flex items-center gap-6">
             {userRole === UserRole.STUDENT && (
               <>
                 <button onClick={() => setView(View.DASHBOARD)} className={`text-sm font-medium ${view === View.DASHBOARD ? 'text-primary' : 'text-slate-600'}`}>Dashboard</button>
                 <button onClick={() => setView(View.UNIVERSITY_LIST)} className={`text-sm font-medium ${view === View.UNIVERSITY_LIST ? 'text-primary' : 'text-slate-600'}`}>Universities</button>
                 <button onClick={() => setView(View.STUDENT_PREFERENCES)} className={`text-sm font-medium ${view === View.STUDENT_PREFERENCES ? 'text-primary' : 'text-slate-600'}`}>Preferences</button>
               </>
             )}
             {userRole === UserRole.ADMIN && (
                <>
                 <button onClick={() => setView(View.ADMIN_DASHBOARD)} className={`text-sm font-medium ${view === View.ADMIN_DASHBOARD ? 'text-primary' : 'text-slate-600'}`}>Admin Panel</button>
                 <button onClick={() => setView(View.PAIRWISE_COMPARISON)} className={`text-sm font-medium ${view === View.PAIRWISE_COMPARISON ? 'text-primary' : 'text-slate-600'}`}>AHP Matrix</button>
                 <button onClick={() => setView(View.MANAGE_UNIVERSITIES)} className={`text-sm font-medium ${view === View.MANAGE_UNIVERSITIES ? 'text-primary' : 'text-slate-600'}`}>Data</button>
                </>
             )}
             {userRole !== UserRole.GUEST && (
                <div className="flex items-center gap-3 ml-4 border-l pl-4 border-slate-200">
                  <div className="text-right hidden md:block">
                    <div className="text-xs font-bold text-slate-800">{userRole === UserRole.ADMIN ? 'Administrator' : 'Student User'}</div>
                  </div>
                  <button onClick={handleLogout} className="text-slate-500 hover:text-red-500"><Icons.LogOut /></button>
                </div>
             )}
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {children}
      </main>
    </div>
  );

  // --- Route Renderer ---
  if (view === View.LANDING) return <LandingPage />;
  if (view === View.LOGIN) return <Layout><LoginPage /></Layout>;

  return (
    <Layout>
      {view === View.DASHBOARD && userRole === UserRole.STUDENT && <StudentDashboard />}
      {view === View.UNIVERSITY_LIST && <UniversityList />}
      {view === View.UNIVERSITY_DETAIL && <UniversityDetail />}
      {view === View.CRITERIA_LIST && <CriteriaList />}
      {view === View.STUDENT_PREFERENCES && <StudentPreferences />}
      {view === View.PAIRWISE_COMPARISON && <PairwiseComparison />}
      {view === View.MANAGE_UNIVERSITIES && <ManageUniversities />}
      {view === View.RESULTS && <ResultsPage />}
      {view === View.ADMIN_DASHBOARD && <AdminDashboard />}
    </Layout>
  );
};

export default App;
