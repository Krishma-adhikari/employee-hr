import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { Employee } from '../types';
import { Smile, Award, Activity, HeartCrack } from 'lucide-react';

interface SatisfactionTabProps {
  filteredEmployees: Employee[];
}

export default function SatisfactionTab({ filteredEmployees }: SatisfactionTabProps) {
  const satisfactionLabels = ['Low (1)', 'Medium (2)', 'High (3)', 'Very High (4)'];

  // 1. Job Satisfaction Data
  const jobSatData = [1, 2, 3, 4].map((rating, idx) => {
    const cohort = filteredEmployees.filter(e => e.jobSatisfaction === rating);
    const total = cohort.length;
    const left = cohort.filter(e => e.attrition === 'Yes').length;
    const active = total - left;
    return {
      rating: satisfactionLabels[idx],
      Active: active,
      Departed: left,
      rate: total > 0 ? (left / total) * 100 : 0
    };
  });

  // 2. Work Life Balance Data
  const workLifeData = [1, 2, 3, 4].map((rating, idx) => {
    const cohort = filteredEmployees.filter(e => e.workLifeBalance === rating);
    const total = cohort.length;
    const left = cohort.filter(e => e.attrition === 'Yes').length;
    const active = total - left;
    return {
      rating: satisfactionLabels[idx],
      Active: active,
      Departed: left,
      rate: total > 0 ? (left / total) * 100 : 0
    };
  });

  // 3. Environment Satisfaction Data
  const envSatData = [1, 2, 3, 4].map((rating, idx) => {
    const cohort = filteredEmployees.filter(e => e.environmentSatisfaction === rating);
    const total = cohort.length;
    const left = cohort.filter(e => e.attrition === 'Yes').length;
    const active = total - left;
    return {
      rating: satisfactionLabels[idx],
      Active: active,
      Departed: left,
      rate: total > 0 ? (left / total) * 100 : 0
    };
  });

  // 4. Salary Hike Impact
  const hikeBuckets = [
    { name: '11-14% (Low)', min: 11, max: 14 },
    { name: '15-19% (Moderate)', min: 15, max: 19 },
    { name: '20%+ (High)', min: 20, max: 100 }
  ];

  const hikeData = hikeBuckets.map(bucket => {
    const cohort = filteredEmployees.filter(e => e.percentSalaryHike >= bucket.min && e.percentSalaryHike <= bucket.max);
    const total = cohort.length;
    const left = cohort.filter(e => e.attrition === 'Yes').length;
    const active = total - left;
    return {
      name: bucket.name,
      Active: active,
      Departed: left,
      rate: total > 0 ? (left / total) * 100 : 0
    };
  });

  // Calculations for cards
  const lowJobSatRate = jobSatData[0].rate;
  const lowWorkLifeRate = workLifeData[0].rate;
  const lowSalaryHikeRate = hikeData[0].rate;

  return (
    <div className="space-y-6">
      {/* Satisfaction Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1 */}
        <div className="bg-white dark:bg-[#0F1219]/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-start gap-4">
          <div className="bg-rose-50 dark:bg-rose-950/30 p-3 rounded-lg text-rose-500 shrink-0 border border-rose-100/10">
            <HeartCrack size={20} />
          </div>
          <div>
            <h4 className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">Low Job Satisfaction Attrition</h4>
            <p className="text-2xl font-sans font-bold text-slate-800 dark:text-slate-100 mt-1">
              {lowJobSatRate.toFixed(1)}%
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Departures among personnel rating their Job Satisfaction as Low (1).
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-[#0F1219]/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-start gap-4">
          <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg text-amber-500 shrink-0 border border-amber-100/10">
            <Smile size={20} />
          </div>
          <div>
            <h4 className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">Low Work-Life Balance Attrition</h4>
            <p className="text-2xl font-sans font-bold text-slate-800 dark:text-slate-100 mt-1">
              {lowWorkLifeRate.toFixed(1)}%
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Turnover rate among staff indicating poor balance (1).
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-[#0F1219]/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-start gap-4">
          <div className="bg-indigo-50 dark:bg-indigo-950/30 p-3 rounded-lg text-indigo-500 shrink-0 border border-indigo-100/10">
            <Award size={20} />
          </div>
          <div>
            <h4 className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">Low Salary Hike Attrition</h4>
            <p className="text-2xl font-sans font-bold text-slate-800 dark:text-slate-100 mt-1">
              {lowSalaryHikeRate.toFixed(1)}%
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Turnover for employees receiving minor (11-14%) hikes.
            </p>
          </div>
        </div>
      </div>

      {/* Satisfaction Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Job Satisfaction vs Attrition */}
        <div className="bg-white dark:bg-[#0F1219]/50 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/80 shadow-sm transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-sans font-semibold text-slate-800 dark:text-slate-200">Job Satisfaction Impact</h4>
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">Active vs Departed</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={jobSatData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800/60" />
                <XAxis dataKey="rating" stroke="#94a3b8" fontSize={11} tickLine={false} />
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

        {/* Chart 2: Work-Life Balance vs Attrition */}
        <div className="bg-white dark:bg-[#0F1219]/50 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/80 shadow-sm transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-sans font-semibold text-slate-800 dark:text-slate-200">Work-Life Balance Impact</h4>
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">Active vs Departed</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workLifeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800/60" />
                <XAxis dataKey="rating" stroke="#94a3b8" fontSize={11} tickLine={false} />
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

        {/* Chart 3: Environment Comfort vs Attrition */}
        <div className="bg-white dark:bg-[#0F1219]/50 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/80 shadow-sm transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-sans font-semibold text-slate-800 dark:text-slate-200">Environment Comfort Impact</h4>
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">Active vs Departed</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={envSatData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800/60" />
                <XAxis dataKey="rating" stroke="#94a3b8" fontSize={11} tickLine={false} />
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
                <Bar dataKey="Active" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="Departed" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Salary Hike Impact */}
        <div className="bg-white dark:bg-[#0F1219]/50 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/80 shadow-sm transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-sans font-semibold text-slate-800 dark:text-slate-200">Salary Hike Correlation</h4>
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">Active vs Departed</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hikeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                <Bar dataKey="Active" fill="#a855f7" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="Departed" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
