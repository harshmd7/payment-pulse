import { Customer } from '../lib/supabase';
import { Transaction, generateUpcomingPayments, generateMockTransactions } from './transactionUtils';

export async function generateCustomerPDF(customer: Customer, paymentHistory?: Transaction[], upcomingPayments?: { dueDate: string; amount: number }[]): Promise<void> {
  // Use provided payment history (from UI) if available to ensure consistency,
  // otherwise generate mock history.
  const history = paymentHistory && paymentHistory.length > 0 ? paymentHistory : generateMockTransactions(customer);

  // Use provided upcoming payments or generate defaults
  const upcoming = upcomingPayments && upcomingPayments.length > 0 ? upcomingPayments : generateUpcomingPayments(customer);

  // Create PDF
  const pdfContent = await createPDFDocument(customer, history, upcoming);

  // Download the PDF
  downloadPDF(pdfContent, `${customer.name.replace(/\s+/g, '_')}_Report.pdf`);
}

async function createPDFDocument(
  customer: Customer,
  paymentHistory: Transaction[],
  upcomingPayments: { dueDate: string; amount: number }[]
): Promise<Blob> {
  // Use modern browser PDF generation
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();

  // Colors
  const primaryColor = [27, 64, 121]; // #1b4079
  const secondaryColor = [77, 124, 138]; // #4d7c8a

  // Title
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text('Payment Pulse', 105, 20, { align: 'center' });
  doc.setFontSize(14);
  doc.text('Customer Payment Report', 105, 30, { align: 'center' });

  // Customer Info
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.text('Customer Information', 20, 55);
  
  doc.setFontSize(11);
  doc.text(`Name: ${customer.name}`, 20, 65);
  if (customer.email) doc.text(`Email: ${customer.email}`, 20, 72);
  if (customer.phone) doc.text(`Phone: ${customer.phone}`, 20, 79);
  doc.text(`Outstanding Amount: ₹${Number(customer.outstanding_amount).toLocaleString()}`, 20, 86);
  doc.text(`Days Overdue: ${customer.days_overdue}`, 20, 93);
  doc.text(`Risk Score: ${customer.risk_score}`, 20, 100);

  // Payment History
  doc.setFontSize(16);
  doc.text('Last 3 Months Payment History', 20, 115);
  
  // Table header
  doc.setFillColor(...secondaryColor);
  doc.rect(20, 120, 170, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text('Payment Date', 25, 127);
  doc.text('Amount', 80, 127);
  doc.text('Status', 135, 127);

  // Table rows
  doc.setTextColor(0, 0, 0);
  let yPos = 137;
  paymentHistory.forEach((payment, index) => {
    if (index % 2 === 0) {
      doc.setFillColor(240, 240, 240);
      doc.rect(20, yPos - 5, 170, 8, 'F');
    }
    doc.text(payment.date, 25, yPos);
    doc.text(`₹${payment.amount.toLocaleString()}`, 80, yPos);
    
    if (payment.status === 'Paid') {
      doc.setTextColor(16, 185, 129);
    } else {
      doc.setTextColor(239, 68, 68);
    }
    doc.text(payment.status, 135, yPos);
    doc.setTextColor(0, 0, 0);
    
    yPos += 10;
  });

  // Upcoming Payments
  yPos += 10;
  doc.setFontSize(16);
  doc.text('Upcoming Payments', 20, yPos);
  
  yPos += 5;
  // Table header
  doc.setFillColor(...secondaryColor);
  doc.rect(20, yPos, 170, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text('Due Date', 25, yPos + 7);
  doc.text('Amount', 80, yPos + 7);

  // Table rows
  doc.setTextColor(0, 0, 0);
  yPos += 15;
  upcomingPayments.forEach((payment, index) => {
    if (index % 2 === 0) {
      doc.setFillColor(240, 240, 240);
      doc.rect(20, yPos - 5, 170, 8, 'F');
    }
    doc.text(payment.dueDate, 25, yPos);
    doc.text(`₹${payment.amount.toLocaleString()}`, 80, yPos);
    
    yPos += 10;
  });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text(`Generated on ${new Date().toLocaleDateString('en-IN')} at ${new Date().toLocaleTimeString('en-IN')}`, 105, 280, { align: 'center' });
  doc.text('Payment Pulse - Customer Risk Analysis System', 105, 285, { align: 'center' });

  return doc.output('blob');
}

function downloadPDF(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
