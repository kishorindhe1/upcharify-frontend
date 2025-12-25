# Upcharify - Hospital Management System

A modern, production-grade hospital management application built with React, TypeScript, and Ant Design.

## 🚀 Features

- **Authentication System**
  - Login with email/password
  - Forgot password functionality
  - Reset password with token verification
  - Protected routes with authentication
  - Persistent sessions with Zustand

- **Hospital Management**
  - Add new hospitals with comprehensive details
  - List all hospitals with advanced filtering
  - Search hospitals by name, location
  - Update hospital information
  - Delete hospitals with confirmation
  - View detailed statistics

- **Modern UI/UX**
  - Beautiful gradient backgrounds
  - Glass morphism effects
  - Smooth animations
  - Responsive design (mobile, tablet, desktop)
  - Professional medical theme

- **Technical Features**
  - Type-safe with TypeScript
  - Form validation with Zod
  - API integration with Axios
  - State management with Zustand
  - Data fetching with React Query
  - Routing with React Router DOM
  - UI components from Ant Design
  - Styling with Tailwind CSS

## 📦 Tech Stack

- **Frontend Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Library:** Ant Design
- **Form Handling:** React Hook Form
- **Validation:** Zod
- **State Management:** Zustand
- **Data Fetching:** React Query (TanStack Query)
- **HTTP Client:** Axios
- **Routing:** React Router DOM

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd upcharify
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your API URL:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

The application will start on `http://localhost:3000`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📁 Project Structure

```
upcharify/
├── src/
│   ├── components/          # Reusable components
│   │   ├── MainLayout.tsx   # Main layout with sidebar
│   │   └── ProtectedRoute.tsx
│   ├── pages/              # Page components
│   │   ├── LoginPage.tsx
│   │   ├── ForgotPasswordPage.tsx
│   │   ├── ResetPasswordPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── HospitalListPage.tsx
│   │   ├── AddHospitalPage.tsx
│   │   ├── TermsPage.tsx
│   │   └── PrivacyPage.tsx
│   ├── services/           # API services
│   │   ├── api.ts          # Axios instance
│   │   ├── authService.ts  # Authentication APIs
│   │   └── hospitalService.ts
│   ├── store/              # State management
│   │   └── authStore.ts    # Authentication store
│   ├── types/              # TypeScript types
│   │   └── index.ts
│   ├── utils/              # Utility functions
│   │   └── validation.ts   # Zod schemas
│   ├── styles/             # Global styles
│   │   └── index.css
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── public/                 # Static assets
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## 🔐 Authentication Flow

1. **Login:** Users authenticate with email and password
2. **Token Storage:** JWT token stored in Zustand with persistence
3. **Protected Routes:** Routes require authentication
4. **Auto Logout:** Invalid/expired tokens trigger automatic logout
5. **Password Reset:** Email-based password reset flow

## 🏥 Hospital Management Features

### Add Hospital
- Comprehensive form with validation
- Multiple sections: Basic Info, Location, Facilities
- Real-time validation feedback
- Support for emergency and ambulance services

### Hospital List
- Paginated table with advanced filtering
- Search by name, location
- Filter by services, state, city
- Quick actions: View, Edit, Delete
- Statistics cards showing totals

## 🎨 Design Philosophy

- **Medical Theme:** Teal and cyan gradients representing healthcare
- **Glass Morphism:** Modern frosted glass effects
- **Smooth Animations:** Fade-in, slide-up effects
- **Professional Look:** Clean, organized, production-ready UI
- **Accessibility:** Semantic HTML, proper contrast ratios

## 🔧 Configuration

### Ant Design Theme
Customized in `src/App.tsx`:
- Primary color: Teal (#14b8a6)
- Border radius: 12px
- Custom component heights and spacing

### Tailwind CSS
Extended in `tailwind.config.js`:
- Custom color palette
- Medical gradients
- Animation utilities

## 📝 API Integration

The application is designed to work with the hospital management backend API. Update the `VITE_API_BASE_URL` in `.env` to point to your API server.

### Expected API Endpoints:

**Authentication:**
- POST `/auth/login`
- POST `/auth/register`
- POST `/auth/forgot-password`
- POST `/auth/reset-password`

**Hospitals:**
- GET `/hospitals/list`
- GET `/hospitals/:id`
- POST `/hospitals/add`
- PUT `/hospitals/:id`
- DELETE `/hospitals/:id`
- PATCH `/hospitals/:id/beds`
- PATCH `/hospitals/:id/status`

## 🔒 Security Features

- Password validation (min 8 chars, uppercase, lowercase, number)
- Token-based authentication
- Protected routes
- Automatic token refresh
- XSS protection
- CSRF protection ready

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Adaptive layouts for all screen sizes
- Touch-friendly UI elements

## 🐛 Error Handling

- Form validation errors
- API error handling
- User-friendly error messages
- Loading states
- Success/error notifications

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For support, email support@upcharify.com or visit our support page.

## 🎯 Roadmap

- [ ] Patient management module
- [ ] Doctor scheduling system
- [ ] Appointment booking
- [ ] Medical records management
- [ ] Analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Dark mode

---

Built with ❤️ for healthcare professionals
