import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
      }
    ]
  },
  {
    path: 'user',
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/user/dashboard/user-dashboard.component').then(m => m.UserDashboardComponent)
      },
      {
        path: 'loan-application',
        loadComponent: () => import('./features/user/loan-application/loan-application.component').then(m => m.LoanApplicationComponent)
      },
      {
        path: 'my-loans',
        loadComponent: () => import('./features/user/my-loans/my-loans.component').then(m => m.MyLoansComponent)
      },
      {
        path: 'emi-payment',
        loadComponent: () => import('./features/user/emi-payment/emi-payment.component').then(m => m.EmiPaymentComponent)
      },
      {
        path: 'loan-calculator',
        loadComponent: () => import('./features/user/loan-calculator/loan-calculator.component').then(m => m.LoanCalculatorComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/user/profile/profile.component').then(m => m.ProfileComponent)
      }
    ]
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'pending-approvals',
        loadComponent: () => import('./features/admin/pending-approvals/pending-approvals.component').then(m => m.PendingApprovalsComponent)
      },
      {
        path: 'all-loans',
        loadComponent: () => import('./features/admin/all-loans/all-loans.component').then(m => m.AllLoansComponent)
      },
      {
        path: 'users-management',
        loadComponent: () => import('./features/admin/users-management/users-management.component').then(m => m.UsersManagementComponent)
      },
      {
        path: 'analytics',
        loadComponent: () => import('./features/admin/analytics/analytics.component').then(m => m.AnalyticsComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];
