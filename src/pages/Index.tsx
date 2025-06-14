
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AdminPortal from '@/components/Portal/AdminPortal';
import SellerPortal from '@/components/Portal/SellerPortal';
import ClientPortal from '@/components/Portal/ClientPortal';
import OnboardingWizard from '@/components/Onboarding/OnboardingWizard';
import { 
  Building2, 
  Users, 
  FileText, 
  ArrowRight,
  Shield,
  Zap,
  Globe
} from 'lucide-react';

const Index = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'admin' | 'seller' | 'client' | 'onboarding'>('landing');
  const [onboardingType, setOnboardingType] = useState<'tier1_seller' | 'tier2_seller' | 'client'>('tier1_seller');

  const handlePortalAccess = (portal: 'admin' | 'seller' | 'client') => {
    setCurrentView(portal);
  };

  const handleOnboarding = (type: 'tier1_seller' | 'tier2_seller' | 'client') => {
    setOnboardingType(type);
    setCurrentView('onboarding');
  };

  if (currentView === 'admin') {
    return <AdminPortal />;
  }

  if (currentView === 'seller') {
    return <SellerPortal />;
  }

  if (currentView === 'client') {
    return <ClientPortal />;
  }

  if (currentView === 'onboarding') {
    return (
      <OnboardingWizard 
        entityType={onboardingType}
        onComplete={() => setCurrentView('landing')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">RP</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  ReportingPortal.ai
                </h1>
                <p className="text-sm text-gray-500">Simplified Multi-Tier Reporting</p>
              </div>
            </div>
            <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
              v1.2 Demo
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            One Platform,
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Three Portals</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Streamlined reporting platform with multi-step onboarding, revenue-share fee structures, 
            and dedicated portals for administrators, sellers, and clients.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Admin Control</h3>
              <p className="text-gray-600">Complete oversight of sellers, clients, and revenue flows</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Smart Onboarding</h3>
              <p className="text-gray-600">Multi-step wizards with automated fee structure setup</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Unified Experience</h3>
              <p className="text-gray-600">Consistent design across all three portal interfaces</p>
            </div>
          </div>
        </div>
      </section>

      {/* Portal Access Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Access Portal Demos</h3>
            <p className="text-gray-600">Explore each portal with sample data and workflows</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Admin Portal */}
            <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-red-50 to-red-100">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-red-700">JB Admin Portal</CardTitle>
                <p className="text-sm text-red-600">admin.reportingportal.ai</p>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="text-sm text-gray-600 mb-6 space-y-2">
                  <li>• Provision Tier-1 & Tier-2 Sellers</li>
                  <li>• Global revenue-share settings</li>
                  <li>• Override any onboarding step</li>
                  <li>• Complete ecosystem oversight</li>
                </ul>
                <Button 
                  onClick={() => handlePortalAccess('admin')}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  Access Admin Portal
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Seller Portal */}
            <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-blue-100">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-blue-700">Seller Portal</CardTitle>
                <p className="text-sm text-blue-600">seller.reportingportal.ai</p>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="text-sm text-gray-600 mb-6 space-y-2">
                  <li>• Manage multiple clients</li>
                  <li>• Set custom fee structures</li>
                  <li>• Monitor KPIs & payments</li>
                  <li>• Tier-1 & Tier-2 capabilities</li>
                </ul>
                <Button 
                  onClick={() => handlePortalAccess('seller')}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Access Seller Portal
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Client Portal */}
            <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-green-100">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-green-700">Client Portal</CardTitle>
                <p className="text-sm text-green-600">client.reportingportal.ai</p>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="text-sm text-gray-600 mb-6 space-y-2">
                  <li>• Access current reports</li>
                  <li>• Manage team members</li>
                  <li>• Control report visibility</li>
                  <li>• Update billing details</li>
                </ul>
                <Button 
                  onClick={() => handlePortalAccess('client')}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Access Client Portal
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Onboarding Demo Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Try Multi-Step Onboarding</h3>
            <p className="text-gray-600">Experience the streamlined setup process for each entity type</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Building2 className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Tier-1 Seller</CardTitle>
                <p className="text-sm text-gray-600">Primary seller onboarding</p>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 mb-4 space-y-1">
                  <li>• Company profile setup</li>
                  <li>• Fee structure definition</li>
                  <li>• Legal agreement signing</li>
                  <li>• JB approval process</li>
                </ul>
                <Button 
                  onClick={() => handleOnboarding('tier1_seller')}
                  variant="outline" 
                  className="w-full"
                >
                  Start Onboarding
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Users className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                <CardTitle>Tier-2 Seller</CardTitle>
                <p className="text-sm text-gray-600">Secondary seller setup</p>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 mb-4 space-y-1">
                  <li>• Simplified company profile</li>
                  <li>• Inherited fee structure</li>
                  <li>• Standard agreement</li>
                  <li>• Quick approval</li>
                </ul>
                <Button 
                  onClick={() => handleOnboarding('tier2_seller')}
                  variant="outline" 
                  className="w-full"
                >
                  Start Onboarding
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <FileText className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Client Setup</CardTitle>
                <p className="text-sm text-gray-600">End-client onboarding</p>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 mb-4 space-y-1">
                  <li>• Company & admin details</li>
                  <li>• Payment method setup</li>
                  <li>• Service agreement</li>
                  <li>• Account activation</li>
                </ul>
                <Button 
                  onClick={() => handleOnboarding('client')}
                  variant="outline" 
                  className="w-full"
                >
                  Start Onboarding
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">RP</span>
            </div>
            <h3 className="text-xl font-bold">ReportingPortal.ai</h3>
          </div>
          <p className="text-gray-400 mb-2">Simplified Requirements v1.2</p>
          <p className="text-sm text-gray-500">
            Built with React, TypeScript, and Tailwind CSS • Powered by JupiterBrains
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
