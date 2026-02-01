# Quick Guide: Fixing 500 Internal Server Errors

## What is a 500 Error?

**500 Internal Server Error** = Something broke in the **backend** (not frontend).

The frontend successfully sent the request, but the backend crashed while processing it.

## Quick Diagnosis

### 1. Check Browser Console (F12)

Look for the detailed error log:
```
🔴 500 Internal Server Error
Endpoint: POST /api/auth/login
Backend Error Message: [This tells you what went wrong]
```

### 2. Check Backend Console

Look in your backend terminal/console for:
- Stack traces
- Exception messages
- Error details

### 3. Check Network Tab (F12 → Network)

Click the failed request (red) and check:
- **Response** tab: See backend error details
- **Payload** tab: See what data was sent

## Common Causes & Quick Fixes

| Error Message | Likely Cause | Quick Fix |
|---------------|-------------|-----------|
| "database", "connection", "SQL" | Database not running or connection issue | Start database, check connection string |
| "null reference", "object not set" | Trying to use data that doesn't exist | Check if user/data exists in database |
| "foreign key constraint" | Referenced data doesn't exist | Ensure parent records exist first |
| "validation error", "required field" | Missing or invalid data | Check all required fields are sent |
| "authentication", "unauthorized" | Token/auth issue | Check login token is valid |

## The 3-Step Fix Process

### Step 1: Identify the Endpoint
Look in browser console for the endpoint that failed:
```
Endpoint: POST /api/auth/login
```

### Step 2: Check What Was Sent
In browser console, look for:
```
Full Backend Response: { ... }
```
This shows what data was sent and what error was returned.

### Step 3: Fix in Backend
Go to the backend code for that endpoint and:
1. Find the error in backend console logs
2. Add null checks or fix the code
3. Restart backend

## Quick Checks Before Debugging

✅ **Backend is running** on http://localhost:7041
```bash
# Check if backend is running
curl http://localhost:7041/api
```

✅ **Database is running and accessible**
```bash
# Check database connection
# (command depends on your database type)
```

✅ **Backend is in Development mode** (shows detailed errors)
```bash
dotnet run --environment Development
```

✅ **All migrations are applied**
```bash
cd backend-directory
dotnet ef database update
```

## Most Common Issues

### Issue 1: User Not Found in Database

**Error:** "Object reference not set to an instance of an object"  
**When:** During login or user operations  
**Fix:** Register the user first OR check if email exists in database

### Issue 2: Database Not Running

**Error:** "A network-related or instance-specific error"  
**When:** Any database operation  
**Fix:** Start your database server (SQL Server, PostgreSQL, etc.)

### Issue 3: Migrations Not Applied

**Error:** "Invalid object name" or "table doesn't exist"  
**When:** Any database operation  
**Fix:** Run `dotnet ef database update` in backend directory

### Issue 4: Missing Required Fields

**Error:** "Validation failed" or "required field missing"  
**When:** Creating/updating data  
**Fix:** Ensure all required fields are filled in the form

### Issue 5: Invalid Foreign Key

**Error:** "Foreign key constraint violation"  
**When:** Creating related data  
**Fix:** Create parent records first (e.g., user before loan)

## Where to Look for More Details

1. **Browser Console** (F12) - Shows detailed frontend error logging
2. **Network Tab** (F12 → Network) - Shows request/response details
3. **Backend Console** - Shows stack trace and detailed error
4. **TROUBLESHOOTING_500_ERRORS.md** - Comprehensive troubleshooting guide

## Example: Debugging Login Error

**Browser Console Shows:**
```
🔴 500 Internal Server Error
Endpoint: POST /api/auth/login
Backend Error Message: User not found
```

**Steps:**
1. ✅ Backend is running - OK
2. ✅ Database is running - OK
3. ❌ User doesn't exist in database - **FOUND IT!**
4. Fix: Register the user OR use correct email

## Getting Help

When asking for help, provide:
1. Full error from browser console (🔴 500 Internal Server Error group)
2. Backend console error/stack trace
3. What you were trying to do
4. What data you sent (check Network tab → Payload)

## Prevention Tips

### Frontend
- Validate forms before submission
- Check data types match backend expectations
- Test with various inputs

### Backend  
- Add null checks
- Validate input data
- Use try-catch blocks
- Return proper status codes (400 for bad input, not 500)
- Add logging

---

**Remember:** 500 errors are **backend** errors. The backend code needs to be fixed, not the frontend. The frontend just helps you debug by showing detailed error information.
