import { AppSidebar } from "./AppSidebar";
import "./workspace.css";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="dashboard-shell min-h-screen">
      <AppSidebar />
      <main className="dashboard-main min-w-0">
        <div className="dashboard-content">
          {children}
        </div>
      </main>
    </div>
  );
}
