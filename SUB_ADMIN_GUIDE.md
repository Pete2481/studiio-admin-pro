# Sub Admin Dashboard - Quick Start Guide

## 🚀 Accessing the Sub Admin Dashboard

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Access the Demo
- Open your browser and go to: `http://localhost:5173/demo`
- Click "Access Dashboard" to enter the tenant selection

### 3. Select a Tenant
- Choose "Studiio Pro" (SUB_ADMIN role) or "Photo Studio" (MASTER_ADMIN role)
- You'll be redirected to the tenant-specific admin dashboard

## 🏗️ Sub Admin Dashboard Features

### Dashboard Overview
- **Stats Cards**: Total Users, Bookings, Galleries, Revenue
- **Quick Actions**: Add User, New Booking, Create Gallery, New Invoice
- **Recent Activity**: Latest bookings with status indicators
- **System Overview**: Key metrics and performance indicators

### Available Routes
- `/t/studiio-pro/admin` - Studiio Pro Sub Admin Dashboard
- `/t/photo-studio/admin` - Photo Studio Master Admin Dashboard
- `/tenant-select` - Tenant Selection Page

## 🔧 Development Features

### Mock Data
- **Mock Session**: Pre-configured user session for development
- **Mock Tenants**: Two sample tenants with different roles
- **Mock Stats**: Sample dashboard statistics

### Authentication
- **Passwordless Auth**: Email magic link authentication (configured but not active in demo)
- **Session Management**: 30-day rolling sessions
- **Role-Based Access**: Different permissions per tenant

## 📊 Dashboard Components

### Stats Grid
- **Total Users**: Number of users in the tenant
- **Total Bookings**: All bookings (pending, completed, cancelled)
- **Total Galleries**: Photo galleries created
- **Revenue**: Total revenue generated

### Quick Actions
- **Add User**: Invite new users to the tenant
- **New Booking**: Create a new photography booking
- **Create Gallery**: Set up a new photo gallery
- **New Invoice**: Generate an invoice for services

### Recent Activity
- **Booking Status**: Pending, Completed, Cancelled
- **Timestamps**: When bookings were created/updated
- **Visual Indicators**: Color-coded status badges

## 🎯 Next Steps

### For Production
1. **Database Setup**: Configure PostgreSQL and run migrations
2. **Email Configuration**: Set up SMTP for magic links
3. **Real Authentication**: Replace mock session with real NextAuth
4. **API Integration**: Connect dashboard to real data sources

### For Development
1. **Add More Features**: User management, booking creation
2. **Enhance UI**: More interactive components
3. **Add Tests**: Unit and integration tests
4. **Performance**: Optimize loading and rendering

## 🔐 Security Notes

- **Role-Based Access**: Different permissions per user role
- **Tenant Isolation**: Complete data separation between tenants
- **Session Security**: Secure cookies and session management
- **Route Protection**: Middleware-based access control

## 📱 Responsive Design

The dashboard is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🎨 Customization

### Branding
- Tenant-specific colors and logos
- Customizable dashboard themes
- Brand-specific styling

### Features
- Modular component architecture
- Easy to add new dashboard widgets
- Configurable quick actions

---

**Ready to explore?** Visit `http://localhost:5173/demo` and click "Access Dashboard" to get started!









