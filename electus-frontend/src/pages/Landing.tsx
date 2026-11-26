import { Link } from "react-router-dom";
import { ArrowRight, FileUp, ScanSearch, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicHeader } from "@/components/layout/PublicHeader";

const workflow = [
  { title: "Import CVs", text: "Upload PDF and DOCX files in batches.", icon: FileUp },
  { title: "Find relevant experience", text: "Search CVs by skills, roles, or the work you need done.", icon: ScanSearch },
  { title: "Review candidates", text: "Hide names during screening and track which CVs your team has reviewed.", icon: ShieldCheck },
];

export default function Landing() {
  const signedIn = Boolean(localStorage.getItem("electus-token"));

  return (
    <div className="public-shell">
      <PublicHeader />
      <main className="public-content">
        <section className="landing-hero">
          <h1>From stacks of CVs to a focused shortlist.</h1>
          <p>Electus helps recruiting teams organize resumes, find relevant experience, and keep candidate reviews moving.</p>
          <div className="flex flex-wrap gap-3">
            <Button asChild><Link to={signedIn ? "/dashboard" : "/signup"}>{signedIn ? "Open workspace" : "Create an account"} <ArrowRight /></Link></Button>
            <Button variant="outline" asChild><Link to="/pricing">View plans</Link></Button>
          </div>
        </section>
        <section className="workflow-grid" aria-label="How Electus works">
          {workflow.map(({ title, text, icon: Icon }) => (
            <div key={title}>
              <Icon size={21} className="text-primary" aria-hidden="true" />
              <h2>{title}</h2>
              <p>{text}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
