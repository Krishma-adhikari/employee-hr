import { Employee } from '../types';

// Deterministic seed-based random to keep metrics identical on every render
function createRandom(seed: number) {
  let s = seed;
  return function() {
    const x = Math.sin(s++) * 10000;
    return x - Math.floor(x);
  };
}

const jobRolesByDept = {
  'Sales': [
    'Sales Executive',
    'Sales Representative',
    'Manager'
  ],
  'Research & Development': [
    'Research Scientist',
    'Laboratory Technician',
    'Manufacturing Director',
    'Healthcare Representative',
    'Research Director',
    'Manager'
  ],
  'Human Resources': [
    'Human Resources',
    'Manager'
  ]
};

const eduFields = [
  'Life Sciences',
  'Medical',
  'Marketing',
  'Technical Degree',
  'Human Resources',
  'Other'
];

function generateMockEmployees(): Employee[] {
  const employees: Employee[] = [];
  const random = createRandom(12345); // Static seed

  const depts = ['Sales', 'Research & Development', 'Human Resources'] as const;
  const genders = ['Male', 'Female'] as const;
  const maritalStatuses = ['Single', 'Married', 'Divorced'] as const;
  const travelModes = ['Non-Travel', 'Travel_Rarely', 'Travel_Frequently'] as const;

  const firstNamesMale = ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Kenneth', 'Joshua'];
  const firstNamesFemale = ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen', 'Lisa', 'Nancy', 'Sandra', 'Betty', 'Ashley', 'Emily', 'Kimberly', 'Donna', 'Michelle', 'Carol'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

  const tempEmployees: (Omit<Employee, 'attrition'> & { overtimePropensity: number; attritionPropensity: number })[] = [];

  for (let i = 1; i <= 1470; i++) {
    // Determine Department
    // Make sure we have a reasonable distribution of departments
    // IBM HR dataset has around 65% R&D, 30% Sales, 5% HR
    let dept: 'Sales' | 'Research & Development' | 'Human Resources' = 'Research & Development';
    const deptRoll = random();
    if (deptRoll < 0.30) {
      dept = 'Sales';
    } else if (deptRoll < 0.35) {
      dept = 'Human Resources';
    }

    const roles = jobRolesByDept[dept];
    let jobRole = roles[Math.floor(random() * roles.length)];
    
    // Ensure only one manager in Sales/HR, etc., or keep it proportional
    if (jobRole === 'Manager' && random() > 0.15) {
      jobRole = roles[0]; // fallback to standard role
    }

    const gender = genders[Math.floor(random() * genders.length)];
    const firstName = gender === 'Male' 
      ? firstNamesMale[Math.floor(random() * firstNamesMale.length)] 
      : firstNamesFemale[Math.floor(random() * firstNamesFemale.length)];
    const lastName = lastNames[Math.floor(random() * lastNames.length)];

    const maritalStatus = maritalStatuses[Math.floor(random() * maritalStatuses.length)];
    const businessTravel = travelModes[random() < 0.7 ? 1 : (random() < 0.6 ? 2 : 0)];
    
    // Age distribution: 18 to 60
    let age = 18 + Math.floor(random() * 42);
    if (random() > 0.3) {
      age = 26 + Math.floor(random() * 15);
    }

    const educationField = eduFields[Math.floor(random() * eduFields.length)];

    // Satisfactions: 1 to 4
    const jobSatisfaction = 1 + Math.floor(random() * 4);
    const environmentSatisfaction = 1 + Math.floor(random() * 4);
    const relationshipSatisfaction = 1 + Math.floor(random() * 4);
    const workLifeBalance = 1 + Math.floor(random() * 4);
    const performanceRating = random() < 0.15 ? 4 : 3;

    // Years at company depends on age
    const maxTenure = Math.min(age - 18, 20);
    const yearsAtCompany = Math.max(0, Math.floor(random() * maxTenure));
    const yearsSinceLastPromotion = Math.max(0, Math.min(yearsAtCompany, Math.floor(random() * 8)));
    const yearsWithCurrManager = Math.max(0, Math.min(yearsAtCompany, Math.floor(random() * 6)));

    const numCompaniesWorked = Math.floor(random() * 8);
    const distanceFromHome = 1 + Math.floor(random() * 29);

    // Job Level based on tenure & role
    let jobLevel = 1;
    if (jobRole === 'Manager' || jobRole === 'Research Director') {
      jobLevel = 4 + Math.floor(random() * 2); // 4 or 5
    } else if (yearsAtCompany > 8) {
      jobLevel = 3;
    } else if (yearsAtCompany > 3) {
      jobLevel = 2;
    }

    // Monthly income: JobLevel is the main driver
    let monthlyIncome = 2000 + (jobLevel - 1) * 3500 + Math.floor(random() * 2000);
    if (jobRole === 'Manager' || jobRole === 'Research Director') {
      monthlyIncome = 12000 + Math.floor(random() * 7000);
    } else if (jobRole === 'Sales Representative') {
      monthlyIncome = 2200 + Math.floor(random() * 1200);
    }
    
    const percentSalaryHike = 11 + Math.floor(random() * 15);

    // Overtime propensity
    let overtimePropensity = random() * 10;
    if (dept === 'Sales') overtimePropensity += 2.0;
    if (jobRole === 'Sales Representative' || jobRole === 'Laboratory Technician') overtimePropensity += 1.5;

    // Attrition propensity
    let attritionPropensity = 0;
    if (jobSatisfaction === 1) attritionPropensity += 2.0;
    if (jobSatisfaction === 2) attritionPropensity += 1.0;
    if (environmentSatisfaction === 1) attritionPropensity += 1.5;
    if (workLifeBalance === 1) attritionPropensity += 2.0;
    if (maritalStatus === 'Single') attritionPropensity += 3.0;
    
    if (dept === 'Sales') attritionPropensity += 2.5;
    if (dept === 'Human Resources') attritionPropensity += 1.5;
    
    if (jobRole === 'Sales Representative') attritionPropensity += 4.0;
    if (jobRole === 'Laboratory Technician') attritionPropensity += 2.5;
    if (jobRole === 'Sales Executive') attritionPropensity += 1.5;
    
    if (age < 25) attritionPropensity += 4.0;
    else if (age < 30) attritionPropensity += 2.0;
    
    if (monthlyIncome < 3000) attritionPropensity += 4.0;
    else if (monthlyIncome < 5000) attritionPropensity += 2.0;
    
    if (yearsAtCompany < 2) attritionPropensity += 3.0;
    else if (yearsAtCompany < 5) attritionPropensity += 1.5;
    
    if (distanceFromHome > 15) attritionPropensity += 1.0;
    if (relationshipSatisfaction === 1) attritionPropensity += 0.5;
    
    // Add deterministic variance
    attritionPropensity += random() * 3.0;

    tempEmployees.push({
      id: `EMP-${1000 + i}`,
      age,
      gender,
      maritalStatus,
      department: dept,
      jobRole,
      jobLevel,
      educationField,
      monthlyIncome,
      percentSalaryHike,
      overTime: 'No', // Will be set in next step
      jobSatisfaction,
      environmentSatisfaction,
      relationshipSatisfaction,
      workLifeBalance,
      performanceRating,
      yearsAtCompany,
      yearsSinceLastPromotion,
      yearsWithCurrManager,
      distanceFromHome,
      numCompaniesWorked,
      businessTravel,
      overtimePropensity,
      attritionPropensity
    });
  }

  // Assign exactly 416 Overtime = 'Yes' based on overtimePropensity
  tempEmployees.sort((a, b) => b.overtimePropensity - a.overtimePropensity);
  for (let i = 0; i < 416; i++) {
    tempEmployees[i].overTime = 'Yes';
  }
  // The rest (1054) remain 'No'

  // Split into Overtime Yes (Pool A) and Overtime No (Pool B)
  const poolA = tempEmployees.filter(e => e.overTime === 'Yes');
  const poolB = tempEmployees.filter(e => e.overTime === 'No');

  // Sort Pool A by attritionPropensity descending
  // Top 127 get attrition = 'Yes', the rest (289) get 'No'
  poolA.sort((a, b) => b.attritionPropensity - a.attritionPropensity);
  const poolAWithAttrition: Employee[] = poolA.map((emp, idx) => {
    const { overtimePropensity, attritionPropensity, ...rest } = emp;
    return {
      ...rest,
      attrition: idx < 127 ? 'Yes' : 'No'
    };
  });

  // Sort Pool B by attritionPropensity descending
  // Top 110 get attrition = 'Yes', the rest (944) get 'No'
  poolB.sort((a, b) => b.attritionPropensity - a.attritionPropensity);
  const poolBWithAttrition: Employee[] = poolB.map((emp, idx) => {
    const { overtimePropensity, attritionPropensity, ...rest } = emp;
    return {
      ...rest,
      attrition: idx < 110 ? 'Yes' : 'No'
    };
  });

  // Merge them back and sort by ID to restore natural order
  const finalEmployees = [...poolAWithAttrition, ...poolBWithAttrition];
  finalEmployees.sort((a, b) => a.id.localeCompare(b.id));

  return finalEmployees;
}

export const MOCK_EMPLOYEES = generateMockEmployees();

// Detailed aggregate stats for the AI context
export const AGGREGATE_STATS = {
  totalEmployees: MOCK_EMPLOYEES.length,
  attritionCount: MOCK_EMPLOYEES.filter(e => e.attrition === 'Yes').length,
  attritionRate: `${((MOCK_EMPLOYEES.filter(e => e.attrition === 'Yes').length / MOCK_EMPLOYEES.length) * 100).toFixed(1)}%`,
  overtimeAttritionRate: `${((MOCK_EMPLOYEES.filter(e => e.overTime === 'Yes' && e.attrition === 'Yes').length / MOCK_EMPLOYEES.filter(e => e.overTime === 'Yes').length) * 100).toFixed(1)}%`,
  noOvertimeAttritionRate: `${((MOCK_EMPLOYEES.filter(e => e.overTime === 'No' && e.attrition === 'Yes').length / MOCK_EMPLOYEES.filter(e => e.overTime === 'No').length) * 100).toFixed(1)}%`,
  departmentStats: {
    sales: {
      total: MOCK_EMPLOYEES.filter(e => e.department === 'Sales').length,
      attrition: MOCK_EMPLOYEES.filter(e => e.department === 'Sales' && e.attrition === 'Yes').length,
      rate: `${((MOCK_EMPLOYEES.filter(e => e.department === 'Sales' && e.attrition === 'Yes').length / MOCK_EMPLOYEES.filter(e => e.department === 'Sales').length) * 100).toFixed(1)}%`
    },
    rd: {
      total: MOCK_EMPLOYEES.filter(e => e.department === 'Research & Development').length,
      attrition: MOCK_EMPLOYEES.filter(e => e.department === 'Research & Development' && e.attrition === 'Yes').length,
      rate: `${((MOCK_EMPLOYEES.filter(e => e.department === 'Research & Development' && e.attrition === 'Yes').length / MOCK_EMPLOYEES.filter(e => e.department === 'Research & Development').length) * 100).toFixed(1)}%`
    },
    hr: {
      total: MOCK_EMPLOYEES.filter(e => e.department === 'Human Resources').length,
      attrition: MOCK_EMPLOYEES.filter(e => e.department === 'Human Resources' && e.attrition === 'Yes').length,
      rate: `${((MOCK_EMPLOYEES.filter(e => e.department === 'Human Resources' && e.attrition === 'Yes').length / MOCK_EMPLOYEES.filter(e => e.department === 'Human Resources').length) * 100).toFixed(1)}%`
    }
  },
  satisfactionStats: {
    lowSatisfactionAttritionRate: `${((MOCK_EMPLOYEES.filter(e => e.jobSatisfaction === 1 && e.attrition === 'Yes').length / MOCK_EMPLOYEES.filter(e => e.jobSatisfaction === 1).length) * 100).toFixed(1)}%`,
    highSatisfactionAttritionRate: `${((MOCK_EMPLOYEES.filter(e => e.jobSatisfaction === 4 && e.attrition === 'Yes').length / MOCK_EMPLOYEES.filter(e => e.jobSatisfaction === 4).length) * 100).toFixed(1)}%`
  }
};
