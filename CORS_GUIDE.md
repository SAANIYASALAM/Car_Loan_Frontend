# CORS Configuration Guide

## Problem: Connection Error (ERR_EMPTY_RESPONSE)

If you're seeing an error like:
```
HTTP Error: Error Code: 0
Message: Http failure response for http://localhost:7041/api/auth/login: 0 Unknown Error
Failed to load resource: net::ERR_EMPTY_RESPONSE
```

This is a **CORS (Cross-Origin Resource Sharing)** issue.

## What is CORS?

CORS is a browser security feature that blocks web pages from making requests to a different domain than the one serving the page. In our case:
- **Frontend**: `http://localhost:4200` (Angular dev server)
- **Backend**: `http://localhost:7041` (ASP.NET Core API)

Since these are different ports, the browser considers them different origins and blocks the request.

## Solution 1: Use Angular Proxy (Recommended for Development)

We've configured an Angular proxy that forwards API requests to the backend, avoiding CORS issues during development.

### Configuration

**File: `proxy.conf.json`**
```json
{
  "/api": {
    "target": "http://localhost:7041",
    "secure": false,
    "logLevel": "debug",
    "changeOrigin": true
  }
}
```

**File: `angular.json`**
```json
"serve": {
  "options": {
    "proxyConfig": "proxy.conf.json"
  }
}
```

**File: `src/environments/environment.ts`**
```typescript
export const environment = {
  production: false,
  apiUrl: '/api'  // Relative URL - proxy forwards to backend
};
```

### How to Use

1. **Start the backend server** on port 7041:
   ```bash
   # In your backend directory
   dotnet run
   ```

2. **Start the Angular dev server** with proxy:
   ```bash
   npm start
   # OR
   ng serve
   ```

3. The Angular dev server will:
   - Serve the frontend on `http://localhost:4200`
   - Forward all `/api/*` requests to `http://localhost:7041/api/*`
   - No CORS errors!

## Solution 2: Configure CORS in Backend (Required for Production)

For production deployment, you need to configure CORS in your ASP.NET Core backend.

### ASP.NET Core CORS Configuration

Add this to your `Program.cs` or `Startup.cs`:

```csharp
// Add CORS services
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200") // Angular dev server
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

// ... other service configurations ...

var app = builder.Build();

// Use CORS middleware (must be before UseAuthorization)
app.UseCors("AllowAngularApp");

app.UseAuthorization();
```

### For Production

Update the CORS policy to include your production domain:

```csharp
policy.WithOrigins(
    "http://localhost:4200",           // Development
    "https://your-domain.com"          // Production
)
```

## Troubleshooting Checklist

- [ ] **Backend is running**: Verify the backend is running on `http://localhost:7041`
  ```bash
  curl http://localhost:7041/api/health
  # Or check in browser
  ```

- [ ] **Proxy configuration exists**: Check that `proxy.conf.json` exists in the project root

- [ ] **Angular.json updated**: Verify `angular.json` has `"proxyConfig": "proxy.conf.json"`

- [ ] **Environment uses relative URL**: Check `environment.ts` uses `apiUrl: '/api'` not `http://localhost:7041/api`

- [ ] **Dev server restarted**: After changing proxy config, restart `ng serve`

- [ ] **Check browser console**: Look for CORS-related error messages

- [ ] **Check network tab**: In browser DevTools, check if request is even being sent

## Common Issues

### Issue: "Proxy config not found"
**Solution**: Ensure `proxy.conf.json` is in the project root (same level as `angular.json`)

### Issue: "Backend not receiving requests"
**Solution**: 
1. Check backend is running: `netstat -ano | findstr :7041` (Windows) or `lsof -i :7041` (Mac/Linux)
2. Check backend logs for incoming requests
3. Verify proxy target URL in `proxy.conf.json`

### Issue: "Still getting CORS errors with proxy"
**Solution**:
1. Clear browser cache and cookies
2. Restart both frontend and backend servers
3. Try incognito/private browsing mode
4. Check that you're accessing `http://localhost:4200` not `http://localhost:7041`

### Issue: "Works in development but not production"
**Solution**: Configure CORS in backend (Solution 2 above)

## Testing the Connection

### 1. Test Backend Directly
```bash
curl -X POST http://localhost:7041/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### 2. Test Through Proxy
With Angular dev server running:
```bash
curl -X POST http://localhost:4200/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

Both should return the same response.

## Additional Resources

- [Angular Proxy Documentation](https://angular.io/guide/build#proxying-to-a-backend-server)
- [ASP.NET Core CORS Documentation](https://docs.microsoft.com/en-us/aspnet/core/security/cors)
- [MDN CORS Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
