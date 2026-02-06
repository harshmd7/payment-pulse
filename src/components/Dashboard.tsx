import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Customer } from '../lib/supabase';
import {
  LogOut,
  Upload,
  Users,
  TrendingUp,
  AlertCircle,
  BarChart3,
  Search,
  ChevronRight,
  Bell,
  Menu,
  X,
  ChevronDown,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp as TrendingUpIcon,
  Activity,
  Target,
  Download,
  User,
  Eye,
  EyeOff,
  UserPlus,
} from 'lucide-react';
import FileUpload from './FileUpload';
import CustomerList from './CustomerList';
import Analytics from './Analytics';
import AddCustomer from './AddCustomer';
import { generateCustomerPDF } from '../utils/pdfGenerator';

const COLORS = {
  primary: '#1b4079',
  secondary: '#4d7c8a',
  accent1: '#7f9c96',
  accent2: '#8fad88',
  accent3: '#cbdf90',
  dark: '#0a1931',
  light: '#f8f9fa',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
};

interface Alert {
  id: number;
  message: string;
  time: string;
  type: 'upcoming' | 'high_risk' | 'overdue';
  unread: boolean;
  customerId?: string;
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'upload' | 'customers' | 'analytics' | 'add_customer'>('upload');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showRevenue, setShowRevenue] = useState(true);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showAlerts, setShowAlerts] = useState(false);

  const [stats, setStats] = useState({
    totalCustomers: 0,
    highRisk: 0,
    totalOutstanding: 0,
    avgRiskScore: 0,
    activeCustomers: 0,
    newThisMonth: 0,
    avgPaymentDays: 0,
    recoveryRate: 0,
    successRate: 0,
  });

  useEffect(() => {
    loadCustomers();
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
        generateAlerts(data);
        generateRecentActivities(data);
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

    // Compute recovery rate as percentage of customers with no outstanding amount
    const recoveredCustomers = customerData.filter(c => Number(c.outstanding_amount) <= 0).length;
    const recoveryRate = totalCustomers > 0 ? (recoveredCustomers / totalCustomers) * 100 : 0;

    // Compute average payment days weighted by outstanding amount so larger debts influence the average
    const weightedDaysSum = customerData.reduce((sum, c) => sum + (Number(c.days_overdue || 0) * Number(c.outstanding_amount || 0)), 0);
    const avgPaymentDays = totalOutstanding > 0 ? Math.round(weightedDaysSum / totalOutstanding) : 0;

    setStats(prev => ({
      ...prev,
      totalCustomers,
      highRisk,
      totalOutstanding,
      avgRiskScore,
      recoveryRate: Number(recoveryRate.toFixed(1)),
      avgPaymentDays,
    }));
  };

  const generateAlerts = (customerData: Customer[]) => {
    const newAlerts: Alert[] = [];
    let alertId = 1;

    // High-risk customers
    const highRiskCustomers = customerData.filter(c => c.risk_score >= 70);
    highRiskCustomers.forEach(customer => {
      newAlerts.push({
        id: alertId++,
        message: `High-risk customer: ${customer.name} (Risk: ${customer.risk_score})`,
        time: 'Now',
        type: 'high_risk',
        unread: true,
        customerId: customer.id,
      });
    });

    // Overdue payments
    const overdueCustomers = customerData.filter(c => c.days_overdue > 30);
    overdueCustomers.slice(0, 5).forEach(customer => {
      newAlerts.push({
        id: alertId++,
        message: `Payment overdue: ${customer.name} (${customer.days_overdue} days)`,
        time: 'Today',
        type: 'overdue',
        unread: true,
        customerId: customer.id,
      });
    });

    // Upcoming payments (simulated)
    customerData.slice(0, 3).forEach(customer => {
      newAlerts.push({
        id: alertId++,
        message: `Upcoming payment due: ${customer.name} (₹${Number(customer.outstanding_amount).toLocaleString()})`,
        time: '3 days',
        type: 'upcoming',
        unread: true,
        customerId: customer.id,
      });
    });

    setAlerts(newAlerts);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const markAlertAsRead = (id: number) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === id ? { ...alert, unread: false } : alert
      )
    );
  };

  const handleExportData = async () => {
    try {
      for (const customer of customers) {
        await generateCustomerPDF(customer);
      }
      alert(`Exported ${customers.length} customer reports successfully!`);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data. Please try again.');
    }
  };

  const NavigationItem = ({
    icon: Icon,
    label,
    tab,
    description,
    badge
  }: {
    icon: React.ElementType;
    label: string;
    tab: 'upload' | 'customers' | 'analytics' | 'add_customer';
    description?: string;
    badge?: number;
  }) => (
    <button
      onClick={() => {
        setActiveTab(tab);
        setTimeout(() => tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
      }}
      className={`w-full flex items-center p-4 rounded-2xl transition-all duration-300 group ${
        activeTab === tab
          ? 'bg-gradient-to-r from-[#1b4079] to-[#4d7c8a] text-white shadow-lg'
          : 'text-gray-700 hover:bg-[#f1f5f9] hover:text-[#1b4079] border border-white/5'
      }`}
      style={{
        backdropFilter: 'blur(10px)',
      }}
    >
      <div className={`flex items-center justify-center w-12 h-12 rounded-xl mr-4 transition-all ${
        activeTab === tab
          ? 'bg-white/20'
          : 'bg-white/5 group-hover:bg-white/10'
      }`}>
        <Icon className={`w-6 h-6 ${
          activeTab === tab ? 'text-white' : 'text-gray-400 group-hover:text-white'
        }`} />
      </div>

      {sidebarOpen && (
        <div className="flex-1 text-left">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">{label}</span>
            {badge && badge > 0 && (
              <span className="px-2 py-1 text-xs rounded-full bg-red-500/30 text-red-200">
                {badge}
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-gray-400 mt-1">{description}</p>
          )}
        </div>
      )}

      {sidebarOpen && (
        <ChevronRight className={`w-4 h-4 ml-2 transition-transform ${
          activeTab === tab ? 'translate-x-1 text-white' : 'text-transparent group-hover:text-gray-400'
        }`} />
      )}
    </button>
  );

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    trend,
    trendValue,
    subtitle,
    gradient,
    iconBg
  }: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    subtitle?: string;
    gradient?: string;
    iconBg?: string;
  }) => (
    <div
      className="rounded-2xl p-6 relative overflow-hidden group transition-all duration-300 hover:scale-[1.02]"
      style={{
        background: gradient || `linear-gradient(135deg, ${COLORS.primary}15, ${COLORS.secondary}15)`,
        border: `1px solid ${color}30`,
        boxShadow: `0 8px 32px ${color}15`,
      }}
    >
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, ${color}40 2%, transparent 2.5%)`,
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div
            className="p-3 rounded-xl"
            style={{
              backgroundColor: iconBg || `${color}20`,
              border: `1px solid ${color}30`,
            }}
          >
            <Icon className="w-6 h-6" style={{ color }} />
          </div>

          {trend && trendValue && (
            <div className={`flex items-center px-3 py-1.5 rounded-full ${
              trend === 'up' ? 'bg-emerald-500/20 text-emerald-400' :
              trend === 'down' ? 'bg-red-500/20 text-red-400' :
              'bg-gray-500/20 text-gray-400'
            }`}>
              {trend === 'up' ? <TrendingUpIcon className="w-3 h-3 mr-1" /> :
               trend === 'down' ? <TrendingUpIcon className="w-3 h-3 mr-1 rotate-180" /> : null}
              <span className="text-xs font-semibold">{trendValue}</span>
            </div>
          )}
        </div>

        <div>
          <p className="text-3xl font-bold mb-2" style={{ color: COLORS.dark }}>
            {value}
          </p>
          <p className="text-sm font-semibold mb-1" style={{ color: COLORS.primary }}>
            {title}
          </p>
          {subtitle && (
            <p className="text-xs" style={{ color: COLORS.secondary }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'high_risk':
        return AlertTriangle;
      case 'overdue':
        return Clock;
      case 'upcoming':
        return CheckCircle;
      default:
        return Bell;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'high_risk':
        return COLORS.danger;
      case 'overdue':
        return COLORS.warning;
      case 'upcoming':
        return COLORS.primary;
      default:
        return COLORS.secondary;
    }
  };

  const unreadCount = alerts.filter(a => a.unread).length;
  const [recentActivities, setRecentActivities] = useState<Array<{
    id: number;
    action: string;
    user: string;
    time: string;
    icon: React.ElementType;
    color: string;
  }>>([]);

  const timeAgo = (isoDate?: string) => {
    if (!isoDate) return 'Unknown';
    const d = new Date(isoDate).getTime();
    const diff = Date.now() - d;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins} min${mins > 1 ? 's' : ''} ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
    const days = Math.floor(hrs / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const generateRecentActivities = (customerData: Customer[]) => {
    const activities: any[] = [];
    let id = 1;

    customerData.forEach((c) => {
      const createdAt = c.created_at;
      const updatedAt = c.updated_at || c.created_at;

      if (Number(c.outstanding_amount) === 0) {
        activities.push({
          id: id++,
          action: `Payment received: ${c.name}`,
          user: 'System',
          time: updatedAt,
          icon: TrendingUp,
          color: COLORS.success,
        });
        return;
      }

      if (c.days_overdue > 30) {
        activities.push({
          id: id++,
          action: `Payment overdue: ${c.name} (${c.days_overdue} days)`,
          user: 'System',
          time: updatedAt,
          icon: Clock,
          color: COLORS.warning,
        });
        return;
      }

      if (c.risk_score >= 70) {
        activities.push({
          id: id++,
          action: `Risk score high: ${c.name} (Risk: ${c.risk_score})`,
          user: 'System',
          time: updatedAt,
          icon: AlertCircle,
          color: COLORS.danger,
        });
        return;
      }

      // New customer if created within last 7 days
      const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - new Date(createdAt).getTime() < sevenDaysMs) {
        activities.push({
          id: id++,
          action: `New customer uploaded: ${c.name}`,
          user: 'Uploader',
          time: createdAt,
          icon: Upload,
          color: COLORS.primary,
        });
        return;
      }

      // Fallback: general updated activity
      activities.push({
        id: id++,
        action: `Customer updated: ${c.name}`,
        user: 'System',
        time: updatedAt,
        icon: BarChart3,
        color: COLORS.secondary,
      });
    });

    // Sort by time desc and limit to 6
    activities.sort((a, b) => (new Date(b.time).getTime() - new Date(a.time).getTime()));
    const mapped = activities.slice(0, 6).map((a) => ({
      id: a.id,
      action: a.action,
      user: a.user,
      time: timeAgo(a.time),
      icon: a.icon,
      color: a.color,
    }));

    setRecentActivities(mapped);
  };

  return (
    <div
      className="min-h-screen overflow-hidden relative font-sans"
      style={{
        backgroundColor: COLORS.light,
        color: COLORS.dark,
      }}
    >
      {/* Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(45deg, ${COLORS.primary} 2%, transparent 2.5%),
                              linear-gradient(-45deg, ${COLORS.primary} 2%, transparent 2.5%),
                              linear-gradient(45deg, transparent 97%, ${COLORS.primary} 97.5%),
                              linear-gradient(-45deg, transparent 97%, ${COLORS.primary} 97.5%)`,
            backgroundSize: '80px 80px',
            backgroundPosition: '0 0, 0 40px, 40px -40px, -40px 0',
            opacity: 0.02,
          }}
        />
      </div>

      {/* Top Navigation */}
      <nav
        className="sticky top-0 z-50 backdrop-blur-xl border-b"
        style={{
          backgroundColor: `${COLORS.primary}10`,
          borderColor: `${COLORS.primary}20`,
        }}
      >
        <div className="px-6">
          <div className="flex justify-between items-center h-20">

            {/* Left */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-3 rounded-xl transition-all hover:scale-105 lg:hidden"
                style={{
                  backgroundColor: `${COLORS.primary}15`,
                  border: `1px solid ${COLORS.primary}20`,
                }}
              >
                {sidebarOpen ? <X className="w-5 h-5" style={{ color: COLORS.primary }} /> :
                              <Menu className="w-5 h-5" style={{ color: COLORS.primary }} />}
              </button>

              <div className="flex items-center space-x-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                  }}
                >
                  <Activity className="w-5 h-5 text-white" />
                </div>

                <div>
                  <span
                    className="text-xl font-bold tracking-tight"
                    style={{ color: COLORS.primary }}
                  >
                    Payment Pulse
                  </span>
                  <p className="text-xs" style={{ color: COLORS.secondary }}>
                    Customer Risk Analysis
                  </p>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div
                className="relative w-full"
                style={{
                  backgroundColor: `${COLORS.primary}08`,
                  border: `1px solid ${COLORS.primary}20`,
                  borderRadius: '12px',
                }}
              >
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: COLORS.secondary }} />
                <input
                  type="text"
                  placeholder="Search customers..."
                  className="w-full pl-12 pr-4 py-3 bg-transparent focus:outline-none"
                  style={{ color: COLORS.dark }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center space-x-3">

              {/* Export Report Button removed from navbar - per UX requirement */}

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowAlerts(!showAlerts)}
                  className="p-3 rounded-xl relative transition-all hover:scale-105"
                  style={{
                    backgroundColor: `${COLORS.primary}15`,
                    border: `1px solid ${COLORS.primary}20`,
                  }}
                >
                  <Bell className="w-5 h-5" style={{ color: COLORS.primary }} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 px-1.5 min-w-[20px] h-5 bg-red-500 rounded-full border-2 border-white text-white text-xs font-bold flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showAlerts && (
                  <div
                    className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl z-50"
                    style={{
                      border: `1px solid ${COLORS.primary}20`,
                      backdropFilter: 'blur(20px)',
                    }}
                  >
                    <div className="p-4 border-b" style={{ borderColor: `${COLORS.primary}20` }}>
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold" style={{ color: COLORS.primary }}>Alerts</h3>
                        <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${COLORS.primary}15`, color: COLORS.primary }}>
                          {unreadCount} new
                        </span>
                      </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      {alerts.map((alert) => {
                        const AlertIcon = getAlertIcon(alert.type);
                        const alertColor = getAlertColor(alert.type);
                        return (
                          <div
                            key={alert.id}
                            className="p-4 border-b hover:bg-gray-50/50 transition-colors cursor-pointer"
                            style={{ borderColor: `${COLORS.primary}10` }}
                            onClick={() => markAlertAsRead(alert.id)}
                          >
                            <div className="flex items-start space-x-3">
                              <div
                                className={`p-2 rounded-lg ${alert.unread ? 'opacity-100' : 'opacity-60'}`}
                                style={{
                                  backgroundColor: `${alertColor}15`,
                                  border: `1px solid ${alertColor}30`,
                                }}
                              >
                                <AlertIcon className="w-4 h-4" style={{ color: alertColor }} />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-sm" style={{ color: COLORS.dark }}>{alert.message}</p>
                                <p className="text-xs mt-1" style={{ color: COLORS.secondary }}>{alert.time}</p>
                              </div>
                              {alert.unread && (
                                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1"></div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile */}
              <div className="relative group">
                <button
                  className="flex items-center space-x-3 p-2 rounded-xl transition-all hover:scale-105"
                  style={{
                    backgroundColor: `${COLORS.primary}15`,
                    border: `1px solid ${COLORS.primary}20`,
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                    }}
                  >
                    <span className="text-white font-semibold text-sm">
                      {user?.email?.charAt(0).toUpperCase() || 'A'}
                    </span>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold" style={{ color: COLORS.dark }}>
                      {user?.email?.split('@')[0] || 'Admin'}
                    </p>
                    <p className="text-xs" style={{ color: COLORS.secondary }}>Admin</p>
                  </div>
                  <ChevronDown className="w-4 h-4" style={{ color: COLORS.secondary }} />
                </button>

                <div
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
                  style={{
                    border: `1px solid ${COLORS.primary}20`,
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  <div className="p-4 border-b" style={{ borderColor: `${COLORS.primary}20` }}>
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                        }}
                      >
                        <span className="text-white font-semibold text-base">
                          {user?.email?.charAt(0).toUpperCase() || 'A'}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold" style={{ color: COLORS.dark }}>
                          {user?.email?.split('@')[0] || 'Admin User'}
                        </p>
                        <p className="text-xs" style={{ color: COLORS.secondary }}>{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <button className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-50/50 transition-colors flex items-center space-x-3">
                      <User className="w-4 h-4" style={{ color: COLORS.primary }} />
                      <span className="text-sm" style={{ color: COLORS.dark }}>Profile</span>
                    </button>
                  </div>

                  <div className="p-2 border-t" style={{ borderColor: `${COLORS.primary}20` }}>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-red-50/50 transition-colors flex items-center space-x-3"
                      style={{ color: COLORS.danger }}
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">Sign Out</span>
                    </button>
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
          fixed lg:sticky top-20 lg:top-0 h-[calc(100vh-5rem)]
          transition-all duration-300 z-40
          ${sidebarOpen ? 'w-72 translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'}
        `}>
          <div
            className="h-full flex flex-col p-6 border-r"
            style={{
              backgroundColor: 'white',
              borderColor: `${COLORS.primary}20`,
              backdropFilter: 'blur(20px)',
            }}
          >
            {sidebarOpen && (
              <div
                className="mb-8 p-5 rounded-2xl"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.primary}10, ${COLORS.secondary}10)`,
                  border: `1px solid ${COLORS.primary}20`,
                }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${COLORS.primary}15` }}
                  >
                    <Activity className="w-5 h-5" style={{ color: COLORS.primary }} />
                  </div>
                  <div>
                    <h3 className="font-semibold" style={{ color: COLORS.primary }}>Dashboard</h3>
                    <p className="text-xs" style={{ color: COLORS.secondary }}>Payment Pulse</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: COLORS.dark }}>Status:</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-emerald-500/20 text-emerald-600 font-medium">
                    Active
                  </span>
                </div>
              </div>
            )}

            <nav className="flex-1 space-y-2">
              <NavigationItem
                icon={Upload}
                label="Upload Data"
                tab="upload"
                description="Upload and process files"
              />
              <NavigationItem
                icon={Users}
                label="Customers"
                tab="customers"
                description="Monitor customer records"
                badge={stats.highRisk}
              />
              <NavigationItem
                icon={BarChart3}
                label="Analytics"
                tab="analytics"
                description="Customer insights & reports"
              />
              <NavigationItem
                icon={UserPlus}
                label="Add New Customer"
                tab="add_customer"
                description="Manual customer entry"
              />
            </nav>

            {sidebarOpen && (
              <div
                className="mt-8 p-5 rounded-2xl"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.primary}08, ${COLORS.secondary}08)`,
                  border: `1px solid ${COLORS.primary}20`,
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold" style={{ color: COLORS.dark }}>Quick Stats</span>
                  <Activity className="w-4 h-4" style={{ color: COLORS.primary }} />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: COLORS.secondary }}>High Risk</span>
                    <span className="text-sm font-semibold" style={{ color: stats.highRisk > 50 ? COLORS.danger : COLORS.success }}>
                      {stats.highRisk}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: COLORS.secondary }}>Recovery Rate</span>
                    <span className="text-sm font-semibold" style={{ color: COLORS.success }}>
                      {stats.recoveryRate}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6">

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: COLORS.dark }}>
              Customer Analysis Dashboard
            </h1>
            <p className="text-sm" style={{ color: COLORS.secondary }}>
              Welcome back, <span className="font-semibold" style={{ color: COLORS.primary }}>
                {user?.email?.split('@')[0] || 'Admin'}
              </span>. Here is the latest customer payment status.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Customers"
              value={stats.totalCustomers.toLocaleString()}
              icon={Users}
              color={COLORS.primary}
              trend="up"
              trendValue="+12%"
              subtitle="Active: 82%"
              gradient={`linear-gradient(135deg, ${COLORS.primary}15, ${COLORS.secondary}15)`}
              iconBg={`${COLORS.primary}20`}
            />

            <StatCard
              title="High Risk"
              value={stats.highRisk}
              icon={AlertCircle}
              color={COLORS.danger}
              trend="up"
              trendValue="+3"
              subtitle="Requires attention"
              gradient={`linear-gradient(135deg, ${COLORS.danger}10, ${COLORS.warning}10)`}
              iconBg={`${COLORS.danger}20`}
            />

            <StatCard
              title="Total Outstanding"
              value={`₹${(stats.totalOutstanding / 100000).toFixed(1)}L`}
              icon={TrendingUp}
              color={COLORS.secondary}
              trend="down"
              trendValue="-2.1%"
              subtitle="Across all customers"
              gradient={`linear-gradient(135deg, ${COLORS.primary}12, ${COLORS.secondary}12)`}
              iconBg={`${COLORS.secondary}20`}
            />

            <StatCard
              title="Avg Risk Score"
              value={stats.avgRiskScore.toFixed(1)}
              icon={TrendingUp}
              color={COLORS.success}
              trend="down"
              trendValue="-1.5"
              subtitle="Overall improvement"
              gradient={`linear-gradient(135deg, ${COLORS.success}10, ${COLORS.accent1}15)`}
              iconBg={`${COLORS.success}20`}
            />
          </div>

          {/* Recovery Metrics */}
          <div
            className="p-6 rounded-2xl mb-8"
            style={{
              background: `linear-gradient(135deg, ${COLORS.primary}10, ${COLORS.secondary}10)`,
              border: `1px solid ${COLORS.primary}20`,
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold" style={{ color: COLORS.primary }}>
                Recovery Performance
              </h2>
              <button
                onClick={() => setShowRevenue(!showRevenue)}
                className="p-2 rounded-lg hover:bg-white/50 transition-colors"
                style={{ color: COLORS.secondary }}
              >
                {showRevenue ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl" style={{ backgroundColor: 'white' }}>
                <div className="flex items-center mb-2">
                  <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: `${COLORS.success}15` }}>
                    <Target className="w-4 h-4" style={{ color: COLORS.success }} />
                  </div>
                  <span className="text-sm font-semibold" style={{ color: COLORS.dark }}>Recovery Rate</span>
                </div>
                <p className="text-2xl font-bold mb-1" style={{ color: COLORS.dark }}>{stats.recoveryRate}%</p>
                <p className="text-xs" style={{ color: COLORS.secondary }}>+2.3% from last month</p>
              </div>

              <div className="p-4 rounded-xl" style={{ backgroundColor: 'white' }}>
                <div className="flex items-center mb-2">
                  <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: `${COLORS.warning}15` }}>
                    <Clock className="w-4 h-4" style={{ color: COLORS.warning }} />
                  </div>
                  <span className="text-sm font-semibold" style={{ color: COLORS.dark }}>Avg Payment Days</span>
                </div>
                <p className="text-2xl font-bold mb-1" style={{ color: COLORS.dark }}>{stats.avgPaymentDays}</p>
                <p className="text-xs" style={{ color: COLORS.secondary }}>-3 days improvement</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'white',
              border: `1px solid ${COLORS.primary}20`,
              boxShadow: `0 8px 32px ${COLORS.primary}10`,
            }}
          >
            <div
              className="border-b px-6"
              style={{ borderColor: `${COLORS.primary}20` }}
            >
              <div className="flex space-x-8">
                {[
                  { id: 'upload', label: 'Upload & Process', icon: Upload },
                  { id: 'customers', label: 'Customers', icon: Users },
                  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                  { id: 'add_customer', label: 'Add New Customer', icon: UserPlus },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-4 border-b-2 transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="font-medium">{tab.label}</span>
                    {tab.id === 'customers' && stats.highRisk > 0 && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-600">
                        {stats.highRisk}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {activeTab === 'upload' && <FileUpload onUploadComplete={loadCustomers} />}
              {activeTab === 'customers' && (
                <CustomerList customers={customers} loading={loading} onRefresh={loadCustomers} />
              )}
              {activeTab === 'analytics' && <Analytics customers={customers} />}
              {activeTab === 'add_customer' && <AddCustomer onCustomerAdded={loadCustomers} />}
            </div>
          </div>

          {/* Recent Activity */}
          <div
            className="mt-6 p-6 rounded-2xl"
            style={{
              background: 'white',
              border: `1px solid ${COLORS.primary}20`,
            }}
          >
            <h2 className="text-lg font-semibold mb-6" style={{ color: COLORS.primary }}>
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div
                      className="p-2 rounded-lg"
                      style={{
                        backgroundColor: `${activity.color}15`,
                        border: `1px solid ${activity.color}30`,
                      }}
                    >
                      <activity.icon className="w-4 h-4" style={{ color: activity.color }} />
                    </div>
                    <div>
                      <p className="font-medium text-sm" style={{ color: COLORS.dark }}>{activity.action}</p>
                      <p className="text-xs" style={{ color: COLORS.secondary }}>by {activity.user}</p>
                    </div>
                  </div>
                  <span className="text-xs" style={{ color: COLORS.secondary }}>{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm" style={{ color: COLORS.secondary }}>
              Payment Pulse v2.1 • Last updated: Today, {new Date().getHours()}:{new Date().getMinutes().toString().padStart(2, '0')}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
