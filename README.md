# 💱 ForexPro - Intelligent Currency Conversion Platform

![ForexPro Banner](https://img.shields.io/badge/ForexPro-Currency%20Conversion-blue?style=for-the-badge&logo=java)
![Java](https://img.shields.io/badge/Java-17-orange?style=flat-square&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.14-green?style=flat-square&logo=springboot)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=flat-square&logo=mysql)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple?style=flat-square&logo=bootstrap)

## 🚀 Live Demo
> Run locally at `http://localhost:8081`

---

## 📋 About The Project

**ForexPro** is a modern full-stack web application for real-time currency
conversion and analytics. Built with Java Spring Boot backend and
Bootstrap 5 frontend, it provides live exchange rates, historical
charts, AI predictions, and comprehensive forex analytics.

---

## ✨ Features

### Core Features
- 💱 **Real-time Currency Conversion** — Convert 150+ currencies instantly
- 📊 **Live Exchange Rates** — Auto-refreshing rate ticker
- 🔄 **Swap Currencies** — One-click currency swap
- ⭐ **Favorite Pairs** — Save frequently used pairs
- 📈 **Historical Charts** — 7D, 30D, 90D trend analysis
- 🔮 **AI Prediction** — SMA, Linear Regression, WMA algorithms

### User Features
- 🔐 **Secure Login** — Spring Security authentication
- 👤 **User Dashboard** — Personal conversion dashboard
- 📋 **Conversion History** — Full history with search & filter
- 📥 **Export Data** — CSV, Excel, PDF export

### Advanced Features
- 🎤 **Voice Commands** — "Convert 100 USD to EUR"
- 🌙 **Dark/Light Theme** — Persistent theme preference
- 📰 **Forex News** — Latest market news & analysis
- 📅 **Economic Calendar** — Upcoming market events
- 📱 **Responsive UI** — Works on all devices
- 🔌 **Offline Cache** — Service Worker for offline use

---

## 🛠️ Built With

| Technology | Version | Purpose |
|-----------|---------|---------|
| Java | 17 | Backend language |
| Spring Boot | 3.5.14 | Application framework |
| Spring Security | 6.x | Authentication |
| Spring Data JPA | 3.x | Database ORM |
| MySQL | 8.0.46 | Database |
| Thymeleaf | 3.x | Template engine |
| Bootstrap | 5.3.0 | UI framework |
| Chart.js | 4.4.0 | Interactive charts |
| Maven | 3.9.16 | Build tool |

---

## 📡 APIs Used

| API | Purpose | Cost |
|-----|---------|------|
| ExchangeRate-API | Live exchange rates | Free |
| Frankfurter API | Historical rates | Free |

---

## 🗄️ Database Schema
forexpro_db
├── users
├── conversion_history
├── favorite_pairs
├── exchange_rates_cache
├── historical_rates
└── user_alerts

---

## ⚡ Quick Start

### Prerequisites
- Java 17+
- MySQL 8.0+
- Maven 3.9+

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/Ayushyeole18/Forexpro.git
cd Forexpro
```

**2. Setup MySQL Database**
```sql
CREATE DATABASE forexpro_db;
```

**3. Configure application.properties**
```properties
spring.datasource.password=your_mysql_password
exchangerate.api.key=your_api_key
```

**4. Run the application**
```bash
mvn spring-boot:run
```

**5. Open browser**
http://localhost:8081
---

## 📸 Screenshots

### Home Page
> Real-time currency converter with live rate ticker

### Dashboard
> Personal dashboard with conversion stats and quick converter

### Analytics
> Historical charts and AI prediction tools

### News
> Latest forex news and economic calendar

---

## 🔑 Demo Credentials

| Username | Password | Role |
|----------|----------|------|
| admin | password | Admin |
| john | password | User |
| jane | password | User |

---

## 📁 Project Structure
forexpro/
├── src/main/java/com/forexpro/
│   ├── config/          # Security & Web config
│   ├── controller/      # REST & MVC controllers
│   ├── dto/             # Data Transfer Objects
│   ├── entity/          # JPA entities
│   ├── repository/      # Data repositories
│   └── service/         # Business logic
├── src/main/resources/
│   ├── static/
│   │   ├── css/         # Stylesheets
│   │   └── js/          # JavaScript files
│   └── templates/       # Thymeleaf HTML templates
└── pom.xml

---

## 🤝 Contributing

1. Fork the project
2. Create your feature branch
   (`git checkout -b feature/AmazingFeature`)
3. Commit your changes
   (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch
   (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License.

---

## 👨‍💻 Author

**Ayush Yeole**

- GitHub: [@Ayushyeole18](https://github.com/Ayushyeole18)
- LinkedIn: [Ayush Yeole](https://linkedin.com/in/ayushyeole)
- Email: ayushyeole18@gmail.com

---

## 🙏 Acknowledgments

- [ExchangeRate-API](https://exchangerate-api.com)
- [Frankfurter API](https://frankfurter.app)
- [Bootstrap](https://getbootstrap.com)
- [Chart.js](https://chartjs.org)
- [Spring Boot](https://spring.io/projects/spring-boot)

---

⭐ **If you found this project helpful, please give it a star!** ⭐
