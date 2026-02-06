import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Customer } from '../lib/supabase';
import {
  LogOut,
  Upload,
  Users,
  TrendingUp,
  AlertCircle,
  BarChart3,
  Zap,
  FileText,
  Download,
  Search,
  ChevronRight,
  Bell,
  Settings,
  HelpCircle,
  Menu,
  X,
  Home,
  User,
  CreditCard,
  Shield,
  PieChart,
  Activity,
  Calendar,
  Filter,
  MoreVertical,
  ChevronDown,
  CheckCircle,
  Clock,
  AlertTriangle,
  DollarSign,
  Globe,
  Building,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';
import FileUpload from './FileUpload';
import CustomerList from './CustomerList';
import Analytics from './Analytics';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'upload' | 'customers' | 'analytics'>('upload');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications] = useState([
    { id: 1, message: 'New high-risk customer detected', time: '10 min ago', type: 'warning' },
    { id: 2, message: 'Monthly report is ready', time: '2 hours ago', type: 'info' },
    { id: 3, message: 'System update completed', time: '1 day ago', type: 'success' },
  ]);
  
  const [stats, setStats] = useState({
    totalCustomers: 0,
    highRisk: 0,
    totalOutstanding: 0,
    avgRiskScore: 0,
    activeCustomers: 0,
    newThisMonth: 0,
    paymentsCollected: 0,
    avgPaymentDays: 0,
  });

  useEffect(() => {
    loadCustomers();
    // Mock additional data for demo
    setTimeout(() => {
      setStats(prev => ({
        ...prev,
        activeCustomers: Math.floor(prev.totalCustomers * 0.82),
        newThisMonth: 12,
        paymentsCollected: 156000,
        avgPaymentDays: 28,
      }));
    }, 1000);
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('risk_score', { ascending: false });

      if (error) throw error;

      if (data) {
        setCustomers(data);
        calculateStats(data);
      }
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (customerData: Customer[]) => {
    const totalCustomers = customerData.length;
    const highRisk = customerData.filter((c) => c.risk_score >= 70).length;
    const totalOutstanding = customerData.reduce((sum, c) => sum + Number(c.outstanding_amount), 0);
    const avgRiskScore = totalCustomers > 0
      ? customerData.reduce((sum, c) => sum + Number(c.risk_score), 0) / totalCustomers
      : 0;

    setStats(prev => ({
      ...prev,
      totalCustomers,
      highRisk,
      totalOutstanding,
      avgRiskScore,
    }));
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getRiskBgColor = (score: number) => {
    if (score >= 70) return 'bg-red-500/10';
    if (score >= 40) return 'bg-yellow-500/10';
    return 'bg-green-500/10';
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const recentCustomers = filteredCustomers.slice(0, 5);

  const NavigationItem = ({ 
    icon: Icon, 
    label, 
    tab, 
    badge 
  }: { 
    icon: React.ElementType; 
    label: string; 
    tab: 'upload' | 'customers' | 'analytics';
    badge?: number;
  }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group ${
        activeTab === tab 
          ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/10 border border-blue-500/30 text-white' 
          : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${
          activeTab === tab 
            ? 'bg-gradient-to-br from-blue-500 to-cyan-400' 
            : 'bg-slate-800 group-hover:bg-slate-700'
        }`}>
          <Icon className="w-4 h-4" />
        </div>
        <span className="font-medium">{label}</span>
      </div>
      {badge && (
        <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-400">
          {badge}
        </span>
      )}
      <ChevronRight className={`w-4 h-4 transition-transform ${
        activeTab === tab ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'
      }`} />
    </button>
  );

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color, 
    trend, 
    subtitle 
  }: { 
    title: string; 
    value: string | number; 
    icon: React.ElementType; 
    color: string; 
    trend?: string;
    subtitle?: string;
  }) => (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/30 backdrop-blur-sm rounded-2xl border border-slate-700/30 p-5 hover:border-slate-600/50 transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            trend.startsWith('+') 
              ? 'bg-green-500/10 text-green-400' 
              : 'bg-red-500/10 text-red-400'
          }`}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-white mb-1">{value}</p>
        <p className="text-slate-400 text-sm font-medium">{title}</p>
        {subtitle && (
          <p className="text-slate-500 text-xs mt-2">{subtitle}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Top Navigation */}
      <nav className="bg-slate-900/40 backdrop-blur-xl border-b border-slate-800/50 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors lg:hidden"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                    Payment Pulse
                  </span>
                  <p className="text-xs text-slate-500">Risk Management Platform</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden md:flex items-center bg-slate-800/50 rounded-xl px-3 py-2">
                <Search className="w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search customers, reports..."
                  className="bg-transparent border-none text-sm text-white placeholder-slate-500 focus:outline-none ml-2 w-48"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Notifications */}
              <div className="relative group">
                <button className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors relative">
                  <Bell className="w-5 h-5 text-slate-400" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                </button>
                <div className="absolute right-0 mt-2 w-80 bg-slate-900/95 backdrop-blur-xl rounded-xl border border-slate-800 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-4 border-b border-slate-800">
                    <h3 className="font-semibold text-white">Notifications</h3>
                    <p className="text-xs text-slate-500">{notifications.length} new</p>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((note) => (
                      <div key={note.id} className="p-4 border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${
                            note.type === 'warning' ? 'bg-red-500/10' :
                            note.type === 'success' ? 'bg-green-500/10' : 'bg-blue-500/10'
                          }`}>
                            {note.type === 'warning' ? <AlertTriangle className="w-4 h-4 text-red-400" /> :
                             note.type === 'success' ? <CheckCircle className="w-4 h-4 text-green-400" /> :
                             <Bell className="w-4 h-4 text-blue-400" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-white">{note.message}</p>
                            <p className="text-xs text-slate-500 mt-1">{note.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-white">{user?.name || 'Admin User'}</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 rounded-xl bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-slate-900/95 backdrop-blur-xl rounded-xl border border-slate-800 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <button className="w-full text-left p-3 text-sm text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-t-xl flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </button>
                    <button className="w-full text-left p-3 text-sm text-slate-300 hover:text-white hover:bg-slate-800/50 flex items-center space-x-2">
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                    <button className="w-full text-left p-3 text-sm text-slate-300 hover:text-white hover:bg-slate-800/50 flex items-center space-x-2">
                      <HelpCircle className="w-4 h-4" />
                      <span>Help & Support</span>
                    </button>
                    <div className="border-t border-slate-800">
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left p-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-b-xl flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-16 lg:top-0 h-[calc(100vh-4rem)] 
          bg-gradient-to-b from-slate-900/95 to-slate-950/95 backdrop-blur-xl 
          border-r border-slate-800/50
          transition-all duration-300 z-40
          ${sidebarOpen ? 'w-64 translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'}
        `}>
          <div className="h-full flex flex-col p-4">
            {/* Navigation */}
            <nav className="flex-1 space-y-2 mt-4">
              <NavigationItem icon={Home} label="Overview" tab="upload" />
              <NavigationItem icon={Upload} label="Upload Data" tab="upload" />
              <NavigationItem 
                icon={Users} 
                label="Customers" 
                tab="customers" 
                badge={stats.highRisk}
              />
              <NavigationItem icon={BarChart3} label="Analytics" tab="analytics" />
              <NavigationItem icon={Activity} label="Activity Log" tab="analytics" />
              <NavigationItem icon={Shield} label="Risk Rules" tab="analytics" />
              <NavigationItem icon={PieChart} label="Reports" tab="analytics" />
            </nav>

            {/* Quick Stats */}
            <div className={`
              mt-6 p-4 rounded-xl bg-gradient-to-br from-slate-800/30 to-slate-900/30 
              border border-slate-800/50 transition-all duration-300
              ${sidebarOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0'}
            `}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-400">Quick Stats</span>
                <Activity className="w-4 h-4 text-blue-400" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">High Risk</span>
                  <span className="text-xs font-semibold text-red-400">{stats.highRisk}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Outstanding</span>
                  <span className="text-xs font-semibold text-emerald-400">
                    ${(stats.totalOutstanding / 1000).toFixed(0)}K
                  </span>
                </div>
              </div>
            </div>

            {/* Help Card */}
            <div className={`
              mt-4 p-4 rounded-xl bg-gradient-to-br from-blue-500/5 to-cyan-500/5 
              border border-blue-500/20 transition-all duration-300
              ${sidebarOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0'}
            `}>
              <div className="flex items-center space-x-3">
                <HelpCircle className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-xs font-medium text-white">Need help?</p>
                  <p className="text-xs text-slate-400">Check our guides</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Total Customers"
              value={stats.totalCustomers}
              icon={Users}
              color="text-blue-400"
              trend="+12%"
              subtitle="Active: 82%"
            />
            <StatCard
              title="High Risk"
              value={stats.highRisk}
              icon={AlertCircle}
              color="text-red-400"
              trend="+3"
              subtitle="Require attention"
            />
            <StatCard
              title="Total Outstanding"
              value={`$${(stats.totalOutstanding / 1000).toFixed(0)}K`}
              icon={DollarSign}
              color="text-emerald-400"
              trend="+5.2%"
              subtitle="Across all customers"
            />
            <StatCard
              title="Avg Risk Score"
              value={stats.avgRiskScore.toFixed(1)}
              icon={TrendingUp}
              color="text-amber-400"
              trend="-2.1"
              subtitle="Improving"
            />
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/30 backdrop-blur-sm rounded-2xl border border-slate-700/30 p-5">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-green-500/10">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Active Customers</p>
                  <p className="text-xl font-bold text-white">{stats.activeCustomers}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/30 backdrop-blur-sm rounded-2xl border border-slate-700/30 p-5">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-blue-500/10">
                  <Calendar className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">New This Month</p>
                  <p className="text-xl font-bold text-white">{stats.newThisMonth}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/30 backdrop-blur-sm rounded-2xl border border-slate-700/30 p-5">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-purple-500/10">
                  <Clock className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Avg Payment Days</p>
                  <p className="text-xl font-bold text-white">{stats.avgPaymentDays}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-gradient-to-br from-slate-900/40 to-slate-950/40 backdrop-blur-xl rounded-3xl border border-slate-800/50 overflow-hidden">
            {/* Tab Header */}
            <div className="border-b border-slate-800/50">
              <div className="flex flex-col md:flex-row md:items-center justify-between p-6">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                    {activeTab === 'upload' && 'Upload & Process Data'}
                    {activeTab === 'customers' && 'Customer Management'}
                    {activeTab === 'analytics' && 'Analytics & Insights'}
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">
                    {activeTab === 'upload' && 'Upload CSV files and process customer data'}
                    {activeTab === 'customers' && 'Manage and monitor customer risk profiles'}
                    {activeTab === 'analytics' && 'Deep dive into risk analytics and trends'}
                  </p>
                </div>
                <div className="flex items-center space-x-3 mt-4 md:mt-0">
                  <button className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 rounded-xl text-sm font-medium transition-colors flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl text-sm font-medium transition-all hover:shadow-lg hover:shadow-blue-500/25 flex items-center space-x-2">
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {activeTab === 'upload' && (
                <div className="space-y-6">
                  <FileUpload onUploadComplete={loadCustomers} />
                  
                  {/* Recent Activity */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {recentCustomers.map((customer) => (
                        <div key={customer.id} className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:border-slate-600/50 transition-all">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg ${getRiskBgColor(customer.risk_score)}`}>
                                <User className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="font-medium text-white">{customer.name}</p>
                                <p className="text-sm text-slate-500">{customer.company}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`text-lg font-bold ${getRiskColor(customer.risk_score)}`}>
                                {customer.risk_score}
                              </p>
                              <p className="text-xs text-slate-500">Risk Score</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-4 text-sm">
                            <div className="flex items-center space-x-4">
                              <span className="text-slate-400 flex items-center">
                                <DollarSign className="w-3 h-3 mr-1" />
                                ${Number(customer.outstanding_amount).toLocaleString()}
                              </span>
                              <span className="text-slate-400 flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                30 days
                              </span>
                            </div>
                            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                              View Details →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'customers' && (
                <CustomerList customers={customers} loading={loading} onRefresh={loadCustomers} />
              )}
              
              {activeTab === 'analytics' && (
                <Analytics customers={customers} />
              )}
            </div>
          </div>

          {/* Bottom Info */}
          <div className="mt-6 text-center text-sm text-slate-500">
            <p>Payment Pulse Dashboard v2.0 • Last updated: Today, 14:30</p>
            <p className="text-xs mt-1">Need assistance? Contact support@paymentpulse.com</p>
          </div>
        </main>
      </div>
    </div>
  );
}