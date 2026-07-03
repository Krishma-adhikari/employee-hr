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
  LineChart, 
  Line 
} from 'recharts';
import { Employee } from '../types';
import { Award, Briefcase, MapPin, Heart } from 'lucide-react';

interface DemographicsTabProps {
  filteredEmployees: Employee[];
}

export default function DemographicsTab({ filteredEmployees }: DemographicsTabProps) {
  // 1. Age Ranges Attrition
  const ageRanges = [
    { name: 'Under 25', min: 18, max: 24 },
    { name: '25-34', min: 25, max: 34 },
    { name: '35-44', min: 35, max: 44 },
    { name: '45-54', min: 45, max: 54 },
    { name: '55+', min: 55, max: 100 }
  ];

  const ageRangeData = ageRanges.map(range => {
    const cohort = filteredEmployees.filter(e => e.age >= range.min && e.age <= range.max);
    const total = cohort.length;
    const left = cohort.filter(e => e.attrition === 'Yes').length;
    const active = total - left;
    return {
      name: range.name,
      Active: active,
      Departed: left,
      rate: total > 0 ? (left / total) * 100 : 0
    };
  });

  // 2. Education Field Attrition Rate
  const eduFieldsMap: { [key: string]: { total: number; left: number } } = {};
  filteredEmployees.forEach(e => {
    if (!eduFieldsMap[e.educationField]) {
      eduFieldsMap[e.educationField] = { total: 0, left: 0 };
    }
    eduFieldsMap[e.educationField].total++;
    if (e.attrition === 'Yes') {
      eduFieldsMap[e.educationField].left++;
    }
  });

  const eduFieldData = Object.entries(eduFieldsMap).map(([field, stats]) => ({
    field,
    'Attrition Rate (%)': Math.round((stats.left / stats.total) * 1000) / 10,
    Total: stats.total,
    Left: stats.left
  })).sort((a, b) => b['Attrition Rate (%)'] - a['Attrition Rate (%)']);

  // 3. Marital Status Attrition
  const maritalTypes = ['Single', 'Married', 'Divorced'] as const;
  const maritalData = maritalTypes.map(status => {
    const cohort = filteredEmployees.filter(e => e.maritalStatus === status);
    const total = cohort.length;
    const left = cohort.filter(e => e.attrition === 'Yes').length;
    const active = total - left;
    return {
      status,
      Active: active,
      Departed: left,
      rate: total > 0 ? (left / total) * 100 : 0
    };
  });

  // 4. Distance From Home Attrition Rate
  const distanceGroups = [
    { name: 'Near (1-5 mi)', min: 1, max: 5 },
    { name: 'Moderate (6-15 mi)', min: 6, max: 15 },
    { name: 'Far (16+ mi)', min: 16, max: 100 }
  ];

  const distanceData = distanceGroups.map(group => {
    const cohort = filteredEmployees.filter(e => e.distanceFromHome >= group.min && e.distanceFromHome <= group.max);
    const total = cohort.length;
    const left = cohort.filter(e => e.attrition === 'Yes').length;
    const active = total - left;
    return {
      name: group.name,
      Active: active,
      Departed: left,
      'Attrition Rate (%)': total > 0 ? Math.round((left / total) * 1000) / 10 : 0
    };
  });

  // Insights calculations
  const highestAgeAttrition = [...ageRangeData].sort((a, b) => b.rate - a.rate)[0];
  const highestEduAttrition = eduFieldData[0];
  const highestMaritalAttrition = [...maritalData].sort((a, b) => b.rate - a.rate)[0];

  return (
    <div className="space-y-6">
      {/* Demographic Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Insight 1 */}
        <div className="bg-white dark:bg-[#0F1219]/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-start gap-4">
          <div className="bg-rose-50 dark:bg-rose-950/30 p-3 rounded-lg text-rose-500 shrink-0 border border-rose-100/10">
            <Heart size={20} />
          </div>
          <div>
            <h4 className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">Marital Status Driver</h4>
            {highestMaritalAttrition ? (
              <>
                <p className="text-lg font-sans font-bold text-slate-800 dark:text-slate-100 mt-1">
                  {highestMaritalAttrition.status} Cohort
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Leads attrition with a <strong>{highestMaritalAttrition.rate.toFixed(1)}%</strong> turnover rate. Single employees exhibit substantially higher departure rates globally.
                </p>
              </>
            ) : (
              <p className="text-xs text-slate-400 mt-1">No demographic data available.</p>
            )}
          </div>
        </div>

        {/* Insight 2 */}
        <div className="bg-white dark:bg-[#0F1219]/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-start gap-4">
          <div className="bg-indigo-50 dark:bg-indigo-950/30 p-3 rounded-lg text-indigo-500 shrink-0 border border-indigo-100/10">
            <Award size={20} />
          </div>
          <div>
            <h4 className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">Education Field Peak</h4>
            {highestEduAttrition ? (
              <>
                <p className="text-lg font-sans font-bold text-slate-800 dark:text-slate-100 mt-1">
                  {highestEduAttrition.field}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Shows an attrition rate of <strong>{highestEduAttrition['Attrition Rate (%)']}%</strong>. Recruitments from this sector experience faster cycles.
                </p>
              </>
            ) : (
              <p className="text-xs text-slate-400 mt-1">No demographic data available.</p>
            )}
          </div>
        </div>

        {/* Insight 3 */}
        <div className="bg-white dark:bg-[#0F1219]/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-start gap-4">
          <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg text-amber-500 shrink-0 border border-amber-100/10">
            <Briefcase size={20} />
          </div>
          <div>
            <h4 className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">Vulnerable Age Group</h4>
            {highestAgeAttrition ? (
              <>
                <p className="text-lg font-sans font-bold text-slate-800 dark:text-slate-100 mt-1">
                  {highestAgeAttrition.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Turnover in this bracket is <strong>{highestAgeAttrition.rate.toFixed(1)}%</strong>. Early-career staff require stronger integration and mentorship programs.
                </p>
              </>
            ) : (
              <p className="text-xs text-slate-400 mt-1">No demographic data available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Demographic Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Age Range Attrition */}
        <div className="bg-white dark:bg-[#0F1219]/50 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/80 shadow-sm transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-sans font-semibold text-slate-800 dark:text-slate-200">Attrition by Age Bracket</h4>
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">Active vs Departed</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageRangeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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

        {/* Chart 2: Education Field Attrition */}
        <div className="bg-white dark:bg-[#0F1219]/50 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/80 shadow-sm transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-sans font-semibold text-slate-800 dark:text-slate-200">Education Field Attrition Rates</h4>
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">Relative Rate %</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eduFieldData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800/60" />
                <XAxis dataKey="field" stroke="#94a3b8" fontSize={10} tickLine={false} interval={0} tickFormatter={(v) => v.length > 10 ? `${v.substring(0,8)}...` : v} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 18, 25, 0.95)', 
                    borderColor: '#334155', 
                    borderRadius: '12px', 
                    color: '#f8fafc' 
                  }} 
                />
                <Bar dataKey="Attrition Rate (%)" fill="#a855f7" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Marital Status */}
        <div className="bg-white dark:bg-[#0F1219]/50 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/80 shadow-sm transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-sans font-semibold text-slate-800 dark:text-slate-200">Marital Status Breakdown</h4>
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">Active vs Departed</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={maritalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800/60" />
                <XAxis dataKey="status" stroke="#94a3b8" fontSize={11} tickLine={false} />
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
                <Bar dataKey="Active" fill="#10b981" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="Departed" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Distance From Home */}
        <div className="bg-white dark:bg-[#0F1219]/50 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/80 shadow-sm transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-sans font-semibold text-slate-800 dark:text-slate-200">Commute Distance Impact</h4>
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">Attrition Rate vs Distance</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={distanceData} margin={{ top: 15, right: 15, left: -20, bottom: 5 }}>
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
                <Line type="monotone" dataKey="Attrition Rate (%)" stroke="#f59e0b" strokeWidth={3} activeDot={{ r: 6 }} dot={{ strokeWidth: 2, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
