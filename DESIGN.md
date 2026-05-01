---
name: Feniks Design System
description: Rehabilitation center branding with warmth, hope, and professional expertise
colors:
  orange-primary: "#F47920"
  orange-active: "#FF9A4D"
  orange-deep: "#C05C00"
  success-green: "#10B981"
  error-red: "#EF4444"
  info-blue: "#3B82F6"
  warning-amber: "#F59E0B"
  neutral-black: "#0a0a0a"
  neutral-white: "#fafafa"
  neutral-gray: "#888"
  section-background: "#f5f3f0"
  light-gray: "#4A4A48"
  text-primary-light: "#1a1a1a"
  text-secondary-light: "#666"
  background-light: "#ffffff"
typography:
  display:
    fontFamily: "TT Norms Pro, sans-serif"
    fontSize: "clamp(2rem, 6vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.08em"
  headline:
    fontFamily: "TT Norms Pro, sans-serif"
    fontSize: "clamp(1.5rem, 4vw, 2.5rem)"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.06em"
  title:
    fontFamily: "TT Norms Pro, sans-serif"
    fontSize: "1.3rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.08em"
  body:
    fontFamily: "Source Sans 3, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "TT Norms Pro, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.06em"
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  full: "50%"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.orange-primary}"
    textColor: "{colors.neutral-white}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.orange-active}"
    textColor: "{colors.neutral-white}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.orange-primary}"
    rounded: "{rounded.full}"
    padding: "8px 14px"
  input-field:
    backgroundColor: "{colors.background-light}"
    textColor: "{colors.text-primary-light}"
    rounded: "{rounded.sm}"
    padding: "12px 16px"
  nav-link:
    textColor: "{colors.neutral-white}"
    fontSize: "0.78rem"
    fontWeight: 700
---

# Design System: Feniks

## 1. Overview

**Creative North Star: "The Phoenix Rise with Warm and Loving Care After"**

Feniks' visual system embodies renewal and hope while maintaining the warmth and human touch that makes recovery feel possible, not clinical. The design rejects sterile institutional aesthetics — every shape, color, and interaction carries emotional weight. This is not a hospital; it's a sanctuary where expertise and compassion meet.

The system is built on contrast: bold orange against calm neutrals, strong typography paired with generous whitespace, interactions that feel alive but never frivolous. Motion is purposeful, colors are intentional, and nothing feels generic.

**Key Characteristics:**
- Warm, not cold — human-centered, not institutional
- Living orange energy balanced with calm white space
- Expert typography (TT Norms Pro for authority, Source Sans 3 for humanity)
- Accessible always — high contrast, clear hierarchy, keyboard-navigable
- Responsive and fluid — scales beautifully from mobile to desktop
- Dark mode support — orange carries warmth in both themes

## 2. Colors: The Warmth Palette with Strategic Accents

The palette centers on orange (15–25% of screen) with semantic colors for meaning and hierarchy. Every color serves a purpose: warmth, trust, or clear communication.

### Primary Brand

- **Warm Sunrise Orange** (#F47920): The core brand color. Used for calls-to-action, primary buttons, links, and active states. This is Feniks' voice — warm, direct, unmistakably hopeful.
- **Glowing Warmth** (#FF9A4D): Lighter hover and accent tone. Used for hover states, overlays, secondary emphasis. Maintains warmth without overwhelming.
- **Deep Earth Orange** (#C05C00): Grounded, authoritative variant. Used sparingly in dark backgrounds, active navigation, and text links in dark mode.

### Semantic Colors (State & Meaning)

- **Success Green** (#10B981): Form validation success, positive outcomes, completed states. Communicates "all is well, move forward."
- **Error Red** (#EF4444): Form validation errors, warnings, dangerous actions. Clear and urgent without aggression.
- **Info Blue** (#3B82F6): Informational messages, secondary calls-to-action, neutral emphasis. Trustworthy and calm.
- **Warning Amber** (#F59E0B): Caution states, pending actions, alerts. Warm but distinct from primary orange.

### Neutral

- **Off-White** (#fafafa): Primary background. Warm and inviting, never stark pure white.
- **Deep Charcoal** (#0a0a0a): Primary text color. Nearly black but tinted toward warmth, never pure black.
- **Neutral Gray** (#888): Secondary text, disabled states, subtle borders.
- **Light Gray** (#4A4A48): Borders, dividers, light UI elements. In dark mode, acts as a lighter neutral.
- **Section Background** (#f5f3f0): Subtle warmth for content sections. A whisper of orange, not a shout.

### Named Rules

**The Orange Restraint Rule.** Orange carries 15–25% of any given screen. Its rarity is the point. When overused, it loses impact and the design becomes "loud" rather than "alive."

**The Warmth Tint Rule.** No pure #000 or #fff. Every neutral is tinted toward warmth (orange/tan). This keeps the system cohesive and prevents clinical coldness.

**The Semantic Color Rule.** Green = success/positive, Red = error/caution, Blue = info/neutral. These colors are used *intentionally* for meaning, not decoration. Never use red just for visual accent; it signals danger.

## 3. Typography

**Display Font:** TT Norms Pro (Bold 700, Medium 600)  
**Body Font:** Source Sans 3 (Variable weight 100–900)

**Character:** TT Norms Pro is bold, geometric, and professional — it commands authority. Source Sans 3 is warm and approachable — it puts users at ease. Together, they speak with confidence and care.

### Hierarchy

- **Display** (TT Norms Pro, 700, clamp(2rem, 6vw, 3.5rem), line-height 1.2, letter-spacing 0.08em): Hero section headlines and page titles. Rare, powerful, sets the tone.
- **Headline** (TT Norms Pro, 700, clamp(1.5rem, 4vw, 2.5rem), line-height 1.3, letter-spacing 0.06em): Section titles. Clear visual hierarchy without excess.
- **Title** (TT Norms Pro, 700, 1.3rem, line-height 1.4, letter-spacing 0.08em): Card titles, subheadings, nav logo. Professional yet warm.
- **Body** (Source Sans 3, 400, 1rem, line-height 1.6, letter-spacing normal): Running text, descriptions, content. Max line length 65–75ch for readability. Warm, human voice.
- **Label** (TT Norms Pro, 700, 0.78rem, line-height 1, letter-spacing 0.06em, uppercase): Button text, nav links, labels. Small but authoritative.

### Named Rules

**The Clamp Rule.** Display and headline sizes use CSS `clamp()` for fluid scaling. This avoids viewport-specific breakpoints and keeps typography responsive without jumps.

**The Weight Contrast Rule.** Every hierarchy jump uses ≥1.25 ratio in size or +100 in weight. Never flat scales. The hierarchy must be *felt*.

## 4. Elevation

Feniks uses **no drop shadows by default**. Depth is conveyed through:
- Tonal layering (section backgrounds, cards use subtle background shifts)
- Transparent borders and overlays
- Position and scale (larger = closer)
- Color contrast (warm orange "pops" forward)

When hover states or focus states trigger elevation, a subtle blur and opacity shift replace shadows. Motion and interactivity create depth, not static shadows.

### Named Rules

**The Flat-by-Default Rule.** Surfaces are flat at rest. When a user hovers, focuses, or activates an element, subtle transforms (scale, opacity, blur backdrop) provide feedback without heavy shadows. This keeps the design clean and accessible.

## 5. Components

### Buttons

- **Primary Button** (orange-primary background, white text, rounded 6px, padding 10px 20px): Calls-to-action. "Залишити заявку" (Request Help). Used sparingly — one per section usually.
- **Hover / Focus** (transitions to orange-active, slight scale-up, focus ring for accessibility): Smooth feedback, no jump.
- **Ghost Button** (transparent background, orange text, rounded 50%, padding 8px 14px): Secondary interactions. FAQ button, theme toggle. Feels lighter but still actionable.

### Navigation

- **Navbar** (fixed, height 72px, transitions from transparent to semi-opaque on scroll): Solid white background and text when scrolled. Logo fades in/out smoothly via `smoothstep()` easing. CTA button always orange.
- **Mobile Burger** (44px circle, orange icon, auto-close on link click): Three horizontal lines become X on open. No animation complexity — directness matters on mobile.
- **Phone Strip** (fixed top, height 40px, orange background, white text): Always visible. 24/7 hotline + social links. High affordance (clickable phone number).

### Forms

- **Input Fields** (white background, light-gray border, padding 12px 16px, border-radius 4px): Clean, spacious. On focus: orange border glow and subtle scale.
- **Submit Button** (orange-primary, white text, rounded 6px): Same button treatment as primary. Consistent affordance.
- **Error State** (light red or orange text, light-orange background tint if needed): Clear and actionable, not harsh.

### Cards / Sections

- **Content Cards** (white background, no shadow, subtle light-gray border or section-background tint): Hierarchy through color and spacing, not depth.
- **Gallery Cards** (white background, slight opacity overlay on hover, orange border accent on active): Interactive elements feel responsive without heavy shadows.

### Navigation Sidebar (about.html)

- **Sidebar Group** (sticky, top: 90px, width 280px, white background): Persistent navigation. Groups collapse/expand with smooth `max-height` transition.
- **Active Link** (orange text, orange bottom-border, bold weight): Clearly indicates current section.
- **Collapsible Chevron** (TT Norms Pro, orange, rotates 180° on toggle): Visual feedback for state change.

## 6. Do's and Don'ts

### Do:

- **Do use orange as the primary accent.** 15–25% of screen area max. It is your voice.
- **Do pair orange with white, off-white, or light backgrounds.** The contrast is the design's strength.
- **Do use TT Norms Pro for authority** — headings, labels, calls-to-action. It commands attention.
- **Do use Source Sans 3 for humanity** — body text, descriptions. It puts people at ease.
- **Do scale typography with `clamp()`** for fluid, responsive design across all devices.
- **Do use smooth, ease-out transitions** (250ms–400ms) for state changes. No bounces.
- **Do maintain high color contrast** (WCAG AA minimum) for accessibility. Test with tools.
- **Do design for dark mode.** Use CSS variables so orange carries warmth in both themes.
- **Do add focus rings and keyboard navigation.** Not everyone uses a mouse.

### Don't:

- **Don't use clinical colors:** no sterile whites, no harsh grays, no institutional blues. (Anti-reference: overly clinical/sterile)
- **Don't chase design trends.** No glassmorphism, no heavy gradients, no neon accents. (Anti-reference: trendy/flashy)
- **Don't strip complexity to the point of emptiness.** The site must convey expertise and depth, not look like a one-pager. (Anti-reference: overly simplistic)
- **Don't use pure black (#000) or pure white (#fff).** Tint them toward warmth.
- **Don't use orange on orange.** Contrast is clarity.
- **Don't animate layout properties** (width, height, position). Use transform and opacity instead for smoother 60fps motion.
- **Don't add drop shadows by default.** Elevation is for interactive feedback, not static depth.
- **Don't use side-stripe borders** (`border-left` > 1px) as accent decorations. Rewrite with full borders, tints, or icons instead.
- **Don't make the design look AI-generated.** Specificity, intention, and human care are visible in every choice. This is not generic healthcare branding.
