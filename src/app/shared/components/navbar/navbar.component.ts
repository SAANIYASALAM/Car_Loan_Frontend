import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule
  ],
  template: `
    <mat-toolbar color="primary">
      <span class="logo" routerLink="/">Car Loan EMI</span>
      <span class="spacer"></span>
      
      <ng-container *ngIf="currentUser">
        <button mat-button routerLink="/user/dashboard" *ngIf="!isAdmin">
          <mat-icon>dashboard</mat-icon> Dashboard
        </button>
        <button mat-button routerLink="/admin/dashboard" *ngIf="isAdmin">
          <mat-icon>admin_panel_settings</mat-icon> Admin
        </button>
        
        <button mat-icon-button [matMenuTriggerFor]="userMenu">
          <mat-icon>account_circle</mat-icon>
        </button>
        <mat-menu #userMenu="matMenu">
          <div class="user-info">
            <p><strong>{{ currentUser.fullName }}</strong></p>
            <p class="email">{{ currentUser.email }}</p>
          </div>
          <mat-divider></mat-divider>
          <button mat-menu-item routerLink="/user/profile" *ngIf="!isAdmin">
            <mat-icon>person</mat-icon> Profile
          </button>
          <button mat-menu-item (click)="logout()">
            <mat-icon>logout</mat-icon> Logout
          </button>
        </mat-menu>
      </ng-container>
      
      <ng-container *ngIf="!currentUser">
        <button mat-button routerLink="/auth/login">
          <mat-icon>login</mat-icon> Login
        </button>
        <button mat-raised-button color="accent" routerLink="/auth/register">
          Register
        </button>
      </ng-container>
    </mat-toolbar>
  `,
  styles: [`
    .logo {
      font-size: 1.5rem;
      font-weight: bold;
      cursor: pointer;
    }
    .spacer {
      flex: 1 1 auto;
    }
    .user-info {
      padding: 12px 16px;
    }
    .user-info p {
      margin: 4px 0;
    }
    .email {
      font-size: 0.85rem;
      color: #666;
    }
  `]
})
export class NavbarComponent {
  currentUser: User | null = null;
  isAdmin = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAdmin = this.authService.isAdmin();
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
