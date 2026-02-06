import { useState } from 'react';
import { Customer } from '../lib/supabase';
import {
  Search,
  Brain,
  TrendingUp,
  AlertCircle,
  Phone,
  Mail,
  DollarSign,
  Calendar,
  Loader,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import CustomerAnalysis from './CustomerAnalysis';

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
    if (score >= 70) return 'text-red-400 bg-red-500/10 border-red-500/20';
    if (score >= 40) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
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
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customers..."
            className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="high_risk">High Risk</option>
          <option value="moderate_risk">Moderate Risk</option>
          <option value="low_risk">Low Risk</option>
          <option value="active">Active</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">No customers found. Upload a CSV file to get started.</p>
          </div>
        ) : (
          filteredCustomers.map((customer) => (
            <div key={customer.id}>
              <div className="bg-slate-900/50 rounded-xl border border-slate-700 p-6 hover:border-blue-500/50 transition-all">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">{customer.name}</h3>
                      <div className="flex flex-wrap gap-3 text-sm text-slate-400">
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
                      className={`px-3 py-1 rounded-full text-sm font-semibold border ${getRiskColor(
                        customer.risk_score
                      )}`}
                    >
                      {getRiskLabel(customer.risk_score)} ({customer.risk_score})
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      <div>
                        <p className="text-xs text-slate-400">Outstanding</p>
                        <p className="text-white font-semibold">
                          ${Number(customer.outstanding_amount).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      <div>
                        <p className="text-xs text-slate-400">Days Overdue</p>
                        <p className="text-white font-semibold">{customer.days_overdue}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-blue-400" />
                      <div>
                        <p className="text-xs text-slate-400">Status</p>
                        <p className="text-white font-semibold capitalize">
                          {customer.status.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleAnalyzeCustomer(customer)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 whitespace-nowrap"
                  >
                    <Brain className="w-5 h-5" />
                    <span>AI Analysis</span>
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
