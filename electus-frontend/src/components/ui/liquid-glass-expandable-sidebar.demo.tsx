"use client";

import { useState } from "react";
import { Folder, House, LayoutTemplate, Settings2 } from "lucide-react";
import LiquidGlassExpandableSidebar, { type GlassNavGroup } from "@/components/ui/liquid-glass-expandable-sidebar";

const groups: GlassNavGroup[] = [{
  label: "Workspace",
  items: [
    { id: "home", label: "Home", href: "#home", icon: <House /> },
    {
      id: "projects", label: "Projects", href: "#projects", icon: <Folder />,
      children: [{ id: "studio", label: "Studio website", href: "#studio", icon: <LayoutTemplate /> }],
    },
    { id: "settings", label: "Settings", href: "#settings", icon: <Settings2 /> },
  ],
}];

export default function LiquidGlassExpandableSidebarDemo() {
  const [activeId, setActiveId] = useState("studio");
  return (
    <div className="relative isolate min-h-screen p-4 sm:p-10">
      <img
        src="https://cdn.21st.dev/assets/mirror/78/783f8881b23c99dc41d7682328c17d453aa4303c754b6322aad7ebd815836974.jpg"
        alt="" className="absolute inset-0 -z-10 size-full object-cover"
      />
      <LiquidGlassExpandableSidebar
        brand="Studio workspace"
        groups={groups}
        activeId={activeId}
        account={{ id: "profile", name: "Studio Member", detail: "Studio workspace", initials: "SM", href: "#profile" }}
        onNavigate={(item, event) => {
          event.preventDefault();
          setActiveId(item.id);
        }}
        glass={{ blur: 2, distortion: 20, edge: .85 }}
        selectionLight={.8}
      />
      <a className="mt-4 inline-block rounded bg-background px-3 py-2 text-sm underline"
        href="https://unsplash.com/photos/3epCdVoYCds">Photo by Chris Weiher on Unsplash</a>
    </div>
  );
}
