import { Customer } from '../lib/supabase';

export interface Transaction {
  date: string;
  amount: number;
  status: 'Paid' | 'Pending';
}

export function generateMockTransactions(customer: Customer, months = 3): Transaction[] {
  const transactions: Transaction[] = [];
  const today = new Date();

  for (let i = 0; i < months; i++) {
    const date = new Date(today);
    date.setMonth(date.getMonth() - i);

    transactions.push({
      date: date.toLocaleDateString('en-IN'),
      amount: Math.floor(Math.random() * Number(customer.outstanding_amount) * 0.4),
      status: i === 0 ? 'Pending' : 'Paid',
    });
  }

  return transactions;
}

export function generateUpcomingPayments(customer: Customer, count = 2) {
  const upcoming: { dueDate: string; amount: number }[] = [];
  const today = new Date();

  for (let i = 1; i <= count; i++) {
    const dueDate = new Date(today);
    dueDate.setDate(dueDate.getDate() + i * 15);

    upcoming.push({
      dueDate: dueDate.toLocaleDateString('en-IN'),
      amount: Math.floor(Number(customer.outstanding_amount) * 0.3),
    });
  }

  return upcoming;
}
