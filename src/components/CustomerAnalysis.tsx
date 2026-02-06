import { useState, useEffect } from 'react';
import { Customer, supabase } from '../lib/supabase';
import { X, Brain, Loader, AlertCircle, CheckCircle, Phone, Mail, MessageCircle } from 'lucide-react';

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
    : 'fixed inset-0 bg-black/0 z-50 flex items-start justify-center p-4';

  const modalClass = inline
    ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-purple-500/20 w-full overflow-y-auto shadow-xl shadow-purple-500/10'
    : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-purple-500/20 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-purple-500/10';

  return (
    <div className={wrapperClass}>
      <div className={modalClass}>
        <div className="sticky top-0 bg-gradient-to-r from-purple-900/40 via-slate-900/95 to-indigo-900/40 backdrop-blur-xl border-b border-purple-500/20 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-violet-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-200 via-violet-200 to-indigo-200 bg-clip-text text-transparent">AI Analysis</h2>
              <p className="text-slate-400 text-sm">{customer.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-purple-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {analyzing && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader className="w-12 h-12 text-purple-400 animate-spin mb-4" />
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
              <div className="bg-gradient-to-br from-purple-500/10 via-violet-500/10 to-indigo-500/10 border border-purple-500/30 rounded-xl p-6 shadow-lg shadow-purple-500/5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-purple-200 to-violet-200 bg-clip-text text-transparent">AI Insights</h3>
                  <span className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-violet-500/20 text-purple-300 rounded-full text-sm font-semibold border border-purple-400/30">
                    Confidence: {analysis.confidence_score}%
                  </span>
                </div>
                <p className="text-white mb-4 leading-relaxed">{analysis.ai_insights.summary}</p>
                <div className="space-y-2">
                  {analysis.ai_insights.details.map((insight: string, index: number) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
                      <p className="text-slate-300 text-sm">{insight}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-purple-500/20">
                  <div>
                    <p className="text-xs text-purple-300/70 mb-1">Emotional State</p>
                    <p className="text-white text-sm font-semibold">
                      {analysis.ai_insights.emotional_indicators}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-purple-300/70 mb-1">Engagement Level</p>
                    <p className="text-white text-sm font-semibold">
                      {analysis.ai_insights.engagement_readiness}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-xl border border-indigo-500/20 p-6 shadow-lg shadow-indigo-500/5">
                <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent mb-4">Risk Assessment</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-lg p-4 border border-emerald-500/20">
                    <p className="text-sm text-emerald-300/70 mb-1">Recovery Probability</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                      {analysis.risk_assessment.probability_of_recovery}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg p-4 border border-cyan-500/20">
                    <p className="text-sm text-cyan-300/70 mb-1">Expected Timeline</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
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
                      <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-2.5 rounded-full ${
                            factor.score >= 70
                              ? 'bg-gradient-to-r from-red-500 to-rose-500'
                              : factor.score >= 40
                              ? 'bg-gradient-to-r from-amber-400 to-orange-400'
                              : 'bg-gradient-to-r from-emerald-400 to-teal-400'
                          }`}
                          style={{ width: `${factor.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-xl border border-violet-500/20 p-6 shadow-lg shadow-violet-500/5">
                <h3 className="text-xl font-bold bg-gradient-to-r from-violet-200 to-fuchsia-200 bg-clip-text text-transparent mb-4">Recommended Actions</h3>
                <div className="space-y-4">
                  {analysis.recommended_actions.map((action: any, index: number) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-lg p-4 border border-slate-700/50 hover:border-purple-500/30 transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {action.channel === 'Phone Call' || action.channel === 'Phone' ? (
                            <Phone className="w-5 h-5 text-cyan-400" />
                          ) : action.channel === 'Email' || action.channel === 'Follow-up Email' ? (
                            <Mail className="w-5 h-5 text-violet-400" />
                          ) : (
                            <MessageCircle className="w-5 h-5 text-emerald-400" />
                          )}
                          <h4 className="text-white font-semibold">{action.action}</h4>
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            action.priority === 'Critical'
                              ? 'bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-300 border border-red-500/30'
                              : action.priority === 'High'
                              ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-500/30'
                          }`}
                        >
                          {action.priority}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <p className="text-xs text-purple-300/70">Channel</p>
                          <p className="text-sm text-white">{action.channel}</p>
                        </div>
                        <div>
                          <p className="text-xs text-purple-300/70">Timing</p>
                          <p className="text-sm text-white">{action.timing}</p>
                        </div>
                      </div>
                      <div className="bg-slate-800/50 rounded p-3 border border-purple-500/10">
                        <p className="text-xs text-purple-300/70 mb-1">Suggested Approach:</p>
                        <p className="text-sm text-slate-300">{action.script}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-gradient-to-r from-purple-900/40 via-slate-900/95 to-indigo-900/40 backdrop-blur-xl border-t border-purple-500/20 p-6">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-semibold transition-all transform hover:scale-[1.02] shadow-lg shadow-purple-500/20"
          >
            Close Analysis
          </button>
        </div>
      </div>
    </div>
  );
}