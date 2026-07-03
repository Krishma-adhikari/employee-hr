import React, { useState, useEffect } from 'react';
import { Employee, PredictorInput, PredictorResult } from '../types';
import { MOCK_EMPLOYEES } from '../data/mockData';
import { Brain, Sparkles, CheckCircle2, XCircle, AlertTriangle, User, Loader2, ArrowRight } from 'lucide-react';

export default function PredictorTab() {
  const [selectedEmpId, setSelectedEmpId] = useState<string>('');
  const [inputs, setInputs] = useState<PredictorInput>({
    age: 32,
    gender: 'Male',
    maritalStatus: 'Single',
    department: 'Sales',
    jobRole: 'Sales Executive',
    monthlyIncome: 5400,
    overTime: 'Yes',
    jobSatisfaction: 2,
    workLifeBalance: 2,
    environmentSatisfaction: 2,
    yearsAtCompany: 3,
    yearsSinceLastPromotion: 1,
    yearsWithCurrManager: 2,
    distanceFromHome: 12
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictorResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Auto-fill form when roster employee is selected
  useEffect(() => {
    if (selectedEmpId) {
      const emp = MOCK_EMPLOYEES.find(e => e.id === selectedEmpId);
      if (emp) {
        setInputs({
          age: emp.age,
          gender: emp.gender,
          maritalStatus: emp.maritalStatus,
          department: emp.department,
          jobRole: emp.jobRole,
          monthlyIncome: emp.monthlyIncome,
          overTime: emp.overTime,
          jobSatisfaction: emp.jobSatisfaction,
          workLifeBalance: emp.workLifeBalance,
          environmentSatisfaction: emp.environmentSatisfaction,
          yearsAtCompany: emp.yearsAtCompany,
          yearsSinceLastPromotion: emp.yearsSinceLastPromotion,
          yearsWithCurrManager: emp.yearsWithCurrManager,
          distanceFromHome: emp.distanceFromHome
        });
        setResult(null);
        setError(null);
      }
    }
  }, [selectedEmpId]);

  // Adjust job roles when department changes
  const handleDeptChange = (dept: 'Sales' | 'Research & Development' | 'Human Resources') => {
    let defaultRole = 'Sales Executive';
    if (dept === 'Research & Development') defaultRole = 'Research Scientist';
    else if (dept === 'Human Resources') defaultRole = 'Human Resources';

    setInputs(prev => ({
      ...prev,
      department: dept,
      jobRole: defaultRole
    }));
  };

  const getRolesForDept = (dept: string) => {
    if (dept === 'Sales') return ['Sales Executive', 'Sales Representative', 'Manager'];
    if (dept === 'Research & Development') return ['Research Scientist', 'Laboratory Technician', 'Manufacturing Director', 'Healthcare Representative', 'Research Director', 'Manager'];
    return ['Human Resources', 'Manager'];
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: inputs })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze risk');
      }

      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during prediction. Please verify your Gemini API key is configured correctly.');
    } finally {
      setLoading(false);
    }
  };

  // Pre-fill helper templates
  const applyTemplate = (type: 'high' | 'low') => {
    setSelectedEmpId('');
    if (type === 'high') {
      setInputs({
        age: 23,
        gender: 'Male',
        maritalStatus: 'Single',
        department: 'Sales',
        jobRole: 'Sales Representative',
        monthlyIncome: 2400,
        overTime: 'Yes',
        jobSatisfaction: 1,
        workLifeBalance: 1,
        environmentSatisfaction: 1,
        yearsAtCompany: 1,
        yearsSinceLastPromotion: 0,
        yearsWithCurrManager: 1,
        distanceFromHome: 26
      });
    } else {
      setInputs({
        age: 44,
        gender: 'Female',
        maritalStatus: 'Married',
        department: 'Research & Development',
        jobRole: 'Research Director',
        monthlyIncome: 14500,
        overTime: 'No',
        jobSatisfaction: 4,
        workLifeBalance: 3,
        environmentSatisfaction: 4,
        yearsAtCompany: 11,
        yearsSinceLastPromotion: 1,
        yearsWithCurrManager: 8,
        distanceFromHome: 2
      });
    }
    setResult(null);
    setError(null);
  };

  // Risk Color Utilities
  const getRiskColor = (level: string) => {
    if (level === 'High') return 'text-red-500 border-red-500 bg-red-500/10';
    if (level === 'Medium') return 'text-amber-500 border-amber-500 bg-amber-500/10';
    return 'text-emerald-500 border-emerald-500 bg-emerald-500/10';
  };

  const getImpactIcon = (impact: string) => {
    if (impact === 'Negative') return <XCircle className="text-red-500 shrink-0 mt-0.5" size={16} />;
    if (impact === 'Positive') return <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={16} />;
    return <AlertTriangle className="text-slate-400 shrink-0 mt-0.5" size={16} />;
  };

  const getImpactBadge = (impact: string) => {
    if (impact === 'Negative') return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-bold">RISK DRIVER</span>;
    if (impact === 'Positive') return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold">PROTECTIVE</span>;
    return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold">NEUTRAL</span>;
  };

  return (
    <div className="space-y-6">
      {/* Introduction Card */}
      <div className="bg-white dark:bg-[#0F1219]/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 dark:bg-indigo-950/60 p-3 rounded-xl text-indigo-600">
            <Brain size={24} />
          </div>
          <div>
            <h3 className="text-lg font-sans font-semibold text-slate-800 dark:text-slate-100">Predictive Employee Retention Engine</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Simulate individual scenarios or load staff records to project retention risk and generate custom, Gemini-engineered retention strategies.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto shrink-0">
          <button 
            onClick={() => applyTemplate('high')} 
            className="flex-1 md:flex-none text-xs font-semibold px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-950/50 transition-colors border border-rose-100/10"
          >
            Load High-Risk Profile
          </button>
          <button 
            onClick={() => applyTemplate('low')} 
            className="flex-1 md:flex-none text-xs font-semibold px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-950/50 transition-colors border border-emerald-100/10"
          >
            Load Low-Risk Profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column - Left (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0F1219]/50 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/80 shadow-sm">
          <h4 className="text-sm font-sans font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center justify-between">
            <span>Simulation Parameters</span>
            <span className="text-[10px] font-mono text-slate-400">INPUT DATA</span>
          </h4>

          <form onSubmit={handlePredict} className="space-y-4">
            {/* Quick Fill Dropdown */}
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">Roster Lookup (Optional)</label>
              <div className="relative">
                <select
                  value={selectedEmpId}
                  onChange={(e) => setSelectedEmpId(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-900/50 px-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">-- Choose active employee --</option>
                  {MOCK_EMPLOYEES.filter(e => e.attrition === 'No').map(e => (
                    <option key={e.id} value={e.id}>
                      {e.id} - {e.jobRole} ({e.department === 'Research & Development' ? 'R&D' : e.department})
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-2.5 text-slate-400">
                  <User size={12} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Age */}
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">Age</label>
                <input
                  type="number"
                  min={18}
                  max={65}
                  value={inputs.age}
                  onChange={(e) => setInputs(p => ({ ...p, age: parseInt(e.target.value) || 18 }))}
                  className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-900/50 px-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">Gender</label>
                <select
                  value={inputs.gender}
                  onChange={(e) => setInputs(p => ({ ...p, gender: e.target.value as any }))}
                  className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-900/50 px-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Marital Status */}
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">Marital Status</label>
                <select
                  value={inputs.maritalStatus}
                  onChange={(e) => setInputs(p => ({ ...p, maritalStatus: e.target.value as any }))}
                  className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-900/50 px-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                </select>
              </div>

              {/* Overtime */}
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">Works Overtime</label>
                <select
                  value={inputs.overTime}
                  onChange={(e) => setInputs(p => ({ ...p, overTime: e.target.value as any }))}
                  className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-900/50 px-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="No">No (Regular Hours)</option>
                  <option value="Yes">Yes (Overtime)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Department */}
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">Department</label>
                <select
                  value={inputs.department}
                  onChange={(e) => handleDeptChange(e.target.value as any)}
                  className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-900/50 px-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="Sales">Sales</option>
                  <option value="Research & Development">R&D</option>
                  <option value="Human Resources">HR</option>
                </select>
              </div>

              {/* Job Role */}
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">Job Role</label>
                <select
                  value={inputs.jobRole}
                  onChange={(e) => setInputs(p => ({ ...p, jobRole: e.target.value }))}
                  className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-900/50 px-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {getRolesForDept(inputs.department).map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Monthly Income */}
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">Monthly Income ($)</label>
                <input
                  type="number"
                  step={100}
                  min={1500}
                  max={25000}
                  value={inputs.monthlyIncome}
                  onChange={(e) => setInputs(p => ({ ...p, monthlyIncome: parseInt(e.target.value) || 2000 }))}
                  className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-900/50 px-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Commute Distance */}
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">Commute (Miles)</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={inputs.distanceFromHome}
                  onChange={(e) => setInputs(p => ({ ...p, distanceFromHome: parseInt(e.target.value) || 1 }))}
                  className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-900/50 px-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Satisfaction Grid */}
            <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl p-4 border border-slate-100 dark:border-slate-800/60 space-y-3">
              <span className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">Satisfaction Indices (Scale 1-4)</span>
              
              <div className="grid grid-cols-3 gap-2">
                {/* Job Sat */}
                <div>
                  <label className="block text-[9px] font-sans font-medium text-slate-600 dark:text-slate-400 mb-1">Job Satisfaction</label>
                  <select
                    value={inputs.jobSatisfaction}
                    onChange={(e) => setInputs(p => ({ ...p, jobSatisfaction: parseInt(e.target.value) }))}
                    className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 py-1 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value={1}>1 (Low)</option>
                    <option value={2}>2 (Mid)</option>
                    <option value={3}>3 (High)</option>
                    <option value={4}>4 (Max)</option>
                  </select>
                </div>

                {/* Work Life */}
                <div>
                  <label className="block text-[9px] font-sans font-medium text-slate-600 dark:text-slate-400 mb-1">Work-Life Bal.</label>
                  <select
                    value={inputs.workLifeBalance}
                    onChange={(e) => setInputs(p => ({ ...p, workLifeBalance: parseInt(e.target.value) }))}
                    className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 py-1 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value={1}>1 (Low)</option>
                    <option value={2}>2 (Mid)</option>
                    <option value={3}>3 (High)</option>
                    <option value={4}>4 (Max)</option>
                  </select>
                </div>

                {/* Env Sat */}
                <div>
                  <label className="block text-[9px] font-sans font-medium text-slate-600 dark:text-slate-400 mb-1">Environment</label>
                  <select
                    value={inputs.environmentSatisfaction}
                    onChange={(e) => setInputs(p => ({ ...p, environmentSatisfaction: parseInt(e.target.value) }))}
                    className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 py-1 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value={1}>1 (Low)</option>
                    <option value={2}>2 (Mid)</option>
                    <option value={3}>3 (High)</option>
                    <option value={4}>4 (Max)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tenure Metrics */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">Company Yrs</label>
                <input
                  type="number"
                  min={0}
                  max={40}
                  value={inputs.yearsAtCompany}
                  onChange={(e) => setInputs(p => ({ ...p, yearsAtCompany: parseInt(e.target.value) || 0 }))}
                  className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-900/50 px-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">Since Promo</label>
                <input
                  type="number"
                  min={0}
                  max={15}
                  value={inputs.yearsSinceLastPromotion}
                  onChange={(e) => setInputs(p => ({ ...p, yearsSinceLastPromotion: parseInt(e.target.value) || 0 }))}
                  className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-900/50 px-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">With Mgr</label>
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={inputs.yearsWithCurrManager}
                  onChange={(e) => setInputs(p => ({ ...p, yearsWithCurrManager: parseInt(e.target.value) || 0 }))}
                  className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-900/50 px-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-sans font-semibold py-2.5 px-4 rounded-xl shadow-sm text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Running Predictive Models...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Run AI Attrition Risk Forecast
                </>
              )}
            </button>
          </form>
        </div>

        {/* Prediction Results Column - Right (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Result view */}
          {result ? (
            <div className="bg-white dark:bg-[#0F1219]/50 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/80 shadow-sm space-y-6 animate-fadeIn transition-all duration-300">
              {/* Header metrics */}
              <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-slate-100 dark:border-slate-800 pb-5">
                {/* Score Ring */}
                <div className="relative shrink-0 flex items-center justify-center w-28 h-28">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="56"
                      cy="56"
                      r="46"
                      stroke="#f1f5f9"
                      strokeWidth="8"
                      fill="transparent"
                      className="dark:stroke-slate-800/60"
                    />
                    <circle
                      cx="56"
                      cy="56"
                      r="46"
                      stroke={result.riskScore > 70 ? '#ef4444' : result.riskScore > 30 ? '#f59e0b' : '#10b981'}
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 46}
                      strokeDashoffset={2 * Math.PI * 46 * (1 - result.riskScore / 100)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-bold font-sans text-slate-900 dark:text-slate-100">{result.riskScore}%</span>
                    <span className="text-[9px] font-mono text-slate-400 font-bold">RISK</span>
                  </div>
                </div>

                <div className="text-center sm:text-left space-y-2">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h4 className="text-base font-sans font-bold text-slate-800 dark:text-slate-200">
                      Calculated Attrition Risk
                    </h4>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getRiskColor(result.riskLevel)}`}>
                      {result.riskLevel} Risk
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    This staff member presents a <strong>{result.riskLevel.toLowerCase()}</strong> likelihood of exiting the company in the next 12 months based on core environmental, financial, and commute friction weights.
                  </p>
                </div>
              </div>

              {/* Factors list */}
              <div className="space-y-3">
                <h5 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">Key Influencer Weights</h5>
                <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-56 overflow-y-auto pr-1">
                  {result.factors.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-start gap-3">
                      {getImpactIcon(item.impact)}
                      <div className="space-y-0.5 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-medium text-slate-800 dark:text-slate-200">{item.factor}</span>
                          {getImpactBadge(item.impact)}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable recommendations */}
              <div className="bg-indigo-500/5 dark:bg-indigo-950/20 border border-indigo-100/10 dark:border-indigo-900/30 rounded-2xl p-4 space-y-3">
                <h5 className="text-xs font-mono font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={14} /> Custom Retention Playbook
                </h5>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2 leading-relaxed">
                      <ArrowRight className="text-indigo-500 mt-1 shrink-0" size={12} />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-3xl p-6 text-center space-y-3">
              <XCircle className="text-red-500 mx-auto" size={36} />
              <h4 className="text-sm font-sans font-bold text-red-900 dark:text-red-300">Prediction Engine Error</h4>
              <p className="text-xs text-red-700 dark:text-red-400 max-w-md mx-auto leading-relaxed">
                {error}
              </p>
            </div>
          ) : (
            <div className="bg-slate-50/50 dark:bg-[#0F1219]/30 rounded-3xl p-12 border border-dashed border-slate-200 dark:border-slate-800/80 text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="bg-slate-100 dark:bg-slate-850 p-4 rounded-full text-slate-400 mb-4 animate-pulse border border-slate-100/10">
                <Brain size={40} className="text-indigo-500" />
              </div>
              <h4 className="text-sm font-sans font-medium text-slate-700 dark:text-slate-300">Awaiting Simulation Parameter Forecast</h4>
              <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">
                Configure candidate parameters on the left or load an active employee roster template, then click the AI forecast button to generate instant risk scoring.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
