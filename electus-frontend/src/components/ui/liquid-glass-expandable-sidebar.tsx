"use client";

import { useId, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { ArrowLeftToLine, ArrowRightFromLine, ChevronDown, ChevronRight, PanelsTopLeft, Search, X } from "lucide-react";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";
import { useSidebarRefraction } from "./use-sidebar-refraction";
import "./liquid-glass-expandable-sidebar.css";

gsap.registerPlugin(Flip, useGSAP);

/* Liquid Glass Expandable Sidebar. MIT. Troy Lorents / Automate Flows. */
export type GlassNavItem = { id: string; label: string; href: string; icon: ReactNode; badge?: string };
export type GlassSidebarItem = GlassNavItem & { children?: GlassNavItem[] };
export type GlassNavGroup = { label: string; items: GlassSidebarItem[] };
export type GlassSettings = { blur: number; opacity: number; saturation: number; tint: string; edge: number; distortion: number };
export type NavigationGlassProps = {
  glass?: Partial<GlassSettings>;
  theme?: "light" | "dark";
  accent?: string;
  motion?: boolean;
  effects?: { speed?: number };
  className?: string;
  style?: CSSProperties;
};
export type ExpandableGlassSidebarProps = NavigationGlassProps & {
  groups: GlassNavGroup[];
  activeId?: string;
  brand?: string;
  brandDetail?: string;
  brandIcon?: ReactNode;
  account?: { id?: string; name: string; detail: string; initials: string; href: string };
  footer?: ReactNode;
  expanded?: boolean;
  defaultExpanded?: boolean;
  selectionLight?: number;
  onExpandedChange?: (expanded: boolean) => void;
  onNavigate?: (item: GlassNavItem, event: MouseEvent<HTMLAnchorElement>) => void;
};

export function LiquidGlassExpandableSidebar({
  groups, activeId, brand = "Workspace", brandDetail, brandIcon, account, footer,
  expanded: controlled, defaultExpanded = true, onExpandedChange, onNavigate,
  motion = true, selectionLight = 1, effects, glass, accent, theme, className = "", style,
}: ExpandableGlassSidebarProps) {
  const [localExpanded, setLocalExpanded] = useState(defaultExpanded);
  const [search, setSearch] = useState("");
  const [closedGroups, setClosedGroups] = useState<string[]>([]);
  const expanded = controlled ?? localExpanded;
  const query = expanded ? search.trim().toLowerCase() : "";
  const root = useRef<HTMLElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const snapshot = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const bodyId = useId();
  useSidebarRefraction(root, glass?.distortion ?? 28);

  useGSAP(() => {
    if (snapshot.current) {
      Flip.from(snapshot.current, { duration: .24 / (effects?.speed || 1), ease: "power3.out", scale: false });
      snapshot.current = null;
    }
  }, { scope: root, dependencies: [expanded] });

  const toggle = () => {
    if (root.current && motion && !matchMedia("(prefers-reduced-motion: reduce), (max-width: 767px)").matches) {
      snapshot.current = Flip.getState(root.current);
    }
    if (expanded) setSearch("");
    if (controlled === undefined) setLocalExpanded(!expanded);
    onExpandedChange?.(!expanded);
  };

  const clearSearch = () => {
    setSearch("");
    input.current?.focus();
  };

  const renderLink = (item: GlassNavItem, currentBranch = false) => (
    <a href={item.href} aria-current={activeId === item.id ? "page" : currentBranch ? "location" : undefined}
      aria-label={item.badge ? `${item.label}, ${item.badge}` : item.label}
      title={expanded ? undefined : item.label}
      onClick={event => {
        if (event.button === 0 && !event.defaultPrevented && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
          onNavigate?.(item, event);
        }
      }}>
      <span className="gn-sidebar-icon" aria-hidden="true">{item.icon}</span>
      <span className="gn-sidebar-label">{item.label}</span>
      {item.badge && <span className="gn-sidebar-badge" aria-hidden="true" />}
    </a>
  );

  const filtered = groups.map(group => ({
    ...group,
    items: group.items.flatMap(item => {
      if (item.label.toLowerCase().includes(query)) return [item];
      const children = item.children?.filter(child => child.label.toLowerCase().includes(query));
      return children?.length ? [{ ...item, children }] : [];
    }),
  })).filter(group => group.items.length);

  return (
    <nav ref={root} className={`gn-sidebar ${className}`} data-expanded={expanded} data-theme={theme}
      aria-label={`${brand} navigation`} style={{
        "--gn-blur": `${glass?.blur ?? 2}px`,
        "--gn-opacity": `${66 + (glass?.opacity ?? .08) * 34}%`,
        "--gn-saturation": glass?.saturation ?? 1.3,
        "--gn-edge": glass?.edge ?? .85,
        "--gn-bend": (glass?.distortion ?? 28) / 60,
        "--gn-strength": `${selectionLight * 15}%`,
        ...(glass?.tint && { "--gn-tint": glass.tint }),
        ...(accent && { "--gn-accent": accent }),
        ...style,
      } as CSSProperties}>
      <div className="gn-sidebar-brand">
        <span className="gn-sidebar-mark" aria-hidden="true">{brandIcon ?? <PanelsTopLeft />}</span>
        {expanded && <div className="gn-sidebar-copy"><strong>{brand}</strong>{brandDetail && <small>{brandDetail}</small>}</div>}
        <button type="button" aria-expanded={expanded} aria-controls={bodyId}
          aria-label={expanded ? "Collapse navigation" : "Expand navigation"} onClick={toggle}>
          {expanded ? <ArrowLeftToLine aria-hidden="true" /> : <ArrowRightFromLine aria-hidden="true" />}
        </button>
      </div>

      {expanded && <div className="gn-sidebar-search">
        <Search aria-hidden="true" />
        <input ref={input} type="search" aria-label="Find a page" placeholder="Find a page" value={search}
          onChange={event => setSearch(event.target.value)}
          onKeyDown={event => {
            if (event.key === "Escape" && search) {
              event.preventDefault();
              clearSearch();
            }
          }} />
        {search && <button type="button" aria-label="Clear search" onClick={clearSearch}><X aria-hidden="true" /></button>}
      </div>}

      <div className="gn-sidebar-body" id={bodyId}>
        {filtered.map(group => (
          <div className="gn-sidebar-group" key={group.label}>
            {expanded && <p>{group.label}</p>}
            <ul aria-label={group.label}>
              {group.items.map(item => {
                const open = expanded && (Boolean(query) || !closedGroups.includes(item.id));
                const panelId = `${bodyId}-${encodeURIComponent(item.id)}`;
                return <li key={item.id}>
                  <div className="gn-sidebar-row">
                    {renderLink(item, !open && item.children?.some(child => child.id === activeId))}
                    {expanded && Boolean(item.children?.length) && !query &&
                      <button type="button" aria-label={`${item.label} subpages`} aria-expanded={open} aria-controls={panelId}
                        onClick={() => setClosedGroups(current => open ? [...current, item.id] : current.filter(id => id !== item.id))}>
                        <ChevronDown aria-hidden="true" />
                      </button>}
                  </div>
                  {Boolean(item.children?.length) && <ul className="gn-sidebar-children" id={panelId} hidden={!open}>
                    {item.children?.map(child => <li key={child.id}>{renderLink(child)}</li>)}
                  </ul>}
                </li>;
              })}
            </ul>
          </div>
        ))}
        {!filtered.length && <p className="gn-sidebar-empty" role="status">No matching pages.</p>}
      </div>

      {(account || footer) && <div className="gn-sidebar-footer">
        {account && renderLink({
          id: account.id ?? "",
          href: account.href,
          label: account.name,
          icon: <span className="gn-sidebar-avatar">{account.initials}</span>,
        })}
        {account && expanded && <div className="gn-sidebar-account-detail"><small>{account.detail}</small><ChevronRight aria-hidden="true" /></div>}
        {footer}
      </div>}
    </nav>
  );
}

export default LiquidGlassExpandableSidebar;
