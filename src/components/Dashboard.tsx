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
  Sun, Moon,
  Crown,
} from 'lucide-react';
import FileUpload from './FileUpload';
import CustomerList from './CustomerList';
import Analytics from './Analytics';
import AddCustomer from './AddCustomer';
import { generateCustomerPDF } from '../utils/pdfGenerator';

const COLORS = {
  primary: '#1b4079',
  // Darken secondary for better contrast against light backgrounds
  secondary: '#2f5668',
  // Slightly deeper accents to remain visible on white
  accent1: '#6f8f88',
  accent2: '#7ea77a',
  accent3: '#cbdf90',
  dark: '#0a1931',
  // Slightly warmer light background for better contrast with white elements
  light: '#f3f6f9',
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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleTheme = () => setIsDarkMode(v => !v);

  const THEME = {
    bg: isDarkMode ? COLORS.dark : COLORS.light,
    text: isDarkMode ? '#e6eef8' : COLORS.dark,
    muted: isDarkMode ? '#b8c5d0' : '#1b4079',
    cardBg: isDarkMode ? COLORS.primary + '12' : 'white'
  };
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
      className="w-full flex items-center p-4 rounded-2xl transition-all duration-300 group"
      style={{
        background: activeTab === tab ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})` : 'transparent',
        color: activeTab === tab ? 'white' : (isDarkMode ? '#e6eef8' : COLORS.dark),
        border: activeTab === tab ? 'none' : `1px solid ${COLORS.primary}20`,
        backdropFilter: 'blur(10px)',
        boxShadow: activeTab === tab ? `0 8px 16px ${COLORS.primary}20` : 'none',
      }}
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-xl mr-4 transition-all"
        style={{
          backgroundColor: activeTab === tab ? 'rgba(255,255,255,0.2)' : `${COLORS.primary}15`,
        }}>
        <Icon className="w-6 h-6" style={{
          color: activeTab === tab ? 'white' : COLORS.primary
        }} />
      </div>

      {sidebarOpen && (
        <div className="flex-1 text-left">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-base" style={{ color: activeTab === tab ? 'white' : (isDarkMode ? '#e6eef8' : COLORS.dark) }}>{label}</span>
            {badge && badge > 0 && (
              <span className="px-2 py-1 text-sm rounded-full bg-red-100 text-red-800 font-semibold">
                {badge}
              </span>
            )}
          </div>
          {description && (
            <p className="text-sm mt-1" style={{ color: activeTab === tab ? 'rgba(255,255,255,0.8)' : (isDarkMode ? '#b8c5d0' : COLORS.secondary) }}>{description}</p>
          )}
        </div>
      )}

      {sidebarOpen && (
        <ChevronRight className="w-4 h-4 ml-2 transition-transform" style={{
          color: activeTab === tab ? 'white' : 'transparent',
          transform: activeTab === tab ? 'translateX(4px)' : 'translateX(0)',
        }} />
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
            <div className={`flex items-center px-3 py-1.5 rounded-full ${trend === 'up' ? 'bg-emerald-100 text-emerald-800' :
              trend === 'down' ? 'bg-red-100 text-red-800' :
                'bg-gray-200 text-gray-800'
              }`}>
              {trend === 'up' ? <TrendingUpIcon className="w-4 h-4 mr-1" /> :
                trend === 'down' ? <TrendingUpIcon className="w-4 h-4 mr-1 rotate-180" /> : null}
              <span className="text-sm font-semibold">{trendValue}</span>
            </div>
          )}
        </div>

        <div>
          <p className="text-3xl font-bold mb-2" style={{ color: THEME.text }}>
            {value}
          </p>
          <p className="text-base font-semibold mb-1" style={{ color: THEME.text }}>
            {title}
          </p>
          {subtitle && (
            <p className="text-sm" style={{ color: THEME.muted }}>
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
        backgroundColor: THEME.bg,
        color: THEME.text,
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
          backgroundColor: isDarkMode ? `${COLORS.primary}20` : `${COLORS.primary}10`,
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
                  <Crown className="w-5 h-5 text-white" />
                </div>

                <div>
                  <span
                    className="text-xl font-bold tracking-tight"
                    style={{ color: COLORS.primary }}
                  >
                    Payment Pulse
                  </span>
                  <p className="text-sm" style={{ color: THEME.muted }}>
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
                        <span className="text-sm px-2 py-1 rounded-full" style={{ backgroundColor: `${COLORS.primary}15`, color: COLORS.primary }}>
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
                                <p className="font-medium text-base" style={{ color: COLORS.dark }}>{alert.message}</p>
                                <p className="text-sm mt-1" style={{ color: COLORS.secondary }}>{alert.time}</p>
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

              {/* Theme toggle */}
              <div className="ml-2">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-xl transition-all hover:scale-105 flex items-center"
                  title={isDarkMode ? 'Switch to light' : 'Switch to dark'}
                  style={{
                    backgroundColor: `${COLORS.primary}08`,
                    border: `1px solid ${COLORS.primary}12`,
                    color: THEME.text,
                  }}
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
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
                    <p className="text-sm font-semibold" style={{ color: THEME.text }}>
                      {user?.email?.split('@')[0] || 'Admin'}
                    </p>
                    <p className="text-sm" style={{ color: THEME.muted }}>Admin</p>
                  </div>
                  <ChevronDown className="w-4 h-4" style={{ color: COLORS.secondary }} />
                </button>

                <div
                  className="absolute right-0 mt-2 w-64 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                  style={{
                    backgroundColor: THEME.cardBg,
                    border: `1px solid ${COLORS.primary}20`,
                    backdropFilter: 'blur(20px)',
                    zIndex: 9999,
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
                        <p className="font-semibold" style={{ color: THEME.text }}>
                          {user?.email?.split('@')[0] || 'Admin User'}
                        </p>
                        <p className="text-sm" style={{ color: THEME.muted }}>{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Profile removed per request */}

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
              backgroundColor: THEME.bg,
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
                    <Crown className="w-5 h-5" style={{ color: COLORS.primary }} />
                  </div>
                  <div>
                    <h3 className="font-semibold" style={{ color: COLORS.primary }}>Dashboard</h3>
                    <p className="text-sm" style={{ color: THEME.muted }}>Payment Pulse</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: THEME.text }}>Status:</span>
                  <span className="px-2 py-1 text-sm rounded-full bg-emerald-100 text-emerald-800 font-semibold">
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
                  <span className="text-sm font-semibold" style={{ color: THEME.text }}>Quick Stats</span>
                  <Activity className="w-4 h-4" style={{ color: COLORS.primary }} />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: THEME.muted }}>High Risk</span>
                    <span className="text-sm font-semibold" style={{ color: stats.highRisk > 50 ? COLORS.danger : COLORS.success }}>
                      {stats.highRisk}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: THEME.muted }}>Recovery Rate</span>
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
            <h1 className="text-3xl font-bold mb-2" style={{ color: THEME.text }}>
              Customer Analysis Dashboard
            </h1>
            <p className="text-base" style={{ color: THEME.muted }}>
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
              <h2 className="text-lg font-semibold" style={{ color: THEME.text }}>
                Recovery Performance
              </h2>
              <button
                onClick={() => setShowRevenue(!showRevenue)}
                className="p-2 rounded-lg transition-colors"
                style={{ color: THEME.muted }}
              >
                {showRevenue ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl" style={{ backgroundColor: THEME.cardBg }}>
                <div className="flex items-center mb-2">
                  <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: `${COLORS.success}15` }}>
                    <Target className="w-4 h-4" style={{ color: COLORS.success }} />
                  </div>
                  <span className="text-sm font-semibold" style={{ color: THEME.text }}>Recovery Rate</span>
                </div>
                <p className="text-2xl font-bold mb-1" style={{ color: THEME.text }}>{stats.recoveryRate}%</p>
                <p className="text-sm" style={{ color: THEME.muted }}>+2.3% from last month</p>
              </div>

              <div className="p-4 rounded-xl" style={{ backgroundColor: THEME.cardBg }}>
                <div className="flex items-center mb-2">
                  <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: `${COLORS.warning}15` }}>
                    <Clock className="w-4 h-4" style={{ color: COLORS.warning }} />
                  </div>
                  <span className="text-sm font-semibold" style={{ color: THEME.text }}>Avg Payment Days</span>
                </div>
                <p className="text-2xl font-bold mb-1" style={{ color: THEME.text }}>{stats.avgPaymentDays}</p>
                <p className="text-sm" style={{ color: THEME.muted }}>-3 days improvement</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: THEME.cardBg,
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
                    className="flex items-center space-x-2 py-4 border-b-2 transition-all duration-300"
                    style={{
                      borderColor: activeTab === tab.id ? COLORS.primary : 'transparent',
                      color: activeTab === tab.id ? COLORS.primary : THEME.muted,
                    }}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="font-medium">{tab.label}</span>
                    {tab.id === 'customers' && stats.highRisk > 0 && (
                      <span className="px-2 py-0.5 text-sm rounded-full bg-red-100 text-red-800 font-semibold">
                        {stats.highRisk}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {activeTab === 'upload' && <FileUpload onUploadComplete={loadCustomers} isDarkMode={isDarkMode} />}
              {activeTab === 'customers' && (
                <CustomerList customers={customers} loading={loading} onRefresh={loadCustomers} isDarkMode={isDarkMode} />
              )}
              {activeTab === 'analytics' && <Analytics customers={customers} isDarkMode={isDarkMode} />}
              {activeTab === 'add_customer' && <AddCustomer onCustomerAdded={loadCustomers} isDarkMode={isDarkMode} />}
            </div>
          </div>

          {/* Recent Activity */}
          <div
            className="mt-6 p-6 rounded-2xl"
            style={{
              background: THEME.cardBg,
              border: `1px solid ${COLORS.primary}20`,
            }}
          >
            <h2 className="text-lg font-semibold mb-6" style={{ color: THEME.text }}>
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: `${COLORS.primary}05` }}>
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
                      <p className="font-medium text-base" style={{ color: THEME.text }}>{activity.action}</p>
                      <p className="text-sm" style={{ color: THEME.muted }}>by {activity.user}</p>
                    </div>
                  </div>
                  <span className="text-sm" style={{ color: THEME.muted }}>{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm" style={{ color: THEME.muted }}>
              Payment Pulse v2.1 • Last updated: Today, {new Date().getHours()}:{new Date().getMinutes().toString().padStart(2, '0')}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
