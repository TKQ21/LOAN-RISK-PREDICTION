import { useNavigate } from "react-router-dom";
import { Shield, ArrowLeft, ArrowRight, Users, ShieldCheck, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPredictions } from "@/lib/riskEngine";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const Dashboard = () => {
  const navigate = useNavigate();
  const predictions = getPredictions();

  const lowCount = predictions.filter((p) => p.result.risk === "LOW").length;
  const highCount = predictions.filter((p) => p.result.risk === "HIGH").length;
  const total = predictions.length;

  const pieData = [
    { name: "Low Risk", value: lowCount, color: "hsl(152, 60%, 40%)" },
    { name: "High Risk", value: highCount, color: "hsl(0, 72%, 51%)" },
  ];

  // Credit score distribution
  const creditBuckets = [
    { range: "300-500", count: 0 },
    { range: "500-600", count: 0 },
    { range: "600-700", count: 0 },
    { range: "700-800", count: 0 },
    { range: "800-900", count: 0 },
  ];
  predictions.forEach((p) => {
    const cs = p.applicant.creditScore;
    if (cs < 500) creditBuckets[0].count++;
    else if (cs < 600) creditBuckets[1].count++;
    else if (cs < 700) creditBuckets[2].count++;
    else if (cs < 800) creditBuckets[3].count++;
    else creditBuckets[4].count++;
  });

  const stats = [
    { icon: Users, label: "Total Predictions", value: total, color: "text-primary" },
    { icon: ShieldCheck, label: "Low Risk", value: lowCount, color: "text-risk-low" },
    { icon: ShieldAlert, label: "High Risk", value: highCount, color: "text-risk-high" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Shield className="h-5 w-5 text-accent" />
            <span className="font-display font-bold text-foreground">Admin Dashboard</span>
          </div>
          <Button size="sm" onClick={() => navigate("/apply")} className="gap-1">
            New Assessment <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-10">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-lg p-6 shadow-card">
              <div className="flex items-center gap-3">
                <s.icon className={`h-8 w-8 ${s.color}`} />
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="font-display text-3xl font-bold text-foreground">{s.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {total === 0 ? (
          <div className="bg-card border border-border rounded-lg p-16 text-center shadow-card">
            <p className="text-muted-foreground mb-4">No predictions yet. Run your first assessment to see analytics.</p>
            <Button onClick={() => navigate("/apply")}>Start Assessment</Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-card">
              <h3 className="font-display font-semibold text-foreground mb-4">Risk Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-2">
                {pieData.map((d) => (
                  <div key={d.name} className="flex items-center gap-2 text-sm">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-muted-foreground">{d.name}: {d.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bar Chart */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-card">
              <h3 className="font-display font-semibold text-foreground mb-4">Credit Score Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={creditBuckets}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 88%)" />
                  <XAxis dataKey="range" tick={{ fontSize: 12, fill: "hsl(220, 10%, 46%)" }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "hsl(220, 10%, 46%)" }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(222, 62%, 18%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Recent predictions table */}
            <div className="md:col-span-2 bg-card border border-border rounded-lg p-6 shadow-card">
              <h3 className="font-display font-semibold text-foreground mb-4">Recent Predictions</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-3 text-muted-foreground font-medium">Name</th>
                      <th className="text-left py-2 px-3 text-muted-foreground font-medium">Credit</th>
                      <th className="text-left py-2 px-3 text-muted-foreground font-medium">Loan Amt</th>
                      <th className="text-left py-2 px-3 text-muted-foreground font-medium">Risk</th>
                      <th className="text-left py-2 px-3 text-muted-foreground font-medium">Score</th>
                      <th className="text-left py-2 px-3 text-muted-foreground font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...predictions].reverse().slice(0, 10).map((p) => (
                      <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30">
                        <td className="py-2.5 px-3 font-medium text-foreground">{p.applicant.name}</td>
                        <td className="py-2.5 px-3 text-muted-foreground">{p.applicant.creditScore}</td>
                        <td className="py-2.5 px-3 text-muted-foreground">₹{p.applicant.loanAmount.toLocaleString()}</td>
                        <td className="py-2.5 px-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${p.result.risk === "LOW" ? "bg-risk-low/15 text-risk-low" : "bg-risk-high/15 text-risk-high"}`}>
                            {p.result.risk}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-muted-foreground">{p.result.probability}%</td>
                        <td className="py-2.5 px-3">
                          <Button variant="ghost" size="sm" onClick={() => navigate(`/result/${p.id}`)}>View</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
