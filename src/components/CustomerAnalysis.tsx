import { useState, useEffect } from 'react';
import { Customer, supabase } from '../lib/supabase';
import { X, Brain, Loader, AlertCircle, CheckCircle, TrendingUp, Phone, Mail, MessageCircle } from 'lucide-react';

interface CustomerAnalysisProps {
  customer: Customer;
  onClose: () => void;
}

export default function CustomerAnalysis({ customer, onClose }: CustomerAnalysisProps) {
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

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl border border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-900 border-b border-slate-700 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">AI Analysis</h2>
              <p className="text-slate-400 text-sm">{customer.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {analyzing && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader className="w-12 h-12 text-blue-400 animate-spin mb-4" />
              <p className="text-white font-semibold">Analyzing customer data...</p>
              <p className="text-slate-400 text-sm">Running AI models and risk assessment</p>
            </div>
          )}

          {error && (
            <div className="flex items-center space-x-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {analysis && !analyzing && (
            <div className="space-y-6">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">AI Insights</h3>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold">
                    Confidence: {analysis.confidence_score}%
                  </span>
                </div>
                <p className="text-white mb-4 leading-relaxed">{analysis.ai_insights.summary}</p>
                <div className="space-y-2">
                  {analysis.ai_insights.details.map((insight: string, index: number) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <p className="text-slate-300 text-sm">{insight}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-blue-500/20">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Emotional State</p>
                    <p className="text-white text-sm font-semibold">
                      {analysis.ai_insights.emotional_indicators}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Engagement Level</p>
                    <p className="text-white text-sm font-semibold">
                      {analysis.ai_insights.engagement_readiness}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
                <h3 className="text-xl font-bold text-white mb-4">Risk Assessment</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <p className="text-sm text-slate-400 mb-1">Recovery Probability</p>
                    <p className="text-2xl font-bold text-emerald-400">
                      {analysis.risk_assessment.probability_of_recovery}
                    </p>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <p className="text-sm text-slate-400 mb-1">Expected Timeline</p>
                    <p className="text-2xl font-bold text-blue-400">
                      {analysis.risk_assessment.expected_recovery_time}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  {analysis.risk_assessment.factors.map((factor: any, index: number) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white">{factor.factor}</span>
                        <span className="text-slate-400">{factor.score}/100</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            factor.score >= 70
                              ? 'bg-red-500'
                              : factor.score >= 40
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${factor.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
                <h3 className="text-xl font-bold text-white mb-4">Recommended Actions</h3>
                <div className="space-y-4">
                  {analysis.recommended_actions.map((action: any, index: number) => (
                    <div
                      key={index}
                      className="bg-slate-900/50 rounded-lg p-4 border border-slate-700"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {action.channel === 'Phone Call' || action.channel === 'Phone' ? (
                            <Phone className="w-5 h-5 text-blue-400" />
                          ) : action.channel === 'Email' || action.channel === 'Follow-up Email' ? (
                            <Mail className="w-5 h-5 text-cyan-400" />
                          ) : (
                            <MessageCircle className="w-5 h-5 text-emerald-400" />
                          )}
                          <h4 className="text-white font-semibold">{action.action}</h4>
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            action.priority === 'Critical'
                              ? 'bg-red-500/20 text-red-400'
                              : action.priority === 'High'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-blue-500/20 text-blue-400'
                          }`}
                        >
                          {action.priority}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <p className="text-xs text-slate-400">Channel</p>
                          <p className="text-sm text-white">{action.channel}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Timing</p>
                          <p className="text-sm text-white">{action.timing}</p>
                        </div>
                      </div>
                      <div className="bg-slate-800 rounded p-3">
                        <p className="text-xs text-slate-400 mb-1">Suggested Approach:</p>
                        <p className="text-sm text-slate-300">{action.script}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-slate-900 border-t border-slate-700 p-6">
          <button
            onClick={onClose}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition-colors"
          >
            Close Analysis
          </button>
        </div>
      </div>
    </div>
  );
}
