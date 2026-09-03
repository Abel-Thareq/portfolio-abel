# Antigravity Rules & Design System — Abel's Portfolio

## 1. Design Direction
Create a minimalist, editorial, typography-first developer portfolio tailored for **Abel Thareq**.
The visual language must be:
- **Editorial & Restrained**: Clean typography hierarchy with elegant italic serif display accents (similar to luxury design portfolios & Apple/Swiss design).
- **Spacious**: Generous whitespace (`py-24`, `gap-12`, `max-w-3xl` or `max-w-4xl`), uncluttered layouts.
- **Monochrome & High Contrast**: Neutral-first color palette with strictly minimal/purposeful accent.
- **Anti-AI-Slop**: No unnecessary gradients, no heavy glassmorphism/blur, no particle animations, no excessive rounded cards, no rainbow tags.

---

## 2. Color System & Design Tokens
Neutral-first palette (Off-white / Warm Gray / Zinc):
- **Background**: `#FAFAF9` (stone-50) or `#FDFDFD` (clean near-white)
- **Foreground / Primary Text**: `#18181B` (zinc-900)
- **Muted Text / Secondary**: `#71717A` (zinc-500)
- **Subtle Borders**: `#E4E4E7` (zinc-200) / `#F4F4F5` (zinc-100)
- **Cards / Containers**: `#FFFFFF` with ultra-fine `border-zinc-200/60` and `shadow-[0_2px_8px_rgba(0,0,0,0.02)]`
- **Accent (Single)**: `#18181B` (monochrome focus) or soft `#0F172A` / `#2563EB` used strictly on primary CTA buttons.

---

## 3. Typography & Hierarchy
Use two distinct, harmonious font families:
1. **Primary Sans**: `Geist Sans` / `Inter` for crisp body copy, navigation, metadata, and tags.
2. **Editorial Display / Serif**: `Instrument Serif` / `Playfair Display` (italic) for poetic heading accents and section titles (matching the reference image: *"Hi, I'm Abel, software engineer."*).

Rules:
- Typography hierarchy must be created with size, weight, and font pairing, NOT rainbow colors.
- Maximum 2 font families across the whole website.

---

## 4. Anti-Slop Rules
**STRICTLY FORBIDDEN**:
- ❌ No default rainbow gradients or neon glows (`from-purple-500 to-indigo-500` is banned).
- ❌ No particle canvas backgrounds, glowing laser borders, or 3D spinning cubes.
- ❌ No wrapping every single text snippet inside heavy colored cards.
- ❌ No inconsistent icon sets (Use ONLY `lucide-react`).
- ❌ No messy inline styles or custom ad-hoc CSS. Use pure Tailwind utility classes and shadcn primitives.

---

## 5. Animation & Motion Rules
Motion must be barely noticeable yet silky-smooth:
- Subtle fade-in + slight slide-up (`y: 10 -> 0`, `duration: 0.4s`, `ease: [0.25, 0.1, 0.25, 1.0]`).
- Gentle micro-interactions on hover (slight opacity shift or `scale-[1.01]`, crisp underline transitions).
- Staggered entrances for list items and project rows.

---

## 6. Execution Workflow
1. Build incrementally section-by-section (Hero -> Selected Work -> Experience/Background -> Skills/Stack -> Contact/Footer).
2. Validate visual balance, typography contrast, responsive spacing, and accessibility after each section.
