# Payment Pulse - Intelligent B2B Debt Recovery Dashboard

![Payment Pulse Banner]

Payment Pulse is a cutting-edge **AI-powered Debt Recovery Platform** designed to help businesses manage customer risk, analyze outstanding debts, and automate recovery strategies. Unlike traditional credit scores (CIBIL) which look backward, Payment Pulse looks forward—using behavioral data to predict payment probability in real-time.

## 🌟 Unique Selling Propositions (USP)

-   **Real-Time Intelligence**: Instantly updates risk scores based on live payment behavior.
-   **Predictive AI**: Forecasts recovery probability with 92% accuracy using the Gemini 1.5 Flash model.
-   **Actionable Strategy**: Doesn't just flag risks—tells you *exactly* what to do (e.g., "Call now," "Send legal notice").
-   **Emotion-Detection AI**: Distinguishes between customers who *can't* pay vs. those who *won't* pay.

---

## 🚀 Key Features

### 🧠 Core Intelligence
-   **Advanced Risk Engine**: Calculates a proprietary 0-100 risk score based on:
    -   Days Overdue (40% weight)
    -   Outstanding Amount (30% weight)
    -   Payment Behavior Patterns (20% weight)
    -   Recency of Engagement (10% weight)
-   **Behavioral Analysis**: Identifies patterns like "Chronic Delinquency," "Strategic Avoider," or "Inconsistent Payer."
-   **Smart Ranking**: Automatically prioritizes high-risk customers so agents focus on the biggest fires first.

### 💻 Dashboard & UI
-   **"Royal UI" Design**: A premium interface featuring Deep Blue (#1b4079) and Gold accents for a trustworthy, institutional feel.
-   **Interactive Visualization**: Real-time charts for Total Outstanding, Recovery Rate, and High-Risk Customer counts.
-   **Customer Management**:
    -   **Bulk Upload**: Import thousands of customers via CSV.
    -   **Smart Filters**: Sort by Risk Category (Low/Moderate/High) or Status.
    -   **Bulk Actions**: Select multiple customers to delete or analyze.

### 🤖 AI Agent & Chatbot
-   **Integrated Support Bot**: Powered by **Google Gemini 1.5 Flash**.
-   **Context-Aware**: The bot understands the full "Payment Pulse" context, products, and features.
-   **Smart Handover**: Automatically directs complex legal/technical queries to human customer support.

### 💳 Payments & Integrations
-   **Simulated Payments**: Demo capability for GPay and UPI synchronization.
-   **Payment Links**: Generates payment links and QR codes for immediate settlement.
-   **Razorpay Integration**: (Ready for production) supports creating actual payment links via Razorpay API.
-   **Discount Engine**: Automatically calculates early payment discounts to incentivize recovery.

### 📄 Reporting & Automation
-   **One-Click PDF Reports**: Generates professional, branded outstanding statements for any customer.
-   **Automated Workflows**: Suggests specific scripts for Emails, SMS, and Phone calls based on risk severity.
-   **Transaction History**: View past payment trends and partial payments.

---

## �️ Tech Stack & APIs

### Frontend
-   **React (Vite)**: High-performance component-based UI.
-   **TypeScript**: For type-safe, robust code.
-   **Tailwind CSS**: Utility-first styling for the "Royal UI" theme.
-   **Lucide React**: Premium icon set.

### Backend & Database
-   **Supabase**:
    -   **PostgreSQL Database**: Stores customer data, transactions, and analysis results.
    -   **Auth**: Secure email/password and Google authentication.
    -   **Row Level Security (RLS)**: Ensures data privacy.

### AI & Intelligence
-   **Google Gemini API (gemini-1.5-flash)**:
    -   Powers the "AI Analysis" feature for detailed risk breakdowns.
    -   Drives the conversational Customer Support Chatbot.

### Utilities & Integrations
-   **Razorpay SDK**: For generating payment links and handling transactions.
-   **QRCode**: Generates UPI QR codes for immediate payment facilitation.
-   **jsPDF**: Client-side PDF generation for reports.
-   **Papaparse**: Robust CSV parsing for bulk uploads.
-   **Date-fns**: Date manipulation and formatting.

---

## 📦 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/krishgit24/payment-pulse-hackathon.git
    cd payment-pulse-hackathon
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory with the following keys:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    VITE_GEMINI_API_KEY=your_gemini_api_key
    # Optional for Payment Features
    VITE_RAZORPAY_KEY_ID=your_razorpay_key
    VITE_RAZORPAY_KEY_SECRET=your_razorpay_secret
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

---

## � Database Schema (Supabase)

-   **`customers`**: Stores core customer data (id, name, email, outstanding_amount, days_overdue, risk_score).
-   **`transactions`**: Records payment history and partial payments.
-   **`analysis_results`**: Caches AI-generated risk reports to reduce API costs.

---

## 🤝 Support

For support, email **support@paymentpulse.com** or call **+1 (888) PAY-PULSE**.

---
*Payment Pulse v2.1.0 — Intelligent Debt Solutions*
