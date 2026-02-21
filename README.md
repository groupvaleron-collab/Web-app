# Carz - Premium Vehicle Import Web Application

A comprehensive web application for vehicle import services in Sri Lanka, built with Next.js 14, TypeScript, and Tailwind CSS.

## 🌟 Features

### 🏠 Home Page
- Hero section with animated content and CTAs
- Why Choose Us - Feature cards showcasing company strengths
- Import Process Timeline - Visual step-by-step guide
- Featured Stock Preview - Latest available vehicles
- Customer Reviews Carousel
- FAQ Accordion Section
- Contact Form with Google Maps integration
- WhatsApp integration

### 🚗 Vehicle Stock
- Advanced filtering (Brand, Model, Year, Price, Transmission, Fuel Type, Status)
- Grid/List view toggle
- Vehicle cards with image carousel
- Import status badges (Available, Reserved, Sold)
- Location status indicators (Received, Shipping, Auction, Customs)
- Sort options (Price, Year, Mileage)

### 📄 Vehicle Details
- Full image gallery with fullscreen mode
- Comprehensive specifications
- Features list
- Inquiry form
- Reserve vehicle (for authenticated users)
- WhatsApp/Call integration
- Auction sheet & condition report links

### ⭐ Customer Reviews
- Average rating display with breakdown
- Filter by star rating
- Verified buyer badges
- Add review (for authenticated users)

### 🧮 Import Calculator
- Calculate total import costs
- CIF Value calculation
- Tax calculation
- Cost breakdown
- Save calculations (for logged-in users)
- Export as PDF
- Tooltips for each field

### 👤 Client Dashboard (Protected)
- Order overview with stats
- Vehicle tracking with progress timeline
- Document management (upload/download)
- Notifications panel
- Account settings

### 🔧 Admin Panel (Protected)
- Dashboard with analytics
- Vehicle inventory management (CRUD)
- Order management
- Review moderation
- User management
- Settings configuration

### 🔐 Authentication
- Google OAuth integration
- Protected routes
- Role-based access (User/Admin)

## 🎨 Theme

Green mixed light theme with:
- Light background (#F4FFF6)
- Dark green primary buttons
- Soft green accents
- Rounded cards
- Smooth animations
- Clean typography
- Modern minimal style

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** NextAuth.js
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **PDF Export:** jsPDF

## 📁 Project Structure

```
src/
├── app/
│   ├── api/auth/[...nextauth]/  # NextAuth API routes
│   ├── admin/                    # Admin panel
│   ├── auth/                     # Auth pages (signin, error)
│   ├── calculator/               # Import calculator
│   ├── dashboard/                # Client dashboard
│   ├── reviews/                  # Customer reviews
│   ├── stocks/                   # Vehicle stock listing
│   │   └── [id]/                 # Vehicle details (dynamic)
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/
│   ├── home/                     # Home page sections
│   ├── layout/                   # Navbar, Footer
│   ├── providers/                # Context providers
│   └── vehicles/                 # Vehicle components
└── data/
    └── mockData.ts               # Mock data and types
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
cd /Users/adithya/Documents/Carz/WEB_APPLICATION
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your credentials to `.env.local`:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Setting up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth Client ID
5. Choose Web Application
6. Add Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
7. Copy Client ID and Client Secret to `.env.local`

### Running the App

Development:
```bash
npm run dev
```

Build for production:
```bash
npm run build
npm start
```

## 📱 Pages

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/` | Home page | No |
| `/stocks` | Vehicle listing | No |
| `/stocks/[id]` | Vehicle details | No |
| `/calculator` | Import calculator | No |
| `/reviews` | Customer reviews | No |
| `/dashboard` | Client dashboard | Yes |
| `/admin` | Admin panel | Yes (Admin) |
| `/auth/signin` | Sign in page | No |

## 🔒 Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXTAUTH_URL` | Your application URL |
| `NEXTAUTH_SECRET` | Random secret for NextAuth |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret |

## 📄 License

This project is proprietary software for Carz Vehicle Imports.

## 📞 Contact

- Phone: 037 037 6789
- Email: info@carz.lk
- Website: www.carz.lk
