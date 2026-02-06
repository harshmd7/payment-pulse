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
  Sparkle,
  Castle as CastleIcon,
  Shield,
  BookOpen,
  Coins,
  Scale,
  ScrollText,
} from 'lucide-react';
import FileUpload from './FileUpload';
import CustomerList from './CustomerList';
import Analytics from './Analytics';

// Enhanced Royal color palette
const COLORS = {
  primary: '#1b4079',    // Royal Deep Blue
  primaryLight: '#2b5089',
  secondary: '#4d7c8a',  // Steel Blue
  secondaryLight: '#5d8c9a',
  accent1: '#7f9c96',    // Sage Green
  accent2: '#8fad88',    // Olive Green
  accent3: '#cbdf90',    // Pale Green
  gold: '#d4af37',       // Royal Gold
  goldLight: '#e4bf47',
  goldDark: '#c49f27',
  light: '#f5f7fa',
  dark: '#0a1a2e',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  royalPurple: '#6b46c1',
  royalRed: '#b91c1c',
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
    { id: 1, message: 'New royal-tier customer onboarded', time: '10 min ago', type: 'success', unread: true },
    { id: 2, message: 'Monthly report is ready for review', time: '2 hours ago', type: 'info', unread: true },
    { id: 3, message: 'System update completed', time: '1 day ago', type: 'success', unread: false },
    { id: 4, message: 'Royal tier milestone reached', time: '2 days ago', type: 'achievement', unread: false },
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
      className={`w-full flex items-center p-4 rounded-xl transition-all duration-300 group ${
        activeTab === tab 
          ? 'bg-gradient-to-r from-[#1b4079] to-[#4d7c8a] text-white shadow-lg transform scale-[1.02]' 
          : 'text-gray-700 hover:bg-white/50 hover:shadow-md border border-[#1b4079]/10'
      }`}
      style={{
        backdropFilter: 'blur(10px)',
      }}
    >
      <div className={`relative flex items-center justify-center w-10 h-10 rounded-xl mr-4 transition-all duration-300 ${
        activeTab === tab 
          ? 'bg-white/20 backdrop-blur-sm' 
          : 'bg-gradient-to-br from-[#f5f7fa] to-white shadow-inner group-hover:shadow-sm'
      }`}>
        <Icon className={`w-5 h-5 transition-all duration-300 ${
          activeTab === tab ? 'text-white scale-110' : 'text-[#4d7c8a] group-hover:text-[#1b4079]'
        }`} />
        {activeTab === tab && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-[#d4af37] to-[#e4bf47] rounded-full shadow-sm" />
        )}
      </div>
      
      {sidebarOpen && (
        <div className="flex-1 text-left transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className={`font-semibold text-sm transition-all duration-300 ${
              activeTab === tab ? 'text-white' : 'text-[#1b4079]'
            }`}>
              {label}
            </span>
            {badge && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white shadow-sm">
                {badge}
              </span>
            )}
          </div>
          {description && (
            <p className={`text-xs mt-1 transition-all duration-300 ${
              activeTab === tab ? 'text-white/90' : 'text-[#4d7c8a]'
            }`}>
              {description}
            </p>
          )}
        </div>
      )}
      
      {sidebarOpen && (
        <ChevronRight className={`w-4 h-4 ml-2 transition-all duration-300 ${
          activeTab === tab 
            ? 'translate-x-1 text-white opacity-100' 
            : 'text-transparent group-hover:text-[#4d7c8a] opacity-0 group-hover:opacity-100'
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
      className="rounded-2xl p-5 relative overflow-hidden group transition-all duration-300 hover:scale-[1.02] cursor-pointer"
      style={{
        background: gradient || `linear-gradient(145deg, #ffffff, #f5f7fa)`,
        border: `1px solid ${color}20`,
        boxShadow: `0 4px 20px ${color}08, 0 1px 2px ${color}10`,
      }}
    >
      {/* Decorative Corner */}
      <div className="absolute top-0 right-0 w-16 h-16 opacity-10">
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#d4af37] rounded-tr-2xl" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-5">
          <div 
            className="p-3 rounded-xl relative overflow-hidden group/icon transition-all duration-300"
            style={{ 
              backgroundColor: iconBg || '#ffffff',
              border: `1px solid ${color}30`,
              boxShadow: `0 2px 8px ${color}15`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/20 opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300" />
            <Icon className="w-6 h-6 relative z-10" style={{ color }} />
          </div>
          
          {trend && trendValue && (
            <div className={`flex items-center px-3 py-1.5 rounded-full shadow-sm ${
              trend === 'up' ? 'bg-gradient-to-r from-[#10b981]/20 to-[#34d399]/20 text-[#10b981]' :
              trend === 'down' ? 'bg-gradient-to-r from-[#ef4444]/20 to-[#dc2626]/20 text-[#ef4444]' :
              'bg-gradient-to-r from-[#4d7c8a]/20 to-[#1b4079]/20 text-[#4d7c8a]'
            }`}>
              {trend === 'up' ? <TrendingUp className="w-3.5 h-3.5 mr-1.5" /> : 
               trend === 'down' ? <TrendingUp className="w-3.5 h-3.5 mr-1.5 rotate-180" /> : null}
              <span className="text-xs font-semibold">{trendValue}</span>
            </div>
          )}
        </div>
        
        <div>
          <p className="text-2xl font-bold mb-2 bg-gradient-to-r from-[#1b4079] to-[#4d7c8a] bg-clip-text text-transparent">
            {value}
          </p>
          <p className="text-sm font-semibold mb-1.5 text-[#1b4079]">{title}</p>
          {subtitle && (
            <p className="text-xs text-[#4d7c8a] flex items-center">
              <Sparkle className="w-3 h-3 mr-1" />
              {subtitle}
            </p>
          )}
        </div>
      </div>
      
      {/* Hover Effect Line */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
    </div>
  );

  const QuickActionCard = ({ icon: Icon, title, description, onClick, color }: any) => (
    <button
      onClick={onClick}
      className="p-4 rounded-xl transition-all duration-300 hover:scale-[1.03] group text-left relative overflow-hidden"
      style={{
        background: `linear-gradient(145deg, #ffffff, #f5f7fa)`,
        border: `1px solid ${color}30`,
        boxShadow: `0 2px 8px ${color}10`,
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(${color}40 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }} />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center mb-3">
          <div 
            className="p-2.5 rounded-lg mr-3 group-hover:scale-110 transition-transform relative overflow-hidden"
            style={{ backgroundColor: color + '15' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Icon className="w-5 h-5 relative z-10" style={{ color }} />
          </div>
          <span className="font-semibold text-sm text-[#1b4079]">{title}</span>
        </div>
        <p className="text-xs text-[#4d7c8a] leading-relaxed">{description}</p>
      </div>
    </button>
  );

  const recentActivities = [
    { id: 1, action: 'Royal customer onboarded', user: 'Alex Chen', time: '10 min ago', icon: Crown, color: COLORS.gold },
    { id: 2, action: 'Risk assessment completed', user: 'System AI', time: '25 min ago', icon: ShieldCheck, color: COLORS.primary },
    { id: 3, action: 'Payment received', user: 'Customer #245', time: '1 hour ago', icon: Coins, color: COLORS.success },
    { id: 4, action: 'Royal report generated', user: 'Auto System', time: '2 hours ago', icon: ScrollText, color: COLORS.royalPurple },
  ];

  const quickActions = [
    { icon: Upload, title: 'Upload Data', description: 'Import new customer files', color: COLORS.primary },
    { icon: Download, title: 'Export Report', description: 'Download current analytics', color: COLORS.secondary },
    { icon: Filter, title: 'Apply Filter', description: 'Refine customer list', color: COLORS.accent1 },
    { icon: MessageSquare, title: 'Send Alerts', description: 'Notify team members', color: COLORS.gold },
  ];

  return (
    <div 
      className="min-h-screen overflow-hidden relative font-sans antialiased"
      style={{ 
        backgroundColor: COLORS.light,
        color: COLORS.dark,
      }}
    >
      {/* Enhanced Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Royal Pattern Overlay */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, ${COLORS.primary}10 0%, transparent 50%),
                             radial-gradient(circle at 80% 20%, ${COLORS.accent1}10 0%, transparent 50%),
                             radial-gradient(circle at 40% 40%, ${COLORS.gold}05 0%, transparent 50%)`,
          }}
        />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(${COLORS.primary}05 1px, transparent 1px),
                             linear-gradient(90deg, ${COLORS.primary}05 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
            opacity: 0.5,
          }}
        />
      </div>

      {/* Enhanced Top Navigation */}
      <nav 
        className="sticky top-0 z-50 backdrop-blur-xl border-b"
        style={{ 
          background: `linear-gradient(135deg, ${COLORS.primary}15, ${COLORS.secondary}10)`,
          borderColor: `${COLORS.primary}20`,
          boxShadow: `0 4px 20px ${COLORS.primary}10`,
        }}
      >
        <div className="px-6">
          <div className="flex justify-between items-center h-20">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-3 rounded-xl transition-all hover:scale-105 lg:hidden relative overflow-hidden group"
                style={{ 
                  backgroundColor: `${COLORS.primary}15`,
                  border: `1px solid ${COLORS.primary}30`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {sidebarOpen ? (
                  <X className="w-5 h-5 relative z-10" style={{ color: COLORS.primary }} />
                ) : (
                  <Menu className="w-5 h-5 relative z-10" style={{ color: COLORS.primary }} />
                )}
              </button>
              
              <div className="flex items-center space-x-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden group"
                  style={{ 
                    background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                    boxShadow: `0 8px 32px ${COLORS.primary}30`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Crown className="w-5 h-5 text-white relative z-10" />
                </div>
                <div>
                  <span 
                    className="text-xl font-bold tracking-tight"
                    style={{ 
                      background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Royal Risk Management
                  </span>
                  <p className="text-xs flex items-center" style={{ color: COLORS.secondary }}>
                    <Shield className="w-3 h-3 mr-1" />
                    Premium Dashboard
                  </p>
                </div>
              </div>
            </div>

            {/* Middle Section - Search */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div 
                className="relative w-full group"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.8)',
                  border: `1px solid ${COLORS.primary}30`,
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                  boxShadow: `0 4px 12px ${COLORS.primary}10`,
                }}
              >
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: COLORS.secondary }} />
                <input
                  type="text"
                  placeholder="Search royal customers, reports, or analytics..."
                  className="w-full pl-12 pr-4 py-3 bg-transparent focus:outline-none placeholder-[#4d7c8a]/70"
                  style={{ color: COLORS.dark }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 px-2 py-1 text-xs rounded-md bg-gradient-to-r from-[#1b4079]/10 to-[#4d7c8a]/10 text-[#4d7c8a]">
                  Royal
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-3">
              {/* Royal Badge */}
              <div className="hidden lg:block">
                <div className="flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r from-[#d4af37]/20 to-[#e4bf47]/20">
                  <Diamond className="w-4 h-4 mr-2" style={{ color: COLORS.gold }} />
                  <span className="text-sm font-medium" style={{ color: COLORS.goldDark }}>Royal Tier</span>
                </div>
              </div>

              {/* Notifications */}
              <div className="relative">
                <button 
                  className="p-3 rounded-xl relative transition-all hover:scale-105 group"
                  style={{ 
                    backgroundColor: `${COLORS.primary}15`,
                    border: `1px solid ${COLORS.primary}30`,
                  }}
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  onBlur={() => setTimeout(() => setIsNotificationsOpen(false), 200)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Bell className="w-5 h-5 relative z-10" style={{ color: COLORS.primary }} />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-gradient-to-r from-[#ef4444] to-[#dc2626] rounded-full border-2 border-white shadow-sm"></span>
                </button>
                
                {/* Enhanced Notifications Dropdown */}
                {isNotificationsOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
                    style={{ 
                      border: `1px solid ${COLORS.primary}30`,
                      backdropFilter: 'blur(20px)',
                      boxShadow: `0 20px 60px ${COLORS.primary}20`,
                    }}
                  >
                    <div 
                      className="p-4 border-b"
                      style={{ 
                        borderColor: `${COLORS.primary}20`,
                        background: `linear-gradient(135deg, ${COLORS.primary}05, ${COLORS.secondary}05)`,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Bell className="w-5 h-5 mr-2" style={{ color: COLORS.primary }} />
                          <h3 className="font-semibold text-[#1b4079]">Royal Notifications</h3>
                        </div>
                        <span className="px-2 py-1 text-xs rounded-full bg-gradient-to-r from-[#1b4079] to-[#4d7c8a] text-white">
                          {notifications.filter(n => n.unread).length} new
                        </span>
                      </div>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((note) => (
                        <div 
                          key={note.id}
                          className={`p-4 border-b hover:bg-gradient-to-r hover:from-[#1b4079]/5 hover:to-[#4d7c8a]/5 transition-colors cursor-pointer group/note ${
                            note.unread ? 'bg-gradient-to-r from-[#1b4079]/3 to-transparent' : ''
                          }`}
                          style={{ borderColor: `${COLORS.primary}10` }}
                          onClick={() => markNotificationAsRead(note.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <div 
                              className={`p-2 rounded-lg flex-shrink-0 transition-all duration-300 group-hover/note:scale-110 ${
                                note.unread ? 'opacity-100' : 'opacity-60'
                              }`}
                              style={{ 
                                background: note.type === 'warning' 
                                  ? `linear-gradient(135deg, ${COLORS.warning}15, ${COLORS.warning}05)`
                                  : note.type === 'success'
                                  ? `linear-gradient(135deg, ${COLORS.success}15, ${COLORS.success}05)`
                                  : note.type === 'achievement'
                                  ? `linear-gradient(135deg, ${COLORS.gold}15, ${COLORS.goldLight}05)`
                                  : `linear-gradient(135deg, ${COLORS.primary}15, ${COLORS.secondary}05)`,
                                border: `1px solid ${
                                  note.type === 'warning' ? COLORS.warning + '30' :
                                  note.type === 'success' ? COLORS.success + '30' :
                                  note.type === 'achievement' ? COLORS.gold + '30' : COLORS.primary + '30'
                                }`,
                              }}
                            >
                              {note.type === 'warning' ? <AlertTriangle className="w-4 h-4" style={{ color: COLORS.warning }} /> :
                               note.type === 'success' ? <CheckCircle className="w-4 h-4" style={{ color: COLORS.success }} /> :
                               note.type === 'achievement' ? <Award className="w-4 h-4" style={{ color: COLORS.gold }} /> :
                               <Bell className="w-4 h-4" style={{ color: COLORS.primary }} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-[#1b4079] truncate">{note.message}</p>
                              <div className="flex items-center justify-between mt-1">
                                <p className="text-xs text-[#4d7c8a]">{note.time}</p>
                                {note.type === 'achievement' && (
                                  <Sparkle className="w-3 h-3 text-[#d4af37]" />
                                )}
                              </div>
                            </div>
                            {note.unread && (
                              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#1b4079] to-[#4d7c8a] mt-1 flex-shrink-0"></div>
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
                  className="flex items-center space-x-3 p-2 rounded-xl transition-all hover:scale-105 group"
                  style={{ 
                    background: `linear-gradient(135deg, ${COLORS.primary}15, ${COLORS.secondary}10)`,
                    border: `1px solid ${COLORS.primary}30`,
                    boxShadow: `0 4px 12px ${COLORS.primary}10`,
                  }}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                >
                  <div 
                    className="w-9 h-9 rounded-lg flex items-center justify-center relative overflow-hidden group/avatar"
                    style={{ 
                      background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/30 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300" />
                    <span className="text-white font-semibold text-sm relative z-10">
                      {user?.email?.charAt(0).toUpperCase() || 'A'}
                    </span>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold text-[#1b4079]">
                      {user?.email?.split('@')[0] || 'Royal Admin'}
                    </p>
                    <p className="text-xs flex items-center" style={{ color: COLORS.secondary }}>
                      <CastleIcon className="w-3 h-3 mr-1" />
                      Supreme Authority
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 transition-transform duration-300" style={{ 
                    color: COLORS.secondary,
                    transform: isDropdownOpen ? 'rotate(180deg)' : 'none' 
                  }} />
                </button>
                
                {/* Enhanced Profile Dropdown */}
                {isDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
                    style={{ 
                      border: `1px solid ${COLORS.primary}30`,
                      boxShadow: `0 20px 60px ${COLORS.primary}20`,
                    }}
                  >
                    {/* Dropdown Header */}
                    <div 
                      className="p-4 border-b"
                      style={{ 
                        borderColor: `${COLORS.primary}20`,
                        background: `linear-gradient(135deg, ${COLORS.primary}05, ${COLORS.secondary}05)`,
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center relative overflow-hidden"
                          style={{ 
                            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                            boxShadow: `0 4px 12px ${COLORS.primary}30`,
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/30" />
                          <span className="text-white font-semibold text-base relative z-10">
                            {user?.email?.charAt(0).toUpperCase() || 'A'}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-[#1b4079]">
                            {user?.email?.split('@')[0] || 'Royal Admin'}
                          </p>
                          <p className="text-xs text-[#4d7c8a]">{user?.email}</p>
                        </div>
                      </div>
                      
                      {/* Royal Badge */}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center px-2 py-1 rounded-md bg-gradient-to-r from-[#d4af37]/20 to-[#e4bf47]/20">
                          <Crown className="w-3 h-3 mr-1" style={{ color: COLORS.gold }} />
                          <span className="text-xs font-medium" style={{ color: COLORS.goldDark }}>Royal Access</span>
                        </div>
                        <div className="text-xs text-[#4d7c8a]">ID: #R-001</div>
                      </div>
                    </div>
                    
                    {/* Dropdown Menu */}
                    <div className="p-2">
                      {[
                        { icon: User, label: 'Royal Profile', color: COLORS.primary },
                        { icon: Settings, label: 'Kingdom Settings', color: COLORS.secondary },
                        { icon: Shield, label: 'Security', color: COLORS.accent1 },
                        { icon: BookOpen, label: 'Documentation', color: COLORS.gold },
                        { icon: HelpCircle, label: 'Royal Support', color: COLORS.royalPurple },
                      ].map((item, index) => (
                        <button 
                          key={index}
                          className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gradient-to-r hover:from-[#1b4079]/5 hover:to-[#4d7c8a]/5 transition-colors flex items-center space-x-3 group/item"
                        >
                          <div 
                            className="p-2 rounded-md group-hover/item:scale-110 transition-transform"
                            style={{ backgroundColor: `${item.color}15` }}
                          >
                            <item.icon className="w-4 h-4" style={{ color: item.color }} />
                          </div>
                          <span className="text-sm text-[#1b4079] font-medium">{item.label}</span>
                        </button>
                      ))}
                    </div>
                    
                    {/* Sign Out Section */}
                    <div 
                      className="p-2 border-t"
                      style={{ borderColor: `${COLORS.primary}20` }}
                    >
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gradient-to-r hover:from-[#ef4444]/10 hover:to-[#dc2626]/10 transition-colors flex items-center space-x-3 group/signout"
                      >
                        <div className="p-2 rounded-md bg-gradient-to-r from-[#ef4444]/20 to-[#dc2626]/20 group-hover/signout:scale-110 transition-transform">
                          <LogOut className="w-4 h-4" style={{ color: COLORS.danger }} />
                        </div>
                        <span className="text-sm font-medium" style={{ color: COLORS.danger }}>Sign Out</span>
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
        {/* Enhanced Sidebar */}
        <aside 
          className={`fixed lg:sticky lg:top-0 h-[calc(100vh-5rem)] z-40 transition-all duration-300 ${
            sidebarOpen ? 'w-72 translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'
          }`}
          style={{ 
            background: `linear-gradient(180deg, #ffffff 0%, ${COLORS.light} 100%)`,
            borderRight: `1px solid ${COLORS.primary}20`,
            backdropFilter: 'blur(20px)',
            top: '5rem',
            overflow: 'hidden',
            boxShadow: `20px 0 60px ${COLORS.primary}10`,
          }}
        >
          <div 
            className="h-full flex flex-col p-6 overflow-y-auto"
            style={{ maxHeight: 'calc(100vh - 5rem)' }}
          >
            {/* Royal Welcome Card */}
            {sidebarOpen && (
              <div 
                className="mb-8 p-5 rounded-2xl relative overflow-hidden"
                style={{ 
                  background: `linear-gradient(135deg, ${COLORS.primary}10, ${COLORS.secondary}10)`,
                  border: `1px solid ${COLORS.primary}30`,
                  boxShadow: `0 8px 32px ${COLORS.primary}10`,
                }}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(${COLORS.gold}40 1px, transparent 1px)`,
                    backgroundSize: '30px 30px',
                  }} />
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-4">
                    <div 
                      className="p-2.5 rounded-lg relative overflow-hidden group/icon"
                      style={{ 
                        background: `linear-gradient(135deg, ${COLORS.gold}20, ${COLORS.goldLight}20)`,
                        border: `1px solid ${COLORS.gold}30`,
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/30 opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300" />
                      <Gem className="w-5 h-5 relative z-10" style={{ color: COLORS.gold }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1b4079]">Royal Dashboard</h3>
                      <p className="text-xs flex items-center" style={{ color: COLORS.secondary }}>
                        <Sparkle className="w-3 h-3 mr-1" />
                        Supreme Access
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#4d7c8a]">Status:</span>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#10b981] to-[#34d399] mr-2 animate-pulse" />
                      <span className="px-2.5 py-1 text-xs rounded-full bg-gradient-to-r from-[#10b981]/20 to-[#34d399]/20 text-[#10b981] font-medium">
                        Active • Royal
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 space-y-2">
              <NavigationItem 
                icon={CastleIcon} 
                label="Royal Overview" 
                tab="upload"
                description="Manage kingdom operations"
              />
              <NavigationItem 
                icon={Users} 
                label="Court Members" 
                tab="customers"
                description="Monitor royal subjects"
                badge={stats.highRisk}
              />
              <NavigationItem 
                icon={BarChart3} 
                label="Kingdom Analytics" 
                tab="analytics"
                description="Royal insights and reports"
              />
            </nav>

            {/* Royal Crest at Bottom */}
            {sidebarOpen && (
              <div className="mt-8 pt-6 border-t" style={{ borderColor: `${COLORS.primary}20` }}>
                <div className="flex items-center justify-center space-x-2 text-[#4d7c8a]">
                  <Shield className="w-4 h-4" />
                  <span className="text-xs font-medium">Royal Crest v2.1</span>
                  <Crown className="w-4 h-4" />
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Enhanced Main Content */}
        <main className={`flex-1 p-6 transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-0' : 'lg:ml-20'
        }`}>
          {/* Royal Welcome Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#1b4079] via-[#4d7c8a] to-[#7f9c96] bg-clip-text text-transparent">
                  Royal Risk Management
                </h1>
                <p className="text-sm text-[#4d7c8a] flex items-center">
                  <Scale className="w-4 h-4 mr-2" />
                  Supreme oversight of kingdom finances
                </p>
              </div>
              <div className="hidden lg:flex items-center space-x-3">
                <div className="flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r from-[#1b4079]/10 to-[#4d7c8a]/10">
                  <Calendar className="w-4 h-4 mr-2" style={{ color: COLORS.primary }} />
                  <span className="text-sm font-medium text-[#1b4079]">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Royal Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Royal Subjects"
              value={stats.totalCustomers.toLocaleString()}
              icon={CastleIcon}
              color={COLORS.primary}
              trend="up"
              trendValue="+12%"
              subtitle="Active courtiers"
              gradient={`linear-gradient(145deg, #ffffff, ${COLORS.light})`}
            />
            
            <StatCard
              title="Risk Alerts"
              value={stats.highRisk}
              icon={ShieldCheck}
              color={COLORS.danger}
              trend="up"
              trendValue="+3"
              subtitle="Require royal attention"
              gradient={`linear-gradient(145deg, #ffffff, ${COLORS.light})`}
            />
            
            <StatCard
              title="Kingdom Treasury"
              value={`$${(stats.totalOutstanding / 1000000).toFixed(1)}M`}
              icon={Coins}
              color={COLORS.gold}
              trend="down"
              trendValue="-2.1%"
              subtitle="Royal collections"
              gradient={`linear-gradient(145deg, #ffffff, ${COLORS.light})`}
            />
            
            <StatCard
              title="Royal Score"
              value={stats.avgRiskScore.toFixed(1)}
              icon={Trophy}
              color={COLORS.success}
              trend="down"
              trendValue="-1.5"
              subtitle="Kingdom health"
              gradient={`linear-gradient(145deg, #ffffff, ${COLORS.light})`}
            />
          </div>

          {/* Royal Performance & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Royal Recovery Metrics */}
            <div 
              className="p-6 rounded-2xl col-span-1 lg:col-span-2 relative overflow-hidden"
              style={{ 
                background: `linear-gradient(145deg, #ffffff, ${COLORS.light})`,
                border: `1px solid ${COLORS.primary}30`,
                boxShadow: `0 8px 32px ${COLORS.primary}10`,
              }}
            >
              {/* Decorative Border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1b4079] via-[#4d7c8a] to-[#7f9c96]" />
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <TargetIcon className="w-5 h-5 mr-2" style={{ color: COLORS.primary }} />
                  <h2 className="text-lg font-semibold text-[#1b4079]">
                    Royal Recovery Performance
                  </h2>
                </div>
                <button 
                  onClick={() => setShowRevenue(!showRevenue)}
                  className="p-2 rounded-lg hover:bg-gradient-to-r hover:from-[#1b4079]/10 hover:to-[#4d7c8a]/10 transition-colors"
                  style={{ color: COLORS.secondary }}
                >
                  {showRevenue ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div 
                  className="p-5 rounded-xl relative overflow-hidden group"
                  style={{ 
                    background: `linear-gradient(145deg, #ffffff, #f5f7fa)`,
                    border: `1px solid ${COLORS.success}30`,
                    boxShadow: `0 4px 16px ${COLORS.success}10`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="flex items-center mb-3">
                    <div 
                      className="p-2.5 rounded-lg mr-3"
                      style={{ backgroundColor: `${COLORS.success}15` }}
                    >
                      <TargetIcon className="w-4 h-4" style={{ color: COLORS.success }} />
                    </div>
                    <span className="text-sm font-semibold text-[#1b4079]">Royal Recovery Rate</span>
                  </div>
                  <p className="text-2xl font-bold mb-1 bg-gradient-to-r from-[#10b981] to-[#34d399] bg-clip-text text-transparent">
                    {stats.recoveryRate}%
                  </p>
                  <p className="text-xs text-[#4d7c8a] flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +2.3% from last month
                  </p>
                </div>
                
                <div 
                  className="p-5 rounded-xl relative overflow-hidden group"
                  style={{ 
                    background: `linear-gradient(145deg, #ffffff, #f5f7fa)`,
                    border: `1px solid ${COLORS.warning}30`,
                    boxShadow: `0 4px 16px ${COLORS.warning}10`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="flex items-center mb-3">
                    <div 
                      className="p-2.5 rounded-lg mr-3"
                      style={{ backgroundColor: `${COLORS.warning}15` }}
                    >
                      <Clock className="w-4 h-4" style={{ color: COLORS.warning }} />
                    </div>
                    <span className="text-sm font-semibold text-[#1b4079]">Royal Payment Cycle</span>
                  </div>
                  <p className="text-2xl font-bold mb-1 bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] bg-clip-text text-transparent">
                    {stats.avgPaymentDays} days
                  </p>
                  <p className="text-xs text-[#4d7c8a] flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1 rotate-180" />
                    -3 days improvement
                  </p>
                </div>
              </div>
            </div>

            {/* Royal Quick Actions */}
            <div 
              className="p-6 rounded-2xl relative overflow-hidden"
              style={{ 
                background: `linear-gradient(145deg, #ffffff, ${COLORS.light})`,
                border: `1px solid ${COLORS.accent1}30`,
                boxShadow: `0 8px 32px ${COLORS.accent1}10`,
              }}
            >
              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
                <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-[#8fad88] rounded-tr-2xl" />
              </div>
              
              <div className="flex items-center mb-6">
                <Zap className="w-5 h-5 mr-2" style={{ color: COLORS.accent1 }} />
                <h2 className="text-lg font-semibold text-[#1b4079]">Royal Commands</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => (
                  <QuickActionCard key={index} {...action} />
                ))}
              </div>
              
              {/* Command Note */}
              <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-[#1b4079]/5 to-[#4d7c8a]/5">
                <p className="text-xs text-[#4d7c8a] flex items-center">
                  <Scroll className="w-3 h-3 mr-2" />
                  Execute commands with royal authority
                </p>
              </div>
            </div>
          </div>

          {/* Royal Content Area with Enhanced Tabs */}
          <div 
            className="rounded-2xl overflow-hidden"
            style={{ 
              background: `linear-gradient(145deg, #ffffff, ${COLORS.light})`,
              border: `1px solid ${COLORS.primary}30`,
              boxShadow: `0 20px 60px ${COLORS.primary}10`,
            }}
          >
            {/* Royal Tab Navigation */}
            <div 
              className="border-b px-6"
              style={{ 
                borderColor: `${COLORS.primary}20`,
                background: `linear-gradient(135deg, ${COLORS.primary}05, ${COLORS.secondary}05)`,
              }}
            >
              <div className="flex space-x-8">
                {[
                  { id: 'upload', label: 'Royal Upload', icon: Upload, color: COLORS.primary },
                  { id: 'customers', label: 'Court Management', icon: Users, color: COLORS.secondary },
                  { id: 'analytics', label: 'Kingdom Analytics', icon: BarChart3, color: COLORS.accent1 },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-3 py-4 border-b-2 transition-all duration-300 relative group ${
                      activeTab === tab.id 
                        ? 'border-blue-600' 
                        : 'border-transparent'
                    }`}
                    style={{
                      borderColor: activeTab === tab.id ? tab.color : 'transparent',
                    }}
                  >
                    <div className={`p-2 rounded-lg transition-all duration-300 ${
                      activeTab === tab.id 
                        ? 'scale-110 bg-gradient-to-br from-white to-white shadow-sm'
                        : 'group-hover:scale-110'
                    }`}
                    style={{
                      background: activeTab === tab.id 
                        ? `linear-gradient(145deg, white, #f5f7fa)`
                        : `linear-gradient(145deg, ${tab.color}15, ${tab.color}05)`,
                      border: activeTab === tab.id 
                        ? `1px solid ${tab.color}30`
                        : `1px solid ${tab.color}20`,
                    }}>
                      <tab.icon className={`w-4 h-4 transition-all duration-300 ${
                        activeTab === tab.id ? 'scale-110' : ''
                      }`}
                      style={{ 
                        color: activeTab === tab.id ? tab.color : `${tab.color}80`
                      }} />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className={`font-semibold text-sm transition-all duration-300 ${
                        activeTab === tab.id 
                          ? 'text-[#1b4079]' 
                          : 'text-[#4d7c8a] group-hover:text-[#1b4079]'
                      }`}>
                        {tab.label}
                      </span>
                      <span className="text-xs text-[#4d7c8a]">
                        {tab.id === 'upload' && 'Process royal documents'}
                        {tab.id === 'customers' && 'Manage court members'}
                        {tab.id === 'analytics' && 'Kingdom insights'}
                      </span>
                    </div>
                    {tab.id === 'customers' && stats.highRisk > 0 && (
                      <span className="absolute -top-1 -right-1 px-2 py-0.5 text-xs rounded-full bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white shadow-sm">
                        {stats.highRisk}
                      </span>
                    )}
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-20" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Royal Content */}
            <div className="p-6">
              {activeTab === 'upload' && <FileUpload onUploadComplete={loadCustomers} />}
              {activeTab === 'customers' && (
                <CustomerList customers={customers} loading={loading} onRefresh={loadCustomers} />
              )}
              {activeTab === 'analytics' && <Analytics customers={customers} />}
            </div>
          </div>

          {/* Royal Court Activities */}
          <div 
            className="mt-6 p-6 rounded-2xl relative overflow-hidden"
            style={{ 
              background: `linear-gradient(145deg, #ffffff, ${COLORS.light})`,
              border: `1px solid ${COLORS.primary}30`,
              boxShadow: `0 8px 32px ${COLORS.primary}10`,
            }}
          >
            {/* Decorative Border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1b4079] via-[#4d7c8a] to-[#7f9c96]" />
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <ScrollText className="w-5 h-5 mr-2" style={{ color: COLORS.primary }} />
                <h2 className="text-lg font-semibold text-[#1b4079]">Royal Court Activities</h2>
              </div>
              <span className="px-3 py-1 text-xs rounded-full bg-gradient-to-r from-[#1b4079]/10 to-[#4d7c8a]/10 text-[#4d7c8a]">
                Today's Scroll
              </span>
            </div>
            
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div 
                  key={activity.id} 
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-gradient-to-r hover:from-[#1b4079]/5 hover:to-[#4d7c8a]/5 transition-all duration-300 group/activity"
                  style={{ 
                    border: `1px solid ${activity.color}20`,
                    background: `linear-gradient(145deg, #ffffff, #f5f7fa)`,
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <div 
                      className="p-2.5 rounded-lg relative overflow-hidden group/icon"
                      style={{ 
                        background: `linear-gradient(135deg, ${activity.color}15, ${activity.color}05)`,
                        border: `1px solid ${activity.color}30`,
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/30 opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300" />
                      <activity.icon className="w-4 h-4 relative z-10" style={{ color: activity.color }} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-[#1b4079] group-hover/activity:translate-x-1 transition-transform duration-300">
                        {activity.action}
                      </p>
                      <p className="text-xs text-[#4d7c8a] flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        by {activity.user}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-[#4d7c8a] bg-gradient-to-r from-[#1b4079]/10 to-[#4d7c8a]/10 px-2 py-1 rounded">
                      {activity.time}
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#4d7c8a] opacity-0 group-hover/activity:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Royal Footer */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center space-x-4 mb-2">
              <div className="flex items-center text-sm" style={{ color: COLORS.secondary }}>
                <Shield className="w-4 h-4 mr-2" />
                Royal Dashboard v2.1 • Protected by Royal Crest
              </div>
              <div className="h-4 w-px bg-gradient-to-b from-transparent via-[#4d7c8a] to-transparent" />
              <div className="flex items-center text-sm" style={{ color: COLORS.secondary }}>
                <Clock className="w-4 h-4 mr-2" />
                Last updated: Today, {new Date().getHours()}:{new Date().getMinutes().toString().padStart(2, '0')}
              </div>
            </div>
            <p className="text-xs" style={{ color: COLORS.secondary }}>
              © {new Date().getFullYear()} Royal Risk Management • All kingdom rights reserved
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}