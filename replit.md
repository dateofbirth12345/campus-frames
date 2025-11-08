# WellnessHub - School Mental Health Platform

## Overview

WellnessHub is a comprehensive mental health and wellness platform designed for schools and colleges. The platform enables anonymous student wellbeing surveys, AI-driven mental health trend analysis, student storytelling campaigns, and secure counselor request systems. The application serves multiple user roles including students, staff members, counselors, and parents, each with tailored interfaces and functionality.

The platform emphasizes privacy, accessibility, and data-driven insights to help educational institutions proactively support student mental health and wellbeing.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18+ with TypeScript for type safety
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- React Query (TanStack Query) for server state management and data fetching

**UI Component System:**
- Shadcn/UI component library (New York style variant) with Radix UI primitives
- Tailwind CSS for styling with custom design tokens
- Design system follows accessibility-first principles with WCAG compliance
- Responsive layouts using mobile-first approach (breakpoints: mobile, tablet, desktop)

**State Management:**
- React Query handles all server state (surveys, stories, alerts, counselor requests)
- Local component state with React hooks for UI state
- Context API for theme management (light/dark mode support)

**Key Design Decisions:**
- System-based design approach ensures consistency across healthcare/education contexts
- Component library emphasizes professional credibility and universal access
- Inter font family for typography with tabular figures for data displays
- 12-column responsive grid system for dashboard layouts
- Card-based UI patterns for surveys and data displays

### Backend Architecture

**Server Framework:**
- Express.js running on Node.js
- TypeScript for type safety across the entire stack
- ESM (ES Modules) for modern JavaScript module system

**API Design:**
- RESTful API endpoints organized by resource type
- JSON-based request/response format
- Centralized error handling and logging
- Session-based authentication (prepared with connect-pg-simple for PostgreSQL session store)

**Key Routes:**
- `/api/surveys` - CRUD operations and analytics for wellbeing surveys
- `/api/stories` - Student story management with moderation
- `/api/alerts` - AI-generated mental health alerts
- `/api/counselor-requests` - Confidential counselor support requests

**Middleware:**
- Request logging with timing information
- JSON body parsing with raw body capture for webhook verification
- CORS and security headers (prepared for production)

### Data Storage

**Database:**
- PostgreSQL as the primary database
- Neon serverless PostgreSQL for cloud deployment
- WebSocket support for real-time features

**ORM & Schema Management:**
- Drizzle ORM for type-safe database queries
- Schema-first approach with TypeScript inference
- Migration system (Drizzle Kit) for version-controlled schema changes

**Data Models:**
- **Users**: Multi-role support (student, staff, counselor, parent) with authentication
- **Surveys**: Anonymous wellbeing surveys with structured fields (mood, stress, sleep, concerns)
- **Stories**: Student-authored mental health stories with moderation workflow
- **Alerts**: AI-generated alerts from survey trend analysis with severity levels
- **Counselor Requests**: Confidential support requests with verification codes and status tracking

**Storage Layer Abstraction:**
- IStorage interface defines contract for all data operations
- DbStorage implementation provides PostgreSQL-backed persistence
- Clean separation enables testing and future storage backend changes

### AI Integration

**OpenAI Integration:**
- GPT-5 model (latest as of August 2025) for natural language processing
- AI-powered survey trend analysis to identify mental health patterns
- Content moderation for student stories to ensure safety
- Alert suggestion generation based on survey data

**AI Service Functions:**
- `analyzeSurveyTrends()`: Analyzes survey data to identify patterns, severity levels, and recommendations
- `moderateStoryContent()`: Reviews student stories for appropriateness and safety
- `generateAlertSuggestion()`: Creates actionable recommendations for identified concerns

**Design Rationale:**
- Centralized AI service prevents vendor lock-in
- JSON-based prompts enable clear model instructions
- Structured outputs ensure consistent data processing
- Error handling prevents AI failures from breaking core functionality

### Authentication & Authorization

**User Roles:**
- Student: Submit surveys, create stories, request counselor support
- Staff: View dashboards, access analytics, observe trends
- Counselor: Manage support requests, view alerts
- Parent: Monitor student wellbeing (prepared for future implementation)

**Security Considerations:**
- Anonymous survey submissions protect student privacy
- Verification codes for counselor requests maintain confidentiality
- Story moderation prevents inappropriate content
- Session-based authentication prepared for production deployment

### Development & Deployment

**Development Tools:**
- TypeScript strict mode for compile-time safety
- Path aliases (@/, @shared/) for clean imports
- Hot module replacement (HMR) in development
- Replit-specific plugins for cloud development environment

**Build Process:**
- Vite builds optimized client bundle
- esbuild bundles server code for production
- Separate build outputs (dist/public for client, dist/ for server)

**Environment Configuration:**
- DATABASE_URL for PostgreSQL connection
- OPENAI_API_KEY for AI features
- NODE_ENV for environment-specific behavior

## External Dependencies

### Third-Party Services

**Database:**
- Neon Serverless PostgreSQL - Cloud-hosted PostgreSQL database
- Connection pooling via @neondatabase/serverless package
- WebSocket support for real-time features

**AI Services:**
- OpenAI API (GPT-5 model) - Natural language processing for trend analysis, content moderation, and alert generation
- Requires OPENAI_API_KEY environment variable

### Key Libraries

**Frontend:**
- React Router: wouter (lightweight alternative to react-router)
- State Management: @tanstack/react-query for server state
- UI Components: Radix UI primitives (@radix-ui/*) with shadcn/ui wrapper components
- Forms: react-hook-form with @hookform/resolvers for validation
- Styling: Tailwind CSS with class-variance-authority for variant management
- Date Handling: date-fns for date formatting and manipulation

**Backend:**
- Database: drizzle-orm with drizzle-zod for schema validation
- Session Store: connect-pg-simple for PostgreSQL-backed sessions
- Validation: zod for runtime type validation

**Development:**
- Build Tools: Vite, esbuild, TypeScript
- Code Quality: tsx for TypeScript execution, strict TypeScript configuration

### Design System Dependencies

**Shadcn/UI Configuration:**
- Style variant: "new-york"
- Tailwind config: Custom color system with HSL values
- Component aliases configured for clean imports
- CSS variables for theme customization (light/dark mode)
