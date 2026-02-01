import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatListModule, MatIconModule],
  template: `
    <mat-nav-list *ngIf="isAdmin; else userMenu">
      <h3 mat-subheader>Admin Menu</h3>
      <a mat-list-item routerLink="/admin/dashboard" routerLinkActive="active">
        <mat-icon matListItemIcon>dashboard</mat-icon>
        <span matListItemTitle>Dashboard</span>
      </a>
      <a mat-list-item routerLink="/admin/pending-approvals" routerLinkActive="active">
        <mat-icon matListItemIcon>pending_actions</mat-icon>
        <span matListItemTitle>Pending Approvals</span>
      </a>
      <a mat-list-item routerLink="/admin/all-loans" routerLinkActive="active">
        <mat-icon matListItemIcon>list_alt</mat-icon>
        <span matListItemTitle>All Loans</span>
      </a>
      <a mat-list-item routerLink="/admin/users-management" routerLinkActive="active">
        <mat-icon matListItemIcon>people</mat-icon>
        <span matListItemTitle>Users</span>
      </a>
      <a mat-list-item routerLink="/admin/analytics" routerLinkActive="active">
        <mat-icon matListItemIcon>analytics</mat-icon>
        <span matListItemTitle>Analytics</span>
      </a>
    </mat-nav-list>

    <ng-template #userMenu>
      <mat-nav-list>
        <h3 mat-subheader>User Menu</h3>
        <a mat-list-item routerLink="/user/dashboard" routerLinkActive="active">
          <mat-icon matListItemIcon>dashboard</mat-icon>
          <span matListItemTitle>Dashboard</span>
        </a>
        <a mat-list-item routerLink="/user/loan-application" routerLinkActive="active">
          <mat-icon matListItemIcon>assignment</mat-icon>
          <span matListItemTitle>Apply for Loan</span>
        </a>
        <a mat-list-item routerLink="/user/my-loans" routerLinkActive="active">
          <mat-icon matListItemIcon>account_balance</mat-icon>
          <span matListItemTitle>My Loans</span>
        </a>
        <a mat-list-item routerLink="/user/emi-payment" routerLinkActive="active">
          <mat-icon matListItemIcon>payment</mat-icon>
          <span matListItemTitle>EMI Payment</span>
        </a>
        <a mat-list-item routerLink="/user/loan-calculator" routerLinkActive="active">
          <mat-icon matListItemIcon>calculate</mat-icon>
          <span matListItemTitle>Loan Calculator</span>
        </a>
        <a mat-list-item routerLink="/user/profile" routerLinkActive="active">
          <mat-icon matListItemIcon>person</mat-icon>
          <span matListItemTitle>Profile</span>
        </a>
      </mat-nav-list>
    </ng-template>
  `,
  styles: [`
    .active {
      background-color: rgba(63, 81, 181, 0.1);
      color: #3f51b5;
    }
    mat-nav-list {
      padding-top: 0;
    }
  `]
})
export class SidebarComponent {
  isAdmin = false;

  constructor(private authService: AuthService) {
    this.authService.currentUser$.subscribe(() => {
      this.isAdmin = this.authService.isAdmin();
    });
  }
}
