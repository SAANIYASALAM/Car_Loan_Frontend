import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { User, UpdateUserDto } from '../../../core/models/user.model';

@Component({
    selector: 'app-profile',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatSnackBarModule
    ],
    template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>My Profile</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Full Name</mat-label>
              <input matInput formControlName="fullName">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Mobile</mat-label>
              <input matInput formControlName="mobile">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Monthly Income</mat-label>
              <input matInput type="number" formControlName="monthlyIncome">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Employment Type</mat-label>
              <mat-select formControlName="employmentType">
                <mat-option value="Salaried">Salaried</mat-option>
                <mat-option value="Self-Employed">Self-Employed</mat-option>
                <mat-option value="Business">Business</mat-option>
              </mat-select>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit"
                    [disabled]="profileForm.invalid || updating">
              {{ updating ? 'Updating...' : 'Update Profile' }}
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
    styles: [`
    .container { padding: 24px; max-width: 600px; margin: 0 auto; }
    .full-width { width: 100%; margin-bottom: 16px; }
  `]
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  updating = false;
  currentUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      monthlyIncome: ['', Validators.required],
      employmentType: ['']
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.loadProfile();
    }
  }

  loadProfile(): void {
    if (!this.currentUser) return;
    
    this.userService.getUserById(this.currentUser.id).subscribe({
      next: (response) => {
        if (response.success) {
          const user = response.data;
          this.profileForm.patchValue({
            fullName: user.fullName,
            mobile: user.mobile,
            monthlyIncome: user.monthlyIncome,
            employmentType: user.employmentType
          });
        }
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid && this.currentUser) {
      this.updating = true;
      const updateDto: UpdateUserDto = this.profileForm.value;

      this.userService.updateUser(this.currentUser.id, updateDto).subscribe({
        next: (response) => {
          this.updating = false;
          if (response.success) {
            this.snackBar.open('Profile updated successfully!', 'Close', { duration: 3000 });
          }
        },
        error: (error) => {
          this.updating = false;
          this.snackBar.open(error.message, 'Close', { duration: 5000 });
        }
      });
    }
  }
}
