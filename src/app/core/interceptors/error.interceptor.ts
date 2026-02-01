import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side error
        if (error.status === 0) {
          // Network error or CORS issue
          errorMessage = 'Cannot connect to the server. Please ensure:\n' +
            '1. The backend server is running on http://localhost:7041\n' +
            '2. CORS is properly configured on the backend\n' +
            '3. The Angular dev server is running with proxy configuration';
        } else if (error.status === 401) {
          // Unauthorized - logout and redirect to login
          authService.logout();
          router.navigate(['/auth/login']);
          errorMessage = 'Session expired. Please login again.';
        } else if (error.status === 403) {
          errorMessage = 'You do not have permission to access this resource.';
        } else if (error.status === 404) {
          errorMessage = 'Resource not found.';
        } else if (error.status === 500) {
          // Internal server error - provide detailed logging
          const endpoint = `${req.method} ${req.url}`;
          const backendMessage = error.error?.message || error.error?.error || error.error?.title;
          const backendDetails = error.error?.details || error.error?.errors;
          
          // Detailed console logging for debugging
          console.group('🔴 500 Internal Server Error');
          console.error('Endpoint:', endpoint);
          console.error('Status:', error.status, error.statusText);
          console.error('Timestamp:', new Date().toISOString());
          
          if (backendMessage) {
            console.error('Backend Error Message:', backendMessage);
          }
          
          if (backendDetails) {
            console.error('Backend Error Details:', backendDetails);
          }
          
          if (error.error) {
            console.error('Full Backend Response:', error.error);
          }
          
          console.error('Full Error Object:', error);
          console.groupEnd();
          
          // Create user-friendly error message with details
          errorMessage = `Internal server error at ${endpoint}.`;
          
          if (backendMessage) {
            errorMessage += `\n\nError: ${backendMessage}`;
          }
          
          if (backendDetails) {
            if (typeof backendDetails === 'string') {
              errorMessage += `\n\nDetails: ${backendDetails}`;
            } else if (typeof backendDetails === 'object') {
              errorMessage += `\n\nDetails: ${JSON.stringify(backendDetails, null, 2)}`;
            }
          }
          
          errorMessage += '\n\nCheck the browser console for more details.';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
      }

      console.error('HTTP Error:', errorMessage);
      return throwError(() => new Error(errorMessage));
    })
  );
};
