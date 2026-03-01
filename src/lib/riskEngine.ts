/**
 * Loan Risk Prediction Engine
 * 
 * Implements a weighted scoring model based on real-world banking parameters.
 * Mimics logistic regression output with probability scoring.
 */

export interface LoanApplicant {
  name: string;
  age: number;
  monthlyIncome: number;
  employmentType: "salaried" | "self-employed";
  creditScore: number;
  loanAmount: number;
  loanPurpose: string;
  existingEMIs: number;
  pastDefault: boolean;
}

export interface RiskFactor {
  factor: string;
  impact: "positive" | "negative" | "neutral";
  description: string;
  weight: number; // -1 to 1
}

export interface PredictionResult {
  risk: "LOW" | "HIGH";
  probability: number; // 0-100, percentage safe
  factors: RiskFactor[];
  summary: string;
}

// Sigmoid function to normalize scores to 0-1 range
function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

export function predictRisk(applicant: LoanApplicant): PredictionResult {
  const factors: RiskFactor[] = [];
  let score = 0;

  // 1. Credit Score (highest weight - 35%)
  const creditNorm = (applicant.creditScore - 300) / 600; // normalize 300-900 to 0-1
  const creditWeight = (creditNorm - 0.5) * 3.5;
  score += creditWeight;
  factors.push({
    factor: "Credit Score",
    impact: applicant.creditScore >= 700 ? "positive" : applicant.creditScore >= 550 ? "neutral" : "negative",
    description: applicant.creditScore >= 700
      ? `Excellent credit score (${applicant.creditScore}). Strong repayment history indicates reliability.`
      : applicant.creditScore >= 550
        ? `Fair credit score (${applicant.creditScore}). Some risk factors present in credit history.`
        : `Low credit score (${applicant.creditScore}). Poor repayment history significantly increases default risk.`,
    weight: creditWeight,
  });

  // 2. Debt-to-Income Ratio (25%)
  const totalEMI = applicant.existingEMIs + (applicant.loanAmount * 0.012); // estimated new EMI
  const dtiRatio = totalEMI / applicant.monthlyIncome;
  const dtiWeight = (0.4 - dtiRatio) * 2.5;
  score += dtiWeight;
  factors.push({
    factor: "Debt-to-Income Ratio",
    impact: dtiRatio <= 0.35 ? "positive" : dtiRatio <= 0.5 ? "neutral" : "negative",
    description: dtiRatio <= 0.35
      ? `Healthy DTI ratio (${(dtiRatio * 100).toFixed(0)}%). Sufficient income to cover obligations.`
      : dtiRatio <= 0.5
        ? `Moderate DTI ratio (${(dtiRatio * 100).toFixed(0)}%). Income may be stretched thin.`
        : `High DTI ratio (${(dtiRatio * 100).toFixed(0)}%). Total debt obligations exceed safe limits relative to income.`,
    weight: dtiWeight,
  });

  // 3. Past Default History (20%)
  const defaultWeight = applicant.pastDefault ? -2.0 : 0.8;
  score += defaultWeight;
  factors.push({
    factor: "Default History",
    impact: applicant.pastDefault ? "negative" : "positive",
    description: applicant.pastDefault
      ? "Previous loan defaults detected. This is the strongest predictor of future default risk."
      : "No previous defaults. Clean repayment track record.",
    weight: defaultWeight,
  });

  // 4. Employment Stability (10%)
  const empWeight = applicant.employmentType === "salaried" ? 0.5 : -0.2;
  score += empWeight;
  factors.push({
    factor: "Employment Type",
    impact: applicant.employmentType === "salaried" ? "positive" : "neutral",
    description: applicant.employmentType === "salaried"
      ? "Salaried employment provides stable, predictable income stream."
      : "Self-employment income can be variable, adding slight uncertainty to repayment capacity.",
    weight: empWeight,
  });

  // 5. Age Factor (5%)
  const ageWeight = applicant.age >= 25 && applicant.age <= 55 ? 0.3 : -0.3;
  score += ageWeight;
  factors.push({
    factor: "Age Profile",
    impact: applicant.age >= 25 && applicant.age <= 55 ? "positive" : "neutral",
    description: applicant.age >= 25 && applicant.age <= 55
      ? `Age ${applicant.age} falls within the prime earning years, indicating stable income potential.`
      : `Age ${applicant.age} is outside the typical prime earning bracket, which may affect long-term repayment.`,
    weight: ageWeight,
  });

  // 6. Loan-to-Income Ratio (5%)
  const ltiRatio = applicant.loanAmount / (applicant.monthlyIncome * 12);
  const ltiWeight = ltiRatio <= 3 ? 0.3 : ltiRatio <= 5 ? 0 : -0.5;
  score += ltiWeight;
  factors.push({
    factor: "Loan-to-Annual Income",
    impact: ltiRatio <= 3 ? "positive" : ltiRatio <= 5 ? "neutral" : "negative",
    description: `Loan amount is ${ltiRatio.toFixed(1)}x annual income. ${ltiRatio <= 3 ? "Well within safe lending limits." : ltiRatio <= 5 ? "Approaching upper safe limits." : "Exceeds recommended lending multiples."}`,
    weight: ltiWeight,
  });

  // Convert score to probability using sigmoid
  const probability = Math.round(sigmoid(score) * 100);
  const risk = probability >= 50 ? "LOW" : "HIGH";

  // Sort factors by absolute weight
  factors.sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight));

  const summary = risk === "LOW"
    ? `Based on comprehensive analysis, this applicant presents a LOW RISK profile with ${probability}% confidence. Key strengths include ${factors.filter(f => f.impact === "positive").map(f => f.factor.toLowerCase()).join(", ")}.`
    : `This applicant presents a HIGH RISK profile with ${100 - probability}% risk probability. Primary concerns: ${factors.filter(f => f.impact === "negative").map(f => f.factor.toLowerCase()).join(", ")}.`;

  return { risk, probability, factors, summary };
}

// Store predictions for dashboard
const STORAGE_KEY = "loan_predictions";

export interface StoredPrediction {
  id: string;
  applicant: LoanApplicant;
  result: PredictionResult;
  timestamp: number;
}

export function savePrediction(applicant: LoanApplicant, result: PredictionResult): StoredPrediction {
  const prediction: StoredPrediction = {
    id: crypto.randomUUID(),
    applicant,
    result,
    timestamp: Date.now(),
  };
  const existing = getPredictions();
  existing.push(prediction);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  return prediction;
}

export function getPredictions(): StoredPrediction[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}
