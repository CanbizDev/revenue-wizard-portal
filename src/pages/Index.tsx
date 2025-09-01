
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Users, 
  FileText, 
  ArrowRight,
  Globe,
  Building
} from 'lucide-react';

interface IndexProps {
  onCompanySelect: (company: string) => void;
}

const COMPANIES = [
  {
    id: 'jupiterbrains',
    name: 'JupiterBrains',
    type: 'Root Admin',
    subdomain: 'jupiterbrains.webreports.app',
    color: 'red',
    description: 'Complete ecosystem oversight and global management'
  },
  {
    id: 'marketstrendai',
    name: 'Tier-1 Seller',
    type: 'Tier-1 Seller',
    subdomain: 'marketstrendai.webreports.app',
    color: 'blue',
    description: 'Primary seller with multiple clients'
  },
  {
    id: 'xyzseller',
    name: 'XYZSeller',
    type: 'Tier-2 Seller',
    subdomain: 'xyzseller.webreports.app',
    color: 'green',
    description: 'Secondary seller with clients: TCS, Infosys'
  }
];

const Index: React.FC<IndexProps> = ({ onCompanySelect }) => {
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
    return colorMap[color as keyof typeof colorMap];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm sm:text-lg">RP</span>
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  WebReports.app
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Multi-Company Reporting Platform</p>
              </div>
            </div>
            <Badge className="bg-blue-100 text-blue-800 px-2 py-1 text-xs sm:px-3 sm:text-sm">
              Company Selector
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Select Your
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block sm:inline"> Company Portal</span>
          </h2>
          <p className="text-base sm:text-xl text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
            Choose your company to access dedicated subdomains with client management, 
            admin controls, and tailored reporting experiences.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Building className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-2">Root Admin</h3>
              <p className="text-sm sm:text-base text-gray-600">JupiterBrains - Complete ecosystem management</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-2">Tier-1 Seller</h3>
              <p className="text-sm sm:text-base text-gray-600">MarketsTrendAI - Primary client management</p>
            </div>
            <div className="text-center sm:col-span-2 md:col-span-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-2">Tier-2 Seller</h3>
              <p className="text-sm sm:text-base text-gray-600">XYZSeller - Secondary client operations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Selection Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Choose Your Company</h3>
            <p className="text-sm sm:text-base text-gray-600">Select a company to access its dedicated subdomain and portal</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {COMPANIES.map((company) => {
              const colors = getColorClasses(company.color);
              return (
                <Card key={company.id} className={`hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br ${colors.bg} h-full`}>
                  <CardHeader className="text-center pb-4">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 ${colors.icon} rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4`}>
                      <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <CardTitle className={`text-lg sm:text-xl ${colors.text}`}>{company.name}</CardTitle>
                    <p className="text-xs sm:text-sm text-gray-600">{company.subdomain}</p>
                  </CardHeader>
                  <CardContent className="text-center flex flex-col h-full">
                    <Badge className={`${colors.badge} mb-4 self-center`}>
                      {company.type}
                    </Badge>
                    <p className="text-xs sm:text-sm text-gray-600 mb-6 flex-grow">
                      {company.description}
                    </p>
                    <Button 
                      onClick={() => onCompanySelect(company.id)}
                      className={`w-full ${colors.button} text-sm mt-auto`}
                      size="sm"
                    >
                      {company.id === 'marketstrendai' ? 'Enter Tier-1 Seller' : `Enter ${company.name}`}
                      <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Platform Features</h3>
            <p className="text-sm sm:text-base text-gray-600">Comprehensive reporting platform with multi-tier architecture</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Globe className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 mx-auto mb-3 sm:mb-4" />
                <CardTitle className="text-base sm:text-lg">Subdomain Architecture</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                  <li>• Company-specific subdomains</li>
                  <li>• Client-specific login paths</li>
                  <li>• Role-based access control</li>
                  <li>• Seamless navigation flow</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Users className="w-10 h-10 sm:w-12 sm:h-12 text-green-600 mx-auto mb-3 sm:mb-4" />
                <CardTitle className="text-base sm:text-lg">Multi-Tier Management</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                  <li>• Tier-1 & Tier-2 sellers</li>
                  <li>• Client relationship mapping</li>
                  <li>• Revenue share tracking</li>
                  <li>• Hierarchical permissions</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
              <CardHeader className="text-center">
                <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600 mx-auto mb-3 sm:mb-4" />
                <CardTitle className="text-base sm:text-lg">Smart Reporting</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                  <li>• Real-time data access</li>
                  <li>• Customizable dashboards</li>
                  <li>• Export capabilities</li>
                  <li>• Historical reporting</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs sm:text-sm">RP</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold">WebReports.app</h3>
          </div>
          <p className="text-gray-400 mb-1 sm:mb-2 text-sm">Multi-Company Portal Selector</p>
          <p className="text-xs sm:text-sm text-gray-500">
            Built with React, TypeScript, and Tailwind CSS • Powered by JupiterBrains
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
