# 🏠 HomeCraft - Smart Home E-Commerce Platform

<div align="center">
  <h3>🌟 Where Innovation Meets Comfort 🌟</h3>
  
  ![GitHub last commit](https://img.shields.io/github/last-commit/StiliyanIliev27/SmartHomeApplianceFE)
  ![GitHub repo size](https://img.shields.io/github/repo-size/StiliyanIliev27/SmartHomeApplianceFE)
  ![GitHub stars](https://img.shields.io/github/stars/StiliyanIliev27/SmartHomeApplianceFE)
  ![GitHub forks](https://img.shields.io/github/forks/StiliyanIliev27/SmartHomeApplianceFE)
  [![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
</div>

## 🎯 Overview

HomeCraft is a modern e-commerce platform for smart home devices built with Vue.js and ASP.NET Web API. The platform offers an intuitive user interface, AI chatbot assistant, and complete online shopping functionality.

### 🌟 Project Goals
- Provide a seamless shopping experience for smart home devices
- Offer intelligent product recommendations through AI
- Enable real-time support through chatbot integration
- Ensure secure and efficient payment processing
- Deliver comprehensive admin tools for platform management

![Home-Page](https://github.com/user-attachments/assets/d4c0d272-47c8-4c6c-8815-b7831df05cf7)

## ✨ Key Features

### 🔐 Authentication & Authorization
  - 🎫 JWT-based authentication
  - 👥 Role-based access (User/Admin)
  - ✉️ Email confirmation
  - 🔑 Password recovery

### 🛍️ Shopping Experience
  - 📱 Product catalog
  - 🛒 Shopping cart
  - 💳 Stripe payment integration
  - 📦 Order tracking

### 👨‍💼 Admin Features
  - 📝 Product management
  - 👥 User management
  - 📊 Analytics dashboard
  - 📄 PDF report generation

### 🎯 Additional Features
  - 🤖 AI chatbot assistant
  - 🏷️ Promotional offers
  - 📱 Responsive design
  - ⭐ Rating system

## 💻 Tech Stack

### 🎨 Frontend
- ⚡ Vue.js 3
- 🏪 Pinia (State Management)
- 🎭 Tailwind CSS
- 🎯 Headless UI
- 🛣️ Vue Router
- 🔄 Axios
- 📊 Chart.js
- 📄 jsPDF

### ⚙️ Backend
- 🔧 ASP.NET Web API
- 🗃️ Entity Framework Core
- 💾 SQL Server
- 🔒 JWT Authentication
- 💳 Stripe API

## 📌 Prerequisites

- 📦 Node.js (v14+)
- 📥 npm or yarn
- 🎯 .NET 8.0
- 🗄️ SQL Server

## 🚀 Installation

1. 📥 Clone the repositories:
```bash
git clone https://github.com/StiliyanIliev27/SmartHomeApplianceFE
git clone https://github.com/StiliyanIliev27/SmartHomeApplianceBE
```

2. 🎨 Frontend setup:
```bash
cd SmartHomeApplianceFE
npm install
```

3. ⚙️ Backend setup:
```bash
cd SmartHomeApplianceBE
dotnet restore
```

4. 🏃‍♂️ Run the application:

Frontend:
```bash
npm run dev
```

Backend:
```bash
dotnet run
```

## ⚙️ Configuration

### 🎨 Frontend Environment Variables
Create a `.env` file in the frontend root directory:
```
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

### 🔧 Backend Configuration
1. Open `.sln` file in Visual Studio
2. Right-click on SmartHomeAppliance.API → Manage User Secrets
3. Add the following structure:
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

## 🔌 Required Services

### 1. 💾 SQL Server
- Install SQL Server
- Create database "SmartHomeApplianceDatabase"

### 2. 📧 Email Service
- Gmail account setup
- SMTP configuration

### 3. 💳 Stripe Account
- Account setup
- Webhook configuration
- API keys

### 4. ☁️ Cloudinary Account
- Account setup
- Media management credentials

## 📄 License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details. 📜

## 📈 Future Improvements

- [ ] Implement real-time notifications
- [ ] Add real-time chat and connection between users in the application
- [ ] Add multi-language support
- [ ] Enhance mobile experience
- [ ] Implement progressive web app features
- [ ] Add more payment methods
- [ ] Deployment and CI/CD pipeline

## 🤝 Contributing

We ❤️ contributions! Here's how:
1. 🍴 Fork the repository
2. 🌿 Create feature branch
3. 💻 Make changes
4. 🚀 Submit PR

## 📞 Contact

👨‍💻 **Stiliyan Iliev**
- 📧 Email: stiliyaniliev2705@gmail.com
- 🌐 GitHub: [@StiliyanIliev27](https://github.com/StiliyanIliev27)

## 💝 Acknowledgments

- 🎨 [Tailwind CSS](https://tailwindcss.com)
- ⚡ [Vue.js](https://vuejs.org)
- 🔧 [ASP.NET](https://dotnet.microsoft.com/apps/aspnet)
- 💳 [Stripe](https://stripe.com)

---
<div align="center">
  Made with ❤️ by Stiliyan Iliev
</div>
