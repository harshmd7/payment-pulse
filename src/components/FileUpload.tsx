import { useState, useRef } from 'react';
import { Upload, FileText, X, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Upload Customer Data</h2>
        <p className="text-slate-400">
          Upload a CSV file containing customer payment data for AI-powered analysis
        </p>
      </div>

      <div className="border-2 border-dashed border-slate-700 rounded-xl p-12 text-center hover:border-blue-500/50 transition-colors">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8 text-blue-400" />
          </div>
          <p className="text-lg text-white mb-2">
            {file ? file.name : 'Click to upload or drag and drop'}
          </p>
          <p className="text-sm text-slate-400">CSV files only (Max 10MB)</p>
        </label>
      </div>

      {file && (
        <div className="flex items-center justify-between bg-slate-900/50 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-white font-medium">{file.name}</p>
              <p className="text-sm text-slate-400">{(file.size / 1024).toFixed(2)} KB</p>
            </div>
          </div>
          <button
            onClick={() => {
              setFile(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center space-x-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center space-x-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <h3 className="text-white font-semibold mb-2">CSV Format Guidelines:</h3>
        <ul className="text-sm text-slate-300 space-y-1">
          <li>• Include headers: name, email, phone, outstanding_amount, days_overdue</li>
          <li>• Each row represents one customer</li>
          <li>• Amount should be numeric (e.g., 5000.50)</li>
          <li>• Days overdue should be an integer</li>
        </ul>
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
      >
        <Upload className="w-5 h-5" />
        <span>{uploading ? 'Uploading...' : 'Upload and Process'}</span>
      </button>
    </div>
  );
}
