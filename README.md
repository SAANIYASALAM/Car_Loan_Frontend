# Car Loan Frontend

Empty frontend starter for Car Loan EMI system.

## ⚠️ Getting 500 Internal Server Error on Registration?

If you're seeing a **500 Internal Server Error** when trying to register, this is a **backend issue**, not a frontend problem.

👉 **See [BACKEND_500_ERROR_GUIDE.md](./BACKEND_500_ERROR_GUIDE.md)** for detailed troubleshooting steps.

**Quick Summary:**
- ✅ Frontend is working - it successfully sent the request
- ❌ Backend has an issue - check backend server logs
- 🔍 Most common causes:
  - Database not running
  - Migrations not applied (`dotnet ef database update`)
  - Backend code bug
  - Duplicate email/user

## Getting Started

This is an empty frontend repository. You can now:

1. Initialize your preferred frontend framework (Angular, React, Vue, etc.)
2. Set up the project structure as needed
3. Integrate with the ASP.NET Core backend at `http://localhost:7041/api`

## Backend Integration

The backend API is expected to run on `http://localhost:7041/api`.

See the backend repository for API documentation: https://github.com/SAANIYASALAM/Car_Loan-Emi_Backend

## Next Steps

Choose your frontend framework and initialize it:

**Angular:**
```bash
npm install -g @angular/cli
ng new car-loan-frontend
```

**React:**
```bash
npx create-react-app car-loan-frontend
```

**Vue:**
```bash
npm create vue@latest
```

**Or any other framework of your choice.**

## Troubleshooting

- **500 Error on Registration?** → See [BACKEND_500_ERROR_GUIDE.md](./BACKEND_500_ERROR_GUIDE.md)
- Backend not responding? → Ensure it's running on `http://localhost:7041`
- CORS errors? → Configure CORS in the backend to allow requests from your frontend

## License

This project is part of the Car Loan EMI System.
