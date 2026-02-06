import { useState, useRef } from 'react';
import { Upload, FileText, X, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { calculateAdvancedRiskScore, getRiskCategory } from '../utils/riskScoreCalculator';

// Royal Color Palette - High Contrast
const COLORS = {
  primary: '#1b4079',    // Deep Blue
  secondary: '#4d7c8a',  // Steel Blue
  accent1: '#7f9c96',    // Sage Green
  accent2: '#8fad88',    // Olive Green
  gold: '#b8860b',       // Dark Gold
  lightGold: '#f4e4a6',
  dark: '#0a1931',       // Slate 900
  light: '#f8f9fa',
  success: '#059669',
  warning: '#d97706',
  danger: '#dc2626',
  white: '#ffffff',
  textHeader: '#0f172a',
  textBody: '#334155',
};

interface FileUploadProps {
  onUploadComplete: () => void;
  isDarkMode?: boolean;
}

export default function FileUpload({ onUploadComplete, isDarkMode = false }: FileUploadProps) {
  // CSV State
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- CSV Handlers ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setError('');
        setSuccess('');
      } else {
        setError('Please upload a CSV file');
        setFile(null);
      }
    }
  };

  const calculateRiskScore = (amount: number, daysOverdue: number): number => {
    // Use the advanced risk score calculator from backend
    const riskScore = calculateAdvancedRiskScore({
      daysOverdue,
      outstandingAmount: amount,
      isFirstDefault: true, // CSV upload = first we're seeing this customer
    });
    return riskScore;
  };

  const handleCsvUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const text = await file.text();
      const lines = text.split('\n').filter((line) => line.trim());
      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());

      const customers = [];
      const user = (await supabase.auth.getUser()).data.user;

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length < headers.length) continue;

        const customer: any = { user_id: user?.id };

        headers.forEach((header, index) => {
          const value = values[index]?.trim();
          if (header.includes('name')) customer.name = value || 'Unknown';
          if (header.includes('email')) customer.email = value || null;
          if (header.includes('phone')) customer.phone = value || null;
          if (header.includes('amount') || header.includes('outstanding'))
            customer.outstanding_amount = parseFloat(value) || 0;
          if (header.includes('overdue') || header.includes('days'))
            customer.days_overdue = parseInt(value) || 0;
        });

        if (!customer.name) customer.name = `Customer ${i}`;

        const riskScore = calculateRiskScore(customer.outstanding_amount || 0, customer.days_overdue || 0);
        customer.risk_score = riskScore;
        customer.status = getRiskCategory(riskScore).category;

        customers.push(customer);
      }

      const { error: insertError } = await supabase.from('customers').insert(customers);
      if (insertError) throw insertError;

      const { error: fileError } = await supabase.from('uploaded_files').insert({
        user_id: user?.id,
        file_name: file.name,
        file_type: file.type,
        processing_status: 'completed',
        records_processed: customers.length,
      });
      if (fileError) throw fileError;

      setSuccess(`Successfully processed ${customers.length} records from CSV.`);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      onUploadComplete();
    } catch (err: any) {
      setError(err.message || 'Failed to upload CSV');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 font-serif">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-2 h-8 rounded-full" style={{ backgroundColor: COLORS.gold }} />
          <h2 className="text-2xl font-bold" style={{ color: isDarkMode ? '#e6eef8' : COLORS.textHeader }}>
            Import Data
          </h2>
          <div className="w-2 h-8 rounded-full" style={{ backgroundColor: COLORS.gold }} />
        </div>
        <p style={{ color: isDarkMode ? '#b8c5d0' : COLORS.textBody }}>
          Convert payment data automatically
        </p>
      </div>

      {/* --- CSV Upload Section --- */}
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div
          className="border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 hover:shadow-lg cursor-pointer bg-white"
          style={{
            borderColor: file ? COLORS.primary : `${COLORS.primary}30`,
            backgroundColor: file ? `${COLORS.primary}05` : `${COLORS.white}`,
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 hover:scale-110"
              style={{
                background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                boxShadow: `0 8px 32px ${COLORS.primary}30`,
              }}
            >
              {file ? <CheckCircle className="w-10 h-10 text-white" /> : <Upload className="w-10 h-10 text-white" />}
            </div>
            <p className="text-lg mb-2 font-semibold" style={{ color: isDarkMode ? '#e6eef8' : COLORS.textHeader }}>
              {file ? file.name : 'Click to upload or drag and drop'}
            </p>
            <p className="text-sm" style={{ color: isDarkMode ? '#b8c5d0' : COLORS.textBody }}>
              CSV files only (Max 10MB)
            </p>
          </label>
        </div>

        {/* File Info */}
        {file && (
          <div
            className="flex items-center justify-between rounded-xl p-4 border transition-all duration-300 hover:shadow-md bg-white"
            style={{
              borderColor: `${COLORS.primary}30`,
            }}
          >
            <div className="flex items-center space-x-3">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${COLORS.primary}10` }}
              >
                <FileText className="w-5 h-5" style={{ color: COLORS.primary }} />
              </div>
              <div>
                <p className="font-bold" style={{ color: isDarkMode ? '#e6eef8' : COLORS.textHeader }}>{file.name}</p>
                <p className="text-sm" style={{ color: isDarkMode ? '#b8c5d0' : COLORS.textBody }}>
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setFile(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              style={{ color: COLORS.textBody }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Manual Upload Button */}
        <button
          onClick={handleCsvUpload}
          disabled={!file || uploading}
          className="w-full py-4 rounded-xl font-bold transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 text-white"
          style={{
            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
            boxShadow: `0 8px 32px ${COLORS.primary}40`,
          }}
        >
          {uploading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Processing CSV...</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              <span>Upload and Process</span>
            </>
          )}
        </button>

        {/* Guidelines */}
        <div
          className="rounded-2xl p-6 border transition-all duration-300 hover:shadow-md bg-white"
          style={{
            borderColor: `${COLORS.primary}20`,
          }}
        >
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="w-5 h-5" style={{ color: COLORS.gold }} />
            <h3 className="font-bold" style={{ color: isDarkMode ? '#e6eef8' : COLORS.textHeader }}>CSV Format Guidelines:</h3>
          </div>
          <ul className="text-sm space-y-2 font-medium" style={{ color: isDarkMode ? '#b8c5d0' : COLORS.textBody }}>
            <li>• Include headers: name, email, phone, outstanding_amount, days_overdue</li>
            <li>• Each row represents one customer</li>
            <li>• Amount should be numeric in INR</li>
            <li>• Days overdue should be an integer</li>
          </ul>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div
          className="flex items-center space-x-2 rounded-xl p-4 border bg-red-50"
          style={{
            borderColor: `${COLORS.danger}40`,
            color: COLORS.danger,
          }}
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {success && (
        <div
          className="flex items-center space-x-2 rounded-xl p-4 border bg-emerald-50"
          style={{
            borderColor: `${COLORS.success}40`,
            color: COLORS.success,
          }}
        >
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span className="font-semibold">{success}</span>
        </div>
      )}
    </div>
  );
}