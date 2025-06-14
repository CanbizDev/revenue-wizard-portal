
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, ArrowLeft, ArrowRight } from 'lucide-react';
import type { OnboardingStep } from '@/types';

interface OnboardingWizardProps {
  entityType: 'tier1_seller' | 'tier2_seller' | 'client';
  inviteToken?: string;
  onComplete: () => void;
}

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ 
  entityType, 
  inviteToken,
  onComplete 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    companyProfile: {},
    paymentMethod: {},
    feeStructure: {},
    legalAcceptance: false,
  });

  const getSteps = (): OnboardingStep[] => {
    const baseSteps = [
      { id: 1, title: 'Start', description: 'Welcome & overview', completed: false, current: false },
      { id: 2, title: 'Company Profile', description: 'Company details & admin info', completed: false, current: false },
    ];

    if (entityType === 'client') {
      baseSteps.push({ id: 3, title: 'Payment Method', description: 'Credit card setup', completed: false, current: false });
    }

    baseSteps.push(
      { id: baseSteps.length + 1, title: 'Fee Structure', description: 'Setup & recurring fees', completed: false, current: false },
      { id: baseSteps.length + 2, title: 'Legal Agreement', description: 'Terms & conditions', completed: false, current: false },
      { id: baseSteps.length + 3, title: 'Approval', description: 'Awaiting JB approval', completed: false, current: false }
    );

    return baseSteps.map(step => ({
      ...step,
      completed: step.id < currentStep,
      current: step.id === currentStep
    }));
  };

  const steps = getSteps();
  const progressPercentage = ((currentStep - 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Welcome to ReportingPortal.ai</h3>
            <p className="text-gray-600 mb-6">
              Let's get your {entityType.replace('_', '-')} account set up in just a few steps.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                This wizard will take approximately 5 minutes to complete.
                Your progress is automatically saved.
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Company Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Industry
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Select industry</option>
                    <option>Technology</option>
                    <option>Finance</option>
                    <option>Healthcare</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Admin Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Admin Email *
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="admin@company.com"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        if (entityType === 'client') {
          return (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-gray-600">
                    Secure payment processing powered by Stripe. Your card details are encrypted and secure.
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Holder Name *
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number *
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVV *
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }
        // Fall through to fee structure for non-client entities
        
      default:
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Setup Complete!</h3>
            <p className="text-gray-600">
              Your account is now being reviewed by our team.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Account Setup</h1>
              <p className="text-gray-600">
                {entityType.replace('_', '-').toUpperCase()} Onboarding
              </p>
            </div>
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              Step {currentStep} of {steps.length}
            </Badge>
          </div>
          
          <Progress value={progressPercentage} className="mb-4" />
          
          <div className="flex items-center space-x-4 overflow-x-auto pb-2">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center space-x-2 min-w-0">
                <div className="flex items-center space-x-2">
                  {step.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : step.current ? (
                    <Circle className="w-5 h-5 text-blue-600 fill-current" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400" />
                  )}
                  <div className="min-w-0">
                    <p className={`text-sm font-medium truncate ${
                      step.current ? 'text-blue-600' : 
                      step.completed ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {step.description}
                    </p>
                  </div>
                </div>
                {step.id < steps.length && (
                  <div className="w-8 h-px bg-gray-300 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            {renderStepContent()}
          </CardContent>
        </Card>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>
          
          <Button
            onClick={handleNext}
            className="flex items-center space-x-2"
          >
            <span>{currentStep === steps.length ? 'Complete' : 'Next'}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
