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
  Search,
  ChevronRight,
  Bell,
  Menu,
  X,
  DollarSign,
  ChevronDown,
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  Crown,
  Gem,
  ShieldCheck,
  Trophy,
  Scroll,
  Castle,
  Diamond,
  Activity,
  PieChart,
  Target,
  LineChart,
  MessageSquare,
  Home,
  Settings,
  HelpCircle,
  Filter,
  Download,
  User,
  Building,
  Globe,
  Award,
  Sparkles,
  Eye,
  EyeOff,
  Target as TargetIcon,
  LineChart as LineChartIcon,
} from 'lucide-react';
import FileUpload from './FileUpload';
import CustomerList from './CustomerList';
import Analytics from './Analytics';

// Royal color palette
const COLORS = {
  primary: '#1b4079',    // Royal Blue
  secondary: '#4d7c8a',  // Steel Blue
  accent1: '#7f9c96',    // Sage Green
  accent2: '#8fad88',    // Olive Green
  accent3: '#cbdf90',    // Pale Green
  gold: '#d4af37',       // Royal Gold
  lightGold: '#f4e4a6',
  dark: '#0a1931',
  light: '#f8f9fa',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
};

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'upload' | 'customers' | 'analytics'>('upload');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showRevenue, setShowRevenue] = useState(true);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New high-risk customer detected', time: '10 min ago', type: 'warning', unread: true },
    { id: 2, message: 'Monthly report is ready', time: '2 hours ago', type: 'info', unread: true },
    { id: 3, message: 'System update completed', time: '1 day ago', type: 'success', unread: false },
    { id: 4, message: 'Royal tier milestone reached', time: '2 days ago', type: 'info', unread: false },
  ]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
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
    // Mock data initialization
    setTimeout(() => {
      setStats(prev => ({
        ...prev,
        totalCustomers: 1250,
        highRisk: 87,
        totalOutstanding: 2450000,
        avgRiskScore: 58.7,
        activeCustomers: 1025,
        newThisMonth: 42,
        avgPaymentDays: 28,
        recoveryRate: 78.5,
        successRate: 92.3,
      }));
    }, 1500);
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

  const markNotificationAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, unread: false } : notification
      )
    );
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
    tab: 'upload' | 'customers' | 'analytics';
    description?: string;
    badge?: number;
  }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`w-full flex items-center p-4 rounded-2xl transition-all duration-300 group ${
        activeTab === tab 
          ? 'bg-gradient-to-r from-[#1b4079] to-[#4d7c8a] text-white shadow-lg' 
          : 'text-gray-600 hover:bg-white/10 hover:text-gray-800 border border-white/5'
      }`}
      style={{
        backdropFilter: 'blur(10px)',
      }}
    >
      <div className={`flex items-center justify-center w-12 h-12 rounded-xl mr-4 transition-all ${
        activeTab === tab 
          ? 'bg-white/20' 
          : 'bg-gray-100 group-hover:bg-gray-200'
      }`}>
        <Icon className={`w-6 h-6 ${
          activeTab === tab ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
        }`} />
      </div>
      
      {sidebarOpen && (
        <div className="flex-1 text-left">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm" style={{ 
              color: activeTab === tab ? 'white' : COLORS.dark 
            }}>
              {label}
            </span>
            {badge && (
              <span className="px-2 py-1 text-xs rounded-full bg-red-500/30 text-red-600">
                {badge}
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs mt-1" style={{ 
              color: activeTab === tab ? 'rgba(255,255,255,0.8)' : COLORS.secondary 
            }}>
              {description}
            </p>
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
      className="rounded-2xl p-6 relative overflow-hidden group transition-all duration-300 hover:scale-[1.02] cursor-pointer"
      style={{
        background: gradient || `linear-gradient(135deg, ${COLORS.primary}15, ${COLORS.secondary}15)`,
        border: `1px solid ${color}30`,
        boxShadow: `0 8px 32px ${color}15`,
      }}
    >
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
              trend === 'up' ? 'bg-emerald-500/20 text-emerald-600' :
              trend === 'down' ? 'bg-red-500/20 text-red-600' :
              'bg-gray-500/20 text-gray-600'
            }`}>
              {trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : 
               trend === 'down' ? <TrendingUp className="w-3 h-3 mr-1 rotate-180" /> : null}
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

  const QuickActionCard = ({ icon: Icon, title, description, onClick, color }: any) => (
    <button
      onClick={onClick}
      className="p-4 rounded-xl transition-all duration-300 hover:scale-105 group text-left"
      style={{
        background: `linear-gradient(135deg, ${color}10, ${color}05)`,
        border: `1px solid ${color}20`,
      }}
    >
      <div className="flex items-center mb-3">
        <div 
          className="p-2 rounded-lg mr-3 group-hover:scale-110 transition-transform"
          style={{ backgroundColor: color + '20' }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <span className="font-semibold text-sm" style={{ color: COLORS.dark }}>
          {title}
        </span>
      </div>
      <p className="text-xs" style={{ color: COLORS.secondary }}>
        {description}
      </p>
    </button>
  );

  const recentActivities = [
    { id: 1, action: 'New customer uploaded', user: 'Alex Chen', time: '10 min ago', icon: Upload, color: COLORS.primary },
    { id: 2, action: 'Risk score updated', user: 'System', time: '25 min ago', icon: AlertCircle, color: COLORS.warning },
    { id: 3, action: 'Payment received', user: 'Customer #245', time: '1 hour ago', icon: DollarSign, color: COLORS.success },
    { id: 4, action: 'Report generated', user: 'Auto System', time: '2 hours ago', icon: BarChart3, color: COLORS.secondary },
  ];

  const quickActions = [
    { icon: Upload, title: 'Upload Data', description: 'Import new customer files', color: COLORS.primary },
    { icon: Download, title: 'Export Report', description: 'Download current analytics', color: COLORS.secondary },
    { icon: Filter, title: 'Apply Filter', description: 'Refine customer list', color: COLORS.accent1 },
    { icon: MessageSquare, title: 'Send Alerts', description: 'Notify team members', color: COLORS.gold },
  ];

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
            opacity: 0.03,
          }}
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50/30 via-transparent to-emerald-50/30" />
      </div>

      {/* Top Navigation */}
      <nav 
        className="sticky top-0 z-50 backdrop-blur-xl border-b"
        style={{ 
          backgroundColor: `${COLORS.primary}15`,
          borderColor: `${COLORS.primary}20`,
        }}
      >
        <div className="px-6">
          <div className="flex justify-between items-center h-20">
            {/* Left Section */}
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
                    boxShadow: `0 8px 32px ${COLORS.primary}30`,
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
                  <p className="text-xs" style={{ color: COLORS.secondary }}>
                    Royal Risk Management
                  </p>
                </div>
              </div>
            </div>

            {/* Middle Section - Search */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div 
                className="relative w-full"
                style={{ 
                  backgroundColor: `${COLORS.primary}10`,
                  border: `1px solid ${COLORS.primary}20`,
                  borderRadius: '12px',
                }}
              >
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: COLORS.secondary }} />
                <input
                  type="text"
                  placeholder="Search customers, reports, or analytics..."
                  className="w-full pl-12 pr-4 py-3 bg-transparent focus:outline-none"
                  style={{ color: COLORS.dark }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <div className="relative">
                <button 
                  className="p-3 rounded-xl relative transition-all hover:scale-105"
                  style={{ 
                    backgroundColor: `${COLORS.primary}15`,
                    border: `1px solid ${COLORS.primary}20`,
                  }}
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  onBlur={() => setTimeout(() => setIsNotificationsOpen(false), 200)}
                >
                  <Bell className="w-5 h-5" style={{ color: COLORS.primary }} />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                
                {/* Notifications Dropdown */}
                {isNotificationsOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl z-50"
                    style={{ 
                      border: `1px solid ${COLORS.primary}20`,
                      backdropFilter: 'blur(20px)',
                    }}
                  >
                    <div className="p-4 border-b" style={{ borderColor: `${COLORS.primary}20` }}>
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold" style={{ color: COLORS.primary }}>Notifications</h3>
                        <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${COLORS.primary}15`, color: COLORS.primary }}>
                          {notifications.filter(n => n.unread).length} new
                        </span>
                      </div>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((note) => (
                        <div 
                          key={note.id}
                          className="p-4 border-b hover:bg-gray-50/50 transition-colors cursor-pointer"
                          style={{ borderColor: `${COLORS.primary}10` }}
                          onClick={() => markNotificationAsRead(note.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <div 
                              className={`p-2 rounded-lg ${note.unread ? 'opacity-100' : 'opacity-60'}`}
                              style={{ 
                                backgroundColor: note.type === 'warning' ? `${COLORS.warning}15` :
                                              note.type === 'success' ? `${COLORS.success}15` : `${COLORS.primary}15`,
                                border: `1px solid ${
                                  note.type === 'warning' ? COLORS.warning + '30' :
                                  note.type === 'success' ? COLORS.success + '30' : COLORS.primary + '30'
                                }`,
                              }}
                            >
                              {note.type === 'warning' ? <AlertTriangle className="w-4 h-4" style={{ color: COLORS.warning }} /> :
                               note.type === 'success' ? <CheckCircle className="w-4 h-4" style={{ color: COLORS.success }} /> :
                               <Bell className="w-4 h-4" style={{ color: COLORS.primary }} />}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm" style={{ color: COLORS.dark }}>{note.message}</p>
                              <p className="text-xs mt-1" style={{ color: COLORS.secondary }}>{note.time}</p>
                            </div>
                            {note.unread && (
                              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile */}
              <div className="relative">
                <button 
                  className="flex items-center space-x-3 p-2 rounded-xl transition-all hover:scale-105"
                  style={{ 
                    backgroundColor: `${COLORS.primary}15`,
                    border: `1px solid ${COLORS.primary}20`,
                  }}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
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
                    <p className="text-xs" style={{ color: COLORS.secondary }}>Royal Admin</p>
                  </div>
                  <ChevronDown className="w-4 h-4" style={{ color: COLORS.secondary }} />
                </button>
                
                {/* Profile Dropdown */}
                {isDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl z-50"
                    style={{ 
                      border: `1px solid ${COLORS.primary}20`,
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
                      <button className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-50/50 transition-colors flex items-center space-x-3">
                        <Settings className="w-4 h-4" style={{ color: COLORS.primary }} />
                        <span className="text-sm" style={{ color: COLORS.dark }}>Settings</span>
                      </button>
                      <button className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-50/50 transition-colors flex items-center space-x-3">
                        <HelpCircle className="w-4 h-4" style={{ color: COLORS.primary }} />
                        <span className="text-sm" style={{ color: COLORS.dark }}>Help & Support</span>
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
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar - Fixed and Non-scrollable */}
        <aside 
          className={`fixed lg:sticky lg:top-0 h-[calc(100vh-5rem)] z-40 transition-all duration-300 ${
            sidebarOpen ? 'w-72 translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'
          }`}
          style={{ 
            backgroundColor: 'white',
            borderRight: `1px solid ${COLORS.primary}20`,
            backdropFilter: 'blur(20px)',
            top: '5rem',
            overflow: 'hidden',
          }}
        >
          <div 
            className="h-full flex flex-col p-6 overflow-y-auto"
            style={{ maxHeight: 'calc(100vh - 5rem)' }}
          >
            {/* Welcome Card */}
            {sidebarOpen && (
              <div 
                className="mb-8 p-5 rounded-2xl"
                style={{ 
                  background: `linear-gradient(135deg, ${COLORS.primary}15, ${COLORS.secondary}15)`,
                  border: `1px solid ${COLORS.primary}30`,
                }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div 
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${COLORS.gold}20` }}
                  >
                    <Gem className="w-5 h-5" style={{ color: COLORS.gold }} />
                  </div>
                  <div>
                    <h3 className="font-semibold" style={{ color: COLORS.primary }}>Royal Dashboard</h3>
                    <p className="text-xs" style={{ color: COLORS.secondary }}>Premium Access</p>
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

            {/* Navigation */}
            <nav className="flex-1 space-y-2">
              <NavigationItem 
                icon={Home} 
                label="Dashboard Overview" 
                tab="upload"
                description="Upload and process data"
              />
              <NavigationItem 
                icon={Users} 
                label="Customer Management" 
                tab="customers"
                description="Monitor and analyze customers"
                badge={stats.highRisk}
              />
              <NavigationItem 
                icon={BarChart3} 
                label="Advanced Analytics" 
                tab="analytics"
                description="Deep insights and reports"
              />
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 p-6 transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-0' : 'lg:ml-20'
        }`}>
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: COLORS.dark }}>
              Royal Risk Management Dashboard
            </h1>
            <p className="text-sm" style={{ color: COLORS.secondary }}>
              Welcome back, <span className="font-semibold" style={{ color: COLORS.primary }}>
                {user?.email?.split('@')[0] || 'Admin'}
              </span>. Here's what's happening with your customers today.
            </p>
          </div>

          {/* Stats Grid */}
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
              subtitle="Require immediate attention"
              gradient={`linear-gradient(135deg, ${COLORS.danger}10, ${COLORS.warning}10)`}
              iconBg={`${COLORS.danger}20`}
            />
            
            <StatCard
              title="Total Outstanding"
              value={`$${(stats.totalOutstanding / 1000000).toFixed(1)}M`}
              icon={DollarSign}
              color={COLORS.gold}
              trend="down"
              trendValue="-2.1%"
              subtitle="Across all portfolios"
              gradient={`linear-gradient(135deg, ${COLORS.gold}15, ${COLORS.lightGold}15)`}
              iconBg={`${COLORS.gold}20`}
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

          {/* Secondary Stats & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Recovery Metrics */}
            <div 
              className="p-6 rounded-2xl col-span-1 lg:col-span-2"
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
                      <TargetIcon className="w-4 h-4" style={{ color: COLORS.success }} />
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

            {/* Quick Actions */}
            <div 
              className="p-6 rounded-2xl"
              style={{ 
                background: `linear-gradient(135deg, ${COLORS.accent1}10, ${COLORS.accent2}10)`,
                border: `1px solid ${COLORS.accent1}20`,
              }}
            >
              <h2 className="text-lg font-semibold mb-6" style={{ color: COLORS.primary }}>
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => (
                  <QuickActionCard key={index} {...action} />
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area with Tabs */}
          <div 
            className="rounded-2xl overflow-hidden"
            style={{ 
              background: 'white',
              border: `1px solid ${COLORS.primary}20`,
              boxShadow: `0 8px 32px ${COLORS.primary}10`,
            }}
          >
            {/* Tab Navigation */}
            <div 
              className="border-b px-6"
              style={{ borderColor: `${COLORS.primary}20` }}
            >
              <div className="flex space-x-8">
                {[
                  { id: 'upload', label: 'Upload & Process', icon: Upload },
                  { id: 'customers', label: 'Customer Management', icon: Users },
                  { id: 'analytics', label: 'Advanced Analytics', icon: BarChart3 },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-4 border-b-2 transition-all duration-300 relative ${
                      activeTab === tab.id 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                    style={{
                      borderColor: activeTab === tab.id ? COLORS.primary : 'transparent',
                      color: activeTab === tab.id ? COLORS.primary : COLORS.secondary,
                    }}
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

            {/* Content */}
            <div className="p-6">
              {activeTab === 'upload' && <FileUpload onUploadComplete={loadCustomers} />}
              {activeTab === 'customers' && (
                <CustomerList customers={customers} loading={loading} onRefresh={loadCustomers} />
              )}
              {activeTab === 'analytics' && <Analytics customers={customers} />}
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

          {/* Footer Note */}
          <div className="mt-8 text-center">
            <p className="text-sm" style={{ color: COLORS.secondary }}>
              Royal Dashboard v2.1 • Last updated: Today, {new Date().getHours()}:{new Date().getMinutes().toString().padStart(2, '0')}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}