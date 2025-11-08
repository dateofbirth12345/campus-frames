# Design Guidelines: School Mental Health & Wellness Platform

## Design Approach
**System-Based Design** using Shadcn/UI component philosophy with accessibility-first principles. This healthcare/education platform demands professional credibility, data clarity, and universal accessibility across diverse user groups (students, staff, parents, counselors).

## Typography System
- **Headings**: Inter font family (600-700 weight) for dashboard titles and section headers
- **Body Text**: Inter (400-500 weight) for forms, survey content, and data displays
- **Data/Metrics**: Tabular figures enabled for consistent number alignment in dashboards
- **Hierarchy**: 
  - H1: text-4xl (dashboard titles)
  - H2: text-2xl (section headers)
  - H3: text-xl (card headers)
  - Body: text-base
  - Caption/Meta: text-sm

## Layout System
**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, and 16 consistently
- Component padding: p-4 to p-6
- Section spacing: gap-8 to gap-12
- Page margins: px-4 md:px-8
- Card spacing: space-y-6

**Grid Structure**:
- Dashboard layouts: 12-column grid with responsive breakpoints
- Survey forms: Single column max-w-2xl for optimal readability
- Metric cards: 2-column on tablet, 3-4 column on desktop (grid-cols-1 md:grid-cols-2 lg:grid-cols-4)
- Story gallery: Masonry-style grid for student campaign stories

## Component Library

**Navigation**:
- Persistent sidebar for staff/counselor dashboards (240px width on desktop, collapsible on mobile)
- Top navigation bar for student-facing areas with role indicator badge
- Tab-based sub-navigation for multi-section dashboards

**Forms & Surveys**:
- Card-based survey questions with generous whitespace (p-6 per question card)
- Radio buttons and checkboxes with large touch targets (min 44px)
- Progress indicator showing survey completion percentage
- Anonymous submission confirmation with reassuring messaging

**Data Displays**:
- Metric cards with icon, large number, trend indicator (up/down arrow), and context label
- Line charts for trend visualization over time
- Heatmap calendar for daily mood tracking
- Tag clouds for frequently mentioned concerns
- Alert cards with severity indicators (info, warning, urgent) using subtle border treatments

**Story Creation Module**:
- Rich text editor with formatting toolbar (bold, italic, lists, headings)
- Image upload dropzone with preview thumbnails
- Character counter and reading time estimate
- Draft auto-save indicator
- Publication preview mode before submission

**AR Poster Interface**:
- Camera preview viewport with AR marker detection overlay
- Poster thumbnail gallery with tap-to-activate interaction
- Fullscreen AR view with exit controls clearly visible
- Screenshot/share functionality for created posters

**Verification System**:
- Step-by-step wizard interface (3 steps: request, verification, confirmation)
- Privacy notice prominently displayed with checkboxes for consent
- Secure code entry with masked input
- Counselor matching interface with availability indicators

**Dashboards**:
- Staff: Grid of metric cards (top row), trend charts (middle), recent alerts (bottom)
- Parent: Simplified view with anonymized aggregate data, focus on positive metrics
- Counselor: Case queue, student request cards with urgency labels, resource library

**General UI Patterns**:
- Toast notifications for confirmations and errors (top-right positioning)
- Modal dialogs for critical actions (delete, submit sensitive data)
- Skeleton loaders for async data with content-aware shapes
- Empty states with helpful illustrations and actionable CTAs
- Help tooltips (info icon) for complex features

## Accessibility Standards
- WCAG 2.1 AA compliance minimum across all interfaces
- Form labels always visible (no placeholder-only inputs)
- Focus indicators with 2px offset for keyboard navigation
- Screen reader announcements for dynamic content updates
- Sufficient contrast ratios throughout (test with tools)
- Alt text for all meaningful images and icons

## Images
**Hero Section** (Landing/Student Portal):
- Large hero image (h-96 on desktop) showing diverse students in positive school environment
- Blurred background treatment with centered headline and CTA buttons
- Button backgrounds: backdrop-blur-md with semi-transparent treatment

**Dashboard Illustrations**:
- Empty state illustrations: Simple line drawings (not photographic) for "No surveys yet," "No alerts," "No stories published"
- Success confirmations: Checkmark icons with subtle celebratory elements

**Story Campaign Cards**:
- Student-submitted artwork/photography as card backgrounds
- Consistent aspect ratio (16:9) with object-fit cover
- Overlay gradient for text readability

**General Imagery**:
- Icons from Lucide React (bundled with Shadcn/UI) throughout for consistency
- Illustrative icons for survey categories (mood faces, activity symbols)
- Trust indicators: Secure lock icons, verification badges, privacy shields

## Animations
Use sparingly and purposefully:
- Smooth transitions for tab switching (transition-all duration-200)
- Fade-in for loading content (opacity animation)
- Slide-in for drawer/sidebar (transform translateX)
- NO decorative scroll animations or parallax effects
- Focus on functional micro-interactions only

## Responsive Behavior
- Mobile-first approach with hamburger menu for navigation
- Touch-friendly survey interfaces (larger tap targets)
- Simplified dashboard cards that stack on mobile
- Horizontal scroll for data tables with sticky first column
- Bottom sheet pattern for mobile action menus

This design prioritizes **trustworthiness, clarity, and ease of use** across sensitive mental health contexts while maintaining professional credibility for educational institutions.
