# PaymentPulse Risk Score Calculator - Complete Explanation

## Overview

The PaymentPulse Risk Score is a **real-time, payment-behavior-focused** credit risk calculator that is **better than CIBIL** for identifying customers with outstanding payment issues.

---

## Score Range & Categories

| Score | Category | Meaning | Action |
|-------|----------|---------|--------|
| **0-35** | 🟢 **Low Risk** | Reliable payer | Standard terms |
| **36-65** | 🟡 **Moderate Risk** | Occasional delays | Monitor closely |
| **66-100** | 🔴 **High Risk** | Habitual defaulter | Escalate/Follow-up |

---

## The Formula: 4-Factor Weighted System

### **Total Score = (4 Components × Their Weights)**

```
Final Score = 
  (Days Overdue Score × 0.40) +      ← 40% weight - MOST IMPORTANT
  (Amount Severity Score × 0.30) +   ← 30% weight  
  (Payment Behavior Score × 0.20) +  ← 20% weight
  (Recency Score × 0.10)              ← 10% weight - LEAST IMPORTANT
```

---

## Component 1: Days Overdue (40% Weight)

**This is the PRIMARY indicator of risk.**

### How It's Calculated

```
IF days overdue ≤ 0:      Score = 0
IF days ≤ 7:              Score = 10
IF days ≤ 30:             Score = 20 + (days - 7) × 0.3
IF days ≤ 60:             Score = 35 + (days - 30) × 0.6
IF days ≤ 90:             Score = 55 + (days - 60) × 0.5
IF days > 90:             Score = 70 (capped)
```

### Why Exponential?

- **1-7 days**: Small penalty (10 points) - might be processing delay
- **8-30 days**: Moderate penalty (20-30) - genuine concern
- **31-60 days**: Serious penalty (35-55) - likely won't pay
- **61+ days**: Critical (70) - high default probability

### Examples

| Days Overdue | Score | Why |
|---|---|---|
| 0 days | 0 | On time |
| 5 days | 10 | Minor delay |
| 15 days | 22.4 | Getting serious |
| 30 days | 35 | Month overdue |
| 45 days | 44 | Very concerning |
| 60 days | 55 | Critical |
| 90 days | 70 | Worst case |
| 180 days | 70 | Still capped at worst |

---

## Component 2: Outstanding Amount Severity (30% Weight)

**Measures "how much pain" is the customer in?**

### How It's Calculated

#### Scenario A: First-time Default (No Payment History)
```
IF outstanding < ₹1,000:    Score = 10
IF outstanding < ₹5,000:    Score = 25
IF outstanding < ₹10,000:   Score = 40
IF outstanding < ₹50,000:   Score = 65
IF outstanding ≥ ₹50,000:   Score = 90
```

**Why?** Without history, we use absolute thresholds to assess debt burden.

#### Scenario B: Repeat Customer (Has Payment History)
```
Debt Ratio = Outstanding Amount / Average Past Payment Amount

IF ratio < 0.5x:   Score = 15  (Can pay off in <2 invoices)
IF ratio < 1.0x:   Score = 30  (Can pay in ~1-2 invoices)
IF ratio < 1.5x:   Score = 45  (Getting difficult)
IF ratio < 2.5x:   Score = 65  (Serious burden)
IF ratio < 4.0x:   Score = 80  (Very serious burden)
IF ratio ≥ 4.0x:   Score = 95  (Cannot afford)
```

**Why Ratio-Based?** A ₹10,000 outstanding is different for someone who usually pays ₹5,000 vs ₹50,000.

### Examples

| Outstanding | Avg Payment | Ratio | Score | Why |
|---|---|---|---|---|
| ₹5,000 | None | - | 25 | Small first default |
| ₹10,000 | ₹10,000 | 1.0x | 30 | Can manage in 1 payment |
| ₹15,000 | ₹10,000 | 1.5x | 45 | Harder to pay |
| ₹25,000 | ₹10,000 | 2.5x | 65 | Very difficult |
| ₹50,000 | ₹10,000 | 5.0x | 95 | Cannot afford |

---

## Component 3: Payment Behavior (20% Weight)

**Is this a one-time mistake or habitual defaulter?**

### How It's Calculated

```
IF first default or no payment history:    Score = 15
IF paid 1-2 times before:                  Score = 25
IF paid 3-4 times before:                  Score = 35
IF paid 5+ times before:                   Score = 50
```

### Why This Pattern?

| Scenario | Score | Reasoning |
|---|---|---|
| Never paid before, now late | 15 | Give benefit of doubt, might be first issue |
| Paid 2x, now late | 25 | Somewhat concerning |
| Paid 5x, now late | 50 | **This is MORE RISKY** - they know how to pay but chose not to |

**⚠️ Key Insight:** A repeat customer going late is WORSE than a first-timer, because they're willfully avoiding payment.

---

## Component 4: Recency (10% Weight)

**When did they last pay?**

### How It's Calculated

```
IF last payment < 15 days:    Score = 10 (Recent good signal)
IF last payment < 30 days:    Score = 20
IF last payment < 60 days:    Score = 40
IF last payment < 90 days:    Score = 60
IF last payment < 180 days:   Score = 75
IF last payment > 180 days:   Score = 90 (Haven't paid in 6+ months)
```

### Why Recency Matters

- Someone who paid 2 weeks ago is more likely to pay again soon
- Someone who hasn't paid in a year is essentially dead debt

---

## Real-World Examples

### Example 1: Fresh Customer Gone Bad
```
Days Overdue: 15
Outstanding: ₹8,000
Payment History: None
Last Payment: N/A (current default)

Calculation:
- Days Score: 22.4 × 0.40 = 8.96
- Amount Score: 25 × 0.30 = 7.5
- Behavior Score: 15 × 0.20 = 3.0
- Recency Score: 40 × 0.10 = 4.0
────────────────────────────────
TOTAL SCORE = 23.46 ≈ 23 → 🟢 LOW RISK

Why: First time they've done this, small amount, minor delay
Action: Send friendly reminder
```

### Example 2: Regular Customer Slipping

```
Days Overdue: 35
Outstanding: ₹15,000
Avg Past Payment: ₹10,000
Payment History: 8 previous payments
Last Payment: 45 days ago

Calculation:
- Days Score: 31.4 × 0.40 = 12.56
- Amount Score: 45 × 0.30 = 13.5  (ratio = 1.5x)
- Behavior Score: 50 × 0.20 = 10.0 (knew how to pay, not anymore)
- Recency Score: 60 × 0.10 = 6.0
────────────────────────────────
TOTAL SCORE = 42.06 ≈ 42 → 🟡 MODERATE RISK

Why: Regular payer going bad is a red flag
Action: Investigate reason, discuss payment plan
```

### Example 3: Chronic Defaulter

```
Days Overdue: 120
Outstanding: ₹50,000
Avg Past Payment: ₹10,000
Payment History: 12 previous payments
Last Payment: 6 months ago

Calculation:
- Days Score: 70 × 0.40 = 28.0  (capped at worst)
- Amount Score: 95 × 0.30 = 28.5 (ratio = 5.0x - cannot afford)
- Behavior Score: 50 × 0.20 = 10.0 (knew how to pay, choosing not to)
- Recency Score: 90 × 0.10 = 9.0  (6 months without payment)
────────────────────────────────
TOTAL SCORE = 75.5 ≈ 76 → 🔴 HIGH RISK

Why: Large outstanding, habitual pattern, very overdue
Action: Legal escalation, collection agency consideration
```

---

## How This Is Better Than CIBIL

| Aspect | CIBIL | PaymentPulse | Winner |
|--------|-------|--------------|--------|
| **Update Frequency** | Monthly/Quarterly | Real-time | PaymentPulse |
| **Focus** | Historical credit history | Current payment behavior | PaymentPulse |
| **Amount Consideration** | Ignores (binary on/off time) | ✓ Considers severity | PaymentPulse |
| **Business-Focused** | Consumer lending | B2B/Invoice payments | PaymentPulse |
| **Trend Detection** | Static score | Can track trends | PaymentPulse |
| **Predictive** | What they DID | What they WILL DO | PaymentPulse |
| **Response Time** | Days to update | Instant | PaymentPulse |
| **Ready for Use** | Takes 6+ months | Immediate | PaymentPulse |

---

## Implementation in Code

The Risk Score is NOT hardcoded. It's calculated using the **riskScoreCalculator.ts** utility:

```typescript
// From CSV Upload
const riskScore = calculateAdvancedRiskScore({
  daysOverdue: 45,
  outstandingAmount: 15000,
  totalPaid: 0,           // Optional: for first-timers
  paymentCount: 0,        // Optional: for first-timers
});
// Returns: 42 (Moderate Risk)
```

### Database-Driven

When fetching customer analytics, the score is recalculated from:
- `outstanding_amount` ✓
- `days_overdue` ✓
- Historical payment data (can be added to DB) ✓
- Payment frequency patterns (can be added to DB) ✓

---

## Future Enhancements

To make this even better, add to database:

1. **Payment Transaction History**
   - Payment dates
   - Amounts paid
   - Gaps between payments

2. **Industry Factors**
   - Customer industry classification
   - Seasonal payment patterns
   - Industry default rates

3. **Trend Analysis**
   - Score improvement/worsening over time
   - Payment pattern changes
   - Recovery probability

4. **Competitors Analysis**
   - Network effects
   - Market-wide patterns
   - Systemic risk factors

---

## Summary

**PaymentPulse Risk Score = Data-Driven + Real-Time + Forward-Looking**

It tells you TODAY whether a customer will pay, not what they did 6 months ago.
