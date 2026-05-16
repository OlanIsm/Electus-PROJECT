# 🎨 Electus Design System
> For Figma handoff — Mobile version consistency guide

---

## 📐 Typography

| Property | Value |
|---|---|
| **Font Family** | `Inter` (Google Fonts) |
| **Weights Used** | 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold) |
| **Import URL** | `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700` |

---

## 🌗 Color Palette

### 🔲 Dark Mode (Default / Primary Theme)

#### Core Surfaces
| Token | HSL | HEX | Usage |
|---|---|---|---|
| `background` | `hsl(220, 40%, 8%)` | **#0C1222** | Page background |
| `foreground` | `hsl(210, 40%, 96%)` | **#EFF3F8** | Primary text |
| `card` | `hsl(220, 35%, 12%)` | **#141E30** | Card backgrounds |
| `card-foreground` | `hsl(210, 40%, 96%)` | **#EFF3F8** | Card text |
| `popover` | `hsl(220, 35%, 14%)` | **#182338** | Popover/modal backgrounds |
| `popover-foreground` | `hsl(210, 40%, 96%)` | **#EFF3F8** | Popover text |

#### Brand / Primary
| Token | HSL | HEX | Usage |
|---|---|---|---|
| `primary` | `hsl(168, 52%, 45%)` | **#37AE9B** | Buttons, links, active states |
| `primary-foreground` | `hsl(220, 40%, 8%)` | **#0C1222** | Text on primary buttons |

#### Secondary / Muted
| Token | HSL | HEX | Usage |
|---|---|---|---|
| `secondary` | `hsl(220, 30%, 16%)` | **#1C2640** | Secondary surfaces |
| `secondary-foreground` | `hsl(210, 40%, 90%)` | **#D6E1ED** | Secondary text |
| `muted` | `hsl(220, 30%, 18%)` | **#202D47** | Muted backgrounds |
| `muted-foreground` | `hsl(215, 20%, 55%)` | **#748299** | Placeholder/hint text |

#### Accent
| Token | HSL | HEX | Usage |
|---|---|---|---|
| `accent` | `hsl(220, 30%, 20%)` | **#24334D** | Hover states, highlighted rows |
| `accent-foreground` | `hsl(210, 40%, 92%)` | **#DCE6F0** | Accent text |

#### Utility
| Token | HSL | HEX | Usage |
|---|---|---|---|
| `destructive` | `hsl(0, 72%, 51%)` | **#DC2626** | Delete buttons, error states |
| `destructive-foreground` | `hsl(0, 0%, 100%)` | **#FFFFFF** | Text on destructive |
| `border` | `hsl(220, 30%, 22%)` | **#2A3A57** | Borders, dividers |
| `input` | `hsl(220, 30%, 18%)` | **#202D47** | Input field backgrounds |
| `ring` | `hsl(168, 52%, 45%)` | **#37AE9B** | Focus ring |

#### Sidebar (Dark)
| Token | HSL | HEX | Usage |
|---|---|---|---|
| `sidebar-background` | `hsl(220, 45%, 6%)` | **#091019** | Sidebar bg |
| `sidebar-foreground` | `hsl(210, 20%, 75%)` | **#AEBECE** | Sidebar text |
| `sidebar-primary` | `hsl(168, 52%, 50%)` | **#3DC0AB** | Active nav item |
| `sidebar-border` | `hsl(220, 30%, 15%)` | **#192540** | Sidebar borders |

---

### ☀️ Light Mode

#### Core Surfaces
| Token | HSL | HEX | Usage |
|---|---|---|---|
| `background` | `hsl(0, 0%, 100%)` | **#FFFFFF** | Page background |
| `foreground` | `hsl(220, 40%, 10%)` | **#0F172A** | Primary text |
| `card` | `hsl(0, 0%, 100%)` | **#FFFFFF** | Card backgrounds |
| `popover` | `hsl(0, 0%, 100%)` | **#FFFFFF** | Popover backgrounds |

#### Brand / Primary
| Token | HSL | HEX | Usage |
|---|---|---|---|
| `primary` | `hsl(168, 52%, 45%)` | **#37AE9B** | Same across themes |
| `primary-foreground` | `hsl(0, 0%, 100%)` | **#FFFFFF** | Text on primary buttons |

#### Secondary / Muted
| Token | HSL | HEX | Usage |
|---|---|---|---|
| `secondary` | `hsl(210, 40%, 96%)` | **#EFF3F8** | Secondary surfaces |
| `muted` | `hsl(210, 40%, 96%)` | **#EFF3F8** | Muted backgrounds |
| `muted-foreground` | `hsl(215, 16%, 47%)` | **#64748B** | Placeholder text |

#### Utility
| Token | HSL | HEX | Usage |
|---|---|---|---|
| `destructive` | `hsl(0, 84%, 60%)` | **#EF4444** | Delete, errors |
| `border` | `hsl(214, 32%, 91%)` | **#E2E8F0** | Borders |
| `input` | `hsl(214, 32%, 91%)` | **#E2E8F0** | Input borders |

---

## 🌈 Accent & Chart Colors

### Landing Page Gradient
| Color | HEX | Tailwind Class |
|---|---|---|
| Teal (from) | **#2DD4BF** | `teal-400` |
| Cyan (to) | **#67E8F9** | `cyan-300` |
| Teal Badge | **#14B8A6** | `teal-500` |
| Teal Badge Text | **#5EEAD4** | `teal-300` |

### Status Colors
| Status | Background | Text | Border |
|---|---|---|---|
| Pending | `rgba(fg, 0.06)` | `rgba(fg, 0.50)` | `rgba(fg, 0.10)` |
| Extracting | **#F59E0B**/15 | **#FBBF24** | **#F59E0B**/30 |
| Completed | **#37AE9B**/15 | **#37AE9B** | **#37AE9B**/25 |
| Error | **#DC2626**/15 | **#DC2626** | **#DC2626**/25 |

### Holland Code (RIASEC) Chart Colors
| Personality Type | HEX | Swatch |
|---|---|---|
| Realistic | **#E74C3C** | 🔴 |
| Investigative | **#3498DB** | 🔵 |
| Artistic | **#9B59B6** | 🟣 |
| Social | **#2ECC71** | 🟢 |
| Enterprising | **#F39C12** | 🟠 |
| Conventional | **#1ABC9C** | 🟢 (Teal) |

### Blueprint Background Plasma Gradients
| Layer | Color | HEX | Opacity |
|---|---|---|---|
| Plasma Blob 1 | Teal | **#2B8C7E** | 6% (dark) / 10% (light) |
| Plasma Blob 2 | Blue | **#3B82F6** | 4% (dark) / 8% (light) |
| Plasma Blob 3 | Purple | **#8B5CF6** | 3% (dark) / 8% (light) |

---

## 🪟 Glassmorphism Tokens

### Dark Mode Glass
| Token | Value |
|---|---|
| `glass-bg` | `rgba(255, 255, 255, 0.04)` |
| `glass-bg-hover` | `rgba(255, 255, 255, 0.07)` |
| `glass-border` | `rgba(255, 255, 255, 0.08)` |
| `glass-border-hover` | `rgba(255, 255, 255, 0.14)` |
| `glass-glow` | `rgba(43, 140, 126, 0.15)` |
| `glass-shadow` | `0 8px 32px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2)` |
| `glass-strong-bg` | `rgba(255, 255, 255, 0.06)` |
| `glass-sidebar-bg` | `rgba(10, 15, 30, 0.85)` |
| **Backdrop Blur** | `blur(20px) saturate(150%)` |

### Light Mode Glass
| Token | Value |
|---|---|
| `glass-bg` | `rgba(255, 255, 255, 0.45)` |
| `glass-bg-hover` | `rgba(255, 255, 255, 0.65)` |
| `glass-border` | `rgba(255, 255, 255, 0.80)` |
| `glass-border-hover` | `rgba(255, 255, 255, 1.00)` |
| `glass-shadow` | `0 8px 32px rgba(31,38,135,0.07), 0 2px 8px rgba(31,38,135,0.04)` |
| `glass-strong-bg` | `rgba(255, 255, 255, 0.65)` |
| `glass-sidebar-bg` | `rgba(255, 255, 255, 0.65)` |
| **Backdrop Blur** | `blur(20px) saturate(150%)` |

---

## 🔤 Icon Library

We use **Lucide React** icons throughout the app. Below are all icons used per section.

### Sidebar Navigation
| Icon Name | Lucide Import | Usage |
|---|---|---|
| `LayoutDashboard` | `lucide-react` | Dashboard nav |
| `Upload` | `lucide-react` | Batch Upload nav |
| `BarChart3` | `lucide-react` | Statistics nav |
| `User` | `lucide-react` | Account nav |
| `Sparkles` | `lucide-react` | AI branding accent |

### Dashboard
| Icon Name | Usage |
|---|---|
| `FileText` | Total CVs card |
| `Clock` | Pending Review card |
| `CheckCircle2` | Reviewed card |
| `Send` | Interviews Sent card |
| `Search` | Search bar |
| `User` | Blind mode avatar |
| `Link2` | Portfolio link |
| `Sparkles` | AI Summary section |
| `Trash2` | Delete actions |
| `AlertCircle` | Confirmation dialog |

### Batch Upload
| Icon Name | Usage |
|---|---|
| `CloudUpload` | Upload zone icon |
| `FileText` | File item icon |
| `Trash2` | Remove file |
| `Sparkles` | Start AI Processing |
| `CheckCircle2` | Completed status |
| `Loader2` | Extracting spinner |
| `AlertCircle` | Error/Pending status |

### Statistics
| Icon Name | Usage |
|---|---|
| `Calendar` | Date range picker |
| `ChevronDown` | Dropdown indicator |
| `UploadCloud` | Empty state CTA |

### Account
| Icon Name | Usage |
|---|---|
| `Moon` / `Sun` | Theme toggle |
| `User` | Profile section |

---

## 🖼️ Logo & Brand Assets

| Asset | File | Location |
|---|---|---|
| **Logo (Full)** | `Logo.png` | `/public/Logo.png` |
| **Favicon** | `favicon.svg` | `/public/favicon.svg` |

> ⚠️ The `Logo.png` file is located at `electus-frontend/public/Logo.png` — share this directly with the Figma designer.

---

## 📐 Spacing & Radius

| Token | Value |
|---|---|
| `--radius` | `0.75rem` (12px) |
| Card padding | `20px` (`p-5`) |
| Modal padding | `24px` (`p-6`) |
| Sidebar width | `240px` (`w-60`) |
| Max content width | `1200px` |
| Grid gap (stats) | `16px` (`gap-4`) |
| Grid gap (candidate list) | `12px` (`gap-3`) |

---

## 🎭 Animations

| Animation | Duration | Easing | Usage |
|---|---|---|---|
| `fade-in` | custom | ease | Page/component entry |
| `plasma-drift` | 20s | ease-in-out, infinite alternate | Background plasma pulse |
| `plasma-internal` | 8s | ease-in-out, infinite alternate | Card internal glow |
| Glass hover transition | 0.3s | `cubic-bezier(0.4, 0, 0.2, 1)` | Card hover effects |
| `ping` (Tailwind) | 1s | ease, infinite | Landing page status dot |

---

## 📱 Figma Tips for Mobile

1. **Dark Mode First** — Landing, Login, and SignUp are always dark. Only the dashboard app switches between light/dark.
2. **Glass Effect in Figma** — Use background fill with 4% white opacity + backdrop blur layer (20px) + 8% white border.
3. **Icon Set** — Install the "Lucide Icons" Figma plugin for consistent icon usage.
4. **Primary Brand Color** — `#37AE9B` (Teal) is the hero color used across both themes.
5. **Font** — Use `Inter` from Google Fonts, already available in Figma natively.
