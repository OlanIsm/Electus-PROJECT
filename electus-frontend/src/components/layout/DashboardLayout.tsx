import { AppSidebar } from "./AppSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen blueprint-bg">
      <AppSidebar />
      <main className="relative z-10 ml-60 min-h-screen">
        <div className="mx-auto max-w-[1200px] px-8 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
