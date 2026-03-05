import { useNavigate } from "react-router-dom";
import { Shield, TrendingUp, BarChart3, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Shield,
    title: "Risk Assessment",
    desc: "ML-powered scoring based on 6 real banking parameters",
  },
  {
    icon: TrendingUp,
    title: "Probability Score",
    desc: "Get precise confidence percentages for every prediction",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    desc: "Track predictions with visual risk distribution charts",
  },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-accent" />
            <span className="font-display font-bold text-lg text-foreground">LoanGuard</span>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              Dashboard
            </Button>
            <Button size="sm" onClick={() => navigate("/apply")} className="gap-1">
              Check Risk <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-gradient py-24 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 mb-8">
            <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
            <span className="text-sm font-medium text-primary-foreground/80">Production-Ready Risk Engine</span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground mb-6 max-w-3xl mx-auto leading-tight">
            Intelligent Loan Risk
            <br />
            <span className="text-accent">Prediction System</span>
          </h1>
          <p className="text-lg text-primary-foreground/70 max-w-xl mx-auto mb-10">
            Enterprise-grade credit risk assessment powered by machine learning algorithms.
            Built for banks, NBFCs, and loan officers.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/apply")}
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold gap-2 px-8"
            >
              Check Loan Risk <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
            >
              View Dashboard
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-card rounded-lg border border-border p-8 shadow-card hover:shadow-elevated transition-shadow"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg text-card-foreground mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { step: "01", title: "Enter Details", desc: "Fill in the applicant's financial profile" },
              { step: "02", title: "ML Analysis", desc: "Our engine evaluates 6 weighted risk factors" },
              { step: "03", title: "Get Results", desc: "Receive risk rating, probability & explanations" },
            ].map((s) => (
              <div key={s.step}>
                <div className="text-4xl font-display font-bold text-accent mb-3">{s.step}</div>
                <h4 className="font-display font-semibold text-foreground mb-1">{s.title}</h4>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground space-y-1">
          <p>LoanGuard Risk Engine — Built for production banking environments</p>
          <p>© 2026 Mohd Kaif</p>
          <p className="text-xs">Built with AI assistance</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
