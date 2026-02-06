import { Customer } from '../lib/supabase';
import { TrendingUp, Users, AlertCircle, DollarSign, Calendar, BarChart3 } from 'lucide-react';

interface AnalyticsProps {
  customers: Customer[];
}

export default function Analytics({ customers }: AnalyticsProps) {
  const highRiskCustomers = customers.filter((c) => c.risk_score >= 70);
  const moderateRiskCustomers = customers.filter((c) => c.risk_score >= 40 && c.risk_score < 70);
  const lowRiskCustomers = customers.filter((c) => c.risk_score < 40);

  const totalOutstanding = customers.reduce((sum, c) => sum + Number(c.outstanding_amount), 0);
  const avgDaysOverdue =
    customers.length > 0
      ? customers.reduce((sum, c) => sum + c.days_overdue, 0) / customers.length
      : 0;

  const riskDistribution = [
    { label: 'High Risk', count: highRiskCustomers.length, color: 'bg-red-500', percentage: (highRiskCustomers.length / customers.length) * 100 },
    { label: 'Moderate Risk', count: moderateRiskCustomers.length, color: 'bg-amber-500', percentage: (moderateRiskCustomers.length / customers.length) * 100 },
    { label: 'Low Risk', count: lowRiskCustomers.length, color: 'bg-emerald-500', percentage: (lowRiskCustomers.length / customers.length) * 100 },
  ];

  const overdueRanges = [
    { label: '0-30 days', count: customers.filter((c) => c.days_overdue <= 30).length },
    { label: '31-60 days', count: customers.filter((c) => c.days_overdue > 30 && c.days_overdue <= 60).length },
    { label: '61-90 days', count: customers.filter((c) => c.days_overdue > 60 && c.days_overdue <= 90).length },
    { label: '90+ days', count: customers.filter((c) => c.days_overdue > 90).length },
  ];

  const amountRanges = [
    { label: '$0-$1,000', count: customers.filter((c) => Number(c.outstanding_amount) <= 1000).length },
    { label: '$1,001-$5,000', count: customers.filter((c) => Number(c.outstanding_amount) > 1000 && Number(c.outstanding_amount) <= 5000).length },
    { label: '$5,001-$10,000', count: customers.filter((c) => Number(c.outstanding_amount) > 5000 && Number(c.outstanding_amount) <= 10000).length },
    { label: '$10,000+', count: customers.filter((c) => Number(c.outstanding_amount) > 10000).length },
  ];

  const topCustomers = [...customers]
    .sort((a, b) => Number(b.outstanding_amount) - Number(a.outstanding_amount))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Analytics Dashboard</h2>
        <p className="text-slate-400">Comprehensive insights into your customer portfolio</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-slate-900/50 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Total Portfolio</p>
              <p className="text-2xl font-bold text-white">{customers.length}</p>
            </div>
          </div>
          <div className="text-sm text-slate-400">Active customer accounts</div>
        </div>

        <div className="bg-slate-900/50 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Total Outstanding</p>
              <p className="text-2xl font-bold text-white">${totalOutstanding.toLocaleString()}</p>
            </div>
          </div>
          <div className="text-sm text-slate-400">Across all accounts</div>
        </div>

        <div className="bg-slate-900/50 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Avg Days Overdue</p>
              <p className="text-2xl font-bold text-white">{avgDaysOverdue.toFixed(0)}</p>
            </div>
          </div>
          <div className="text-sm text-slate-400">Portfolio average</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-900/50 rounded-xl border border-slate-700 p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <span>Risk Distribution</span>
          </h3>
          <div className="space-y-4">
            {riskDistribution.map((risk, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white">{risk.label}</span>
                  <span className="text-slate-400">
                    {risk.count} ({risk.percentage.toFixed(0)}%)
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-3">
                  <div
                    className={`${risk.color} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${risk.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-xl border border-slate-700 p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            <span>Overdue Distribution</span>
          </h3>
          <div className="space-y-3">
            {overdueRanges.map((range, index) => (
              <div key={index} className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3">
                <span className="text-slate-300">{range.label}</span>
                <span className="text-white font-semibold">{range.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-900/50 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-emerald-400" />
          <span>Outstanding Amount Distribution</span>
        </h3>
        <div className="grid md:grid-cols-4 gap-4">
          {amountRanges.map((range, index) => (
            <div key={index} className="bg-slate-800/50 rounded-lg p-4 text-center">
              <p className="text-slate-400 text-sm mb-2">{range.label}</p>
              <p className="text-3xl font-bold text-white">{range.count}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900/50 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-red-400" />
          <span>Top 5 Priority Accounts</span>
        </h3>
        <div className="space-y-3">
          {topCustomers.map((customer, index) => (
            <div
              key={customer.id}
              className="flex items-center justify-between bg-slate-800/50 rounded-lg p-4 border border-slate-700"
            >
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{index + 1}</span>
                </div>
                <div>
                  <p className="text-white font-semibold">{customer.name}</p>
                  <p className="text-slate-400 text-sm">{customer.days_overdue} days overdue</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-bold">${Number(customer.outstanding_amount).toLocaleString()}</p>
                <p className="text-slate-400 text-sm">Risk: {customer.risk_score}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
        <h3 className="text-white font-bold mb-2 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-blue-400" />
          <span>AI Recommendations</span>
        </h3>
        <ul className="space-y-2 text-slate-300 text-sm">
          <li>• Focus agent resources on {highRiskCustomers.length} high-risk accounts for maximum recovery</li>
          <li>• Implement automated reminders for {lowRiskCustomers.length} low-risk customers to reduce operational costs</li>
          <li>• Expected recovery improvement: 20-30% with AI-driven prioritization</li>
          <li>• Estimated cost reduction: 30-40% through intelligent automation</li>
        </ul>
      </div>
    </div>
  );
}
