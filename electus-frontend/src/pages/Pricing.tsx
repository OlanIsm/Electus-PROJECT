import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicHeader } from "@/components/layout/PublicHeader";

const plans = [
  {
    name: "Starter",
    tagline: "For individuals & small teams",
    price: 15,
    features: [
      "Up to 5 Job Postings",
      "Up to 500 Candidates",
      "CV Parsing (PDF & DOCX)",
      "AI Summary per Candidate",
      "Semantic Search",
      "Basic Analytics Dashboard",
      "Email Support",
    ],
    upcoming: [],
  },
  {
    name: "Professional",
    tagline: "For growing teams",
    price: 25,
    features: [
      "Unlimited Job Postings",
      "Unlimited Candidates",
      "Everything in Starter",
      "Holland Code (RIASEC) Analysis",
      "Blind Screening Mode",
      "Batch CV Upload",
      "Advanced Statistics & Charts",
      "Priority Email Support",
    ],
    upcoming: [],
  },
  {
    name: "Enterprise",
    tagline: "For industry leaders",
    price: 45,
    features: [
      "Everything in Professional",
      "Unlimited Hiring Managers",
      "Workflow Automation",
      "Advanced Report Builder",
      "Single Sign On (SSO)",
    ],
    upcoming: [
      "AI Interview Q&A Generator",
      "LLM Integration (custom model)",
      "Open API Access",
      "User Groups & RBAC",
      "Dedicated Account Manager",
    ],
  },
];

export default function Pricing() {
  return (
    <div className="public-shell">
      <PublicHeader />
      <main className="public-content">
        <header className="pricing-heading">
          <h1>Plans and pricing</h1>
          <p>Compare plans for individual recruiters and hiring teams.</p>
        </header>
        <div className="pricing-grid">
          {plans.map(plan => (
            <section key={plan.name} className="pricing-plan">
              <div>
                <h2>{plan.name}</h2>
                <p className="text-sm text-muted-foreground">{plan.tagline}</p>
              </div>
              <p className="text-sm text-muted-foreground"><strong className="plan-price text-foreground">${plan.price}</strong> / user / month</p>
              <Button variant={plan.name === "Professional" ? "default" : "outline"} asChild>
                <Link to="/signup">Create an account</Link>
              </Button>
              <ul className="grid gap-2 border-t pt-4 text-sm">
                {plan.features.map(feature => (
                  <li key={feature} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />{feature}</li>
                ))}
              </ul>
              {plan.upcoming.length > 0 && <div className="border-t pt-4 text-sm text-muted-foreground">
                <h3 className="mb-2 font-semibold text-foreground">Coming soon</h3>
                <ul className="grid gap-2">{plan.upcoming.map(feature => <li key={feature}>{feature}</li>)}</ul>
              </div>}
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
