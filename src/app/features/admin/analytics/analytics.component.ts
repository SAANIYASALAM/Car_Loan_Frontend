import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { AdminService } from '../../../core/services/admin.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, MatCardModule, LoadingSpinnerComponent],
  template: `
    <div class="container">
      <h1>Analytics</h1>
      
      <app-loading-spinner *ngIf="loading"></app-loading-spinner>
      
      <div *ngIf="!loading" class="analytics-grid">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Monthly Revenue</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Chart visualization would go here (requires Chart.js integration)</p>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-header>
            <mat-card-title>Car Type Distribution</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Chart visualization would go here (requires Chart.js integration)</p>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 24px; }
    .analytics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 20px;
    }
  `]
})
export class AnalyticsComponent implements OnInit {
  loading = false;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    // Chart.js integration can be added here
  }
}
