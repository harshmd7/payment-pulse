import { useState, useEffect } from 'react';
import { 
  ArrowRight, BarChart3, Brain, Shield, TrendingUp, Zap, 
  ChevronDown, CheckCircle, MessageSquare, Globe, 
  Clock, Sparkles, Star, Target, LineChart, 
  PieChart, X, Menu, Sun, Moon, Users, Mail, Phone, MapPin,
  Github, Twitter, Linkedin
} from 'lucide-react';

// --- Static Data ---
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

const stats = [
  { value: "35%", label: "Higher Recovery Rate", icon: TrendingUp },
  { value: "60%", label: "Faster Collections", icon: Clock },
  { value: "92%", label: "Prediction Accuracy", icon: Target },
  { value: "45%", label: "Cost Reduction", icon: BarChart3 },
];

interface LandingPageProps {
  onGetStarted?: () => void;
}

export default function LandingPage({ onGetStarted = () => {} }: LandingPageProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState('home');
  
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Apply theme to HTML tag
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Scroll to section
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden font-sans transition-colors duration-300">
      
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Subtle gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/20 dark:to-transparent" />
        
        {/* Floating orbs - more subtle */}
        <div className="absolute top-[15%] right-[-5%] w-[400px] h-[400px] rounded-full blur-[120px] bg-blue-100/30 dark:bg-blue-500/5 animate-pulse-slow" />
        <div className="absolute bottom-[25%] left-[-5%] w-[350px] h-[350px] rounded-full blur-[120px] bg-indigo-100/30 dark:bg-indigo-500/5 animate-pulse-slower" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => scrollToSection('home')}>
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                Payment Pulse
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              {[
                { id: 'home', label: 'Home' },
                { id: 'features', label: 'Features' },
                { id: 'how-it-works', label: 'How It Works' },
                { id: 'testimonials', label: 'Testimonials' },
                { id: 'faq', label: 'FAQ' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? 'bg-blue-50 dark:bg-gray-800 text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2" />

              <button 
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <button
                onClick={onGetStarted}
                className="ml-2 px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex items-center space-x-2 md:hidden">
              <button onClick={toggleTheme} className="p-2 text-gray-600 dark:text-gray-300">
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-900 dark:text-white">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <div className="px-4 py-4 space-y-2">
              {[
                { id: 'home', label: 'Home' },
                { id: 'features', label: 'Features' },
                { id: 'how-it-works', label: 'How It Works' },
                { id: 'testimonials', label: 'Testimonials' },
                { id: 'faq', label: 'FAQ' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                >
                  {item.label}
                </button>
              ))}
              <button onClick={onGetStarted} className="w-full mt-4 py-3 bg-blue-600 text-white rounded-lg font-medium">
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-full border border-blue-100 dark:border-blue-800 mb-6">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">AI-Powered Debt Collection</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight mb-6 max-w-4xl mx-auto">
            Transform Debt Recovery with{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Intelligent AI
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Maximize revenue while preserving customer relationships. Our human-aware AI detects emotions, predicts behavior, and personalizes every interaction.
          </p>

          {/* CTA Button */}
          <div className="flex justify-center">
            <button
              onClick={onGetStarted}
              className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-lg font-semibold transition-all shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <span>Let's Get Started</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 pt-16 mt-16 border-t border-gray-200 dark:border-gray-800 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl mb-3 border border-blue-100 dark:border-blue-800">
                  <stat.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium text-center">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4 relative z-10 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features for{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Better Results
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our platform combines cutting-edge AI with intuitive tools to revolutionize your recovery process.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl transition-all duration-300 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800"
              >
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform border border-blue-100 dark:border-blue-800">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">Simple integration, powerful results</p>
          </div>

          <div className="space-y-12">
            {[
              { step: "1", title: "Connect Your Data", desc: "Secure API integration with your existing systems", icon: Globe },
              { step: "2", title: "AI Analysis", desc: "Our AI analyzes patterns and predicts outcomes", icon: Brain },
              { step: "3", title: "Strategy Optimization", desc: "Personalized collection strategies generated", icon: Target },
              { step: "4", title: "Automated Execution", desc: "AI-driven outreach and follow-ups", icon: Zap },
              { step: "5", title: "Monitor & Improve", desc: "Real-time dashboards and performance insights", icon: BarChart3 },
            ].map((step, index) => (
              <div key={index} className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-blue-600 dark:bg-blue-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {step.step}
                </div>
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-lg">{step.desc}</p>
                    </div>
                    <div className="hidden md:block p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                      <step.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Loved by Finance Teams</h2>
            <div className="flex justify-center space-x-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-full flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-gray-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic mb-4">"{testimonial.content}"</p>
                <div className="flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Verified Customer
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-10 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
              >
                <div className="p-5 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{faq.question}</h3>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ml-4 ${openFaqIndex === index ? 'rotate-180' : ''}`} />
                </div>
                {openFaqIndex === index && (
                  <div className="px-5 pb-5 text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Collections?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join 500+ companies already using Payment Pulse to recover more, faster.
          </p>
          
          <button
            onClick={onGetStarted}
            className="px-10 py-4 bg-white text-blue-600 rounded-lg text-xl font-bold hover:bg-gray-100 transition-all shadow-xl transform hover:scale-105"
          >
            Get Started Today
          </button>
          
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-blue-100 text-sm">
            <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-2" /> No credit card required</span>
            <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-2" /> Free to explore</span>
            <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-2" /> Cancel anytime</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 dark:bg-black text-gray-300">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">Payment Pulse</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                AI-powered debt collection platform for modern financial institutions.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors text-sm">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Integrations</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Security</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-start text-sm text-gray-400">
                  <Mail className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>support@paymentpulse.com</span>
                </li>
                <li className="flex items-start text-sm text-gray-400">
                  <Phone className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-start text-sm text-gray-400">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>123 Business St, Suite 100<br />San Francisco, CA 94107</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">&copy; 2026 Payment Pulse. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Chat */}
      <div className="fixed bottom-6 right-6 z-40">
        <button className="w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110">
          <MessageSquare className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* CSS for Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }
        .animate-pulse-slower { animation: pulse-slower 8s ease-in-out infinite; }
        
        html {
          scroll-behavior: smooth;
        }
      `}} />
    </div>
  );
}