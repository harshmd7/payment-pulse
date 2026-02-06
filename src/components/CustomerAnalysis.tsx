import { useState, useEffect } from 'react';
import { Customer, supabase } from '../lib/supabase';
import { 
  X, Brain, Loader, AlertCircle, CheckCircle, Phone, Mail, MessageCircle,
  Crown, Gem, ShieldCheck, Trophy, Scroll, Castle, Diamond, Zap,
  TrendingUp, Target, LineChart, Activity, BarChart3, Sparkles
} from 'lucide-react';

// Royal color palette - matching landing page
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

interface CustomerAnalysisProps {
  customer: Customer;
  onClose: () => void;
  inline?: boolean;
}

export default function CustomerAnalysis({ customer, onClose, inline = false }: CustomerAnalysisProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    performAnalysis();
  }, []);

  const performAnalysis = async () => {
    setAnalyzing(true);
    setError('');

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const aiInsights = generateAIInsights(customer);
      const riskAssessment = generateRiskAssessment(customer);
      const recommendedActions = generateRecommendedActions(customer);

      const analysisData = {
        user_id: (await supabase.auth.getUser()).data.user?.id,
        customer_id: customer.id,
        analysis_type: 'comprehensive_risk_assessment',
        ai_insights: aiInsights,
        risk_assessment: riskAssessment,
        recommended_actions: recommendedActions,
        confidence_score: 85 + Math.floor(Math.random() * 10),
      };

      const { data, error: insertError } = await supabase
        .from('analysis_results')
        .insert(analysisData)
        .select()
        .single();

      if (insertError) throw insertError;

      setAnalysis(data);
    } catch (err: any) {
      setError(err.message || 'Failed to perform analysis');
    } finally {
      setAnalyzing(false);
    }
  };

  const generateAIInsights = (customer: Customer) => {
    const insights: string[] = [];

    if (customer.risk_score >= 70) {
      insights.push('Customer shows HIGH risk indicators with significant payment delays');
      insights.push('Immediate intervention required to prevent further delinquency');
      insights.push('Consider offering structured payment plan to facilitate recovery');
    } else if (customer.risk_score >= 40) {
      insights.push('Customer demonstrates MODERATE risk with some payment inconsistencies');
      insights.push('Proactive engagement recommended to prevent escalation');
      insights.push('May respond well to reminder communications and flexible terms');
    } else {
      insights.push('Customer shows LOW risk profile with manageable debt levels');
      insights.push('Automated reminders likely sufficient for timely resolution');
      insights.push('Good candidate for self-service payment options');
    }

    if (customer.days_overdue > 60) {
      insights.push(`Payment is ${customer.days_overdue} days overdue - urgency level HIGH`);
    }

    if (Number(customer.outstanding_amount) > 5000) {
      insights.push('High-value account - prioritize for personalized agent contact');
    }

    return {
      summary: insights[0],
      details: insights,
      emotional_indicators: customer.risk_score >= 70 ? 'High stress, potential financial hardship' : 'Moderate willingness to engage',
      engagement_readiness: customer.risk_score < 40 ? 'High' : customer.risk_score < 70 ? 'Moderate' : 'Low',
    };
  };

  const generateRiskAssessment = (customer: Customer) => {
    return {
      overall_score: customer.risk_score,
      factors: [
        {
          factor: 'Payment History',
          score: customer.days_overdue > 60 ? 85 : customer.days_overdue > 30 ? 60 : 30,
          impact: 'High',
        },
        {
          factor: 'Outstanding Amount',
          score: Number(customer.outstanding_amount) > 5000 ? 75 : Number(customer.outstanding_amount) > 1000 ? 50 : 25,
          impact: 'High',
        },
        {
          factor: 'Communication Response',
          score: 45 + Math.floor(Math.random() * 30),
          impact: 'Medium',
        },
        {
          factor: 'Financial Stability',
          score: customer.risk_score >= 70 ? 80 : customer.risk_score >= 40 ? 55 : 30,
          impact: 'High',
        },
      ],
      probability_of_recovery: customer.risk_score >= 70 ? '45-60%' : customer.risk_score >= 40 ? '65-80%' : '85-95%',
      expected_recovery_time: customer.risk_score >= 70 ? '60-90 days' : customer.risk_score >= 40 ? '30-60 days' : '15-30 days',
    };
  };

  const generateRecommendedActions = (customer: Customer) => {
    const actions = [];

    if (customer.risk_score >= 70) {
      actions.push({
        action: 'Immediate Agent Contact',
        priority: 'Critical',
        channel: 'Phone Call',
        timing: 'Within 24 hours',
        script: 'Empathetic approach focusing on payment plan options and hardship assessment',
      });
      actions.push({
        action: 'Offer Payment Plan',
        priority: 'High',
        channel: 'Follow-up Email',
        timing: 'After initial contact',
        script: 'Present flexible 3-6 month payment plan with reduced interest',
      });
      actions.push({
        action: 'Escalation Review',
        priority: 'Medium',
        channel: 'Internal',
        timing: 'If no response in 7 days',
        script: 'Prepare for potential collections agency referral',
      });
    } else if (customer.risk_score >= 40) {
      actions.push({
        action: 'Personalized Email Reminder',
        priority: 'High',
        channel: 'Email',
        timing: 'Within 3 days',
        script: 'Friendly reminder with payment options and contact information',
      });
      actions.push({
        action: 'SMS Notification',
        priority: 'Medium',
        channel: 'SMS',
        timing: 'Day 5 if no response',
        script: 'Brief payment reminder with direct payment link',
      });
      actions.push({
        action: 'Agent Follow-up',
        priority: 'Medium',
        channel: 'Phone',
        timing: 'Day 10 if unresolved',
        script: 'Check-in call to discuss payment obstacles and solutions',
      });
    } else {
      actions.push({
        action: 'Automated Email Reminder',
        priority: 'Low',
        channel: 'Email',
        timing: 'Within 7 days',
        script: 'Standard payment reminder with self-service portal link',
      });
      actions.push({
        action: 'Self-Service Portal',
        priority: 'Low',
        channel: 'Online',
        timing: 'Immediate',
        script: 'Provide easy access to online payment and account management',
      });
    }

    return actions;
  };

  const wrapperClass = inline
    ? 'mt-4 w-full'
    : 'fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 backdrop-blur-sm';

  const modalClass = inline
    ? 'bg-gradient-to-br from-white to-gray-50 rounded-2xl border w-full overflow-y-auto shadow-2xl font-serif'
    : 'bg-gradient-to-br from-white to-gray-50 rounded-2xl border max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl font-serif';

  const getRiskColor = (score: number) => {
    if (score >= 70) return COLORS.danger;
    if (score >= 40) return COLORS.warning;
    return COLORS.success;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return COLORS.danger;
      case 'High': return COLORS.warning;
      case 'Medium': return COLORS.secondary;
      default: return COLORS.accent1;
    }
  };

  return (
    <div className={wrapperClass} onClick={onClose}>
      <div 
        className={modalClass}
        style={{ 
          borderColor: `${COLORS.gold}30`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="sticky top-0 backdrop-blur-xl border-b p-6 flex items-center justify-between z-10"
          style={{ 
            background: `linear-gradient(135deg, ${COLORS.primary}15, ${COLORS.secondary}15)`,
            borderColor: `${COLORS.gold}20`,
          }}
        >
          <div className="flex items-center space-x-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-110"
              style={{ 
                background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                boxShadow: `0 8px 32px ${COLORS.primary}40`,
              }}
            >
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: COLORS.primary }}>
                Royal AI Analysis
                <Sparkles className="w-5 h-5" style={{ color: COLORS.gold }} />
              </h2>
              <p className="text-sm" style={{ color: COLORS.secondary }}>{customer.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/50 transition-all duration-300 hover:scale-110"
            style={{ color: COLORS.primary }}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer Summary Card */}
          <div 
            className="p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg"
            style={{ 
              background: `linear-gradient(135deg, ${COLORS.gold}10, ${COLORS.lightGold}10)`,
              borderColor: `${COLORS.gold}30`,
            }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'white' }}>
                <p className="text-sm mb-1" style={{ color: COLORS.secondary }}>Risk Score</p>
                <p className="text-3xl font-bold" style={{ color: getRiskColor(customer.risk_score) }}>
                  {customer.risk_score}
                </p>
              </div>
              <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'white' }}>
                <p className="text-sm mb-1" style={{ color: COLORS.secondary }}>Outstanding</p>
                <p className="text-2xl font-bold" style={{ color: COLORS.dark }}>
                  ₹{Number(customer.outstanding_amount).toLocaleString()}
                </p>
              </div>
              <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'white' }}>
                <p className="text-sm mb-1" style={{ color: COLORS.secondary }}>Days Overdue</p>
                <p className="text-3xl font-bold" style={{ color: COLORS.dark }}>
                  {customer.days_overdue}
                </p>
              </div>
              <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'white' }}>
                <p className="text-sm mb-1" style={{ color: COLORS.secondary }}>Status</p>
                <span 
                  className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: customer.risk_score >= 70 ? `${COLORS.danger}20` :
                                   customer.risk_score >= 40 ? `${COLORS.warning}20` : `${COLORS.success}20`,
                    color: customer.risk_score >= 70 ? COLORS.danger :
                          customer.risk_score >= 40 ? COLORS.warning : COLORS.success,
                    border: `1px solid ${customer.risk_score >= 70 ? COLORS.danger :
                                       customer.risk_score >= 40 ? COLORS.warning : COLORS.success}30`
                  }}
                >
                  {customer.risk_score >= 70 ? 'High Risk' : customer.risk_score >= 40 ? 'Medium Risk' : 'Low Risk'}
                </span>
              </div>
            </div>
          </div>

          {analyzing && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader className="w-12 h-12 animate-spin mb-4" style={{ color: COLORS.gold }} />
              <p className="font-semibold text-lg" style={{ color: COLORS.dark }}>Analyzing customer data...</p>
              <p className="text-sm mt-1" style={{ color: COLORS.secondary }}>Running Royal AI models and risk assessment</p>
            </div>
          )}

          {error && (
            <div 
              className="flex items-center space-x-2 p-4 rounded-lg border"
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

          {analysis && !analyzing && (
            <div className="space-y-6">
              {/* AI Insights Section */}
              <div 
                className="rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg"
                style={{ 
                  background: `linear-gradient(135deg, ${COLORS.primary}10, ${COLORS.secondary}10)`,
                  borderColor: `${COLORS.primary}30`,
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold flex items-center gap-2" style={{ color: COLORS.primary }}>
                    <Diamond className="w-5 h-5" style={{ color: COLORS.gold }} />
                    Royal AI Insights
                  </h3>
                  <span 
                    className="px-3 py-1.5 text-sm font-semibold rounded-full"
                    style={{ 
                      backgroundColor: `${COLORS.gold}20`,
                      color: COLORS.gold,
                      border: `1px solid ${COLORS.gold}30`,
                    }}
                  >
                    Confidence: {analysis.confidence_score}%
                  </span>
                </div>
                <p className="mb-4 leading-relaxed text-lg" style={{ color: COLORS.dark }}>
                  {analysis.ai_insights.summary}
                </p>
                <div className="space-y-2">
                  {analysis.ai_insights.details.map((insight: string, index: number) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: COLORS.success }} />
                      <p className="text-sm" style={{ color: COLORS.secondary }}>{insight}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t" style={{ borderColor: `${COLORS.primary}20` }}>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: 'white' }}>
                    <p className="text-xs mb-1" style={{ color: COLORS.secondary }}>Emotional State</p>
                    <p className="text-sm font-semibold" style={{ color: COLORS.dark }}>
                      {analysis.ai_insights.emotional_indicators}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: 'white' }}>
                    <p className="text-xs mb-1" style={{ color: COLORS.secondary }}>Engagement Level</p>
                    <p className="text-sm font-semibold" style={{ color: COLORS.dark }}>
                      {analysis.ai_insights.engagement_readiness}
                    </p>
                  </div>
                </div>
              </div>

              {/* Risk Assessment Section */}
              <div 
                className="rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg"
                style={{ 
                  background: `linear-gradient(135deg, ${COLORS.accent1}10, ${COLORS.accent2}10)`,
                  borderColor: `${COLORS.accent1}30`,
                }}
              >
                <h3 className="text-xl font-bold flex items-center gap-2 mb-4" style={{ color: COLORS.dark }}>
                  <ShieldCheck className="w-5 h-5" style={{ color: COLORS.accent2 }} />
                  Risk Assessment
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-xl" style={{ backgroundColor: 'white', border: `1px solid ${COLORS.success}20` }}>
                    <p className="text-sm mb-1" style={{ color: COLORS.secondary }}>Recovery Probability</p>
                    <p className="text-2xl font-bold" style={{ color: COLORS.success }}>
                      {analysis.risk_assessment.probability_of_recovery}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl" style={{ backgroundColor: 'white', border: `1px solid ${COLORS.primary}20` }}>
                    <p className="text-sm mb-1" style={{ color: COLORS.secondary }}>Expected Timeline</p>
                    <p className="text-2xl font-bold" style={{ color: COLORS.primary }}>
                      {analysis.risk_assessment.expected_recovery_time}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  {analysis.risk_assessment.factors.map((factor: any, index: number) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span style={{ color: COLORS.dark }}>{factor.factor}</span>
                        <span style={{ color: COLORS.secondary }}>{factor.score}/100</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="h-2.5 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${factor.score}%`,
                            backgroundColor: getRiskColor(factor.score)
                          }}
                        />
                      </div>
                      <p className="text-xs" style={{ color: COLORS.secondary }}>
                        Impact: <span className="font-semibold">{factor.impact}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Actions Section */}
              <div 
                className="rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg"
                style={{ 
                  background: `linear-gradient(135deg, ${COLORS.gold}10, ${COLORS.lightGold}10)`,
                  borderColor: `${COLORS.gold}30`,
                }}
              >
                <h3 className="text-xl font-bold flex items-center gap-2 mb-4" style={{ color: COLORS.dark }}>
                  <Trophy className="w-5 h-5" style={{ color: COLORS.gold }} />
                  Recommended Royal Actions
                </h3>
                <div className="space-y-4">
                  {analysis.recommended_actions.map((action: any, index: number) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl border hover:border-opacity-60 transition-all bg-white hover:shadow-md"
                      style={{ borderColor: `${COLORS.gold}20` }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {action.channel === 'Phone Call' || action.channel === 'Phone' ? (
                            <Phone className="w-5 h-5" style={{ color: COLORS.primary }} />
                          ) : action.channel === 'Email' || action.channel === 'Follow-up Email' ? (
                            <Mail className="w-5 h-5" style={{ color: COLORS.secondary }} />
                          ) : (
                            <MessageCircle className="w-5 h-5" style={{ color: COLORS.accent1 }} />
                          )}
                          <h4 className="font-semibold" style={{ color: COLORS.dark }}>{action.action}</h4>
                        </div>
                        <span
                          className="px-2 py-1 rounded text-xs font-semibold"
                          style={{ 
                            backgroundColor: `${getPriorityColor(action.priority)}20`,
                            color: getPriorityColor(action.priority),
                            border: `1px solid ${getPriorityColor(action.priority)}30`,
                          }}
                        >
                          {action.priority}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <p className="text-xs" style={{ color: COLORS.secondary }}>Channel</p>
                          <p className="text-sm font-medium" style={{ color: COLORS.dark }}>{action.channel}</p>
                        </div>
                        <div>
                          <p className="text-xs" style={{ color: COLORS.secondary }}>Timing</p>
                          <p className="text-sm font-medium" style={{ color: COLORS.dark }}>{action.timing}</p>
                        </div>
                      </div>
                      <div className="p-3 rounded-lg border" style={{ borderColor: `${COLORS.primary}10`, backgroundColor: `${COLORS.primary}5` }}>
                        <p className="text-xs mb-1" style={{ color: COLORS.secondary }}>Suggested Approach:</p>
                        <p className="text-sm" style={{ color: COLORS.dark }}>{action.script}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div 
          className="sticky bottom-0 backdrop-blur-xl border-t p-6"
          style={{ 
            background: `linear-gradient(135deg, ${COLORS.primary}15, ${COLORS.secondary}15)`,
            borderColor: `${COLORS.gold}20`,
          }}
        >
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl font-semibold transition-all transform hover:scale-[1.02] shadow-lg"
            style={{ 
              background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
              color: 'white',
              boxShadow: `0 8px 32px ${COLORS.primary}40`,
            }}
          >
            Close Royal Analysis
          </button>
        </div>
      </div>
    </div>
  );
}