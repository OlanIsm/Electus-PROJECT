import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicHeader } from "@/components/layout/PublicHeader";

export default function NotFound() {
  return (
    <div className="public-shell">
      <PublicHeader />
      <main className="public-content">
        <section className="landing-hero">
          <h1>Page not found</h1>
          <p>The address may have changed or the page may have been removed.</p>
          <Button asChild><Link to="/"><ArrowLeft /> Back to home</Link></Button>
        </section>
      </main>
    </div>
  );
}
