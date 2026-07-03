export interface Employee {
  id: string;
  age: number;
  gender: 'Male' | 'Female';
  maritalStatus: 'Single' | 'Married' | 'Divorced';
  department: 'Sales' | 'Research & Development' | 'Human Resources';
  jobRole: string;
  jobLevel: number; // 1 to 5
  educationField: string;
  monthlyIncome: number;
  percentSalaryHike: number;
  overTime: 'Yes' | 'No';
  jobSatisfaction: number; // 1 to 4 (Low, Medium, High, Very High)
  environmentSatisfaction: number; // 1 to 4
  relationshipSatisfaction: number; // 1 to 4
  workLifeBalance: number; // 1 to 4
  performanceRating: number; // 1 to 4
  yearsAtCompany: number;
  yearsSinceLastPromotion: number;
  yearsWithCurrManager: number;
  distanceFromHome: number; // miles
  numCompaniesWorked: number;
  businessTravel: 'Non-Travel' | 'Travel_Rarely' | 'Travel_Frequently';
  attrition: 'Yes' | 'No';
}

export interface DashboardFilters {
  department: string;
  gender: string;
  jobRole: string;
  overTime: string;
  maritalStatus: string;
}

export type ActiveTab = 'overview' | 'demographics' | 'worklife' | 'predictor' | 'assistant' | 'notebook';

export interface PredictorInput {
  age: number;
  gender: 'Male' | 'Female';
  maritalStatus: 'Single' | 'Married' | 'Divorced';
  department: 'Sales' | 'Research & Development' | 'Human Resources';
  jobRole: string;
  monthlyIncome: number;
  overTime: 'Yes' | 'No';
  jobSatisfaction: number;
  workLifeBalance: number;
  environmentSatisfaction: number;
  yearsAtCompany: number;
  yearsSinceLastPromotion: number;
  yearsWithCurrManager: number;
  distanceFromHome: number;
}

export interface PredictorResult {
  riskScore: number; // 0 to 100
  riskLevel: 'Low' | 'Medium' | 'High';
  factors: {
    factor: string;
    impact: 'Positive' | 'Negative' | 'Neutral';
    description: string;
  }[];
  recommendations: string[];
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}
