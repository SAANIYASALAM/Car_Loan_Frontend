import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { AdminService } from '../../../core/services/admin.service';
import { User } from '../../../core/models/user.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatChipsModule,
    LoadingSpinnerComponent
  ],
  template: `
    <div class="container">
      <h1>User Management</h1>
      
      <app-loading-spinner *ngIf="loading"></app-loading-spinner>
      
      <mat-card *ngIf="!loading">
        <mat-card-content>
          <table mat-table [dataSource]="users" class="mat-elevation-z8">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let user">{{ user.id }}</td>
            </ng-container>

            <ng-container matColumnDef="fullName">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let user">{{ user.fullName }}</td>
            </ng-container>

            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let user">{{ user.email }}</td>
            </ng-container>

            <ng-container matColumnDef="mobile">
              <th mat-header-cell *matHeaderCellDef>Mobile</th>
              <td mat-cell *matCellDef="let user">{{ user.mobile }}</td>
            </ng-container>

            <ng-container matColumnDef="creditScore">
              <th mat-header-cell *matHeaderCellDef>Credit Score</th>
              <td mat-cell *matCellDef="let user">{{ user.creditScore }}</td>
            </ng-container>

            <ng-container matColumnDef="kycStatus">
              <th mat-header-cell *matHeaderCellDef>KYC Status</th>
              <td mat-cell *matCellDef="let user">
                <mat-chip>{{ user.kycStatus }}</mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="role">
              <th mat-header-cell *matHeaderCellDef>Role</th>
              <td mat-cell *matCellDef="let user">
                <mat-chip [color]="user.role === 'Admin' ? 'primary' : ''">
                  {{ user.role }}
                </mat-chip>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { padding: 24px; }
    table { width: 100%; }
  `]
})
export class UsersManagementComponent implements OnInit {
  users: User[] = [];
  loading = true;
  displayedColumns = ['id', 'fullName', 'email', 'mobile', 'creditScore', 'kycStatus', 'role'];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.adminService.getAllUsers().subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.users = response.data;
        }
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
