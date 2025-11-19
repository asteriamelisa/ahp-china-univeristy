import React, { useState, useEffect, useMemo } from 'react';
import { UserRole, University, Criterion, AhpResult } from './types';
import { CRITERIA, UNIVERSITIES } from './constants';
import { calculateAhp, normalizeData } from './services/ahpService';
import { generateCampusImage } from './services/geminiService';

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
};

// --- Types & Enums ---
enum View {
  LANDING,
  LOGIN,
  DASHBOARD,
  UNIVERSITY_LIST,
  UNIVERSITY_DETAIL,
  CRITERIA_LIST,
  PAIRWISE_COMPARISON,
  RESULTS,
  ADMIN_DASHBOARD
}

// --- Components ---

const Button = ({ onClick, children, variant = 'primary', className = '', disabled = false }: any) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-primary text-white hover:bg-blue-700 shadow-md hover:shadow-lg",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    outline: "border-2 border-primary text-primary hover:bg-blue-50"
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`}>
      {children}
    </button>
  );
};

const Card = ({ children, className = '' }: any) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow ${className}`}>
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
  
  // AHP State
  const [ahpMatrix, setAhpMatrix] = useState<number[][]>([]);
  const [ahpResult, setAhpResult] = useState<AhpResult | null>(null);
  
  // Image Gen State
  const [generatedImages, setGeneratedImages] = useState<Record<string, string>>({});
  const [generatingImageFor, setGeneratingImageFor] = useState<string | null>(null);

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
  };

  // --- AHP Logic ---
  const handleMatrixChange = (row: number, col: number, value: number) => {
    const newMatrix = ahpMatrix.map(r => [...r]);
    newMatrix[row][col] = value;
    newMatrix[col][row] = 1 / value;
    setAhpMatrix(newMatrix);
  };

  const calculateAhpWeights = () => {
    const result = calculateAhp(ahpMatrix, criteria.map(c => c.id));
    setAhpResult(result);
  };

  // --- Image Generation ---
  const handleGenerateImage = async (uni: University) => {
    setGeneratingImageFor(uni.id);
    const prompt = `Photorealistic, wide-angle architectural shot of ${uni.name} campus in ${uni.city}, China. ${uni.description}. Academic, modern, sunny day, high quality, detailed, 4k.`;
    const imageUrl = await generateCampusImage(prompt);
    setGeneratedImages(prev => ({ ...prev, [uni.id]: imageUrl }));
    setGeneratingImageFor(null);
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
      <main className="flex-1 flex flex-col items-center justify-center text-center p-8 max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-slate-800 mb-6">
          Master's Degree Selection Decision Support System
        </h1>
        <p className="text-xl text-secondary mb-10 max-w-2xl">
          Empowering students to choose the best university in China using the Analytic Hierarchy Process (AHP) and AI-driven insights.
        </p>
        <div className="flex gap-4">
          <Button onClick={() => setView(View.LOGIN)}>Get Started</Button>
          <Button variant="secondary" onClick={() => {
            setUserRole(UserRole.GUEST);
            setView(View.UNIVERSITY_LIST);
          }}>Explore Universities</Button>
        </div>
        <div className="mt-20 opacity-20 absolute bottom-0 pointer-events-none">
           {/* Decorative background element */}
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
              <div className="text-sm text-slate-500">Find your ideal university</div>
            </div>
          </button>
          <button onClick={() => handleLogin(UserRole.ADMIN)} className="w-full p-4 border-2 border-gray-100 rounded-xl hover:border-primary hover:bg-blue-50 transition-all flex items-center gap-4 group">
            <div className="bg-purple-100 p-3 rounded-full group-hover:bg-purple-200 text-purple-600">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            </div>
            <div className="text-left">
              <div className="font-semibold text-slate-800">Administrator</div>
              <div className="text-sm text-slate-500">Manage data and criteria</div>
            </div>
          </button>
        </div>
        <div className="mt-6 text-center">
           <button onClick={() => setView(View.LANDING)} className="text-sm text-slate-400 hover:text-slate-600">Back to Home</button>
        </div>
      </Card>
    </div>
  );

  const StudentDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="col-span-1 md:col-span-2 bg-gradient-to-r from-primary to-blue-600 text-white border-none">
        <h2 className="text-3xl font-bold mb-2">Welcome, Student!</h2>
        <p className="opacity-90">Start your journey to finding the perfect Master's program.</p>
      </Card>
      
      <div className="space-y-4">
        <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setView(View.PAIRWISE_COMPARISON)}>
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg text-primary"><Icons.Matrix /></div>
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">STEP 1</span>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Pairwise Comparison</h3>
          <p className="text-secondary text-sm">Define your priorities using the AHP matrix to weigh criteria like Rank vs. Cost.</p>
        </Card>
        
        <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setView(View.UNIVERSITY_LIST)}>
           <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg text-primary"><Icons.List /></div>
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">EXPLORE</span>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Browse Universities</h3>
          <p className="text-secondary text-sm">Explore top Chinese universities, view details, and visualize campuses with AI.</p>
        </Card>
      </div>

      <div className="space-y-4">
        <Card className={`cursor-pointer hover:border-primary transition-colors ${!ahpResult ? 'opacity-60' : ''}`} onClick={() => ahpResult && setView(View.RESULTS)}>
           <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg text-primary"><Icons.Chart /></div>
            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">STEP 2</span>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">View Rankings</h3>
          <p className="text-secondary text-sm">See which university matches your preferences based on your AHP weights.</p>
          {!ahpResult && <div className="mt-2 text-xs text-orange-500 font-medium">Complete Comparison first</div>}
        </Card>
         <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setView(View.CRITERIA_LIST)}>
           <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg text-primary"><Icons.Check /></div>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">View Criteria</h3>
          <p className="text-secondary text-sm">Understand the factors: Global Rank, Tuition, CPI, etc.</p>
        </Card>
      </div>
    </div>
  );

  const UniversityList = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Universities</h2>
        <div className="text-sm text-secondary">{universities.length} Institutions</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {universities.map(uni => (
          <Card key={uni.id} className="flex flex-col h-full hover:-translate-y-1 transition-transform">
            <div className="h-32 bg-gray-100 rounded-t-xl mb-4 overflow-hidden relative">
               {/* Placeholder for card header image if we had one, defaulting to pattern */}
               <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-slate-200 opacity-50" />
               <div className="absolute bottom-0 left-4 transform translate-y-1/2 bg-white p-2 rounded-lg shadow-md border border-gray-100">
                  <img src={uni.logoUrl} alt={uni.name} className="w-12 h-12 rounded bg-gray-50 object-cover" />
               </div>
            </div>
            <div className="mt-6 flex-1">
              <h3 className="text-lg font-bold text-slate-800 mb-1">{uni.name}</h3>
              <p className="text-sm text-blue-600 font-medium mb-2">{uni.city}</p>
              <p className="text-sm text-secondary line-clamp-2 mb-4">{uni.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Global Rank #{uni.rankGlobal}</span>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Subject Rank #{uni.rankSubject}</span>
              </div>
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

    const hasGeneratedImage = generatedImages[uni.id];
    const isGenerating = generatingImageFor === uni.id;

    return (
      <div className="max-w-4xl mx-auto">
         <Button variant="secondary" className="mb-6" onClick={() => setView(View.UNIVERSITY_LIST)}>
           <Icons.ArrowLeft /> Back to List
         </Button>
         
         <Card className="overflow-hidden p-0 mb-8">
           <div className="relative h-64 md:h-80 bg-slate-100 group">
             {hasGeneratedImage ? (
               <img src={hasGeneratedImage} alt={uni.name + " Campus"} className="w-full h-full object-cover" />
             ) : (
               <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 flex-col gap-2">
                 <Icons.Image />
                 <span>No AI visualization yet</span>
               </div>
             )}
             
             <div className="absolute bottom-4 right-4">
               <Button 
                 variant="primary" 
                 onClick={() => handleGenerateImage(uni)}
                 disabled={isGenerating}
                 className="shadow-lg"
               >
                 {isGenerating ? (
                   <>
                     <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                     </svg>
                     Designing Campus...
                   </>
                 ) : (
                   <>
                     <Icons.Image /> {hasGeneratedImage ? 'Regenerate View' : 'Visualize Campus with AI'}
                   </>
                 )}
               </Button>
             </div>
           </div>
           
           <div className="p-8">
             <div className="flex items-start justify-between mb-6">
               <div>
                 <h1 className="text-3xl font-bold text-slate-800 mb-2">{uni.name}</h1>
                 <p className="text-xl text-blue-600 flex items-center gap-2">
                   <span className="inline-block w-2 h-2 rounded-full bg-blue-600"></span> {uni.city}, China
                 </p>
               </div>
               <img src={uni.logoUrl} alt="Logo" className="w-20 h-20 rounded-lg border border-gray-100" />
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
           </div>
         </Card>
      </div>
    );
  };

  const PairwiseComparison = () => {
    const scaleValues = [9, 8, 7, 6, 5, 4, 3, 2, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    // This is a simplified logic for the UI. In reality we'd loop through unique pairs.
    // For the grid UX requested: NxN Matrix.
    
    return (
      <div className="max-w-5xl mx-auto">
         <div className="flex justify-between items-center mb-6">
           <h2 className="text-2xl font-bold text-slate-800">Pairwise Comparison Matrix</h2>
           <div className="flex gap-2">
             <Button variant="secondary" onClick={() => {
               const n = criteria.length;
               setAhpMatrix(Array(n).fill(0).map(() => Array(n).fill(1)));
               setAhpResult(null);
             }}>Reset</Button>
             <Button onClick={calculateAhpWeights}>Calculate Weights</Button>
           </div>
         </div>
         
         <div className="flex flex-col lg:flex-row gap-8">
           <Card className="flex-1 overflow-x-auto">
             <table className="w-full min-w-[600px]">
               <thead>
                 <tr>
                   <th className="p-2"></th>
                   {criteria.map(c => (
                     <th key={c.id} className="p-2 text-xs font-bold text-slate-500 uppercase w-24">{c.name}</th>
                   ))}
                 </tr>
               </thead>
               <tbody>
                 {criteria.map((rowC, i) => (
                   <tr key={rowC.id} className="border-b border-gray-50 last:border-none">
                     <td className="p-3 font-medium text-slate-700 text-sm">{rowC.name}</td>
                     {criteria.map((colC, j) => (
                       <td key={`${rowC.id}-${colC.id}`} className="p-1 text-center">
                         {i === j ? (
                           <div className="w-full py-2 bg-gray-50 text-gray-400 rounded text-sm">1</div>
                         ) : i < j ? (
                           <select 
                             className="w-full p-2 bg-white border border-gray-200 rounded text-sm focus:ring-2 focus:ring-primary outline-none"
                             value={ahpMatrix[i][j]}
                             onChange={(e) => handleMatrixChange(i, j, Number(e.target.value))}
                           >
                             <option value="1">1 - Equal</option>
                             <option value="3">3 - Moderate</option>
                             <option value="5">5 - Strong</option>
                             <option value="7">7 - Very Strong</option>
                             <option value="9">9 - Extreme</option>
                             <option value="2">2</option>
                             <option value="4">4</option>
                             <option value="6">6</option>
                             <option value="8">8</option>
                             <option value="0.3333">1/3</option>
                             <option value="0.2">1/5</option>
                             {/* For simplicity, mainly showing integer preferences in this direction */}
                           </select>
                         ) : (
                           <div className="w-full py-2 bg-slate-50 text-slate-500 rounded text-sm">
                             {ahpMatrix[i][j].toFixed(2)}
                           </div>
                         )}
                       </td>
                     ))}
                   </tr>
                 ))}
               </tbody>
             </table>
           </Card>
           
           {ahpResult && (
             <div className="w-full lg:w-80 space-y-4">
               <Card className={`${ahpResult.isConsistent ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                 <h3 className="font-bold text-slate-800 mb-2">Consistency Check</h3>
                 <div className="flex justify-between mb-1 text-sm">
                   <span>Ratio (CR):</span>
                   <span className={ahpResult.isConsistent ? 'text-green-700 font-bold' : 'text-red-700 font-bold'}>
                     {ahpResult.consistencyRatio.toFixed(4)}
                   </span>
                 </div>
                 <p className="text-xs opacity-75">
                   {ahpResult.isConsistent 
                     ? "Matrix is consistent. Weights are reliable." 
                     : "Matrix is inconsistent (CR > 0.1). Please review your judgments."}
                 </p>
               </Card>
               
               <Card>
                 <h3 className="font-bold text-slate-800 mb-4">Priority Weights</h3>
                 <div className="space-y-3">
                   {criteria.map(c => (
                     <div key={c.id}>
                       <div className="flex justify-between text-xs mb-1">
                         <span>{c.name}</span>
                         <span className="font-bold">{(ahpResult.weights[c.id] * 100).toFixed(1)}%</span>
                       </div>
                       <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                         <div 
                           className="h-full bg-primary rounded-full" 
                           style={{ width: `${ahpResult.weights[c.id] * 100}%` }} 
                         />
                       </div>
                     </div>
                   ))}
                 </div>
               </Card>
             </div>
           )}
         </div>
      </div>
    );
  };

  const ResultsPage = () => {
    if (!ahpResult) return <div>No results yet.</div>;

    // Calculate final scores
    const scores: UniversityScore[] = universities.map(uni => {
      let totalScore = 0;
      const breakdown: Record<string, number> = {};
      
      // Need to normalize values for each criteria first across all unis
      criteria.forEach(c => {
         // Find min/max for this criterion
         const values = universities.map(u => {
           switch(c.id) {
             case 'C1': return u.rankGlobal;
             case 'C2': return u.rankSubject;
             case 'C3': return u.tuition;
             case 'C4': return u.cpiIndex;
             case 'C5': return u.englishPrograms;
             case 'C6': return u.intlStudentPercent;
             default: return 0;
           }
         });
         const min = Math.min(...values);
         const max = Math.max(...values);
         
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

         const normalized = normalizeData(rawVal, min, max, c.type);
         const weightedScore = normalized * ahpResult.weights[c.id];
         breakdown[c.id] = weightedScore;
         totalScore += weightedScore;
      });

      return { universityId: uni.id, totalScore, breakdown };
    });

    const sortedScores = [...scores].sort((a, b) => b.totalScore - a.totalScore);

    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800">Ranking Results</h2>
          <p className="text-secondary">Based on your preferences and AHP weighting</p>
        </div>

        <div className="space-y-4">
          {sortedScores.map((score, idx) => {
            const uni = universities.find(u => u.id === score.universityId)!;
            return (
              <Card key={uni.id} className={`flex items-center gap-6 p-4 ${idx === 0 ? 'border-2 border-primary bg-blue-50/30' : ''}`}>
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 font-bold text-xl text-slate-500">
                  {idx + 1}
                </div>
                <img src={uni.logoUrl} alt={uni.name} className="w-16 h-16 rounded object-cover bg-white" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-800">{uni.name}</h3>
                  <div className="flex gap-4 text-sm text-secondary">
                    <span>Score: {(score.totalScore * 100).toFixed(2)}</span>
                    <span>{uni.city}</span>
                  </div>
                </div>
                <div className="hidden md:block w-48">
                   {/* Mini bar chart of breakdown */}
                   <div className="flex h-2 rounded-full overflow-hidden bg-gray-100">
                     {criteria.map((c, i) => (
                       <div 
                         key={c.id} 
                         className={`h-full ${['bg-blue-500','bg-green-500','bg-purple-500','bg-orange-500','bg-red-500','bg-teal-500'][i]}`}
                         style={{ width: `${(score.breakdown[c.id] / score.totalScore) * 100}%` }}
                       />
                     ))}
                   </div>
                </div>
                <Button variant="outline" onClick={() => { setSelectedUniId(uni.id); setView(View.UNIVERSITY_DETAIL); }}>View</Button>
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
       <h2 className="text-2xl font-bold text-slate-800 mb-6">Evaluation Criteria</h2>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {criteria.map(c => (
           <Card key={c.id}>
             <div className="flex justify-between items-start mb-2">
               <h3 className="text-lg font-bold">{c.name}</h3>
               <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${c.type === 'benefit' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                 {c.type}
               </span>
             </div>
             <p className="text-secondary text-sm">{c.description}</p>
           </Card>
         ))}
       </div>
    </div>
  );

  const AdminDashboard = () => (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex flex-col items-center justify-center p-8 text-center border-dashed border-2 border-gray-200 hover:border-primary cursor-pointer">
           <div className="p-4 bg-slate-50 rounded-full mb-4"><Icons.University /></div>
           <h3 className="font-bold">Manage Universities</h3>
           <p className="text-xs text-secondary mt-2">Add, Edit, Delete universities and update their data stats.</p>
        </Card>
        <Card className="flex flex-col items-center justify-center p-8 text-center border-dashed border-2 border-gray-200 hover:border-primary cursor-pointer">
           <div className="p-4 bg-slate-50 rounded-full mb-4"><Icons.Check /></div>
           <h3 className="font-bold">Manage Criteria</h3>
           <p className="text-xs text-secondary mt-2">Update criteria definitions and types.</p>
        </Card>
        <Card className="flex flex-col items-center justify-center p-8 text-center border-dashed border-2 border-gray-200 hover:border-primary cursor-pointer">
           <div className="p-4 bg-slate-50 rounded-full mb-4"><Icons.User /></div>
           <h3 className="font-bold">User Management</h3>
           <p className="text-xs text-secondary mt-2">View registered students and usage logs.</p>
        </Card>
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
                 <button onClick={() => setView(View.PAIRWISE_COMPARISON)} className={`text-sm font-medium ${view === View.PAIRWISE_COMPARISON ? 'text-primary' : 'text-slate-600'}`}>Compare</button>
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
      {view === View.PAIRWISE_COMPARISON && <PairwiseComparison />}
      {view === View.RESULTS && <ResultsPage />}
      {view === View.ADMIN_DASHBOARD && <AdminDashboard />}
    </Layout>
  );
};

export default App;