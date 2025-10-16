import { CheckCircle, Users, BarChart3, Lock, MessageSquare, Zap, ArrowRight, Target, Clock, TrendingUp, Bell, Calendar, FileText, Shield, Layers, GitBranch, Activity, UserPlus, Settings } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section - Full Width */}
      <div className="relative overflow-hidden">
        {/* Background with gradient and pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        <div className="relative container mx-auto px-4 md:px-8 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 backdrop-blur-sm border border-indigo-400/30 px-5 py-2 rounded-full text-sm font-medium mb-8 text-indigo-300">
              <Zap className="w-4 h-4" />
              Project Management Reimagined
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-white">Welcome to</span>
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                TaskFlow
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              The ultimate project management solution for modern teams. Organize projects, track progress in real-time, and collaborate seamlessly—all in one powerful platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <a href="/register" className="group">
                <button className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold px-10 py-5 rounded-xl transition-all duration-200 shadow-xl shadow-indigo-500/25 hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-2 text-lg">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </a>
              <a href="/login">
                <button className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-semibold px-10 py-5 rounded-xl transition-all duration-200 border-2 border-white/20 hover:border-white/30 backdrop-blur-sm text-lg">
                  Sign In
                </button>
              </a>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">10K+</div>
                <div className="text-gray-400 text-sm md:text-base">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">50K+</div>
                <div className="text-gray-400 text-sm md:text-base">Projects Created</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 to-indigo-400 bg-clip-text text-transparent mb-2">99.9%</div>
                <div className="text-gray-400 text-sm md:text-base">Uptime</div>
              </div>
            </div>
          </div>

          {/* Floating Feature Cards */}
          <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto mt-16">
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-indigo-500/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div className="text-white font-semibold">Real-time Sync</div>
              </div>
              <div className="text-sm text-gray-400">Live updates across all devices</div>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-purple-400" />
                <div className="text-white font-semibold">Team Collaboration</div>
              </div>
              <div className="text-sm text-gray-400">Work together seamlessly</div>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-pink-500/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="w-5 h-5 text-pink-400" />
                <div className="text-white font-semibold">Analytics Dashboard</div>
              </div>
              <div className="text-sm text-gray-400">Track progress and insights</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid - Full Width */}
      <div className="container mx-auto px-4 md:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Everything you need to succeed
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powerful features designed to streamline your workflow and boost team productivity
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
            <div className="bg-indigo-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-5">
              <Target className="w-7 h-7 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              Project & Task Management
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Organize tasks with intuitive drag-and-drop Kanban boards. Set priorities, assign team members, add due dates, and track every detail effortlessly.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Drag-and-drop task boards
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Priority levels & labels
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Multiple assignees per task
              </li>
            </ul>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
            <div className="bg-purple-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-5">
              <Users className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              Team Collaboration
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Work together seamlessly with real-time presence indicators, team activity feeds, and instant notifications when team members join or make updates.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Online presence indicators
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Team activity dashboard
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                @mentions & notifications
              </li>
            </ul>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
            <div className="bg-blue-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-5">
              <Zap className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              Real-time Updates
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Stay perfectly synchronized with WebSocket-powered live updates. See changes instantly as they happen across all connected devices and team members.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                WebSocket technology
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Instant push notifications
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Cross-device sync
              </li>
            </ul>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
            <div className="bg-green-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-5">
              <BarChart3 className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              Analytics & Insights
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Make data-driven decisions with comprehensive analytics. Track progress with burndown charts, completion rates, velocity metrics, and team productivity insights.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Burndown charts
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Velocity tracking
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Custom reports
              </li>
            </ul>
          </div>

          {/* Feature 5 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
            <div className="bg-red-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-5">
              <Lock className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              Secure Authentication
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Enterprise-grade security with JWT authentication and granular role-based access control. Define permissions for Admins, Managers, and Members.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                JWT token authentication
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Role-based permissions
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Secure avatar uploads
              </li>
            </ul>
          </div>

          {/* Feature 6 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
            <div className="bg-orange-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-5">
              <MessageSquare className="w-7 h-7 text-orange-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              Comments & Feedback
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Engage in contextual discussions with threaded comments on any task. Get instant notifications and maintain conversation history for better collaboration.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Threaded conversations
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Live comment notifications
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Rich text formatting
              </li>
            </ul>
          </div>
        </div>

        {/* Additional Features Section */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-12 md:p-16 mb-20">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">More powerful features</h3>
              <p className="text-gray-300 mb-8 leading-relaxed">
                TaskFlow comes packed with additional capabilities to help your team work smarter and achieve more together.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-indigo-400 mt-1" />
                  <div>
                    <div className="text-white font-semibold mb-1">Calendar View</div>
                    <div className="text-sm text-gray-400">Timeline planning</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-green-400 mt-1" />
                  <div>
                    <div className="text-white font-semibold mb-1">File Attachments</div>
                    <div className="text-sm text-gray-400">Documents & media</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-400 mt-1" />
                  <div>
                    <div className="text-white font-semibold mb-1">Data Protection</div>
                    <div className="text-sm text-gray-400">Privacy first</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Layers className="w-5 h-5 text-purple-400 mt-1" />
                  <div>
                    <div className="text-white font-semibold mb-1">Project Templates</div>
                    <div className="text-sm text-gray-400">Quick start</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <GitBranch className="w-5 h-5 text-pink-400 mt-1" />
                  <div>
                    <div className="text-white font-semibold mb-1">Task Dependencies</div>
                    <div className="text-sm text-gray-400">Workflow control</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Activity className="w-5 h-5 text-yellow-400 mt-1" />
                  <div>
                    <div className="text-white font-semibold mb-1">Activity Logs</div>
                    <div className="text-sm text-gray-400">Full audit trail</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h4 className="text-xl font-semibold text-white mb-6">Technical Excellence</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                  <span className="text-gray-300">RESTful API Design</span>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                  <span className="text-gray-300">Relational Database</span>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                  <span className="text-gray-300">Data Validation</span>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                  <span className="text-gray-300">Error Handling</span>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                  <span className="text-gray-300">Protected Routes</span>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Middleware Stack</span>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section - Full Width Background */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Trusted by teams worldwide
            </h3>
            <p className="text-indigo-100 text-lg">
              Join thousands of teams already using TaskFlow to achieve their goals
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <Clock className="w-10 h-10 mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">50%</div>
              <div className="text-indigo-100">Faster Project Completion</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <TrendingUp className="w-10 h-10 mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-indigo-100">Team Visibility</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <Target className="w-10 h-10 mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">85%</div>
              <div className="text-indigo-100">Productivity Increase</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <CheckCircle className="w-10 h-10 mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-indigo-100">Real-time Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="container mx-auto px-4 md:px-8 py-20">
        <div className="text-center mb-16">
          <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Get started in minutes
          </h3>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Setting up your project management workflow is quick and easy
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="text-center">
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <UserPlus className="w-8 h-8 text-indigo-600" />
            </div>
            <div className="text-indigo-600 font-bold text-lg mb-2">Step 1</div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">Create Your Account</h4>
            <p className="text-gray-600">
              Sign up in seconds with your email. No credit card required for free tier.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Settings className="w-8 h-8 text-purple-600" />
            </div>
            <div className="text-purple-600 font-bold text-lg mb-2">Step 2</div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">Set Up Your Project</h4>
            <p className="text-gray-600">
              Create projects, invite team members, and configure your workflow preferences.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-green-600 font-bold text-lg mb-2">Step 3</div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">Start Collaborating</h4>
            <p className="text-gray-600">
              Add tasks, track progress, and watch your team's productivity soar.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section - Full Width */}
      <div className="bg-gray-900 py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to transform your workflow?
            </h2>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed">
              Join thousands of teams already using TaskFlow to achieve more together. Start your free trial today—no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a href="/register">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-10 py-4 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/50 hover:shadow-xl hover:scale-105">
                  Start Your Free Trial
                </button>
              </a>
              <a href="/login">
                <button className="bg-white/10 hover:bg-white/20 text-white font-semibold px-10 py-4 rounded-xl transition-all duration-200 border border-white/20 backdrop-blur-sm">
                  View Demo
                </button>
              </a>
            </div>
            <p className="text-gray-400 text-sm">
              Free forever for small teams • No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </div>

      {/* Footer - Full Width */}
      <footer className="bg-gray-950 border-t border-gray-800">
        <div className="container mx-auto px-4 md:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold text-white mb-4">TaskFlow</div>
              <p className="text-gray-400 text-sm mb-4">
                The modern project management platform for high-performing teams.
              </p>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer transition-colors">
                  <span className="text-gray-400 text-xs">TW</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer transition-colors">
                  <span className="text-gray-400 text-xs">LI</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer transition-colors">
                  <span className="text-gray-400 text-xs">GH</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="hover:text-white cursor-pointer transition-colors">Features</li>
                <li className="hover:text-white cursor-pointer transition-colors">Pricing</li>
                <li className="hover:text-white cursor-pointer transition-colors">Security</li>
                <li className="hover:text-white cursor-pointer transition-colors">Roadmap</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="hover:text-white cursor-pointer transition-colors">About Us</li>
                <li className="hover:text-white cursor-pointer transition-colors">Careers</li>
                <li className="hover:text-white cursor-pointer transition-colors">Blog</li>
                <li className="hover:text-white cursor-pointer transition-colors">Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="hover:text-white cursor-pointer transition-colors">Documentation</li>
                <li className="hover:text-white cursor-pointer transition-colors">API Reference</li>
                <li className="hover:text-white cursor-pointer transition-colors">Help Center</li>
                <li className="hover:text-white cursor-pointer transition-colors">Community</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} TaskFlow. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}