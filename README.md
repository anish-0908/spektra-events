# 🎭 Spektra Events - EventVerse

A modern, feature-rich event booking platform built with React, Vite, and Razorpay integration.

![Spektra Events](https://img.shields.io/badge/React-19.2.6-blue)
![Vite](https://img.shields.io/badge/Vite-8.0.12-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.3.0-cyan)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 🎫 User Features
- **Browse Events** - Movies, Concerts, Sports, Theatre, Comedy
- **City-Based Filtering** - Events filtered by selected city
- **Seat Selection** - Interactive seat map with categories (Premium, Gold, Silver)
- **Simple Booking** - One-click booking confirmation
- **Promo Codes** - Apply discount codes at checkout
- **Booking History** - View all your past bookings
- **Beautiful UI** - Modern dark theme with smooth animations

### 👨‍💼 Admin Features
- **Analytics Dashboard** - Revenue, bookings, tickets sold metrics
- **Event Management** - Add, edit, delete events
- **Category Breakdown** - Visual charts for events by category
- **City Distribution** - Track events across cities

### 💳 Booking System
- **Simple Checkout** - Easy one-click booking
- **Booking Confirmation** - Instant confirmation
- **Ticket Generation** - Beautiful ticket cards after booking

## � Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/anish-0908/spektra-events.git
   cd spektra-events
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   ```
   http://localhost:5173
   ```

## 🎯 Usage

### User Login
```
Email: test@user.com
Password: anything
```

### Admin Login
```
Email: admin@spektra.com
Password: admin123
```

### Test Payment Credentials

**Simple Booking:**
- Just click "Confirm Booking" button
- No payment gateway needed
- Instant booking confirmation

## 📁 Project Structure

```
spektra-events/
├── src/
│   ├── assets/          # Images and static files
│   ├── components/      # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── EventCard.jsx
│   │   ├── SeatMap.jsx
│   │   ├── TicketCard.jsx
│   │   └── ...
│   ├── pages/           # Page components
│   │   ├── Home.jsx
│   │   ├── Browse.jsx
│   │   ├── EventDetail.jsx
│   │   ├── SeatSelection.jsx
│   │   ├── Checkout.jsx
│   │   ├── Admin.jsx
│   │   └── ...
│   ├── context/         # React Context
│   │   ├── AuthContext.jsx
│   │   └── BookingContext.jsx
│   ├── services/        # API services
│   │   ├── api.js
│   │   └── payment.js
│   ├── data/            # Mock data
│   │   └── mockData.js
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── public/              # Public assets
├── .env                 # Environment variables
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
└── tailwind.config.js   # Tailwind configuration
```

## �️ Tech Stack

### Frontend
- **React 19.2.6** - UI library
- **Vite 8.0.12** - Build tool
- **React Router 7.15.0** - Routing
- **Tailwind CSS 4.3.0** - Styling
- **Framer Motion 12.38.0** - Animations
- **Lucide React 1.14.0** - Icons

### State Management
- **React Context API** - Global state management
- **localStorage** - Data persistence

## 📦 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 🎨 Features in Detail

### Event Booking Flow
1. User browses events by category or city
2. Selects event and views details
3. Chooses showtime and seats
4. Applies promo code (optional)
5. Confirms booking with one click
6. Receives booking confirmation with ticket

### Admin Dashboard
- View real-time analytics
- Manage events (CRUD operations)
- Track bookings and revenue
- Monitor category and city distribution

### Payment System
- Simple one-click booking
- Instant booking confirmation
- Automatic ticket generation

## 🔒 Security

- Environment variables for sensitive data
- Payment signature verification
- Secure localStorage implementation
- Input validation and sanitization

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📱 Responsive Design

Fully responsive design that works on:
- Desktop (1920x1080+)
- Laptop (1366x768+)
- Tablet (768x1024)
- Mobile (375x667+)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## �‍💻 Author

**Anish**
- GitHub: [@anish-0908](https://github.com/anish-0908)

## 🙏 Acknowledgments

- Razorpay for payment gateway
- Unsplash for placeholder images
- Lucide for beautiful icons
- Tailwind CSS for styling utilities

## 📞 Support

For support, email your-email@example.com or open an issue on GitHub.

## 🚀 Deployment to Vercel

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub

2. **Import Repository**
   - Click "Add New" → "Project"
   - Select your GitHub repository: `spektra-events`
   - Click "Import"

3. **Configure Project**
   - Framework Preset: **Vite** (auto-detected)
   - Build Command: `npm run build` (auto-filled)
   - Output Directory: `dist` (auto-filled)
   - Install Command: `npm install` (auto-filled)

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app is live! 🎉

### Method 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? spektra-events
# - Directory? ./
# - Override settings? No

# Deploy to production
vercel --prod
```

### After Deployment

1. **Get Your URL**
   - Vercel will provide a URL like: `https://spektra-events.vercel.app`

2. **Update GitHub Repository**
   - Add the URL to your repository description
   - Add it to the "Website" field in repository settings

3. **Test Your Deployment**
   - Visit the URL
   - Test login, booking, and payment features
   - Verify everything works

### Automatic Deployments

Once connected to GitHub:
- ✅ Every push to `main` branch auto-deploys to production
- ✅ Pull requests get preview deployments
- ✅ Rollback to previous versions anytime

## 📝 Notes

- This project uses localStorage for data persistence (no backend required)
- Razorpay is in test mode - use test credentials for payments
- Admin credentials are hardcoded for demo purposes

## 🎉 Demo

Live Demo: [https://spektra-events.vercel.app](https://spektra-events.vercel.app) (Deploy to get your URL)

---

Made with ❤️ by Anish
