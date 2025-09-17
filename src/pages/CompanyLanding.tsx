import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, Building2, Users, Shield, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiService, type CompanyInfo } from '@/services/api';

interface CompanyLandingProps {
  company: 'jupiterbrains' | 'marketstrendai' | 'xyzseller';
  onNavigate: (path: string) => void;
}

const CompanyLanding: React.FC<CompanyLandingProps> = ({ company, onNavigate }) => {
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [companyData, setCompanyData] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loginCredentials, setLoginCredentials] = useState({
    email: '',
    password: ''
  });
  const [loginLoading, setLoginLoading] = useState(false);
  const [tier1LoginCredentials, setTier1LoginCredentials] = useState({
    email: '',
    password: ''
  });
  const [tier1LoginLoading, setTier1LoginLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadCompanyData = async () => {
      try {
        setLoading(true);
        const data = await apiService.getCompanyInfo(company);
        setCompanyData(data);
      } catch (err) {
        console.error('Failed to load company data, using fallback:', err);
        
        // Fallback dummy data when API fails
        const fallbackData: CompanyInfo = {
          id: company,
          name: company === 'jupiterbrains' ? 'JupiterBrains' : 
                company === 'marketstrendai' ? 'MarketsTrendAI' : 'Tier-2 Seller',
          subdomain: `${company}.webreports.app`,
          type: company === 'jupiterbrains' ? 'root_admin' : 
                company === 'marketstrendai' ? 'tier1_seller' : 'tier2_seller',
          color: company === 'jupiterbrains' ? 'red' : 
                 company === 'marketstrendai' ? 'blue' : 'green',
          description: company === 'jupiterbrains' ? 'Complete ecosystem oversight and global management' :
                       company === 'marketstrendai' ? 'Primary seller with multiple clients' :
                       'Secondary seller with clients: TCS, Infosys',
          hasAdmin: true,
          clients: company === 'jupiterbrains' ? ['MarketsTrendAI', 'Tier-2 Seller'] :
                   company === 'marketstrendai' ? ['TechCorp', 'DataFlow', 'CloudVision'] :
                   ['TCS', 'Infosys']
        };
        
        setCompanyData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    loadCompanyData();
  }, [company]);

  const getColorClasses = (color: string) => {
    const colorMap = {
      red: {
        bg: 'from-red-50 to-red-100',
        icon: 'bg-red-500',
        text: 'text-red-700',
        button: 'bg-red-600 hover:bg-red-700',
        badge: 'bg-red-100 text-red-800'
      },
      blue: {
        bg: 'from-blue-50 to-blue-100',
        icon: 'bg-blue-500',
        text: 'text-blue-700',
        button: 'bg-blue-600 hover:bg-blue-700',
        badge: 'bg-blue-100 text-blue-800'
      },
      green: {
        bg: 'from-green-50 to-green-100',
        icon: 'bg-green-500',
        text: 'text-green-700',
        button: 'bg-green-600 hover:bg-green-700',
        badge: 'bg-green-100 text-green-800'
      }
    };
    
    // Return the matched color or default to blue if no match
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const colors = companyData ? getColorClasses(companyData.color) : getColorClasses('blue');

  const handleClientAccess = () => {
    if (selectedClient) {
      onNavigate(`/${selectedClient.toLowerCase()}`);
    }
  };

  const handleAdminAccess = () => {
    if (company === 'jupiterbrains') {
      onNavigate('/admin');
    } else if (company === 'marketstrendai' || company === 'xyzseller') {
      onNavigate('/seller-admin');
    } else {
      onNavigate('/admin'); // fallback
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);

    try {
      const response = await apiService.login(loginCredentials.email, loginCredentials.password, 'admin');
      toast({
        title: "Login successful",
        description: `Welcome back, ${response.user.name}!`,
      });
      onNavigate('/admin');
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setLoginLoading(false);
    }
  };

  const handleTier1Login = async (e: React.FormEvent) => {
    e.preventDefault();
    setTier1LoginLoading(true);

    try {
      const userType = company === 'marketstrendai' ? 'tier1_seller' : 'tier2_seller';
      const response = await apiService.login(tier1LoginCredentials.email, tier1LoginCredentials.password, userType);
      toast({
        title: "Login successful",
        description: `Welcome back, ${response.user.name}!`,
      });
      onNavigate('/seller-admin');
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setTier1LoginLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading company information...</p>
        </div>
      </div>
    );
  }

  if (error || !companyData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Company not found'}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 ${colors.icon} rounded-xl flex items-center justify-center`}>
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {companyData.name}
                </h1>
                <p className="text-sm text-gray-500">{companyData.subdomain}</p>
              </div>
            </div>
            <Badge className={`${colors.badge} px-3 py-1`}>
              {companyData.type}
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to {companyData.name}
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              {companyData.description}
            </p>
          </div>

          {/* Access Options */}
          <div className="flex justify-center max-w-4xl mx-auto">
            {/* Admin Login - Centered for JupiterBrains */}
            {companyData.hasAdmin && company === 'jupiterbrains' && (
              <Card className={`hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br ${colors.bg} w-full max-w-md`}>
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 ${colors.icon} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className={`text-xl ${colors.text}`}>Admin Login</CardTitle>
                  <p className="text-sm text-gray-600">
                    Sign in to access administrative portal
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAdminLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin-email">Email</Label>
                      <Input
                        id="admin-email"
                        type="email"
                        placeholder="Enter your email"
                        value={loginCredentials.email}
                        onChange={(e) => setLoginCredentials({ ...loginCredentials, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="admin-password">Password</Label>
                      <Input
                        id="admin-password"
                        type="password"
                        placeholder="Enter your password"
                        value={loginCredentials.password}
                        onChange={(e) => setLoginCredentials({ ...loginCredentials, password: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="user-type">User Type</Label>
                      <Input
                        id="user-type"
                        value="admin"
                        disabled
                        className="bg-gray-50"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className={`w-full ${colors.button}`}
                      disabled={loginLoading}
                    >
                      {loginLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        <>
                          Access Admin Portal
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Seller Login - Centered for non-JupiterBrains */}
            {company !== 'jupiterbrains' && (
              <Card className={`hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br ${colors.bg} w-full max-w-md`}>
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 ${colors.icon} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className={`text-xl ${colors.text}`}>
                    {company === 'marketstrendai' ? 'Tier-1 Seller Login' : 'Tier-2 Seller Login'}
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Sign in to access your seller portal
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleTier1Login} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="tier1-email">Email</Label>
                      <Input
                        id="tier1-email"
                        type="email"
                        placeholder="Enter your email"
                        value={tier1LoginCredentials.email}
                        onChange={(e) => setTier1LoginCredentials({ ...tier1LoginCredentials, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tier1-password">Password</Label>
                      <Input
                        id="tier1-password"
                        type="password"
                        placeholder="Enter your password"
                        value={tier1LoginCredentials.password}
                        onChange={(e) => setTier1LoginCredentials({ ...tier1LoginCredentials, password: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tier1-user-type">User Type</Label>
                      <Input
                        id="tier1-user-type"
                        value={company === 'marketstrendai' ? 'tier1_seller' : 'tier2_seller'}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className={`w-full ${colors.button}`}
                      disabled={tier1LoginLoading}
                    >
                      {tier1LoginLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        <>
                          Access Seller Portal
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>

          {/* No Clients Message */}
          {companyData.clients.length === 0 && !companyData.hasAdmin && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Access Available</h3>
              <p className="text-gray-600">
                This company doesn't have any accessible portals configured yet.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">WR</span>
            </div>
            <h3 className="text-xl font-bold">WebReports.app</h3>
          </div>
          <p className="text-gray-400 mb-2 text-sm">Powered by {companyData.name}</p>
          <p className="text-sm text-gray-500">
            Multi-tier reporting platform • Built with React & TypeScript
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CompanyLanding;