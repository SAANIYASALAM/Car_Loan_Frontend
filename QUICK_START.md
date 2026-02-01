# Quick Start Guide - Fixing Connection Issues

## If you see: "ERR_EMPTY_RESPONSE" or "Error Code: 0"

This means the frontend cannot connect to the backend. Follow these steps:

## Step 1: Start the Backend Server

```bash
# Navigate to your backend directory
cd path/to/Car_Loan_Backend

# Run the backend on port 7041
dotnet run
```

**Verify backend is running:**
- Open browser to: `http://localhost:7041/api` or `http://localhost:7041/swagger`
- You should see the API or Swagger documentation

## Step 2: Start the Frontend Server

```bash
# Navigate to frontend directory
cd path/to/Car_Loan_Frontend

# Install dependencies (first time only)
npm install

# Start the development server with proxy
npm start
```

**The proxy configuration will:**
- Serve frontend on: `http://localhost:4200`
- Forward all `/api/*` requests to: `http://localhost:7041/api/*`
- Avoid CORS errors automatically!

## Step 3: Access the Application

Open your browser to: **http://localhost:4200**

**Important**: Access via `localhost:4200`, NOT `localhost:7041`!

## What Changed?

### Before (With CORS Error):
```
Frontend (localhost:4200) → Backend (localhost:7041)
                           ❌ CORS Error!
```

### After (With Proxy):
```
Frontend (localhost:4200) → Angular Proxy → Backend (localhost:7041)
                            ✅ No CORS Error!
```

## Files Modified

1. **proxy.conf.json** (NEW) - Configures the proxy
2. **angular.json** - Added proxy config to serve options
3. **environment.ts** - Changed from `http://localhost:7041/api` to `/api`
4. **error.interceptor.ts** - Better error messages for connection issues

## Still Having Issues?

See detailed troubleshooting in [CORS_GUIDE.md](./CORS_GUIDE.md)

## Backend CORS Configuration (Optional for Production)

If deploying to production, configure CORS in your ASP.NET Core backend:

```csharp
// In Program.cs or Startup.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200", "https://your-domain.com")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

// ...

app.UseCors("AllowAngularApp");
```

This is **required** for production but **not needed** for development with the proxy!
