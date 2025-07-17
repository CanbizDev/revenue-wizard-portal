import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Shield, Users, Eye, EyeOff } from 'lucide-react';

interface ClientLoginProps {
  company: 'marketstrendai' | 'xyzseller';
  client: string;
  onBack: () => void;
  onLogin: (role: 'admin' | 'viewer') => void;
}

const COMPANY_DATA = {
  marketstrendai: {
    name: 'MarketsTrendAI',
    subdomain: 'marketstrendai.webreports.app',
    color: 'blue'
  },
  xyzseller: {
    name: 'XYZSeller',
    subdomain: 'xyzseller.webreports.app',
    color: 'green'
  }
};

const ClientLogin: React.FC<ClientLoginProps> = ({ company, client, onBack, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState<'admin' | 'viewer'>('admin');
  
  const companyData = COMPANY_DATA[company];
  const clientName = client.charAt(0).toUpperCase() + client.slice(1);

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: {
        bg: 'from-blue-50 to-blue-100',
        icon: 'bg-blue-500',
        text: 'text-blue-700',
        button: 'bg-blue-600 hover:bg-blue-700',
        badge: 'bg-blue-100 text-blue-800',
        border: 'border-blue-200'
      },
      green: {
        bg: 'from-green-50 to-green-100',
        icon: 'bg-green-500',
        text: 'text-green-700',
        button: 'bg-green-600 hover:bg-green-700',
        badge: 'bg-green-100 text-green-800',
        border: 'border-green-200'
      }
    };
    return colorMap[color as keyof typeof colorMap];
  };

  const colors = getColorClasses(companyData.color);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin(loginType);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBack}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 ${colors.icon} rounded-lg flex items-center justify-center`}>
                  <span className="text-white font-bold text-sm">{clientName.charAt(0)}</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {clientName}
                  </h1>
                  <p className="text-sm text-gray-500">via {companyData.name}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">{companyData.subdomain}/{client}</p>
              <Badge className={`${colors.badge} px-2 py-1 text-xs`}>
                Client Portal
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-16 px-4 sm:px-6">
        <div className="max-w-md mx-auto">
          {/* Welcome */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to {clientName}
            </h2>
            <p className="text-gray-600">
              Sign in to access your reports and dashboard
            </p>
          </div>

          {/* Login Type Selection */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <Card 
              className={`cursor-pointer transition-all duration-200 ${
                loginType === 'admin' 
                  ? `${colors.border} shadow-lg bg-gradient-to-br ${colors.bg}` 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setLoginType('admin')}
            >
              <CardContent className="p-4 text-center">
                <Shield className={`w-8 h-8 mx-auto mb-2 ${
                  loginType === 'admin' ? colors.text : 'text-gray-400'
                }`} />
                <h3 className={`font-semibold ${
                  loginType === 'admin' ? colors.text : 'text-gray-600'
                }`}>
                  Admin Login
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Full management access
                </p>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer transition-all duration-200 ${
                loginType === 'viewer' 
                  ? `${colors.border} shadow-lg bg-gradient-to-br ${colors.bg}` 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setLoginType('viewer')}
            >
              <CardContent className="p-4 text-center">
                <Users className={`w-8 h-8 mx-auto mb-2 ${
                  loginType === 'viewer' ? colors.text : 'text-gray-400'
                }`} />
                <h3 className={`font-semibold ${
                  loginType === 'viewer' ? colors.text : 'text-gray-600'
                }`}>
                  Viewer Login
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Read-only access
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Login Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-center">
                {loginType === 'admin' ? 'Admin' : 'Viewer'} Sign In
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className={`w-full ${colors.button}`}
                  disabled={!email || !password}
                >
                  Sign In as {loginType === 'admin' ? 'Admin' : 'Viewer'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Button variant="link" className="text-sm text-gray-500">
                  Forgot your password?
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Demo Credentials */}
          <Card className="mt-6 bg-gray-50 border-gray-200">
            <CardContent className="p-4">
              <h4 className="font-semibold text-sm text-gray-700 mb-2">Demo Credentials</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <p><strong>Admin:</strong> admin@{client}.com / admin123</p>
                <p><strong>Viewer:</strong> viewer@{client}.com / viewer123</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">WR</span>
            </div>
            <h3 className="text-lg font-bold">WebReports.app</h3>
          </div>
          <p className="text-gray-400 text-sm">
            Secure login powered by {companyData.name}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ClientLogin;