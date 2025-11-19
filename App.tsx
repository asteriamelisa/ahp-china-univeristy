import React, { useState, useEffect, useMemo } from 'react';
import { UserRole, University, Criterion, AhpResult, UniversityScore } from './types';
import { CRITERIA, UNIVERSITIES } from './constants';
import { calculateAhp, getCriterionScore } from './services/ahpService';

// --- Icons ---
const Icons = {
  University: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
  Chart: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>,
  List: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  Matrix: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>,
  User: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  LogOut: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Check: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="20 6 9 17 4 12"/></svg>,
  Image: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  ArrowLeft: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Sliders: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>,
  Edit: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Save: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
  Trash: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Alert: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  Refresh: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
  Link: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  ExternalLink: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
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
    // PREDEFINED MATRIX AS REQUESTED
    // C1: Global, C2: Subject, C3: Tuition, C4: Living, C5: English, C6: Intl
    const initialMatrix = [
      [1,      3,      5,      6,      6,      6],
      [0.3333, 1,      3,      4,      4,      4],
      [0.2,    0.3333, 1,      3,      3,      3],
      [0.1667, 0.25,   0.3333, 1,      1,      1],
      [0.1667, 0.25,   0.3333, 1,      1,      1],
      [0.1667, 0.25,   0.3333, 1,      1,      1]
    ];
    
    // Safety check for dimensions, otherwise default
    if (initialMatrix.length === criteria.length) {
       setAhpMatrix(initialMatrix);
    } else {
       const n = criteria.length;
       setAhpMatrix(Array(n).fill(0).map(() => Array(n).fill(1)));
    }
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
    setAhpResult(null); // Reset AHP result
  };

  // --- AHP Logic (Admin) ---
  const handleMatrixChange = (row: number, col: number, value: number) => {
    const newMatrix = ahpMatrix.map(r => [...r]);
    newMatrix[row][col] = value;
    newMatrix[col][row] = 1 / value;
    setAhpMatrix(newMatrix);
    setAhpResult(null); // Reset results on change to force recalculation
  };

  const calculateAhpWeights = () => {
    const result = calculateAhp(ahpMatrix, criteria.map(c => c.id));
    setAhpResult(result);
  };

  const applyAhpWeights = () => {
    if (ahpResult) {
      setActiveWeights(ahpResult.weights);
      setView(View.RESULTS);
    }
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
    const criterionOptions: Record<string, { val: number, label: string }[]> = {
      'C1': [
        { val: 1, label: "> 200" }, { val: 2, label: "101 - 200" }, { val: 3, label: "51 - 100" }, { val: 4, label: "11 - 50" }, { val: 5, label: "Top 10" }
      ],
      'C2': [
        { val: 1, label: "> 200" }, { val: 2, label: "101 - 200" }, { val: 3, label: "51 - 100" }, { val: 4, label: "21 - 50" }, { val: 5, label: "Top 20" }
      ],
      'C3': [
        { val: 1, label: "≥ 80k" }, { val: 2, label: "60k - 79k" }, { val: 3, label: "40k - 59k" }, { val: 4, label: "25k - 39k" }, { val: 5, label: "< 25k" }
      ],
      'C4': [
        { val: 1, label: "≥ 75" }, { val: 2, label: "65 - 74" }, { val: 3, label: "55 - 64" }, { val: 4, label: "45 - 54" }, { val: 5, label: "< 45" }
      ],
      'C5': [
        { val: 1, label: "1" }, { val: 2, label: "2" }, { val: 3, label: "3" }, { val: 4, label: "4" }, { val: 5, label: "5+" }
      ],
      'C6': [
        { val: 1, label: "< 10%" }, { val: 2, label: "10 - 14%" }, { val: 3, label: "15 - 19%" }, { val: 4, label: "20 - 24%" }, { val: 5, label: "≥ 25%" }
      ]
    };

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
              const options = criterionOptions[c.id] || [{ val: 1, label: "Not Important" }, { val: 5, label: "Very Important" }];

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
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Explore Universities</h2>
            <p className="text-slate-500 text-sm">Compare key metrics managed by our data team.</p>
        </div>
        <div className="text-sm font-medium bg-blue-50 text-blue-700 px-3 py-1 rounded-full">{universities.length} Institutions</div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {universities.map(uni => (
          <Card key={uni.id} className="flex flex-col h-full hover:shadow-lg transition-all duration-300 p-0 overflow-hidden border border-slate-200 group">
            {/* Header */}
            <div className="p-6 pb-4 bg-white relative">
                <div className="flex justify-between items-start mb-3">
                   <div>
                      <h3 className="text-xl font-bold text-slate-800 group-hover:text-primary transition-colors">{uni.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-500">{uni.id}</span>
                          <p className="text-sm text-slate-500 font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 inline-block"></span>
                            {uni.city}
                          </p>
                      </div>
                   </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-2">{uni.description}</p>
            </div>
            
            {/* Data Grid - Matches Admin Data Columns */}
            <div className="bg-slate-50 border-y border-slate-100 p-4 grid grid-cols-3 gap-y-4 gap-x-2 text-sm">
                <div className="text-center border-r border-slate-200 last:border-0">
                    <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-1">Global Rank</div>
                    <div className="font-bold text-slate-700">#{uni.rankGlobal}</div>
                </div>
                <div className="text-center border-r border-slate-200 last:border-0">
                    <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-1">Subj. Rank</div>
                    <div className="font-bold text-slate-700">#{uni.rankSubject}</div>
                </div>
                <div className="text-center">
                    <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-1">Tuition</div>
                    <div className="font-bold text-slate-700">¥{uni.tuition.toLocaleString()}</div>
                </div>
                <div className="text-center border-r border-slate-200 last:border-0">
                    <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-1">Living Cost</div>
                    <div className="font-bold text-slate-700">CPI {uni.cpiIndex}</div>
                </div>
                <div className="text-center border-r border-slate-200 last:border-0">
                    <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-1">Eng. Prog</div>
                    <div className="font-bold text-slate-700">{uni.englishPrograms}</div>
                </div>
                <div className="text-center">
                    <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-1">Intl. Students</div>
                    <div className="font-bold text-slate-700">{uni.intlStudentPercent}%</div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 mt-auto bg-white">
                <Button variant="outline" className="w-full justify-center group-hover:border-primary group-hover:text-primary transition-colors" onClick={() => { setSelectedUniId(uni.id); setView(View.UNIVERSITY_DETAIL); }}>
                  View Full Details <Icons.ArrowLeft className="rotate-180 w-4 h-4 ml-1" />
                </Button>
            </div>
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
             {[
                { label: 'Global Rank', value: `#${uni.rankGlobal}`, id: 'C1' },
                { label: 'Subject Rank', value: `#${uni.rankSubject}`, id: 'C2' },
                { label: 'Tuition (Year)', value: `¥${uni.tuition.toLocaleString()}`, id: 'C3' },
                { label: 'CPI Index', value: uni.cpiIndex, id: 'C4' },
                { label: 'English Programs', value: uni.englishPrograms, id: 'C5' },
                { label: 'Intl. Students', value: `${uni.intlStudentPercent}%`, id: 'C6' },
             ].map((item) => {
               const refLink = uni.references?.[item.id];
               return (
                 <div key={item.id} className="p-4 bg-slate-50 rounded-lg">
                   <div className="text-xs text-secondary uppercase font-bold tracking-wider mb-1">{item.label}</div>
                   <div className="text-2xl font-bold text-slate-800">{item.value}</div>
                   {refLink && (
                     <a href={refLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 hover:underline mt-2">
                       Source <Icons.ExternalLink />
                     </a>
                   )}
                 </div>
               );
             })}
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

    const handleReferenceChange = (criterionId: string, value: string) => {
      if (editForm) {
        setEditForm({
          ...editForm,
          references: {
            ...(editForm.references || {}),
            [criterionId]: value
          }
        });
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
                            <div key={item.id} className="relative p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                              <div className="flex justify-between mb-1">
                                <label className="block text-xs font-bold text-slate-500 uppercase">{item.label}</label>
                                <span className="text-[10px] font-mono text-slate-400">{item.id}</span>
                              </div>
                              
                              <div className="flex items-center gap-2 mb-3">
                                <input 
                                  type="number" 
                                  className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
                                  value={val} 
                                  onChange={(e) => handleChange(item.field as keyof University, Number(e.target.value))} 
                                />
                                <div className={`flex flex-col items-center justify-center w-12 h-10 rounded border ${score >= 4 ? 'bg-green-100 border-green-200 text-green-700' : score <= 2 ? 'bg-red-100 border-red-200 text-red-700' : 'bg-yellow-100 border-yellow-200 text-yellow-700'}`}>
                                   <span className="text-[10px] leading-none uppercase font-bold opacity-60">Lvl</span>
                                   <span className="font-bold text-lg leading-none">{score}</span>
                                </div>
                              </div>

                              {/* Reference URL Input */}
                              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                                 <div className="text-slate-400"><Icons.Link /></div>
                                 <input 
                                   type="text" 
                                   className="flex-1 text-xs border-b border-slate-200 focus:border-primary outline-none bg-transparent py-1 text-slate-600 placeholder:text-slate-300"
                                   placeholder={`Source URL for ${item.label}`}
                                   value={editForm?.references?.[item.id] || ''}
                                   onChange={(e) => handleReferenceChange(item.id, e.target.value)}
                                 />
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
                   <div className="flex gap-2">
                      <Button variant="outline" className="text-xs border-white text-white hover:bg-slate-700" onClick={calculateAhpWeights}>
                        <Icons.Refresh /> Recalculate
                      </Button>
                      <Button variant="outline" className="text-xs border-white text-white hover:bg-slate-700" onClick={() => {
                        // Reset to the predefined matrix as requested to ensure it's stable
                         const defaultMatrix = [
                          [1,      3,      5,      6,      6,      6],
                          [0.3333, 1,      3,      4,      4,      4],
                          [0.2,    0.3333, 1,      3,      3,      3],
                          [0.1667, 0.25,   0.3333, 1,      1,      1],
                          [0.1667, 0.25,   0.3333, 1,      1,      1],
                          [0.1667, 0.25,   0.3333, 1,      1,      1]
                        ];
                        setAhpMatrix(defaultMatrix);
                        setAhpResult(null);
                      }}>Reset Default</Button>
                   </div>
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
                                  className="w-full p-2 bg-blue-50 text-slate-900 border-2 border-blue-300 rounded-md text-xs font-bold focus:ring-2 focus:ring-primary focus:border-primary outline-none shadow-sm cursor-pointer hover:bg-white hover:border-blue-500 transition-all"
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
                                <div className="flex flex-col items-center justify-center py-1 bg-slate-100 text-slate-500 rounded text-xs text-center">
                                    <span className="font-mono font-bold">{ahpMatrix[i][j].toFixed(4)}</span>
                                    {ahpMatrix[i][j] < 1 && <span className="text-[10px] opacity-70 scale-90">(1/{Math.round(1/ahpMatrix[i][j])})</span>}
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

             {/* AHP Calculation Engine View (Result Details) */}
             {ahpResult && (
               <div className="animate-fade-in p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                       <Icons.Chart /> Calculation Engine View
                    </h3>
                 </div>

                 {/* Consistency Badge */}
                 <div className={`p-4 rounded-lg border mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 ${ahpResult.isConsistent ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                    <div>
                      <h4 className="font-bold text-lg flex items-center gap-2">
                        {ahpResult.isConsistent ? <Icons.Check /> : <Icons.Alert />}
                        {ahpResult.isConsistent ? 'Consistent Matrix (CR ≤ 0.1)' : 'Inconsistent Matrix (CR > 0.1)'}
                      </h4>
                      {!ahpResult.isConsistent && <p className="text-sm mt-1 font-medium">The judgments are logically inconsistent. Please adjust the matrix values.</p>}
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-xs uppercase font-bold opacity-70">Consistency Ratio</span>
                        <div className="text-3xl font-bold">{ahpResult.consistencyRatio.toFixed(4)}</div>
                    </div>
                 </div>

                 {/* Stats Grid */}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-slate-50 p-3 rounded border border-slate-100">
                       <div className="text-xs text-slate-500 uppercase font-bold">Lambda Max (λmax)</div>
                       <div className="text-xl font-bold text-slate-800">{ahpResult.lambdaMax.toFixed(4)}</div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded border border-slate-100">
                       <div className="text-xs text-slate-500 uppercase font-bold">Consistency Index (CI)</div>
                       <div className="text-xl font-bold text-slate-800">{ahpResult.consistencyIndex.toFixed(4)}</div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded border border-slate-100">
                       <div className="text-xs text-slate-500 uppercase font-bold">Random Index (RI)</div>
                       <div className="text-xl font-bold text-slate-800">{ahpResult.randomIndex.toFixed(2)}</div>
                    </div>
                 </div>
                 
                 <div className="space-y-8">
                    {/* Decimal Judgment Matrix */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider border-b pb-1">Judgment Matrix (Decimal)</h4>
                      <div className="overflow-x-auto border rounded-lg">
                        <table className="w-full text-xs">
                          <thead className="bg-slate-50">
                            <tr>
                              <th className="p-2"></th>
                              {criteria.map(c => <th key={c.id} className="p-2 text-center text-slate-500">{c.id}</th>)}
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {ahpMatrix.map((row, i) => (
                              <tr key={i}>
                                <td className="p-2 font-bold text-slate-600 text-center bg-slate-50">{criteria[i].id}</td>
                                {row.map((val, j) => (
                                  <td key={j} className="p-2 text-center text-slate-600 font-mono">{val.toFixed(4)}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Normalized Matrix */}
                      <div>
                        <h4 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider border-b pb-1">Normalized Matrix</h4>
                        <div className="overflow-x-auto border rounded-lg">
                          <table className="w-full text-xs">
                            <thead className="bg-slate-50">
                              <tr>
                                <th className="p-2"></th>
                                {criteria.map(c => <th key={c.id} className="p-2 text-center text-slate-500">{c.id}</th>)}
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              {ahpResult.normalizedMatrix.map((row, i) => (
                                <tr key={i}>
                                  <td className="p-2 font-bold text-slate-600 text-center bg-slate-50">{criteria[i].id}</td>
                                  {row.map((val, j) => (
                                    <td key={j} className="p-2 text-center text-slate-600 font-mono">{val.toFixed(3)}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Eigen Vector (Priority Weights) */}
                      <div>
                        <h4 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider border-b pb-1">Eigen Vector (Priority Weights)</h4>
                        <div className="space-y-3">
                          {ahpResult.eigenVector.map((val, i) => (
                             <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-slate-500 w-6">{criteria[i].id}</span>
                                  <span className="text-sm font-medium text-slate-700 truncate w-24">{criteria[i].name}</span>
                                </div>
                                <div className="flex-1 mx-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                                   <div className="h-full bg-blue-600" style={{ width: `${val * 100}%` }}></div>
                                </div>
                                <span className="text-sm font-bold text-blue-700 w-12 text-right">{(val * 100).toFixed(1)}%</span>
                             </div>
                          ))}
                          <div className="flex justify-between items-center border-t pt-2 mt-2 text-slate-800 font-bold text-sm">
                             <span>Total</span>
                             <span>{ahpResult.eigenVector.reduce((a,b) => a+b, 0).toFixed(3)} ({Math.round(ahpResult.eigenVector.reduce((a,b) => a+b, 0) * 100)}%)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                 </div>
               </div>
             )}
           </div>

           {/* Sidebar: Scale & Actions */}
           <div className="lg:col-span-4 space-y-6">
              {/* Saaty Scale Legend */}
              <Card className="bg-blue-50 border-blue-100">
                <h3 className="font-bold text-slate-800 mb-4">Saaty Reference Scale</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between p-2 bg-white rounded shadow-sm">
                    <span className="font-bold text-primary">1</span>
                    <span>Equal Importance</span>
                  </div>
                  <div className="flex justify-between p-2 bg-white rounded shadow-sm">
                    <span className="font-bold text-primary">3</span>
                    <span>Moderate Importance</span>
                  </div>
                  <div className="flex justify-between p-2 bg-white rounded shadow-sm">
                    <span className="font-bold text-primary">5</span>
                    <span>Strong Importance</span>
                  </div>
                  <div className="flex justify-between p-2 bg-white rounded shadow-sm">
                    <span className="font-bold text-primary">7</span>
                    <span>Very Strong Importance</span>
                  </div>
                  <div className="flex justify-between p-2 bg-white rounded shadow-sm">
                    <span className="font-bold text-primary">9</span>
                    <span>Extreme Importance</span>
                  </div>
                  <div className="text-center text-slate-400 pt-2 italic">
                    2, 4, 6, 8 are intermediate values
                  </div>
                </div>
              </Card>

              {/* Actions */}
              <Card>
                 <h3 className="font-bold text-slate-800 mb-4">Actions</h3>
                 <p className="text-sm text-secondary mb-6">
                   Once the matrix is consistent (CR ≤ 0.1), you can apply these weights to the global system ranking.
                 </p>
                 <Button 
                    className="w-full justify-center" 
                    onClick={applyAhpWeights} 
                    disabled={!ahpResult || !ahpResult.isConsistent}
                 >
                   <Icons.Check /> Apply Weights & View Ranking
                 </Button>
                 {!ahpResult && <p className="text-xs text-center mt-2 text-slate-400">Please calculate first.</p>}
              </Card>
           </div>
         </div>
      </div>
    );
  };

  const CriteriaList = () => (
    <div className="max-w-4xl mx-auto">
      <Button variant="secondary" className="mb-6" onClick={() => setView(View.DASHBOARD)}>
         <Icons.ArrowLeft /> Back
      </Button>
      <h2 className="text-3xl font-bold text-slate-800 mb-6">Criteria Explanation</h2>
      <div className="grid gap-6">
        {criteria.map(c => (
          <div key={c.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4">
            <div className={`p-3 rounded-full ${c.type === 'benefit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {c.type === 'benefit' ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"/></svg> : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">{c.name} ({c.id})</h3>
              <span className={`text-xs uppercase font-bold tracking-wider ${c.type === 'benefit' ? 'text-green-600' : 'text-red-600'}`}>
                {c.type} Attribute
              </span>
              <p className="mt-2 text-slate-600">{c.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ResultsPage = () => {
    // Calculate Scores
    const scores: UniversityScore[] = useMemo(() => {
      if (!activeWeights) return [];

      return universities.map(uni => {
        const breakdown: Record<string, number> = {};
        let totalScore = 0;

        criteria.forEach(c => {
          // 1. Get Raw Value
          let rawVal = 0;
          if (c.id === 'C1') rawVal = uni.rankGlobal;
          if (c.id === 'C2') rawVal = uni.rankSubject;
          if (c.id === 'C3') rawVal = uni.tuition;
          if (c.id === 'C4') rawVal = uni.cpiIndex;
          if (c.id === 'C5') rawVal = uni.englishPrograms;
          if (c.id === 'C6') rawVal = uni.intlStudentPercent;

          // 2. Convert to Score (1-5)
          const score1to5 = getCriterionScore(c.id, rawVal);

          // 3. Multiply by Weight
          const weight = activeWeights[c.id] || 0;
          const weightedScore = score1to5 * weight;
          
          breakdown[c.id] = weightedScore;
          totalScore += weightedScore;
        });

        return { universityId: uni.id, totalScore, breakdown };
      }).sort((a, b) => b.totalScore - a.totalScore);
    }, [universities, activeWeights, criteria]);

    if (!activeWeights) return <div>No weights calculated.</div>;

    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
             <h2 className="text-3xl font-bold text-slate-800">Ranking Results</h2>
             <p className="text-secondary">Based on your preferences and the AHP analysis.</p>
          </div>
          <div className="flex gap-3">
             <Button variant="secondary" onClick={() => setView(userRole === UserRole.ADMIN ? View.ADMIN_DASHBOARD : View.DASHBOARD)}>
               Dashboard
             </Button>
             <Button variant="outline" onClick={() => window.print()}>Export PDF</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
             {scores.map((score, index) => {
               const uni = universities.find(u => u.id === score.universityId);
               if (!uni) return null;
               return (
                 <Card key={score.universityId} className={`relative overflow-hidden border-2 ${index === 0 ? 'border-yellow-400 shadow-lg' : 'border-transparent'}`}>
                   {index === 0 && <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 font-bold px-4 py-1 rounded-bl-xl z-10">#1 Top Choice</div>}
                   
                   <div className="flex items-start gap-4 relative z-0">
                      <div className={`w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full font-bold text-xl ${index === 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-500'}`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold text-slate-800">{uni.name}</h3>
                            <p className="text-sm text-secondary mb-2">{uni.city}</p>
                          </div>
                          <div className="text-right">
                             <div className="text-2xl font-bold text-primary">{score.totalScore.toFixed(3)}</div>
                             <div className="text-xs text-slate-400 uppercase font-bold">Score</div>
                          </div>
                        </div>
                        
                        <p className="text-sm text-slate-600 leading-snug mb-4 pr-12">
                          {uni.description}
                        </p>

                        <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden flex">
                          {criteria.map((c, i) => (
                            <div 
                              key={c.id}
                              className={`h-full ${['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-teal-500'][i % 6]}`}
                              style={{ width: `${(score.breakdown[c.id] / score.totalScore) * 100}%` }}
                              title={`${c.name}: ${score.breakdown[c.id].toFixed(2)}`}
                            />
                          ))}
                        </div>
                        <div className="flex justify-between mt-1 text-[10px] text-slate-400">
                          <span>Score Contribution Breakdown</span>
                        </div>
                      </div>
                   </div>
                 </Card>
               );
             })}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
               <Card className="bg-slate-50">
                 <h3 className="font-bold text-slate-800 mb-4">Criteria Weights Used</h3>
                 <div className="space-y-3">
                    {Object.entries(activeWeights).sort(([,a], [,b]) => b - a).map(([cid, weight]) => {
                      const c = criteria.find(cr => cr.id === cid);
                      return (
                        <div key={cid} className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">{c?.name}</span>
                          <span className="font-bold text-slate-800">{(weight * 100).toFixed(1)}%</span>
                        </div>
                      );
                    })}
                 </div>
               </Card>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- Routing / Layout ---

  const renderContent = () => {
    switch (view) {
      case View.LANDING: return <LandingPage />;
      case View.LOGIN: return <LoginPage />;
      case View.DASHBOARD: return <StudentDashboard />;
      case View.ADMIN_DASHBOARD: return <AdminDashboard />;
      case View.UNIVERSITY_LIST: return <UniversityList />;
      case View.UNIVERSITY_DETAIL: return <UniversityDetail />;
      case View.CRITERIA_LIST: return <CriteriaList />;
      case View.MANAGE_UNIVERSITIES: return <ManageUniversities />;
      case View.PAIRWISE_COMPARISON: return <PairwiseComparison />;
      case View.STUDENT_PREFERENCES: return <StudentPreferences />;
      case View.RESULTS: return <ResultsPage />;
      default: return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900">
      {view !== View.LANDING && view !== View.LOGIN && (
         <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="flex justify-between h-16">
               <div className="flex items-center cursor-pointer" onClick={() => setView(userRole === UserRole.ADMIN ? View.ADMIN_DASHBOARD : View.DASHBOARD)}>
                 <div className="text-primary mr-2"><Icons.University /></div>
                 <span className="font-bold text-xl tracking-tight text-slate-800">UniSelect China</span>
               </div>
               <div className="flex items-center gap-4">
                 {userRole !== UserRole.GUEST && (
                   <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                     <Icons.User />
                     <span className="font-medium">{userRole === UserRole.ADMIN ? 'Admin' : 'Student'}</span>
                   </div>
                 )}
                 <Button variant="secondary" onClick={handleLogout} className="text-sm px-3">
                   {userRole === UserRole.GUEST ? 'Home' : 'Logout'} <Icons.LogOut />
                 </Button>
               </div>
             </div>
           </div>
         </nav>
      )}

      <div className={`transition-all duration-300 ${view !== View.LANDING && view !== View.LOGIN ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8' : ''}`}>
        {renderContent()}
      </div>
    </div>
  );
};

export default App;