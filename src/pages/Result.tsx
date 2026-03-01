import { useParams, useNavigate } from "react-router-dom";
import { Shield, ArrowLeft, ArrowRight, CheckCircle2, XCircle, MinusCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPredictions, type StoredPrediction } from "@/lib/riskEngine";

const impactIcon = {
  positive: CheckCircle2,
  negative: XCircle,
  neutral: MinusCircle,
};

const impactColor = {
  positive: "text-risk-low",
  negative: "text-risk-high",
  neutral: "text-risk-medium",
};

const Result = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const predictions = getPredictions();
  const prediction: StoredPrediction | undefined = predictions.find((p) => p.id === id);

  if (!prediction) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-xl font-bold text-foreground mb-2">Prediction Not Found</h2>
          <Button onClick={() => navigate("/apply")}>New Assessment</Button>
        </div>
      </div>
    );
  }

  const { applicant, result } = prediction;
  const isLow = result.risk === "LOW";

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Shield className="h-5 w-5 text-accent" />
            <span className="font-display font-bold text-foreground">Risk Report</span>
          </div>
          <Button size="sm" onClick={() => navigate("/apply")} className="gap-1">
            New Assessment <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-10 max-w-3xl">
        {/* Risk Badge */}
        <div className={`rounded-xl p-8 mb-8 text-center ${isLow ? "bg-risk-low/10 risk-glow-low" : "bg-risk-high/10 risk-glow-high"}`}>
          <div className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4 text-sm font-semibold ${isLow ? "bg-risk-low text-risk-low-foreground" : "bg-risk-high text-risk-high-foreground"}`}>
            {isLow ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            {result.risk} RISK
          </div>
          <div className="font-display text-5xl font-bold text-foreground mb-2">
            {result.probability}%
          </div>
          <p className="text-muted-foreground text-sm">Confidence Score (Safe Probability)</p>
        </div>

        {/* Applicant Summary */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-display font-semibold text-foreground">Applicant Summary</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div><span className="text-muted-foreground">Name</span><p className="font-medium text-foreground">{applicant.name}</p></div>
            <div><span className="text-muted-foreground">Age</span><p className="font-medium text-foreground">{applicant.age}</p></div>
            <div><span className="text-muted-foreground">Income</span><p className="font-medium text-foreground">₹{applicant.monthlyIncome.toLocaleString()}/mo</p></div>
            <div><span className="text-muted-foreground">Credit Score</span><p className="font-medium text-foreground">{applicant.creditScore}</p></div>
            <div><span className="text-muted-foreground">Loan Amount</span><p className="font-medium text-foreground">₹{applicant.loanAmount.toLocaleString()}</p></div>
            <div><span className="text-muted-foreground">Purpose</span><p className="font-medium text-foreground">{applicant.loanPurpose}</p></div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6 shadow-card">
          <h3 className="font-display font-semibold text-foreground mb-2">Assessment Summary</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{result.summary}</p>
        </div>

        {/* Risk Factors */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-card">
          <h3 className="font-display font-semibold text-foreground mb-4">Risk Factor Breakdown</h3>
          <div className="space-y-4">
            {result.factors.map((f) => {
              const Icon = impactIcon[f.impact];
              return (
                <div key={f.factor} className="flex gap-3 p-3 rounded-md bg-muted/50">
                  <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${impactColor[f.impact]}`} />
                  <div>
                    <h4 className="font-medium text-sm text-foreground">{f.factor}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{f.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
