# Troubleshooting 500 Internal Server Errors

## Understanding 500 Errors

A **500 Internal Server Error** means something went wrong on the **backend server**. This is NOT a frontend issue - the frontend successfully sent the request, but the backend encountered an error while processing it.

## Error Message Format

When a 500 error occurs, you'll see detailed information in the browser console:

```
🔴 500 Internal Server Error
Endpoint: POST /api/auth/login
Status: 500 Internal Server Error
Timestamp: 2026-02-01T09:47:41.664Z
Backend Error Message: [error message from backend]
Backend Error Details: [detailed error information]
Full Backend Response: [complete response object]
Full Error Object: [complete error object]
```

## Common Causes and Solutions

### 1. Database Connection Issues

**Symptoms:**
- Error message contains "database", "connection", or "SQL"
- Happens on any endpoint that accesses data

**Solutions:**
```bash
# Check if database is running
# For SQL Server:
sqlcmd -S localhost -U sa -P YourPassword

# Check connection string in backend appsettings.json
# Ensure database exists and is accessible
```

**Backend Checklist:**
- [ ] Database service is running
- [ ] Connection string is correct in `appsettings.json`
- [ ] Database exists and migrations are applied
- [ ] User has proper permissions

### 2. Missing or Invalid Data

**Symptoms:**
- Error mentions "null reference", "required field", or validation errors
- Happens when submitting forms or creating data

**Solutions:**
- Check browser console for the request payload
- Verify all required fields are being sent
- Check backend validation requirements
- Ensure data types match (e.g., numbers as numbers, not strings)

**Example Fix:**
```typescript
// Frontend - ensure all required fields are present
const loanApplication = {
  userId: this.currentUser.id,  // Required
  carType: this.form.value.carType,  // Required
  carPrice: this.form.value.carPrice,  // Required
  // ... all other required fields
};
```

**Backend Checklist:**
- [ ] All required fields are being sent from frontend
- [ ] Data types match backend expectations
- [ ] Validation rules are met
- [ ] Foreign key relationships exist (e.g., user exists before creating loan)

### 3. Backend Code Errors

**Symptoms:**
- Error message contains stack trace or line numbers
- Happens consistently on specific endpoints
- May mention "NullReferenceException", "InvalidOperationException", etc.

**Solutions:**
- Check backend server logs for detailed stack trace
- Look for the specific line of code causing the error
- Debug backend code with breakpoints

**Where to Look:**
```bash
# Backend project directory
cd Car_Loan_Backend

# Run in development mode to see detailed errors
dotnet run --environment Development

# Check logs
# Look in console output or log files
```

**Backend Checklist:**
- [ ] Backend is running in Development mode for detailed errors
- [ ] Check exception message in backend logs
- [ ] Review stack trace to find exact line
- [ ] Verify all dependencies are properly injected
- [ ] Check for null reference exceptions

### 4. Authentication/Authorization Issues

**Symptoms:**
- Happens after login or on protected endpoints
- Error mentions "authentication", "token", or "claims"

**Solutions:**
- Verify JWT token is valid and not expired
- Check token is being sent in request headers
- Verify user exists in database
- Check user role/permissions

**Check Token:**
```javascript
// In browser console
console.log(localStorage.getItem('token'));

// Decode JWT token (use jwt.io)
// Check expiration, user claims, etc.
```

**Backend Checklist:**
- [ ] JWT secret key matches between frontend and backend
- [ ] Token is not expired
- [ ] User exists in database
- [ ] User has required role/permissions

### 5. Model Binding/Serialization Errors

**Symptoms:**
- Error mentions "JSON", "serialization", or "binding"
- Happens when sending complex objects

**Solutions:**
- Verify request payload matches backend model exactly
- Check for circular references in objects
- Ensure dates are in correct format
- Check enum values match

**Debug Request:**
```typescript
// Log request before sending
console.log('Sending request:', loanApplication);

// In error.interceptor.ts, the full request is now logged
```

**Backend Checklist:**
- [ ] Frontend model matches backend DTO
- [ ] All property names match (case-sensitive)
- [ ] Data types are correct
- [ ] No circular references in objects

## Debugging Steps

### Step 1: Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for the detailed error group (🔴 500 Internal Server Error)
4. Review all logged information

### Step 2: Check Network Tab
1. Open browser DevTools (F12)
2. Go to Network tab
3. Find the failed request (red text)
4. Click on it to see:
   - **Headers** tab: request headers, response headers
   - **Payload** tab: data sent to backend
   - **Response** tab: error response from backend
   - **Preview** tab: formatted error response

### Step 3: Check Backend Logs
1. Go to backend console/terminal
2. Look for error messages around the timestamp
3. Find stack trace and error details
4. Identify the line of code causing the error

### Step 4: Reproduce with Specific Data
1. Note what data was being sent
2. Try the same request with different data
3. Identify if it's data-specific or general error

## Backend Configuration Checklist

Before debugging frontend, ensure backend is properly configured:

### Database
- [ ] Database server is running
- [ ] Connection string is correct
- [ ] Database exists
- [ ] Migrations are applied: `dotnet ef database update`
- [ ] Seed data is loaded if required

### Backend Server
- [ ] Backend is running: `dotnet run`
- [ ] Running on correct port (7041)
- [ ] No compilation errors
- [ ] All dependencies installed: `dotnet restore`

### Configuration Files
- [ ] `appsettings.json` is correct
- [ ] JWT settings are configured
- [ ] Database connection string is valid
- [ ] CORS policy allows localhost:4200

### Environment
- [ ] Running in Development mode for detailed errors
- [ ] All environment variables are set
- [ ] .NET SDK version is compatible

## Common Error Patterns

### Pattern 1: Null Reference on User/UserId

```
Error: Object reference not set to an instance of an object
Location: LoanService.CreateLoan(LoanApplicationDto dto)
```

**Cause:** User ID is null or user doesn't exist in database

**Solution:**
```csharp
// Backend - add null check
if (user == null)
{
    return BadRequest("User not found");
}
```

### Pattern 2: Foreign Key Constraint Violation

```
Error: The INSERT statement conflicted with the FOREIGN KEY constraint
```

**Cause:** Trying to create a record that references a non-existent parent record

**Solution:**
- Ensure referenced entities exist (e.g., user exists before creating loan)
- Check IDs are correct
- Verify database relationships

### Pattern 3: Validation Error

```
Error: One or more validation errors occurred
```

**Cause:** Data doesn't meet backend validation rules

**Solution:**
- Check ModelState errors in backend
- Verify all required fields
- Check data format and ranges

## Getting Help

When reporting a 500 error, include:

1. **Console Error Group** - Full output from browser console
2. **Request Details** - Method, URL, payload
3. **Backend Logs** - Error message and stack trace
4. **Steps to Reproduce** - Exact steps that cause the error
5. **Environment** - Browser, OS, backend version

## Example: Debugging a Login Error

### Frontend Console Shows:
```
🔴 500 Internal Server Error
Endpoint: POST /api/auth/login
Status: 500 Internal Server Error
Backend Error Message: Object reference not set to an instance of an object
```

### Investigation:
1. Check backend logs for stack trace
2. Find it's in AuthController.Login method
3. User is null when trying to access user.Password
4. Check database - user doesn't exist with that email

### Solution:
Either:
- Register the user first, OR
- Backend should return 401 Unauthorized instead of 500, OR
- Add null check in backend code

## Prevention

### Frontend
- Validate data before sending to backend
- Use TypeScript interfaces matching backend models
- Add form validation
- Test with various data inputs

### Backend
- Add proper error handling (try-catch)
- Validate input data
- Return appropriate status codes (400 for bad request, not 500)
- Add null checks
- Use proper logging
- Write unit tests

## Additional Resources

- [ASP.NET Core Error Handling](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/error-handling)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [Debugging .NET Applications](https://learn.microsoft.com/en-us/visualstudio/debugger/)
