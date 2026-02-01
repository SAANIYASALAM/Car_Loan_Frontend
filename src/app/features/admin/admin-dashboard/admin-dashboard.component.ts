import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AdminService, DashboardStats } from '../../../core/services/admin.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';

@Component({
    selector: 'app-admin-dashboard',
    imports: [
        CommonModule,
        MatCardModule,
        MatIconModule,
        LoadingSpinnerComponent,
        CurrencyFormatPipe
    ],
    template: `
    <div class="container">
      <h1>Admin Dashboard</h1>
      
      <app-loading-spinner *ngIf="loading"></app-loading-spinner>
      
      <div class="stats-grid" *ngIf="!loading && stats">
        <mat-card class="stat-card">
          <mat-card-header>
            <mat-icon class="icon">description</mat-icon>
            <mat-card-title>Total Loans</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <h2>{{ stats.totalLoans }}</h2>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-header>
            <mat-icon class="icon success">check_circle</mat-icon>
            <mat-card-title>Active Loans</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <h2>{{ stats.activeLoans }}</h2>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-header>
            <mat-icon class="icon warn">pending</mat-icon>
            <mat-card-title>Pending Approvals</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <h2>{{ stats.pendingApprovals }}</h2>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-header>
            <mat-icon class="icon">account_balance</mat-icon>
            <mat-card-title>Total Disbursed</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <h2>{{ stats.totalDisbursed | currencyFormat }}</h2>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-header>
            <mat-icon class="icon success">payment</mat-icon>
            <mat-card-title>Total Collected</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <h2>{{ stats.totalCollected | currencyFormat }}</h2>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-header>
            <mat-icon class="icon warn">warning</mat-icon>
            <mat-card-title>Default Rate</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <h2>{{ stats.defaultRate }}%</h2>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
    styles: [`
    .container { padding: 24px; }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-top: 24px;
    }
    .stat-card h2 {
      font-size: 2rem;
      margin: 16px 0;
      color: #3f51b5;
    }
    .icon {
      margin-right: 8px;
      color: #3f51b5;
    }
    .icon.success { color: #4caf50; }
    .icon.warn { color: #ff9800; }
  `]
})
export class AdminDashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  loading = true;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;
    this.adminService.getDashboardStats().subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.stats = response.data;
        }
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
