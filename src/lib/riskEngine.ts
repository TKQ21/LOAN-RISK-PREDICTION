/**
 * Loan Risk Prediction Engine
 * 
 * Implements a weighted scoring model based on real-world banking parameters.
 * Uses Indian banking-style credit score classification.
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
  weight: number;
}

export interface PredictionResult {
  risk: "LOW" | "HIGH";
  safeProbability: number;       // 0-100
  defaultProbability: number;    // 0-100, always 100 - safeProbability
  factors: RiskFactor[];
  summary: string;
  recommendation: string;
  /** @deprecated use safeProbability */
  probability: number;
}

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

function getCreditScoreClass(score: number): { label: string; impact: RiskFactor["impact"] } {
  if (score >= 750) return { label: "Excellent", impact: "positive" };
  if (score >= 700) return { label: "Good", impact: "positive" };
  if (score >= 650) return { label: "Average", impact: "neutral" };
  if (score >= 550) return { label: "Poor", impact: "negative" };
  return { label: "Very Poor", impact: "negative" };
}

export function predictRisk(applicant: LoanApplicant): PredictionResult {
  const factors: RiskFactor[] = [];
  let score = 0;

  // 1. Credit Score (35%) — Indian banking classification
  const creditNorm = (applicant.creditScore - 300) / 600;
  const creditWeight = (creditNorm - 0.5) * 3.5;
  score += creditWeight;
  const creditClass = getCreditScoreClass(applicant.creditScore);
  factors.push({
    factor: "Credit Score",
    impact: creditClass.impact,
    description: creditClass.label === "Excellent"
      ? `${creditClass.label} credit score (${applicant.creditScore}, ≥750). Strong repayment history indicates high reliability.`
      : creditClass.label === "Good"
        ? `${creditClass.label} credit score (${applicant.creditScore}, 700–749). Solid credit history with minor concerns.`
        : creditClass.label === "Average"
          ? `${creditClass.label} credit score (${applicant.creditScore}, 650–699). Moderate risk factors present in credit history.`
          : creditClass.label === "Poor"
            ? `${creditClass.label} credit score (${applicant.creditScore}, 550–649). Significant risk factors weaken repayment confidence.`
            : `${creditClass.label} credit score (${applicant.creditScore}, <550). Severe credit deficiencies greatly increase default probability.`,
    weight: creditWeight,
  });

  // 2. Debt-to-Income Ratio (25%)
  const totalEMI = applicant.existingEMIs + (applicant.loanAmount * 0.012);
  const dtiRatio = totalEMI / applicant.monthlyIncome;
  const dtiWeight = (0.4 - dtiRatio) * 2.5;
  score += dtiWeight;
  factors.push({
    factor: "Debt-to-Income Ratio",
    impact: dtiRatio <= 0.35 ? "positive" : dtiRatio <= 0.5 ? "neutral" : "negative",
    description: dtiRatio <= 0.35
      ? `Healthy DTI ratio (${(dtiRatio * 100).toFixed(0)}%). Sufficient income to cover all obligations comfortably.`
      : dtiRatio <= 0.5
        ? `Moderate DTI ratio (${(dtiRatio * 100).toFixed(0)}%). Income may be stretched; limited buffer for unexpected expenses.`
        : `Dangerously high DTI ratio (${(dtiRatio * 100).toFixed(0)}%). Total debt obligations exceed safe limits, indicating severe repayment strain.`,
    weight: dtiWeight,
  });

  // 3. Past Default History (20%)
  const defaultWeight = applicant.pastDefault ? -2.0 : 0.8;
  score += defaultWeight;
  factors.push({
    factor: "Default History",
    impact: applicant.pastDefault ? "negative" : "positive",
    description: applicant.pastDefault
      ? "Previous loan defaults detected. Past defaults are the strongest predictor of future default risk in banking models."
      : "No previous defaults. Clean repayment track record demonstrates financial discipline.",
    weight: defaultWeight,
  });

  // 4. Employment Stability (10%)
  const empWeight = applicant.employmentType === "salaried" ? 0.5 : -0.2;
  score += empWeight;
  factors.push({
    factor: "Employment Type",
    impact: applicant.employmentType === "salaried" ? "positive" : "neutral",
    description: applicant.employmentType === "salaried"
      ? "Salaried employment provides stable, predictable income stream with lower default probability."
      : "Self-employment income can be variable, adding uncertainty to repayment capacity.",
    weight: empWeight,
  });

  // 5. Age Factor (5%)
  const ageWeight = applicant.age >= 25 && applicant.age <= 55 ? 0.3 : -0.3;
  score += ageWeight;
  factors.push({
    factor: "Age Profile",
    impact: applicant.age >= 25 && applicant.age <= 55 ? "positive" : "neutral",
    description: applicant.age >= 25 && applicant.age <= 55
      ? `Age ${applicant.age} falls within prime earning years (25–55), indicating stable income potential.`
      : `Age ${applicant.age} is outside the typical prime earning bracket (25–55), which may affect long-term repayment.`,
    weight: ageWeight,
  });

  // 6. Loan-to-Annual-Income Ratio (5%) — CORRECTED
  const annualIncome = applicant.monthlyIncome * 12;
  const ltiRatio = applicant.loanAmount / annualIncome;
  const ltiWeight = ltiRatio <= 1.0 ? 0.4 : ltiRatio <= 3 ? 0 : ltiRatio <= 5 ? -0.3 : -0.6;
  score += ltiWeight;
  factors.push({
    factor: "Loan-to-Annual Income",
    impact: ltiRatio <= 1.0 ? "positive" : ltiRatio <= 3 ? "neutral" : "negative",
    description: ltiRatio <= 1.0
      ? `Loan amount is ${ltiRatio.toFixed(1)}x annual income (₹${annualIncome.toLocaleString()}). Well within safe lending limits.`
      : ltiRatio <= 3
        ? `Loan amount is ${ltiRatio.toFixed(1)}x annual income (₹${annualIncome.toLocaleString()}). Approaching upper threshold — requires careful assessment.`
        : `Loan amount is ${ltiRatio.toFixed(1)}x annual income (₹${annualIncome.toLocaleString()}). Exceeds safe lending ratio (>1.0x is high risk). Loan repayment capacity is severely constrained.`,
    weight: ltiWeight,
  });

  // Convert score to probability using sigmoid
  const safeProbability = Math.round(sigmoid(score) * 100);
  const defaultProbability = 100 - safeProbability;
  const risk = safeProbability >= 50 ? "LOW" : "HIGH";

  // Sort factors by absolute weight
  factors.sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight));

  // Consistent summaries — no positive statements for HIGH RISK
  const positiveFactors = factors.filter(f => f.impact === "positive").map(f => f.factor.toLowerCase());
  const negativeFactors = factors.filter(f => f.impact === "negative").map(f => f.factor.toLowerCase());

  const summary = risk === "LOW"
    ? `Based on comprehensive analysis, this applicant presents a LOW RISK profile with ${safeProbability}% safe probability. Strong repayment capacity supported by: ${positiveFactors.join(", ") || "balanced risk profile"}.`
    : `This applicant presents a HIGH RISK profile with ${defaultProbability}% default probability. Critical concerns: ${negativeFactors.join(", ") || "multiple adverse risk indicators"}. Loan repayment capacity is insufficient under current parameters.`;

  const recommendation = risk === "LOW"
    ? "Recommended Action: Proceed with loan approval under standard terms."
    : "Recommended Action: Reject application, or require collateral / guarantor before approval.";

  return { risk, safeProbability, defaultProbability, probability: safeProbability, factors, summary, recommendation };
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
