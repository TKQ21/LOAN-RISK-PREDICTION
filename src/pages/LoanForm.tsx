import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { predictRisk, savePrediction, type LoanApplicant } from "@/lib/riskEngine";
import { toast } from "sonner";

const loanPurposes = ["Home Purchase", "Vehicle Loan", "Education", "Business Expansion", "Personal", "Debt Consolidation"];

const LoanForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    age: "",
    monthlyIncome: "",
    employmentType: "" as string,
    creditScore: "",
    loanAmount: "",
    loanPurpose: "",
    existingEMIs: "",
    pastDefault: false,
  });

  const update = (key: string, value: string | boolean) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!form.name.trim() || form.name.length > 100) {
      toast.error("Please enter a valid name (max 100 chars)");
      return;
    }
    const age = parseInt(form.age);
    if (isNaN(age) || age < 18 || age > 80) {
      toast.error("Age must be between 18 and 80");
      return;
    }
    const income = parseFloat(form.monthlyIncome);
    if (isNaN(income) || income <= 0) {
      toast.error("Enter a valid monthly income");
      return;
    }
    if (!form.employmentType) {
      toast.error("Select employment type");
      return;
    }
    const credit = parseInt(form.creditScore);
    if (isNaN(credit) || credit < 300 || credit > 900) {
      toast.error("Credit score must be between 300 and 900");
      return;
    }
    const loanAmt = parseFloat(form.loanAmount);
    if (isNaN(loanAmt) || loanAmt <= 0) {
      toast.error("Enter a valid loan amount");
      return;
    }
    if (!form.loanPurpose) {
      toast.error("Select a loan purpose");
      return;
    }
    const emis = parseFloat(form.existingEMIs);
    if (isNaN(emis) || emis < 0) {
      toast.error("Enter valid existing EMI amount");
      return;
    }

    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const applicant: LoanApplicant = {
        name: form.name.trim(),
        age,
        monthlyIncome: income,
        employmentType: form.employmentType as "salaried" | "self-employed",
        creditScore: credit,
        loanAmount: loanAmt,
        loanPurpose: form.loanPurpose,
        existingEMIs: emis,
        pastDefault: form.pastDefault,
      };

      const result = predictRisk(applicant);
      const stored = savePrediction(applicant, result);
      setLoading(false);
      navigate(`/result/${stored.id}`);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center h-16 px-4 gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Shield className="h-5 w-5 text-accent" />
          <span className="font-display font-bold text-foreground">Loan Risk Assessment</span>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">Applicant Information</h1>
          <p className="text-muted-foreground text-sm">All fields are required. Data is processed locally and not stored on any server.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name & Age */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Applicant Name</Label>
              <Input id="name" placeholder="Full legal name" value={form.name} onChange={(e) => update("name", e.target.value)} maxLength={100} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input id="age" type="number" placeholder="e.g. 32" value={form.age} onChange={(e) => update("age", e.target.value)} min={18} max={80} />
            </div>
          </div>

          {/* Income & Employment */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="income">Monthly Income (₹)</Label>
              <Input id="income" type="number" placeholder="e.g. 75000" value={form.monthlyIncome} onChange={(e) => update("monthlyIncome", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Employment Type</Label>
              <Select value={form.employmentType} onValueChange={(v) => update("employmentType", v)}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="salaried">Salaried</SelectItem>
                  <SelectItem value="self-employed">Self-Employed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Credit Score & Loan Amount */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="credit">Credit Score (300-900)</Label>
              <Input id="credit" type="number" placeholder="e.g. 720" value={form.creditScore} onChange={(e) => update("creditScore", e.target.value)} min={300} max={900} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loan">Loan Amount (₹)</Label>
              <Input id="loan" type="number" placeholder="e.g. 500000" value={form.loanAmount} onChange={(e) => update("loanAmount", e.target.value)} />
            </div>
          </div>

          {/* Purpose & EMIs */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Loan Purpose</Label>
              <Select value={form.loanPurpose} onValueChange={(v) => update("loanPurpose", v)}>
                <SelectTrigger><SelectValue placeholder="Select purpose" /></SelectTrigger>
                <SelectContent>
                  {loanPurposes.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="emis">Existing Monthly EMIs (₹)</Label>
              <Input id="emis" type="number" placeholder="e.g. 15000" value={form.existingEMIs} onChange={(e) => update("existingEMIs", e.target.value)} />
            </div>
          </div>

          {/* Past Default */}
          <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
            <div>
              <Label htmlFor="default" className="text-sm font-medium">Past Default History</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Has the applicant defaulted on any previous loan?</p>
            </div>
            <Switch id="default" checked={form.pastDefault} onCheckedChange={(v) => update("pastDefault", v)} />
          </div>

          <Button type="submit" size="lg" className="w-full font-semibold" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Analyzing Risk...
              </span>
            ) : (
              "Predict Loan Risk"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoanForm;
