# Risk Score Calculator - Quick Reference

## In 30 Seconds

**Risk Score = How likely someone WON'T pay**

- **0-35**: Good payer ✓
- **36-65**: Risky behavior ⚠️
- **66-100**: Probably won't pay ✗

---

## The 4 Factors (In Priority Order)

### 1️⃣ **Days Overdue** (40% importance) - THE BIG ONE
**"How long haven't they paid?"**
- 0 days: Safe
- 30 days: Concerning (score +20-35)
- 60 days: Critical (score +55)
- 90+ days: Worst case (score 70)

→ **The longer overdue, the higher the risk**

---

### 2️⃣ **Outstanding Amount** (30% importance)
**"How much debt are they avoiding?"**

For new customers:
- ₹1,000: Minor (score 10)
- ₹10,000: Major (score 40)
- ₹50,000: Severe (score 90)

For repeat customers:
- Debt = ~1 month's payment: Manageable (score 30)
- Debt = ~3 months' payments: Serious (score 65)
- Debt = ~6 months' payments: Unaffordable (score 95)

→ **Bigger debt + smaller payment history = higher risk**

---

### 3️⃣ **Payment Behavior** (20% importance)
**"Are they a habitual defaulter?"**

- First default: Light penalty (score 15)
- 2 previous payments: Moderate (score 25)
- 5+ payments, now late: WORSE! (score 50)

→ **Someone who USED to pay but STOPPED is more risky than someone who NEVER did**

---

### 4️⃣ **Recency** (10% importance)
**"When did they last pay?"**

- Last 15 days: Good signal (score 10)
- 30 days: OK (score 20)
- 90 days: Bad (score 60)
- 6+ months: Dead debt (score 90)

→ **Recent payers are more likely to pay again**

---

## Quick Scoring cheat Sheet

| Situation | Expected Score | Action |
|-----------|---|---|
| New customer, 5 days late, ₹5K outstanding | 15 | Monitor |
| Regular customer, 15 days late, ₹10K | 30 | Reminder email |
| Repeat customer, 45 days late, ₹25K | 42 | Phone call |
| Bad customer, 90 days late, ₹50K | 75 | Legal follow-up |

---

## Why This Beats CIBIL

| | CIBIL | PaymentPulse |
|---|---|---|
| **Shows** | Past behavior | Current risk |
| **Updated** | Monthly | Real-time |
| **Considers amount** | No | Yes ✓ |
| **Business-focused** | No | Yes ✓ |
| **Immediate action** | No | Yes ✓ |

---

## Example Calculation

**Customer:**
- Days late: 30
- Outstanding: ₹15,000
- Average payment: ₹10,000
- Previous payments: 5 (repeat customer)

**Scoring:**
```
Days Overdue Score:     20-30 points × 40% = 8-12
Amount Severity Score:  45 points × 30% = 13.5
  (because 15K/10K = 1.5x average)
Payment Behavior Score: 50 points × 20% = 10
  (because they're a repeat defaulter)
Recency Score:          40 points × 10% = 4

Total: 35-39 = 🟡 MODERATE RISK
```

**Action:** Send payment reminder, check if there's a genuine reason for delay.

---

## The Code

The calculator is in: `src/utils/riskScoreCalculator.ts`

Use it like this:

```typescript
import { calculateAdvancedRiskScore } from './utils/riskScoreCalculator';

const score = calculateAdvancedRiskScore({
  daysOverdue: 30,
  outstandingAmount: 15000,
  totalPaid: 50000,           // Optional: total paid historically
  paymentCount: 5,             // Optional: number of times paid
  averagePaymentAmount: 10000, // Optional: average payment amount
  lastPaymentDaysAgo: 35,      // Optional: when did they last pay
  isFirstDefault: false,       // Optional: is this first time?
});

console.log(score); // 0-100 score
```

---

## NOT HARDCODED ✓

The old code had hardcoded thresholds:
```
if (daysOverdue > 90) score += 40;  // ❌ Hardcoded
else if (daysOverdue > 60) score += 30;
Math.random() * 30  // ❌ RANDOM! Bad!
```

The new code:
```
// ✓ Formula-based (works for any numbers)
const daysScore = Math.min(70, 0.6 * daysOverdue);
// ✓ Considers debt ratio
const ratio = outstandingAmount / avgPayment;
// ✓ No randomness - deterministic
```

---

## Need More Details?

Read: **RISK_SCORE_EXPLAINED.md**

That file has:
- Complete formulas
- Real-world examples
- Comparisons with CIBIL
- Implementation guide
