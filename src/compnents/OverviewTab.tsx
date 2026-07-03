import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area 
} from 'recharts';
import { Employee } from '../types';
import { Users, UserX, Percent, DollarSign, Clock, AlertTriangle } from 'lucide-react';

interface OverviewTabProps {
  filteredEmployees: Employee[];
  totalEmployeesCount: number;
}

export default function OverviewTab({ filteredEmployees, totalEmployeesCount }: OverviewTabProps) {
  // Calculations
  const total = filteredEmployees.length;
  const leftCount = filteredEmployees.filter(e => e.attrition === 'Yes').length;
  const activeCount = total - leftCount;
  const attritionRate = total > 0 ? (leftCount / total) * 100 : 0;
  
  const avgIncome = total > 0 
    ? filteredEmployees.reduce((acc, curr) => acc + curr.monthlyIncome, 0) / total 
    : 0;
  const avgTenure = total > 0 
    ? filteredEmployees.reduce((acc, curr) => acc + curr.yearsAtCompany, 0) / total 
    : 0;

  // 1. Department Breakdown Chart Data
  const depts = ['Sales', 'Research & Development', 'Human Resources'] as const;
  const deptData = depts.map(dept => {
    const deptEmployees = filteredEmployees.filter(e => e.department === dept);
    const deptTotal = deptEmployees.length;
    const deptLeft = deptEmployees.filter(e => e.attrition === 'Yes').length;
    const deptActive = deptTotal - deptLeft;
    const rate = deptTotal > 0 ? (deptLeft / deptTotal) * 100 : 0;

    return {
      name: dept === 'Research & Development' ? 'R&D' : dept,
      Active: deptActive,
      Departed: deptLeft,
      'Attrition Rate (%)': Math.round(rate * 10) / 10
    };
  });

  // 2. Overtime vs Attrition Chart Data
  const otYes = filteredEmployees.filter(e => e.overTime === 'Yes');
  const otNo = filteredEmployees.filter(e => e.overTime === 'No');
  
  const otYesLeft = otYes.filter(e => e.attrition === 'Yes').length;
  const otYesActive = otYes.length - otYesLeft;
  
  const otNoLeft = otNo.filter(e => e.attrition === 'Yes').length;
  const otNoActive = otNo.length - otNoLeft;

  const overtimeData = [
    { name: 'Overtime (Active)', value: otYesActive, color: '#6366f1' },
    { name: 'Overtime (Departed)', value: otYesLeft, color: '#f43f5e' },
    { name: 'Regular (Active)', value: otNoActive, color: '#10b981' },
    { name: 'Regular (Departed)', value: otNoLeft, color: '#fda4af' }
  ].filter(d => d.value > 0);

  // 3. Attrition by Job Role (Attrition Rate per Role)
  const rolesMap: { [key: string]: { total: number; left: number } } = {};
  filteredEmployees.forEach(e => {
    if (!rolesMap[e.jobRole]) {
      rolesMap[e.jobRole] = { total: 0, left: 0 };
    }
    rolesMap[e.jobRole].total++;
    if (e.attrition === 'Yes') {
      rolesMap[e.jobRole].left++;
    }
  });

  const jobRoleData = Object.entries(rolesMap).map(([role, stats]) => ({
    role,
    'Attrition Rate (%)': Math.round((stats.left / stats.total) * 1000) / 10,
    Total: stats.total,
    Left: stats.left
  })).sort((a, b) => b['Attrition Rate (%)'] - a['Attrition Rate (%)']);

  // 4. Age and Attrition Distribution (Area Chart)
  // Group ages in 5-year buckets
  const ageBuckets: { [key: string]: { active: number; left: number } } = {};
  for (let age = 20; age <= 60; age += 5) {
    const label = `${age}-${age + 4}`;
    ageBuckets[label] = { active: 0, left: 0 };
  }

  filteredEmployees.forEach(e => {
    const bucketStart = Math.floor(e.age / 5) * 5;
    const label = `${bucketStart}-${bucketStart + 4}`;
    if (ageBuckets[label]) {
      if (e.attrition === 'Yes') ageBuckets[label].left++;
      else ageBuckets[label].active++;
    }
  });

  const ageData = Object.entries(ageBuckets).map(([range, stats]) => ({
    range,
    Active: stats.active,
    Departed: stats.left,
    Total: stats.active + stats.left
  }));

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div id="kpi-headcount" className="bg-white dark:bg-[#0F1219]/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-800/80 shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Headcount</p>
              <h3 className="text-3xl font-sans font-bold text-slate-900 dark:text-slate-100 mt-1">{total}</h3>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-950/40 p-3 rounded-lg text-indigo-500">
              <Users size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300 mr-1">{activeCount}</span> active staff rostered
          </div>
        </div>

        {/* Card 2 */}
        <div id="kpi-attrition" className="bg-white dark:bg-[#0F1219]/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-800/80 shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">Attrition Rate</p>
              <h3 className="text-3xl font-sans font-bold text-slate-900 dark:text-slate-100 mt-1">{attritionRate.toFixed(1)}%</h3>
            </div>
            <div className={`p-3 rounded-lg ${attritionRate > 15 ? 'bg-red-50 dark:bg-red-950/40 text-red-500' : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500'}`}>
              <Percent size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-slate-500 dark:text-slate-400">
            <span className={`font-semibold mr-1 ${attritionRate > 15 ? 'text-red-600' : 'text-emerald-600'}`}>
              {leftCount}
            </span> total employees departed
          </div>
        </div>

        {/* Card 3 */}
        <div id="kpi-income" className="bg-white dark:bg-[#0F1219]/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-800/80 shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">Average Monthly Income</p>
              <h3 className="text-3xl font-sans font-bold text-slate-900 dark:text-slate-100 mt-1">
                ${avgIncome.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </h3>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/40 p-3 rounded-lg text-amber-500">
              <DollarSign size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-slate-500 dark:text-slate-400">
            Across filtered cohort of employees
          </div>
        </div>

        {/* Card 4 */}
        <div id="kpi-tenure" className="bg-white dark:bg-[#0F1219]/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-800/80 shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">Average Tenure</p>
              <h3 className="text-3xl font-sans font-bold text-slate-900 dark:text-slate-100 mt-1">{avgTenure.toFixed(1)} yrs</h3>
            </div>
            <div className="bg-purple-50 dark:bg-purple-950/40 p-3 rounded-lg text-purple-500">
              <Clock size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-slate-500 dark:text-slate-400">
            Average years at the organization
          </div>
        </div>
      </div>

      {/* Critical Attrition Driver Callout */}
      {filteredEmployees.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="text-amber-500 mt-0.5 shrink-0" size={18} />
          <div>
            <h4 className="text-sm font-medium text-amber-900 dark:text-amber-300">Primary Core Metric Breakdown</h4>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-1 leading-relaxed">
              Based on the currently filtered roster, employees working <strong>Overtime</strong> show an attrition rate of{' '}
              <span className="font-semibold text-red-500">
                {((filteredEmployees.filter(e => e.overTime === 'Yes' && e.attrition === 'Yes').length / Math.max(1, filteredEmployees.filter(e => e.overTime === 'Yes').length)) * 100).toFixed(1)}%
              </span>
              , compared to just{' '}
              <span className="font-semibold text-emerald-500">
                {((filteredEmployees.filter(e => e.overTime === 'No' && e.attrition === 'Yes').length / Math.max(1, filteredEmployees.filter(e => e.overTime === 'No').length)) * 100).toFixed(1)}%
              </span>{' '}
              for those who work normal hours. Addressing overtime burn-out represents the single most significant retention lever.
            </p>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Department Attrition */}
        <div id="chart-department" className="bg-white dark:bg-[#0F1219]/50 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/80 shadow-sm transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-sans font-semibold text-slate-800 dark:text-slate-200">Department Headcount & Attrition Rate</h4>
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">Active vs Departed</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800/60" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 18, 25, 0.95)', 
                    borderColor: '#334155', 
                    borderRadius: '12px', 
                    color: '#f8fafc' 
                  }} 
                />
                <Legend iconSize={10} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="Active" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="Departed" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Overtime vs Attrition */}
        <div id="chart-overtime" className="bg-white dark:bg-[#0F1219]/50 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/80 shadow-sm transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-sans font-semibold text-slate-800 dark:text-slate-200">Overtime Distribution</h4>
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">Roster segments</span>
          </div>
          <div className="h-72 flex items-center justify-center">
            {overtimeData.length > 0 ? (
              <div className="w-full h-full flex flex-col sm:flex-row items-center justify-around gap-4">
                <div className="w-1/2 h-full min-h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={overtimeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {overtimeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  {overtimeData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-xs text-slate-600 dark:text-slate-300">
                        {item.name}: <strong className="text-slate-900 dark:text-slate-100">{item.value}</strong>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <span className="text-xs text-slate-400">No data available for filters</span>
            )}
          </div>
        </div>

        {/* Chart 3: Age & Attrition Profile */}
        <div id="chart-age" className="bg-white dark:bg-[#0F1219]/50 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/80 shadow-sm transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-sans font-semibold text-slate-800 dark:text-slate-200">Staff Age Range Distributions</h4>
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">Active vs Departed</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLeft" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800/60" />
                <XAxis dataKey="range" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 18, 25, 0.95)', 
                    borderColor: '#334155', 
                    borderRadius: '12px', 
                    color: '#f8fafc' 
                  }} 
                />
                <Legend iconSize={10} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="Active" stroke="#6366f1" fillOpacity={1} fill="url(#colorActive)" strokeWidth={2} />
                <Area type="monotone" dataKey="Departed" stroke="#f43f5e" fillOpacity={1} fill="url(#colorLeft)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Attrition Rate by Job Role */}
        <div id="chart-jobrole" className="bg-white dark:bg-[#0F1219]/50 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/80 shadow-sm transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-sans font-semibold text-slate-800 dark:text-slate-200">Attrition Rate by Job Role</h4>
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">Departures percentage</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={jobRoleData.slice(0, 5)}
                margin={{ top: 10, right: 10, left: 35, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" className="dark:stroke-slate-800/60" />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis dataKey="role" type="category" stroke="#94a3b8" fontSize={10} tickLine={false} width={130} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 18, 25, 0.95)', 
                    borderColor: '#334155', 
                    borderRadius: '12px', 
                    color: '#f8fafc' 
                  }} 
                />
                <Bar dataKey="Attrition Rate (%)" fill="#a855f7" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
