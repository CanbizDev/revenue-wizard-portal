import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiService, LoginRequest } from '@/services/api';
import { Loader2 } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (userType: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [credentials, setCredentials] = useState<LoginRequest>({
    email: '',
    password: '',
    user_type: 'admin'
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiService.login(credentials.email, credentials.password, credentials.user_type);
      toast({
        title: "Login successful",
        description: `Welcome back, ${response.user.name}!`,
      });
      onLoginSuccess(response.user.role);
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = (email: string, password: string, userType: 'admin' | 'tier1_seller' | 'tier2_seller') => {
    setCredentials({ email, password, user_type: userType });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your SaaS dashboard</p>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="userType">User Type</Label>
                <Select 
                  value={credentials.user_type} 
                  onValueChange={(value: 'admin' | 'tier1_seller' | 'tier2_seller') => 
                    setCredentials({ ...credentials, user_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="tier1_seller">Tier-1 Seller</SelectItem>
                    <SelectItem value="tier2_seller">Tier-2 Seller</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-6 space-y-3">
              <div className="text-sm text-muted-foreground text-center">
                Quick Login (Demo Accounts)
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickLogin('admin@jupiterbrains.com', 'admin123', 'admin')}
                  className="text-xs"
                >
                  Admin Login
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickLogin('admin@marketstrendai.com', 'admin123', 'tier1_seller')}
                  className="text-xs"
                >
                  MarketsTrendAI Tier-1 Seller
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickLogin('admin@tier2seller.com', 'admin123', 'tier2_seller')}
                  className="text-xs"
                >
                  Tier2Seller Login
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickLogin('admin@datainsightspro.com', 'admin123', 'tier2_seller')}
                  className="text-xs"
                >
                  DataInsights Tier-2 Seller
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;