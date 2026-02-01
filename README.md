# Car Loan Frontend

Angular 19+ frontend application for Car Loan EMI system with ASP.NET Core backend integration.

## Security Notice

**Latest Update**: Upgraded to Angular 19.2.18 to address critical security vulnerabilities (XSS and XSRF). See [SECURITY_UPDATE.md](./SECURITY_UPDATE.md) for details.

## Features

### User Features
- User registration and authentication
- Loan eligibility checker
- Loan application submission
- View and manage loans
- EMI payment processing
- Loan calculator
- User profile management
- Dashboard with personalized insights

### Admin Features
- Admin dashboard with statistics
- Loan approval/rejection management
- View all loans with filters
- User management
- Analytics and reporting

## Tech Stack

- **Angular 19.2.18** with standalone components (upgraded for security fixes)
- **Angular Material 19** for UI components
- **TypeScript 5.8** (strict mode)
- **Chart.js** for data visualization
- **RxJS** for reactive programming
- **Lazy loading** for optimized performance

## Project Structure

```
src/
├── app/
│   ├── core/                    # Core services, guards, interceptors, models
│   │   ├── guards/              # Authentication and authorization guards
│   │   ├── interceptors/        # HTTP interceptors
│   │   ├── services/            # Business logic services
│   │   └── models/              # TypeScript interfaces and enums
│   ├── features/                # Feature modules
│   │   ├── auth/                # Login and registration
│   │   ├── user/                # User features (dashboard, loans, etc.)
│   │   └── admin/               # Admin features (approvals, analytics)
│   ├── shared/                  # Shared components and utilities
│   │   ├── components/          # Reusable UI components
│   │   └── pipes/               # Custom pipes
│   └── environments/            # Environment configurations
```

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (`npm install -g @angular/cli`)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Backend API

The application uses a **proxy configuration** to connect to the ASP.NET Core backend, avoiding CORS issues during development.

**Backend URL**: `http://localhost:7041/api`

The proxy is configured in `proxy.conf.json` and automatically forwards all `/api/*` requests from `http://localhost:4200/api/*` to `http://localhost:7041/api/*`.

#### Important Notes:
- The development environment (`environment.ts`) uses relative URL: `apiUrl: '/api'`
- The proxy handles forwarding to the actual backend
- **Ensure the backend is running on port 7041** before starting the frontend

#### CORS Troubleshooting
If you encounter connection errors (ERR_EMPTY_RESPONSE), see **[CORS_GUIDE.md](./CORS_GUIDE.md)** for detailed troubleshooting steps.

### 3. Development Server

**Important**: Make sure the backend server is running on `http://localhost:7041` first!

Then start the development server:

```bash
npm start
# or
ng serve
```

The proxy will automatically forward API requests to the backend. Navigate to `http://localhost:4200/`. The application will automatically reload when you change source files.

### 4. Build for Production

```bash
npm run build
# or
ng build --configuration production
```

The build artifacts will be stored in the `dist/` directory.

## API Integration

The application integrates with the following backend endpoints:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Loan Management (User)
- `POST /api/loan/apply` - Apply for a loan
- `GET /api/loan/user/{userId}` - Get user's loans
- `GET /api/loan/{loanId}` - Get loan details
- `POST /api/loan/check-eligibility` - Check loan eligibility
- `GET /api/loan/rules/{carType}` - Get loan rules
- `POST /api/loan/calculate-emi` - Calculate EMI

### EMI Management
- `GET /api/emi/loan/{loanId}` - Get EMIs for a loan
- `GET /api/emi/upcoming/{userId}` - Get upcoming EMIs
- `GET /api/emi/history/{userId}` - Get EMI history
- `POST /api/emi/pay` - Pay EMI

### User Management
- `GET /api/user/{userId}` - Get user details
- `PUT /api/user/{userId}` - Update user profile
- `GET /api/user/{userId}/dashboard` - Get user dashboard data

### Admin Operations
- `GET /api/admin/loans/pending` - Get pending loan approvals
- `PUT /api/admin/loans/{loanId}/approve` - Approve loan
- `PUT /api/admin/loans/{loanId}/reject` - Reject loan
- `GET /api/admin/loans` - Get all loans (with filters)
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/{userId}/loans` - Get user's loans
- `GET /api/admin/analytics/monthly-revenue` - Get monthly revenue
- `GET /api/admin/analytics/car-type-distribution` - Get car type distribution
- `GET /api/admin/analytics/dashboard-stats` - Get dashboard statistics

## Car Types Supported

- Hatchback
- Sedan
- Compact Sedan
- Compact SUV
- Mid-Size SUV
- Full-Size SUV
- MUV/MPV
- Electric Vehicle
- Hybrid
- Luxury Sedan
- Luxury SUV
- Coupe
- Convertible
- Commercial
- Used Car

## Loan Statuses

- Pending - Awaiting approval
- Approved - Loan approved but not disbursed
- Rejected - Loan rejected
- Active - Loan active with ongoing EMIs
- Closed - Loan fully repaid

## Payment Statuses

- Pending - EMI payment due
- Paid - EMI payment completed
- Overdue - EMI payment overdue

## Authentication & Authorization

The application uses JWT-based authentication with the following features:

- Token-based authentication
- HTTP interceptor for automatic token injection
- Route guards for protected routes
- Role-based access control (User/Admin)
- Automatic session management

## Troubleshooting

### Connection Issues
If you encounter connection errors (ERR_EMPTY_RESPONSE, status 0), see **[CORS_GUIDE.md](./CORS_GUIDE.md)** for detailed troubleshooting steps.

### 500 Internal Server Errors
If you get 500 Internal Server Errors from the backend:
- **[QUICK_FIX_500_ERRORS.md](./QUICK_FIX_500_ERRORS.md)** - Quick diagnosis and common fixes
- **[TROUBLESHOOTING_500_ERRORS.md](./TROUBLESHOOTING_500_ERRORS.md)** - Comprehensive troubleshooting guide

The frontend now provides detailed error logging in the browser console to help debug backend issues. Press F12 to open DevTools and check the Console tab for detailed error information.

### General Issues
- **Backend not running**: Ensure the ASP.NET Core backend is running on http://localhost:7041
- **Database issues**: Check if the database is running and migrations are applied
- **CORS errors**: See CORS_GUIDE.md
- **Build errors**: Try `npm install` to reinstall dependencies

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `npm test`
4. Build the project: `npm run build`
5. Submit a pull request

## License

This project is part of the Car Loan EMI System.
