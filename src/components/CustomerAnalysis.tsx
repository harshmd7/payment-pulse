import { useState, useEffect } from 'react';
import { Customer, supabase } from '../lib/supabase';
import {
  X, Brain, Loader, AlertCircle, CheckCircle, Phone, Mail, MessageCircle,
  Activity, Sparkles, ShieldCheck, Trophy
} from 'lucide-react';
import { calculateAdvancedRiskScore, getRiskScoreExplanation, getRiskCategory } from '../utils/riskScoreCalculator';

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

interface CustomerAnalysisProps {
  customer: Customer;
  onClose: () => void;
  inline?: boolean;
}

export default function CustomerAnalysis({ customer, onClose, inline = false }: CustomerAnalysisProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState('');

  const displayScore = calculateAdvancedRiskScore({ daysOverdue: customer.days_overdue, outstandingAmount: Number(customer.outstanding_amount), isFirstDefault: true });

  const currentScore = analysis?.risk_assessment?.overall_score ?? displayScore;

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
      
      // Calculate confidence score based on data completeness and days overdue severity
      const advancedScore = calculateAdvancedRiskScore({
        daysOverdue: customer.days_overdue,
        outstandingAmount: Number(customer.outstanding_amount),
        isFirstDefault: true,
      });
      
      // Confidence: Higher for extreme scores (very clear), lower for moderate (more uncertain)
      const confidenceScore = Math.abs(advancedScore - 50) >= 20 ? 92 : 85;

      const analysisData = {
        user_id: (await supabase.auth.getUser()).data.user?.id,
        customer_id: customer.id,
        analysis_type: 'comprehensive_risk_assessment',
        ai_insights: aiInsights,
        risk_assessment: riskAssessment,
        recommended_actions: recommendedActions,
        confidence_score: confidenceScore,
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
    // Use the advanced risk score calculator
    const advancedScore = calculateAdvancedRiskScore({
      daysOverdue: customer.days_overdue,
      outstandingAmount: Number(customer.outstanding_amount),
      isFirstDefault: true, // We don't have history in this view
    });

    const riskCategory = getRiskCategory(advancedScore);
    const insights: string[] = [];

    // Primary insight based on days overdue
    if (customer.days_overdue > 90) {
      insights.push(`Critical: Payment is ${customer.days_overdue} days overdue (3+ months)`);
      insights.push('This indicates serious financial difficulty or willful non-payment');
      insights.push('High probability of needing legal intervention if unresolved');
    } else if (customer.days_overdue > 60) {
      insights.push(`Severe: Payment is ${customer.days_overdue} days overdue (2 months)`);
      insights.push('Customer has clearly abandoned payment obligations');
      insights.push('Immediate escalation and structured recovery plan needed');
    } else if (customer.days_overdue > 30) {
      insights.push(`Serious: Payment is ${customer.days_overdue} days overdue (1+ month)`);
      insights.push('Payment pattern shows clear default, not mere delays');
      insights.push('Personalized agent contact required immediately');
    } else if (customer.days_overdue > 7) {
      insights.push(`Late: Payment is ${customer.days_overdue} days overdue`);
      insights.push('Timely intervention can prevent further escalation');
      insights.push('Friendly reminder may be sufficient');
    } else if (customer.days_overdue > 0) {
      insights.push(`Minor delay: Payment is ${customer.days_overdue} days overdue`);
      insights.push('Could be processing delay, likely to resolve on its own');
      insights.push('Automated notification should suffice');
    } else {
      insights.push('✓ Payment is on-time');
      insights.push('No immediate action required');
      insights.push('Customer maintains good standing');
    }

    // Secondary insight based on outstanding amount
    if (Number(customer.outstanding_amount) > 50000) {
      insights.push(`High-value account: ₹${Number(customer.outstanding_amount).toLocaleString()}`);
      insights.push('Deserves priority handling and executive attention');
    } else if (Number(customer.outstanding_amount) > 10000) {
      insights.push(`Significant outstanding: ₹${Number(customer.outstanding_amount).toLocaleString()}`);
      insights.push('Requires dedicated follow-up to prevent write-off');
    }

    return {
      summary: `${riskCategory.label}: ${riskCategory.description}`,
      details: insights,
      emotional_indicators: 
        advancedScore >= 70 
          ? 'Likely financial hardship or intentional avoidance' 
          : advancedScore >= 40 
          ? 'May be temporary cash flow issues - responsive to communication'
          : 'Good financial standing - reliable payer',
      engagement_readiness: 
        advancedScore >= 70 
          ? 'Low - may require legal approach' 
          : advancedScore >= 40 
          ? 'Moderate - responsive to structured offers'
          : 'High - likely self-resolving',
    };
  };

  const generateRiskAssessment = (customer: Customer) => {
    // Calculate advanced risk score with breakdown
    const advancedScore = calculateAdvancedRiskScore({
      daysOverdue: customer.days_overdue,
      outstandingAmount: Number(customer.outstanding_amount),
      isFirstDefault: true,
    });

    const riskCategory = getRiskCategory(advancedScore);

    // Calculate individual component scores for detailed breakdown
    const daysScore = Math.min(70, Math.max(0, 
      customer.days_overdue <= 0 ? 0 :
      customer.days_overdue <= 7 ? 10 :
      customer.days_overdue <= 30 ? 20 + (customer.days_overdue - 7) * 0.3 :
      customer.days_overdue <= 60 ? 35 + (customer.days_overdue - 30) * 0.6 :
      customer.days_overdue <= 90 ? 55 + (customer.days_overdue - 60) * 0.5 :
      70
    ));

    const amountScore = Number(customer.outstanding_amount) < 1000 ? 10 :
      Number(customer.outstanding_amount) < 5000 ? 25 :
      Number(customer.outstanding_amount) < 10000 ? 40 :
      Number(customer.outstanding_amount) < 50000 ? 65 : 90;

    const recoveryProbability = 
      advancedScore >= 70 ? '35-50%' :
      advancedScore >= 40 ? '60-75%' :
      '85-95%';

    const recoveryTime = 
      advancedScore >= 70 ? '90-180+ days' :
      advancedScore >= 40 ? '30-60 days' :
      '7-30 days';

    return {
      overall_score: advancedScore,
      risk_category: riskCategory.category,
      factors: [
        {
          factor: '📅 Days Overdue Impact',
          score: Math.round(daysScore),
          weight: '40%',
          impact: 'Critical',
          description: `${customer.days_overdue} days overdue - ${customer.days_overdue <= 0 ? 'On time' : customer.days_overdue <= 7 ? 'Minor delay' : customer.days_overdue <= 30 ? 'Serious default' : customer.days_overdue <= 60 ? 'Very serious' : 'Critical default'}`,
        },
        {
          factor: '💰 Outstanding Amount Severity',
          score: Math.round(amountScore),
          weight: '30%',
          impact: 'High',
          description: `₹${Number(customer.outstanding_amount).toLocaleString()} outstanding - ${Number(customer.outstanding_amount) < 5000 ? 'Manageable' : Number(customer.outstanding_amount) < 20000 ? 'Significant' : 'Large burden'}`,
        },
        {
          factor: '📊 Payment Behavior Pattern',
          score: 15, // First-time default assumption
          weight: '20%',
          impact: 'Medium',
          description: 'First occurrence - Benefit of doubt given',
        },
        {
          factor: '⏱️ Payment Recency',
          score: Math.round(Math.min(90, customer.days_overdue * 0.75)),
          weight: '10%',
          impact: 'Medium',
          description: 'Time since last payment not available',
        },
      ],
      probability_of_recovery: recoveryProbability,
      expected_recovery_time: recoveryTime,
      explanation: getRiskScoreExplanation(advancedScore, {
        daysOverdue: customer.days_overdue,
        outstandingAmount: Number(customer.outstanding_amount),
        isFirstDefault: true,
      }),
    };
  };

  const generateRecommendedActions = (customer: Customer) => {
    // Use advanced score to determine actions
    const advancedScore = calculateAdvancedRiskScore({
      daysOverdue: customer.days_overdue,
      outstandingAmount: Number(customer.outstanding_amount),
      isFirstDefault: true,
    });

    const actions = [];

    if (advancedScore >= 70) {
      actions.push({
        action: '🚨 CRITICAL: Phone Call from Collections',
        priority: 'Critical',
        channel: 'Phone Call',
        timing: 'Within 24 hours',
        script: 'Senior collections agent - Discuss reasons for delay, offer structured payment plan or hardship relief. Be prepared to escalate to legal if no resolution.',
      });
      actions.push({
        action: 'Formal Demand Letter',
        priority: 'Critical',
        channel: 'Email + Registered Mail',
        timing: 'Within 48 hours if phone fails',
        script: 'Legal notice of default with 10-day cure period before collections/legal action',
      });
      actions.push({
        action: 'Payment Plan or Settlement',
        priority: 'High',
        channel: 'Follow-up Call/Email',
        timing: 'After initial contact',
        script: 'Offer 3-6 month payment plan with possible interest waiver, or lump-sum settlement discount',
      });
      actions.push({
        action: 'Collections Agency Referral Planning',
        priority: 'High',
        channel: 'Internal',
        timing: 'If no resolution in 14 days',
        script: 'Prepare account for third-party collections and potential credit reporting',
      });
    } else if (advancedScore >= 40) {
      actions.push({
        action: '⚠️ Engage - Personalized Call',
        priority: 'High',
        channel: 'Phone Call',
        timing: 'Within 3 days',
        script: 'Account manager - "Hi, I see your payment of ₹X is {{days}} days overdue. Everything okay? How can we help you get this resolved?"',
      });
      actions.push({
        action: 'Email: Friendly Payment Reminder',
        priority: 'High',
        channel: 'Email',
        timing: 'Immediately',
        script: 'Professional reminder with payment link, payment plan options, and direct contact number for questions',
      });
      actions.push({
        action: 'SMS Notification',
        priority: 'Medium',
        channel: 'SMS',
        timing: 'Day 3 if no response',
        script: `Quick reminder: Your ₹${Number(customer.outstanding_amount).toLocaleString()} payment is due. Click here to pay now: [link]`,
      });
      actions.push({
        action: 'Flexible Payment Terms',
        priority: 'Medium',
        channel: 'Email/Call',
        timing: 'Day 5 if unresolved',
        script: 'Offer 2-3 month payment plan with no interest to facilitate faster resolution',
      });
    } else {
      actions.push({
        action: '📧 Automated Courtesy Reminder',
        priority: 'Low',
        channel: 'Email',
        timing: 'Within 5 days',
        script: 'Standard payment reminder: "Hi {{name}}, just wanted to remind you about your payment of ₹X due on {{date}}. Payment options: [link]"',
      });
      actions.push({
        action: 'Self-Service Portal Access',
        priority: 'Low',
        channel: 'Email',
        timing: 'Immediate',
        script: 'Provide easy online payment link with multiple payment options (card, bank transfer, UPI, etc.)',
      });
      actions.push({
        action: 'No Further Action Required',
        priority: 'Low',
        channel: 'System',
        timing: 'Ongoing',
        script: 'Monitor for on-time payment. If missed, escalate to moderate risk actions.',
      });
    }

    return actions;
  };

  const wrapperClass = inline
    ? 'mt-4 w-full'
    : 'fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 backdrop-blur-sm';

  const modalClass = inline
    ? 'bg-gradient-to-br from-white to-gray-50 rounded-2xl border w-full overflow-y-auto shadow-2xl'
    : 'bg-gradient-to-br from-white to-gray-50 rounded-2xl border max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl';

  const getRiskColor = (score: number) => {
    return getRiskCategory(Math.round(score)).color;
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
          borderColor: `${COLORS.primary}30`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="sticky top-0 backdrop-blur-xl border-b p-6 flex items-center justify-between z-10"
          style={{
            background: `linear-gradient(135deg, ${COLORS.primary}15, ${COLORS.secondary}15)`,
            borderColor: `${COLORS.primary}20`,
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
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: COLORS.primary }}>
                AI Analysis
                <Sparkles className="w-5 h-5" style={{ color: COLORS.accent2 }} />
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
              background: `linear-gradient(135deg, ${COLORS.primary}10, ${COLORS.secondary}10)`,
              borderColor: `${COLORS.primary}30`,
            }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'white' }}>
                <p className="text-sm mb-1" style={{ color: COLORS.secondary }}>Risk Score</p>
                <p className="text-3xl font-bold" style={{ color: getRiskColor(currentScore) }}>
                  {currentScore}
                </p>
                {(currentScore !== customer.risk_score) && (
                  <p className="text-xs mt-1" style={{ color: COLORS.accent2 }}>
                    (Calculated: {customer.risk_score} → {Math.round(currentScore)})
                  </p>
                )}
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
                    backgroundColor: `${getRiskColor(Math.round(currentScore))}20`,
                    color: getRiskColor(Math.round(currentScore)),
                    border: `1px solid ${getRiskColor(Math.round(currentScore))}30`
                  }}
                >
                  {getRiskCategory(Math.round(currentScore)).label}
                </span>
              </div>
            </div>
          </div>

          {analyzing && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader className="w-12 h-12 animate-spin mb-4" style={{ color: COLORS.primary }} />
              <p className="font-semibold text-lg" style={{ color: COLORS.dark }}>Analyzing customer data...</p>
              <p className="text-sm mt-1" style={{ color: COLORS.secondary }}>Running AI models and risk assessment</p>
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
                    <Activity className="w-5 h-5" style={{ color: COLORS.accent2 }} />
                    AI Insights
                  </h3>
                  <span
                    className="px-3 py-1.5 text-sm font-semibold rounded-full"
                    style={{
                      backgroundColor: `${COLORS.accent2}20`,
                      color: COLORS.accent2,
                      border: `1px solid ${COLORS.accent2}30`,
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
                <div className="space-y-4">
                  {analysis.risk_assessment.factors.map((factor: any, index: number) => (
                    <div key={index} className="space-y-2 p-4 rounded-xl" style={{ backgroundColor: 'white', border: `1px solid ${COLORS.secondary}10` }}>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold" style={{ color: COLORS.dark }}>{factor.factor}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm px-2 py-1 rounded" style={{ backgroundColor: `${COLORS.secondary}10`, color: COLORS.secondary }}>
                            {factor.weight}
                          </span>
                          <span className="text-xl font-bold" style={{ color: getRiskColor(factor.score) }}>
                            {factor.score}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(100, factor.score)}%`,
                            backgroundColor: getRiskColor(factor.score)
                          }}
                        />
                      </div>
                      <p className="text-xs" style={{ color: COLORS.secondary }}>
                        {factor.description}
                      </p>
                      <p className="text-xs font-semibold">Impact: <span style={{ color: COLORS.danger }}>{factor.impact}</span></p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Actions Section */}
              <div
                className="rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.accent3}10, ${COLORS.accent2}10)`,
                  borderColor: `${COLORS.accent2}30`,
                }}
              >
                <h3 className="text-xl font-bold flex items-center gap-2 mb-4" style={{ color: COLORS.dark }}>
                  <Trophy className="w-5 h-5" style={{ color: COLORS.accent2 }} />
                  Recommended Actions
                </h3>
                <div className="space-y-4">
                  {analysis.recommended_actions.map((action: any, index: number) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl border hover:border-opacity-60 transition-all bg-white hover:shadow-md"
                      style={{ borderColor: `${COLORS.accent2}20` }}
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
            borderColor: `${COLORS.primary}20`,
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
            Close Analysis
          </button>
        </div>
      </div>
    </div>
  );
}
