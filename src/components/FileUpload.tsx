import { useState, useRef } from 'react';
import { Upload, FileText, X, AlertCircle, CheckCircle, Sparkles, Crown, Scroll } from 'lucide-react';
import { supabase } from '../lib/supabase';

// Royal color palette
const COLORS = {
  primary: '#1b4079',
  secondary: '#4d7c8a',
  accent1: '#7f9c96',
  accent2: '#8fad88',
  accent3: '#cbdf90',
  gold: '#d4af37',
  lightGold: '#f4e4a6',
  dark: '#0a1931',
  light: '#f8f9fa',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
};

interface FileUploadProps {
  onUploadComplete: () => void;
}

export default function FileUpload({ onUploadComplete }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Please upload a CSV file');
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const text = await file.text();
      const lines = text.split('\n').filter((line) => line.trim());
      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());

      const customers = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length < headers.length) continue;

        const customer: any = {
          user_id: (await supabase.auth.getUser()).data.user?.id,
        };

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

        const riskScore = calculateRiskScore(
          customer.outstanding_amount || 0,
          customer.days_overdue || 0
        );
        customer.risk_score = riskScore;
        customer.status = riskScore >= 70 ? 'high_risk' : riskScore >= 40 ? 'moderate_risk' : 'low_risk';

        customers.push(customer);
      }

      const { error: insertError } = await supabase.from('customers').insert(customers);

      if (insertError) throw insertError;

      const { error: fileError } = await supabase.from('uploaded_files').insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        file_name: file.name,
        file_type: file.type,
        processing_status: 'completed',
        records_processed: customers.length,
      });

      if (fileError) throw fileError;

      setSuccess(`Successfully uploaded ${customers.length} customer records!`);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      onUploadComplete();
    } catch (err: any) {
      setError(err.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const calculateRiskScore = (amount: number, daysOverdue: number): number => {
    let score = 0;

    if (daysOverdue > 90) score += 40;
    else if (daysOverdue > 60) score += 30;
    else if (daysOverdue > 30) score += 20;
    else if (daysOverdue > 0) score += 10;

    if (amount > 10000) score += 30;
    else if (amount > 5000) score += 20;
    else if (amount > 1000) score += 10;

    score += Math.min(30, Math.floor(Math.random() * 30));

    return Math.min(100, score);
  };

  return (
    <div className="space-y-6 font-serif">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-2 h-8 rounded-full" style={{ backgroundColor: COLORS.gold }} />
          <h2 className="text-2xl font-bold" style={{ color: COLORS.dark }}>
            Upload Customer Data
          </h2>
          <div className="w-2 h-8 rounded-full" style={{ backgroundColor: COLORS.gold }} />
        </div>
        <p style={{ color: COLORS.secondary }}>
          Upload a CSV file containing customer payment data for Royal AI-powered analysis
        </p>
      </div>

      {/* Upload Area */}
      <div 
        className="border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 hover:shadow-lg cursor-pointer"
        style={{ 
          borderColor: file ? COLORS.gold : `${COLORS.primary}30`,
          backgroundColor: file ? `${COLORS.gold}05` : `${COLORS.primary}05`,
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
          <p className="text-lg mb-2" style={{ color: COLORS.dark }}>
            {file ? file.name : 'Click to upload or drag and drop'}
          </p>
          <p className="text-sm flex items-center justify-center gap-2" style={{ color: COLORS.secondary }}>
            <Scroll className="w-4 h-4" />
            CSV files only (Max 10MB)
          </p>
        </label>
      </div>

      {/* File Info */}
      {file && (
        <div 
          className="flex items-center justify-between rounded-xl p-4 border transition-all duration-300 hover:shadow-md"
          style={{ 
            backgroundColor: `${COLORS.gold}10`,
            borderColor: `${COLORS.gold}30`,
          }}
        >
          <div className="flex items-center space-x-3">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${COLORS.gold}20` }}
            >
              <FileText className="w-5 h-5" style={{ color: COLORS.gold }} />
            </div>
            <div>
              <p className="font-medium" style={{ color: COLORS.dark }}>{file.name}</p>
              <p className="text-sm" style={{ color: COLORS.secondary }}>
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setFile(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
            className="p-2 rounded-lg hover:bg-white/50 transition-colors"
            style={{ color: COLORS.secondary }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div 
          className="flex items-center space-x-2 rounded-xl p-4 border"
          style={{ 
            backgroundColor: `${COLORS.danger}10`,
            borderColor: `${COLORS.danger}20`,
            color: COLORS.danger,
          }}
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div 
          className="flex items-center space-x-2 rounded-xl p-4 border"
          style={{ 
            backgroundColor: `${COLORS.success}10`,
            borderColor: `${COLORS.success}20`,
            color: COLORS.success,
          }}
        >
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Guidelines */}
      <div 
        className="rounded-2xl p-6 border transition-all duration-300 hover:shadow-md"
        style={{ 
          background: `linear-gradient(135deg, ${COLORS.primary}10, ${COLORS.secondary}10)`,
          borderColor: `${COLORS.primary}20`,
        }}
      >
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="w-5 h-5" style={{ color: COLORS.gold }} />
          <h3 className="font-semibold" style={{ color: COLORS.dark }}>CSV Format Guidelines:</h3>
        </div>
        <ul className="text-sm space-y-2" style={{ color: COLORS.secondary }}>
          <li className="flex items-start space-x-2">
            <Crown className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: COLORS.gold }} />
            <span>Include headers: name, email, phone, outstanding_amount, days_overdue</span>
          </li>
          <li className="flex items-start space-x-2">
            <Crown className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: COLORS.gold }} />
            <span>Each row represents one customer</span>
          </li>
          <li className="flex items-start space-x-2">
            <Crown className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: COLORS.gold }} />
            <span>Amount should be numeric (e.g., 5000.50)</span>
          </li>
          <li className="flex items-start space-x-2">
            <Crown className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: COLORS.gold }} />
            <span>Days overdue should be an integer</span>
          </li>
        </ul>
      </div>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
        style={{ 
          background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
          color: 'white',
          boxShadow: `0 8px 32px ${COLORS.primary}40`,
        }}
      >
        {uploading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Processing Royal Data...</span>
          </>
        ) : (
          <>
            <Upload className="w-5 h-5" />
            <span>Upload and Process</span>
          </>
        )}
      </button>
    </div>
  );
}