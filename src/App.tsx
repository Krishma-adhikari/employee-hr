import React, { useState } from 'react';
import { ThemeProvider, useTheme } from './components/ThemeContext';
import { MOCK_EMPLOYEES } from './data/mockData';
import { ActiveTab, DashboardFilters } from './types';
import OverviewTab from './components/OverviewTab';
import DemographicsTab from './components/DemographicsTab';
import SatisfactionTab from './components/SatisfactionTab';
// import PredictorTab from './components/PredictorTab';
// import ChatTab from './components/ChatTab';
import NotebookInsightsTab from './components/NotebookInsightsTab';
import { 
  TrendingUp, 
  Users, 
  Building2, 
  Clock, 
  Briefcase, 
  Heart, 
  HelpCircle, 
  Brain, 
  Sparkles, 
  BookOpen,
  Sun, 
  Moon, 
  FilterX, 
  Menu, 
  X,
  MapPin,
  Smile,
  LogOut
} from 'lucide-react';

function DashboardApp() {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filters, setFilters] = useState<DashboardFilters>({
    department: 'All',
    gender: 'All',
    jobRole: 'All',
    overTime: 'All',
    maritalStatus: 'All'
  });

  // Filter core mock data dynamically
  const filteredEmployees = MOCK_EMPLOYEES.filter(emp => {
    if (filters.department !== 'All' && emp.department !== filters.department) return false;
    if (filters.gender !== 'All' && emp.gender !== filters.gender) return false;
    if (filters.overTime !== 'All' && emp.overTime !== filters.overTime) return false;
    if (filters.maritalStatus !== 'All' && emp.maritalStatus !== filters.maritalStatus) return false;
    return true;
  });

  // Unique job roles based on selected department to prevent impossible combinations
  const availableRoles = ['All', ...Array.from(new Set(
    MOCK_EMPLOYEES
      .filter(e => filters.department === 'All' || e.department === filters.department)
      .map(e => e.jobRole)
  ))];

  const resetFilters = () => {
    setFilters({
      department: 'All',
      gender: 'All',
      jobRole: 'All',
      overTime: 'All',
      maritalStatus: 'All'
    });
  };

  const navItems = [
    { id: 'overview', label: 'Overview Metrics', icon: TrendingUp },
    { id: 'demographics', label: 'Demographics Profile', icon: Users },
    { id: 'worklife', label: 'Work & Environment', icon: Smile },
    // { id: 'predictor', label: 'AI Risk Predictor', icon: Brain },
    // { id: 'assistant', label: 'Krishma (AI Partner)', icon: Sparkles },
    { id: 'notebook', label: 'Notebook Insights', icon: BookOpen }
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0E14] text-slate-900 dark:text-slate-200 flex flex-col md:flex-row transition-colors duration-300">
      
      {/* 1. SIDE NAVIGATION BAR (Desktop) */}
      <aside className="hidden md:flex md:w-64 shrink-0 flex-col bg-white dark:bg-[#0F1219] border-r border-slate-100 dark:border-slate-800 flex flex-col transition-colors duration-300">
        {/* Header Branding */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800/60 flex items-center gap-3">
          <div className="bg-indigo-500 p-2 rounded-lg text-white">
            <Building2 size={20} />
          </div>
          <div>
            <h1 className="text-sm font-sans font-bold tracking-tight text-slate-800 dark:text-slate-100">InsightHR</h1>
            <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">HR Attrition Center</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {navItems.map(item => {
            const IconComp = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-sans font-medium transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:text-slate-950 dark:hover:text-slate-200'
                }`}
              >
                <IconComp size={16} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 dark:text-slate-500">
            <span>Roster: {MOCK_EMPLOYEES.length} staff</span>
          </div>
          {/* Light / Dark Toggler */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            title="Toggle theme mode"
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </aside>

      {/* 2. MOBILE TOP NAV */}
      <header className="md:hidden bg-white dark:bg-[#0F1219] border-b border-slate-100 dark:border-slate-800 px-6 py-4 flex items-center justify-between shrink-0 transition-colors duration-300">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-500 p-1.5 rounded text-white">
            <Building2 size={16} />
          </div>
          <span className="font-sans font-bold text-xs tracking-tight text-slate-800 dark:text-slate-100">InsightHR</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleTheme}
            className="p-1.5 rounded bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300"
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300"
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-[#0F1219] border-b border-slate-100 dark:border-slate-800 px-6 py-4 space-y-2 shrink-0 animate-fadeIn transition-colors duration-300">
          {navItems.map(item => {
            const IconComp = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-sans font-medium transition-all ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <IconComp size={16} />
                {item.label}
              </button>
            );
          })}
        </div>
      )}

      {/* 3. MAIN WORKSPACE */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Dynamic Header Frame */}
        <header className="bg-white dark:bg-[#0B0E14] border-b border-slate-100 dark:border-slate-800 px-6 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 transition-colors duration-300">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-sans font-bold text-slate-800 dark:text-slate-100">
                {activeTab === 'overview' && 'Workforce Health & Turnover Overview'}
                {activeTab === 'demographics' && 'Demographics & Recruitment Breakdown'}
                {activeTab === 'worklife' && 'Work Conditions & Environmental Dynamics'}
                {activeTab === 'predictor' && 'Employee Attrition Risk Simulation'}
                {activeTab === 'assistant' && 'Krishma - Talent Strategy AI Partner'}
                {activeTab === 'notebook' && 'Notebook Insights & Business Findings'}
              </h2>
              {activeTab === 'predictor' && (
                <span className="bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-[10px] px-2 py-0.5 rounded font-mono font-bold border border-indigo-200/20">PREDICTIVE</span>
              )}
              {activeTab === 'assistant' && (
                <span className="bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 text-[10px] px-2 py-0.5 rounded font-mono font-bold border border-purple-200/20">CONSULTATIVE</span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Analyzing standard HR metrics for Krishma Adhikari's Employee Attrition project.
            </p>
          </div>
          <div className="text-[10px] font-mono text-slate-400 shrink-0 self-start lg:self-center">
            Dataset Source: <strong className="text-slate-600 dark:text-slate-300">IBM HR Analytics</strong>
          </div>
        </header>

        {/* 4. COHORT GLOBAL FILTERS - Sticky only for analytical sheets */}
        {['overview', 'demographics', 'worklife'].includes(activeTab) && (
          <div className="bg-white dark:bg-[#0B0E14] border-b border-slate-100 dark:border-slate-800/60 px-6 py-3 transition-colors duration-300">
            <div className="flex flex-wrap items-center justify-between gap-3">
              
              {/* Selectors */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 shrink-0">
                  Cohort Filters:
                </span>

                {/* Department */}
                <div className="space-y-0.5">
                  <select
                    value={filters.department}
                    onChange={(e) => setFilters(p => ({ ...p, department: e.target.value, jobRole: 'All' }))}
                    className="text-[11px] rounded-lg border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/40 px-2.5 py-1 text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="All">Dept: All Departments</option>
                    <option value="Sales">Dept: Sales</option>
                    <option value="Research & Development">Dept: R&D</option>
                    <option value="Human Resources">Dept: HR</option>
                  </select>
                </div>

                {/* Overtime */}
                <div className="space-y-0.5">
                  <select
                    value={filters.overTime}
                    onChange={(e) => setFilters(p => ({ ...p, overTime: e.target.value }))}
                    className="text-[11px] rounded-lg border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/40 px-2.5 py-1 text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="All">Overtime: All</option>
                    <option value="Yes">Overtime: Yes</option>
                    <option value="No">Overtime: No</option>
                  </select>
                </div>

                {/* Marital Status */}
                <div className="space-y-0.5">
                  <select
                    value={filters.maritalStatus}
                    onChange={(e) => setFilters(p => ({ ...p, maritalStatus: e.target.value }))}
                    className="text-[11px] rounded-lg border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/40 px-2.5 py-1 text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="All">Marital Status: All</option>
                    <option value="Single">Marital Status: Single</option>
                    <option value="Married">Marital Status: Married</option>
                    <option value="Divorced">Marital Status: Divorced</option>
                  </select>
                </div>

                {/* Gender */}
                <div className="space-y-0.5">
                  <select
                    value={filters.gender}
                    onChange={(e) => setFilters(p => ({ ...p, gender: e.target.value }))}
                    className="text-[11px] rounded-lg border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/40 px-2.5 py-1 text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="All">Gender: All</option>
                    <option value="Male">Gender: Male</option>
                    <option value="Female">Gender: Female</option>
                  </select>
                </div>
              </div>

              {/* Reset Action */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-mono text-slate-400">
                  Matching: <strong className="text-slate-700 dark:text-slate-200">{filteredEmployees.length}</strong> / {MOCK_EMPLOYEES.length}
                </span>
                {(filters.department !== 'All' || filters.gender !== 'All' || filters.overTime !== 'All' || filters.maritalStatus !== 'All') && (
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-1.5 text-[10px] font-mono text-rose-500 dark:text-rose-400 hover:underline px-2 py-1 bg-rose-500/10 dark:bg-rose-950/20 rounded cursor-pointer border border-rose-500/20"
                  >
                    <FilterX size={10} /> Reset
                  </button>
                )}
              </div>

            </div>
          </div>
        )}

        {/* 5. DYNAMIC TAB RENDER STAGE */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'overview' && (
            <OverviewTab 
              filteredEmployees={filteredEmployees} 
              totalEmployeesCount={MOCK_EMPLOYEES.length} 
            />
          )}
          {activeTab === 'demographics' && (
            <DemographicsTab filteredEmployees={filteredEmployees} />
          )}
          {activeTab === 'worklife' && (
            <SatisfactionTab filteredEmployees={filteredEmployees} />
          )}
          {activeTab === 'predictor' && (
            <PredictorTab />
          )}
          {activeTab === 'assistant' && (
            <ChatTab />
          )}
          {activeTab === 'notebook' && (
            <NotebookInsightsTab />
          )}
        </div>

        {/* Footer Credit */}
        <footer className="py-4 px-6 border-t border-slate-100 dark:border-slate-800/80 bg-white/40 dark:bg-[#0B0E14]/40 text-center transition-all duration-300">
          <p className="text-xs font-sans font-medium text-slate-500 dark:text-slate-400 tracking-wide">
            Made by <span className="font-semibold text-amber-500 dark:text-amber-400">Krishma</span>
          </p>
        </footer>

      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <DashboardApp />
    </ThemeProvider>
  );
}
