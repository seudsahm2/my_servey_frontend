# Islamic Learning Survey Platform - Frontend

Next.js frontend application for conducting student and teacher surveys with analytics dashboard.

## Features

- ✨ Modern, responsive UI with Tailwind CSS
- 📝 Student Survey Form (11 questions)
- 👨‍🏫 Teacher Survey Form (12 questions)
- 📊 Analytics Dashboard with interactive charts
- ✅ Form validation with React Hook Form
- 🎨 Glassmorphism design with gradient animations
- 📱 Mobile-friendly responsive design

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Pages

- `/` - Landing page with survey selection
- `/student-survey` - Student survey form (11 questions)
- `/teacher-survey` - Teacher survey form (12 questions)
- `/dashboard` - Analytics dashboard with charts

## Survey Questions

### Student Survey (11 Questions)
1. Quran reading experience level
2. Online lessons history
3. Challenges finding qualified teachers
4. Available study time
5. Preferred session length
6. Preferred frequency
7. Fair price expectations (ETB)
8. Subject interests
9. Trust factors for online teachers
10. Willingness to try platform
11. Desired platform features

### Teacher Survey (12 Questions)
1. Teaching background
2. Online teaching experience
3. Current teaching challenges
4. Weekly student capacity
5. Preferred session length
6. Fair rate expectations (ETB)
7. Confident teaching topics
8. Platform interest
9. Support needed
10. Platform concerns
11. Feedback collection preferences
12. Early access interest

## Tech Stack

- Next.js 16.0.4
- React 19.2.0
- TypeScript
- Tailwind CSS
- React Hook Form
- Recharts
- Axios

## Build for Production

```bash
npm run build
npm start
```

## Features

### Forms
- Real-time validation
- Success animations
- Error handling
- Mobile-optimized inputs

### Dashboard
- Pie charts for distributions
- Bar charts for preferences
- Summary statistics
- Real-time data fetching
- Loading states

## Design System

- **Colors**: Blue, Purple, Pink gradients
- **Effects**: Glassmorphism, gradient animations
- **Typography**: Inter font family
- **Components**: Rounded corners, hover effects, transitions
