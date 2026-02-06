# Payment Pulse - Customer Risk Analysis System

Version 2.1.0 - Updated with all requested features

## ✨ New Features Implemented

### 1. **Functional Alert System**
- Bell icon in navbar shows real-time alerts
- Alerts for high-risk customers, overdue payments, and upcoming payments
- Unread count badge and mark-as-read functionality

### 2. **Modified Quick Actions**
- **Removed**: Upload Data, Apply Filter, Send Alerts buttons
- **Kept**: Export Data button (generates PDF reports)

### 3. **PDF Export Functionality**
- Generate individual PDF reports per customer
- Includes last 3 months payment history
- Shows upcoming payments with due dates
- Professional formatting in ₹ INR currency
- Downloadable and shareable

### 4. **Currency Conversion**
- **ALL $ symbols replaced with ₹ (INR)**
- Applied across dashboard, analytics, reports, and PDFs

### 5. **Add New Customer**
- Manual customer entry form
- Fields match CSV schema exactly
- Auto-calculates risk score
- CSV upload functionality preserved

### 6. **Edit & Delete Customer**
- **Edit**: Update customer details while preserving history
- **Delete**: Confirmation dialog before permanent deletion
- Both integrated into Customer List view

### 7. **View Transactions**
- Shows last 3 payments for each customer
- Displays payment date, amount (₹), and status
- Available as inline panel in customer cards

### 8. **Preserved Features**
- ✅ CSV upload flow
- ✅ AI Behavioral Analysis
- ✅ Risk score calculation
- ✅ Dashboard metrics
- ✅ Advanced analytics

## 🚀 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 📦 Dependencies

- React 18.2+
- TypeScript
- Vite
- Tailwind CSS
- Supabase Client
- Lucide React (icons)
- jsPDF (PDF generation)

## 🎨 Theme

Clean, professional design with Payment Pulse color scheme:
- Primary: #1b4079 (Blue)
- Secondary: #4d7c8a (Steel Blue)
- Accents: Green tones
- No "royal" references

## 💾 Database Setup

Ensure your Supabase instance has the following tables:
- `customers` - Customer records
- `uploaded_files` - File upload tracking
- `analysis_results` - AI analysis data

## 📝 CSV Format

```csv
name,email,phone,outstanding_amount,days_overdue
John Doe,john@example.com,+91 1234567890,5000,30
Jane Smith,jane@example.com,+91 9876543210,10000,45
```

## 🔒 Security

- Authentication via Supabase
- Row-level security enabled
- User-specific data isolation

## 📞 Support

For issues or questions, please contact the development team.

---

**Payment Pulse v2.1** - Professional Customer Risk Analysis
