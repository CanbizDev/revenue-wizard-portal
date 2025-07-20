import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Shield, Users, Eye, EyeOff, Building2, Brain, TrendingUp } from 'lucide-react';
import { applyClientTheme, getClientDisplayName, type ClientTheme } from '@/utils/theme';

interface ClientLoginProps {
  company: 'marketstrendai' | 'xyzseller';
  client: string;
  onBack: () => void;
  onLogin: (role: 'admin' | 'viewer') => void;
}

interface ClientConfig {
  name: string;
  icon: any;
  tagline: string;
  description: string;
  bgPattern: string;
  accentColor: string;
  isSpaceTheme?: boolean;
}

const CLIENT_CONFIG: Record<string, ClientConfig> = {
  servicon: {
    name: 'Servicon',
    icon: Building2,
    tagline: 'Critical Cleaning Services in Complex Spaces',
    description: 'Professional facility management solutions',
    bgPattern: 'bg-gradient-to-br from-primary/5 via-background to-primary/10',
    accentColor: 'from-primary to-blue-600'
  },
  marketstrendai: {
    name: 'MarketTrends AI',
    icon: TrendingUp,
    tagline: 'Your Market Intelligence Agent',
    description: 'AI-powered market insights and analytics',
    bgPattern: 'bg-gradient-to-br from-primary/5 via-background to-primary/10',
    accentColor: 'from-primary to-purple-600'
  },
  markettrends: {
    name: 'MarketTrends AI', 
    icon: TrendingUp,
    tagline: 'Your Market Intelligence Agent',
    description: 'AI-powered market insights and analytics',
    bgPattern: 'bg-gradient-to-br from-primary/5 via-background to-primary/10',
    accentColor: 'from-primary to-purple-600'
  },
  jupiterbrains: {
    name: 'Jupiter Brains',
    icon: Brain,
    tagline: 'Agentic AI. Tuned for Your Domain.',
    description: 'Enterprise-grade AI agents that grow with your business',
    bgPattern: 'bg-gradient-to-br from-background via-muted/30 to-primary/10',
    accentColor: 'from-primary to-purple-400',
    isSpaceTheme: true
  }
};

const ClientLogin: React.FC<ClientLoginProps> = ({ company, client, onBack, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState<'admin' | 'viewer'>('admin');
  
  const normalizedClient = client.toLowerCase();
  const clientConfig = CLIENT_CONFIG[normalizedClient as keyof typeof CLIENT_CONFIG] || CLIENT_CONFIG.servicon;
  const clientDisplayName = getClientDisplayName(client);
  const IconComponent = clientConfig.icon;
  
  useEffect(() => {
    applyClientTheme(client);
    
    return () => {
      // Clean up theme on unmount
      document.documentElement.classList.remove(
        'theme-servicon',
        'theme-markettrends',
        'theme-jupiterbrains'
      );
    };
  }, [client]);


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin(loginType);
    }
  };

  return (
    <div className={`min-h-screen ${clientConfig.bgPattern} ${clientConfig.isSpaceTheme ? 'relative overflow-hidden' : ''}`}>
      {/* Space theme background effect */}
      {clientConfig.isSpaceTheme && (
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            background: `
              radial-gradient(circle at 25% 25%, hsl(var(--primary) / 0.3) 1px, transparent 1px),
              radial-gradient(circle at 75% 75%, hsl(var(--primary) / 0.2) 1px, transparent 1px),
              radial-gradient(circle at 50% 10%, hsl(var(--primary) / 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px, 150px 150px, 200px 200px'
          }} />
        </div>
      )}
      
      {/* Header */}
      <header className="relative z-10 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBack}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                  <IconComponent className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">
                    {clientDisplayName}
                  </h1>
                  <p className="text-sm text-muted-foreground">{clientConfig.tagline}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1 text-xs font-medium">
                Client Portal
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 py-16 px-4 sm:px-6">
        <div className="max-w-md mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-xl">
              <IconComponent className="w-10 h-10 text-primary-foreground" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-3">
              Welcome to {clientDisplayName}
            </h2>
            <p className="text-lg text-muted-foreground mb-2">
              {clientConfig.description}
            </p>
            <p className="text-sm text-muted-foreground">
              Sign in to access your reports and dashboard
            </p>
          </div>

          {/* Login Type Selection */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <Card 
              className={`cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                loginType === 'admin' 
                  ? 'border-primary shadow-xl bg-gradient-to-br from-primary/5 to-primary/10 ring-2 ring-primary/20' 
                  : 'border-border hover:border-primary/30 bg-card/60 backdrop-blur-sm'
              }`}
              onClick={() => setLoginType('admin')}
            >
              <CardContent className="p-6 text-center">
                <Shield className={`w-8 h-8 mx-auto mb-3 ${
                  loginType === 'admin' ? 'text-primary' : 'text-muted-foreground'
                }`} />
                <h3 className={`font-semibold text-sm ${
                  loginType === 'admin' ? 'text-primary' : 'text-foreground'
                }`}>
                  Admin Login
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Full management access
                </p>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                loginType === 'viewer' 
                  ? 'border-primary shadow-xl bg-gradient-to-br from-primary/5 to-primary/10 ring-2 ring-primary/20' 
                  : 'border-border hover:border-primary/30 bg-card/60 backdrop-blur-sm'
              }`}
              onClick={() => setLoginType('viewer')}
            >
              <CardContent className="p-6 text-center">
                <Users className={`w-8 h-8 mx-auto mb-3 ${
                  loginType === 'viewer' ? 'text-primary' : 'text-muted-foreground'
                }`} />
                <h3 className={`font-semibold text-sm ${
                  loginType === 'viewer' ? 'text-primary' : 'text-foreground'
                }`}>
                  Viewer Login
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Read-only access
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Login Form */}
          <Card className="shadow-2xl bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-6">
              <CardTitle className="text-center text-xl font-bold text-foreground">
                {loginType === 'admin' ? 'Admin' : 'Viewer'} Sign In
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 bg-background/50 border-border focus:border-primary focus:ring-primary/20"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-11 bg-background/50 border-border focus:border-primary focus:ring-primary/20 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={!email || !password}
                >
                  Sign In as {loginType === 'admin' ? 'Admin' : 'Viewer'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Button variant="link" className="text-sm text-muted-foreground hover:text-primary">
                  Forgot your password?
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Demo Credentials */}
          <Card className="mt-6 bg-muted/30 border-border/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <h4 className="font-semibold text-sm text-foreground mb-2">Demo Credentials</h4>
              <div className="text-xs text-muted-foreground space-y-1">
                <p><strong className="text-foreground">Admin:</strong> admin@{client}.com / admin123</p>
                <p><strong className="text-foreground">Viewer:</strong> viewer@{client}.com / viewer123</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-card/60 backdrop-blur-sm border-t border-border py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
              <IconComponent className="w-4 h-4 text-primary-foreground" />
            </div>
            <h3 className="text-lg font-bold text-foreground">{clientDisplayName}</h3>
          </div>
          <p className="text-muted-foreground text-sm mb-2">
            {clientConfig.description}
          </p>
          <p className="text-muted-foreground text-xs">
            Secure portal access • Professional reporting platform
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ClientLogin;