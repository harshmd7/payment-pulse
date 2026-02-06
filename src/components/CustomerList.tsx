import { useState } from 'react';
import { Customer } from '../lib/supabase';
import {
  Search,
  Brain,
  TrendingUp,
  Phone,
  Mail,
  Calendar,
  Loader,
  Target,
  Crown,
  Sparkles,
} from 'lucide-react';
import CustomerAnalysis from './CustomerAnalysis';

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

interface CustomerListProps {
  customers: Customer[];
  loading: boolean;
  onRefresh: () => void;
}

export default function CustomerList({ customers, loading, onRefresh }: CustomerListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.includes(searchTerm);

    const matchesFilter = filterStatus === 'all' || customer.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getRiskColor = (score: number) => {
    if (score >= 70) return COLORS.danger;
    if (score >= 40) return COLORS.warning;
    return COLORS.success;
  };

  const getRiskLabel = (score: number) => {
    if (score >= 70) return 'High Risk';
    if (score >= 40) return 'Moderate';
    return 'Low Risk';
  };

  const handleAnalyzeCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowAnalysis(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader className="w-12 h-12 animate-spin mb-4" style={{ color: COLORS.gold }} />
        <p className="font-semibold" style={{ color: COLORS.dark }}>Loading royal customers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-serif">
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: COLORS.secondary }} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customers..."
            className="w-full pl-12 pr-4 py-3 rounded-xl focus:outline-none transition-all duration-300"
            style={{ 
              backgroundColor: `${COLORS.primary}10`,
              border: `1px solid ${COLORS.primary}20`,
              color: COLORS.dark,
            }}
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-6 py-3 rounded-xl focus:outline-none transition-all duration-300"
          style={{ 
            backgroundColor: `${COLORS.primary}10`,
            border: `1px solid ${COLORS.primary}20`,
            color: COLORS.dark,
          }}
        >
          <option value="all">All Status</option>
          <option value="high_risk">High Risk</option>
          <option value="moderate_risk">Moderate Risk</option>
          <option value="low_risk">Low Risk</option>
          <option value="active">Active</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* Customer Cards */}
      <div className="space-y-4">
        {filteredCustomers.length === 0 ? (
          <div 
            className="text-center py-12 rounded-2xl border"
            style={{ 
              backgroundColor: `${COLORS.primary}5`,
              borderColor: `${COLORS.primary}20`,
            }}
          >
            <Crown className="w-16 h-16 mx-auto mb-4" style={{ color: COLORS.gold, opacity: 0.5 }} />
            <p style={{ color: COLORS.secondary }}>No customers found. Upload a CSV file to get started.</p>
          </div>
        ) : (
          filteredCustomers.map((customer) => (
            <div key={customer.id}>
              <div 
                className="rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                style={{ 
                  backgroundColor: 'white',
                  borderColor: `${COLORS.accent1}30`,
                  boxShadow: `0 4px 20px ${COLORS.primary}10`,
                }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold mb-1" style={{ color: COLORS.dark }}>
                          {customer.name}
                        </h3>
                        <div className="flex flex-wrap gap-3 text-sm" style={{ color: COLORS.secondary }}>
                          {customer.email && (
                            <div className="flex items-center space-x-1">
                              <Mail className="w-4 h-4" />
                              <span>{customer.email}</span>
                            </div>
                          )}
                          {customer.phone && (
                            <div className="flex items-center space-x-1">
                              <Phone className="w-4 h-4" />
                              <span>{customer.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div
                        className="px-3 py-1 rounded-full text-sm font-semibold border"
                        style={{
                          backgroundColor: `${getRiskColor(customer.risk_score)}20`,
                          borderColor: `${getRiskColor(customer.risk_score)}30`,
                          color: getRiskColor(customer.risk_score),
                        }}
                      >
                        {getRiskLabel(customer.risk_score)} ({customer.risk_score})
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div 
                        className="flex items-center space-x-2 p-3 rounded-lg"
                        style={{ backgroundColor: `${COLORS.accent2}10` }}
                      >
                        <Target className="w-4 h-4" style={{ color: COLORS.accent2 }} />
                        <div>
                          <p className="text-xs" style={{ color: COLORS.secondary }}>Outstanding</p>
                          <p className="font-semibold" style={{ color: COLORS.dark }}>
                            ₹{Number(customer.outstanding_amount).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div 
                        className="flex items-center space-x-2 p-3 rounded-lg"
                        style={{ backgroundColor: `${COLORS.accent3}10` }}
                      >
                        <Calendar className="w-4 h-4" style={{ color: COLORS.accent3 }} />
                        <div>
                          <p className="text-xs" style={{ color: COLORS.secondary }}>Days Overdue</p>
                          <p className="font-semibold" style={{ color: COLORS.dark }}>
                            {customer.days_overdue}
                          </p>
                        </div>
                      </div>
                      <div 
                        className="flex items-center space-x-2 p-3 rounded-lg"
                        style={{ backgroundColor: `${COLORS.secondary}10` }}
                      >
                        <TrendingUp className="w-4 h-4" style={{ color: COLORS.secondary }} />
                        <div>
                          <p className="text-xs" style={{ color: COLORS.secondary }}>Status</p>
                          <p className="font-semibold capitalize" style={{ color: COLORS.dark }}>
                            {customer.status.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleAnalyzeCustomer(customer)}
                      className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2 whitespace-nowrap"
                      style={{
                        background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                        color: 'white',
                        boxShadow: `0 4px 20px ${COLORS.primary}40`,
                      }}
                    >
                      <Crown className="w-5 h-5" />
                      <span>Royal AI Analysis</span>
                    </button>
                  </div>
                </div>

                {showAnalysis && selectedCustomer?.id === customer.id && (
                  <div className="mt-4">
                    <CustomerAnalysis
                      customer={selectedCustomer}
                      onClose={() => {
                        setShowAnalysis(false);
                        setSelectedCustomer(null);
                        onRefresh();
                      }}
                      inline
                    />
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}