import { useState } from 'react';
import { ArrowRight, BarChart3, Brain, Shield, TrendingUp, Users, Zap, ChevronDown, CheckCircle, Play, MessageSquare, Globe, Lock, Clock, Sparkles, Star, Award, Target, LineChart, PieChart, Mail, Phone, Calendar, X, Menu } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const testimonials = [
    { name: "Sarah Chen", role: "CFO, FinTech Corp", content: "Increased recovery rates by 35% in just 3 months.", avatar: "SC" },
    { name: "Marcus Rodriguez", role: "Operations Director, BankPlus", content: "Reduced customer complaints by 60% while improving collections.", avatar: "MR" },
    { name: "Priya Sharma", role: "Head of Risk, CreditUnion", content: "The AI predictions are 92% accurate. Game-changing technology.", avatar: "PS" },
  ];

  const features = [
    { icon: Brain, title: "Emotion Detection", desc: "Real-time sentiment analysis during customer interactions" },
    { icon: Target, title: "Smart Prioritization", desc: "Focus efforts on accounts with highest recovery potential" },
    { icon: LineChart, title: "Predictive Analytics", desc: "Forecast payment behavior with 90%+ accuracy" },
    { icon: MessageSquare, title: "Automated Outreach", desc: "Personalized communication across multiple channels" },
    { icon: Shield, title: "Compliance Guard", desc: "Automated regulatory compliance and risk monitoring" },
    { icon: PieChart, title: "Real-time Dashboard", desc: "Comprehensive analytics and performance tracking" },
  ];

  const faqs = [
    { question: "How quickly can we implement?", answer: "Most clients go live within 2-4 weeks with our seamless integration." },
    { question: "Is it suitable for small businesses?", answer: "Yes, we offer scalable solutions for businesses of all sizes." },
    { question: "How does the AI ensure compliance?", answer: "Our system automatically adapts to regional regulations and best practices." },
    { question: "What's the pricing model?", answer: "Flexible subscription based on recovery performance and volume." },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-60 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-1/4 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/90 backdrop-blur-xl border-b border-slate-700/30 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-slate-900" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Payment Pulse
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {['Features', 'Solutions', 'Pricing', 'Resources'].map((item) => (
                <a key={item} href="#" className="text-slate-300 hover:text-white transition-colors font-medium">
                  {item}
                </a>
              ))}
              <button
                onClick={onGetStarted}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-slate-300"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-800/95 backdrop-blur-lg border-b border-slate-700/50">
            <div className="px-4 py-3 space-y-3">
              {['Features', 'Solutions', 'Pricing', 'Resources', 'Contact'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="block py-2 text-slate-300 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <button
                onClick={onGetStarted}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8 animate-fade-in">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full border border-blue-500/30">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                AI-Powered Debt Collection Platform
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Transform Debt Recovery with
              <span className="block mt-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent animate-gradient">
                Intelligent AI
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Maximize revenue while preserving customer relationships with our human-aware AI that detects emotions, 
              predicts payment behavior, and recommends personalized collection strategies.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button
                onClick={onGetStarted}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-cyan-500/50 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="flex items-center justify-center space-x-2">
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              
              <button
                onClick={() => setIsVideoModalOpen(true)}
                className="group px-8 py-4 bg-slate-800/50 hover:bg-slate-700/50 text-white rounded-xl text-lg font-semibold transition-all duration-300 border border-slate-700 hover:border-cyan-500/50 flex items-center justify-center space-x-2"
              >
                <Play className="w-5 h-5 group-hover:text-cyan-400" />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12">
              {[
                { value: "35%", label: "Higher Recovery Rate" },
                { value: "60%", label: "Faster Collections" },
                { value: "92%", label: "Prediction Accuracy" },
                { value: "45%", label: "Cost Reduction" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-400 mt-2">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-12 px-4 bg-slate-800/20">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-slate-400 mb-8">Trusted by industry leaders</p>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 opacity-70">
            {["BankCorp", "FinServe", "CreditPlus", "UnionTrust", "CapitalOne", "WealthBank"].map((company) => (
              <div key={company} className="text-center text-slate-300 text-lg font-semibold">
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Everything You Need for
              <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Smarter Collections
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Our platform combines cutting-edge AI with intuitive tools to revolutionize your recovery process
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/10"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-cyan-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-slate-300 leading-relaxed">{feature.desc}</p>
                <div className="mt-6 pt-6 border-t border-slate-700/50">
                  <a href="#" className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold flex items-center space-x-2">
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              How Payment Pulse Works
            </h2>
            <p className="text-xl text-slate-300">Simple integration, powerful results</p>
          </div>

          <div className="relative">
            {/* Timeline Connector */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-cyan-500 to-blue-500" />
            
            <div className="space-y-12 md:space-y-0">
              {[
                { step: "1", title: "Connect Your Data", desc: "Secure API integration with your existing systems", icon: Globe },
                { step: "2", title: "AI Analysis", desc: "Our AI analyzes patterns and predicts outcomes", icon: Brain },
                { step: "3", title: "Strategy Optimization", desc: "Personalized collection strategies generated", icon: Target },
                { step: "4", title: "Automated Execution", desc: "AI-driven outreach and follow-ups", icon: Zap },
                { step: "5", title: "Monitor & Improve", desc: "Real-time dashboards and performance insights", icon: BarChart3 },
              ].map((step, index) => (
                <div
                  key={index}
                  className={`relative flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className="md:w-1/2"></div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 md:relative md:left-0 md:transform-none">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center border-4 border-slate-900 z-10">
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className={`md:w-1/2 mt-8 md:mt-0 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                    <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50 hover:border-cyan-500/50 transition-all">
                      <div className="text-blue-400 font-bold text-lg mb-2">Step {step.step}</div>
                      <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                      <p className="text-slate-300">{step.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 mb-4">
              <Star className="w-5 h-5 text-amber-400" />
              <Star className="w-5 h-5 text-amber-400" />
              <Star className="w-5 h-5 text-amber-400" />
              <Star className="w-5 h-5 text-amber-400" />
              <Star className="w-5 h-5 text-amber-400" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Loved by Finance Teams
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">{testimonial.name}</h4>
                    <p className="text-slate-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-slate-300 italic">"{testimonial.content}"</p>
                <div className="mt-6 pt-6 border-t border-slate-700/50">
                  <div className="text-amber-400 text-sm">Verified Customer</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10" />
        <div className="max-w-4xl mx-auto text-center relative">
          <Award className="w-16 h-16 text-cyan-400 mx-auto mb-8" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Collections?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join 500+ companies already using Payment Pulse to recover more, faster.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onGetStarted}
              className="group px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl text-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-cyan-500/50 flex items-center justify-center space-x-2 mx-auto"
            >
              <span>Start Free 14-Day Trial</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-10 py-5 bg-slate-800/50 hover:bg-slate-700/50 text-white rounded-xl text-xl font-semibold transition-all duration-300 border border-slate-700">
              Schedule a Demo
            </button>
          </div>
          
          <div className="mt-8 text-slate-400 text-sm">
            <div className="flex items-center justify-center space-x-4">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>No credit card required</span>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Cancel anytime</span>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Full support included</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-slate-700/30 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Zap className="w-8 h-8 text-cyan-400" />
                <span className="text-2xl font-bold text-white">Payment Pulse</span>
              </div>
              <p className="text-slate-400">
                AI-powered debt collection platform for modern financial institutions.
              </p>
            </div>
            
            {['Product', 'Company', 'Resources', 'Legal'].map((category) => (
              <div key={category}>
                <h4 className="text-white font-bold mb-4">{category}</h4>
                <ul className="space-y-2">
                  {['Link 1', 'Link 2', 'Link 3'].map((link) => (
                    <li key={link}>
                      <a href="#" className="text-slate-400 hover:text-white transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="pt-8 border-t border-slate-700/30 text-center text-slate-400">
            <p>&copy; 2026 Payment Pulse. All rights reserved. Made with ❤️ for CodeJam</p>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-slate-900 rounded-2xl overflow-hidden">
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-cyan-400 z-10"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="aspect-video bg-gradient-to-br from-blue-900 to-slate-900 flex items-center justify-center">
              <div className="text-center">
                <Play className="w-20 h-20 text-white/50 mx-auto mb-4" />
                <p className="text-white text-lg">Demo video would play here</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Chat Widget */}
      <div className="fixed bottom-6 right-6 z-40">
        <button className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-110">
          <MessageSquare className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
}