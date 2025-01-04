# HomeCraft - Smart Home E-Commerce Platform

HomeCraft is a modern e-commerce platform for smart home devices built with Vue.js and ASP.NET Web API. The platform offers an intuitive user interface, AI chatbot assistant, and complete online shopping functionality.

![HomeCraft Screenshot](path-to-screenshot.png)

## 🚀 Key Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access (User/Admin)
  - Email confirmation
  - Password recovery

- **Shopping Experience**
  - Product catalog
  - Shopping cart
  - Stripe payment integration
  - Order tracking

- **Admin Features**
  - Product management
  - User management
  - Analytics dashboard
  - PDF report generation

- **Additional Features**
  - AI chatbot assistant
  - Promotional offers
  - Responsive design
  - Rating system

## 🛠️ Tech Stack

### Frontend
- Vue.js 3
- Pinia (State Management)
- Tailwind CSS
- Headless UI
- Vue Router
- Axios
- Chart.js
- jsPDF

### Backend
- ASP.NET Web API
- Entity Framework Core
- SQL Server
- JWT Authentication
- Stripe API

## 📋 Prerequisites

- Node.js (v14+)
- npm or yarn
- .NET 8.0
- SQL Server

## ⚙️ Installation

1. Clone the repositories:
```bash
git clone https://github.com/StiliyanIliev27/SmartHomeApplianceFE
git clone https://github.com/StiliyanIliev27/SmartHomeApplianceBE
```

2. Frontend setup:
```bash
cd SmartHomeApplianceFE
npm install
```

3. Backend setup:
```bash
cd SmartHomeApplianceBE
dotnet restore
```

4. Run the application (before running, please see the next steps - Configuration and Required Services, so the application run flow is setup correctly):

Frontend:
```bash
npm run dev
```

Backend:
```bash
dotnet run
```


## 🔧 Configuration

### Frontend Environment Variables
Create a `.env` file in the frontend root directory:
```
VITE_STRIPE_PUBLIC_KEY=pk_test_51PLsAdCeu6PQ0cnAbXxWH5VXyiNJDlm1tEVmV3AW0aUMeLe6FTUlNkzbO74vMttvH8WDWBCfykz0FhEvPtSsCzPS00mhnowUTF
```

### Backend Configuration
First open .sln file in Visual Studio
Then open `secrets.json`, by clicking the right mouse button on SmartHomeAppliance.API and then "Manage User Secrets", file with the following structure (replace with your values):
```json
{
  "Stripe": {
    "SecretKey": "your_stripe_secret_key",
    "PublishableKey": "your_stripe_publishable_key",
    "WebhookSecret": "your_stripe_webhook_secret"
  },
  "SMTP": {
    "Username": "your_email@gmail.com",
    "Port": "465",
    "Password": "your_app_specific_password",
    "Host": "smtp.gmail.com",
    "BypassCertificateValidation": "true"
  },
  "Jwt": {
    "Key": "your_jwt_secret_key",
    "Issuer": "YourAppIssuer",
    "ExpiryMinutes": "60",
    "Audience": "YourAppAudience"
  },
  "FrontendUrl": "http://localhost:5173",
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=SmartHomeApplianceDatabase;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true;"
  },
  "Cloudinary": {
    "CloudName": "your_cloud_name",
    "ApiKey": "your_api_key",
    "ApiSecret": "your_api_secret"
  }
}
```

### Required Services
1. **SQL Server**
   - Install SQL Server
   - Create a database named "SmartHomeApplianceDatabase"

2. **Email Service**
   - Gmail account with App-specific password
   - Configure SMTP settings in secrets.json

3. **Stripe Account**
   - Create a Stripe account
   - Configure webhook endpoints
   - Add Stripe keys to configuration

4. **Cloudinary Account**
   - Set up a Cloudinary account
   - Configure Cloudinary credentials for image management
  

## 📝 License

[MIT](LICENSE)

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:
- Fork the repository.
- Create a new branch: `git checkout -b feature-name`.
- Make your changes and commit them: `git commit -m 'Add feature'`.
- Push to the branch: `git push origin feature-name`.
- Submit a pull request..

## 📧 Contact

Stiliyan Iliev - stiliyaniliev2705@gmail.com

Project Link: https://github.com/StiliyanIliev27/SmartHomeApplianceFE

## 🙏 Acknowledgments

- [Tailwind CSS](https://tailwindcss.com)
- [Vue.js](https://vuejs.org)
- [ASP.NET](https://dotnet.microsoft.com/apps/aspnet)
- [Stripe](https://stripe.com)
