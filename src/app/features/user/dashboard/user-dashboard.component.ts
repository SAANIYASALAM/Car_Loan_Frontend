import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { LoanService } from '../../../core/services/loan.service';
import { UserDashboard } from '../../../core/models/user.model';
import { Loan } from '../../../core/models/loan.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';

@Component({
    selector: 'app-user-dashboard',
    imports: [
        CommonModule,
        RouterModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatProgressBarModule,
        LoadingSpinnerComponent,
        CurrencyFormatPipe
    ],
    template: `
    <div class="dashboard-container">
      <h1>Welcome, {{ currentUser?.fullName }}!</h1>
      
      <app-loading-spinner *ngIf="loading"></app-loading-spinner>
      
      <div class="dashboard-grid" *ngIf="!loading && dashboardData">
        <mat-card class="stat-card">
          <mat-card-header>
            <mat-icon class="card-icon">account_balance_wallet</mat-icon>
            <mat-card-title>Pre-Approved Limit</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <h2>{{ dashboardData.preApprovedLimit | currencyFormat }}</h2>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-header>
            <mat-icon class="card-icon">credit_score</mat-icon>
            <mat-card-title>Credit Score</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <h2>{{ dashboardData.creditScore }}</h2>
            <mat-progress-bar mode="determinate" 
              [value]="(dashboardData.creditScore / 900) * 100">
            </mat-progress-bar>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-header>
            <mat-icon class="card-icon">trending_up</mat-icon>
            <mat-card-title>Loan Health Score</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <h2>{{ dashboardData.loanHealthScore }}%</h2>
            <mat-progress-bar mode="determinate" 
              [value]="dashboardData.loanHealthScore">
            </mat-progress-bar>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-header>
            <mat-icon class="card-icon">description</mat-icon>
            <mat-card-title>Active Loans</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <h2>{{ dashboardData.activeLoans }}</h2>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-header>
            <mat-icon class="card-icon">check_circle</mat-icon>
            <mat-card-title>Total Paid</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <h2>{{ dashboardData.totalPaid | currencyFormat }}</h2>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-header>
            <mat-icon class="card-icon">pending</mat-icon>
            <mat-card-title>Total Remaining</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <h2>{{ dashboardData.totalRemaining | currencyFormat }}</h2>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="actions" *ngIf="!loading">
        <button mat-raised-button color="primary" routerLink="/user/loan-application">
          <mat-icon>add</mat-icon> Apply for New Loan
        </button>
        <button mat-raised-button color="accent" routerLink="/user/my-loans">
          <mat-icon>list</mat-icon> View My Loans
        </button>
        <button mat-raised-button routerLink="/user/loan-calculator">
          <mat-icon>calculate</mat-icon> Loan Calculator
        </button>
      </div>
    </div>
  `,
    styles: [`
    .dashboard-container {
      padding: 24px;
    }
    h1 {
      margin-bottom: 24px;
    }
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 24px;
    }
    .stat-card {
      padding: 16px;
    }
    .stat-card h2 {
      margin: 16px 0;
      font-size: 2rem;
      color: #3f51b5;
    }
    .card-icon {
      margin-right: 8px;
      color: #3f51b5;
    }
    .actions {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }
  `]
})
export class UserDashboardComponent implements OnInit {
  currentUser = this.authService.getCurrentUser();
  dashboardData: UserDashboard | null = null;
  loading = true;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    if (this.currentUser) {
      this.loadDashboard();
    }
  }

  loadDashboard(): void {
    this.loading = true;
    this.userService.getUserDashboard(this.currentUser!.id).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.dashboardData = response.data;
        }
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
