import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';

interface ClientIntakeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (intakeData: any) => void;
  clientId?: string;
  existingData?: any;
}

interface IntakeFormData {
  // Economic Indicators
  economicIndicators: {
    fredSeries: string[];
    customIndicators: string[];
  };
  
  // Raw Materials
  rawMaterials: {
    material: string;
    significance: string;
    costImpact: string;
  }[];
  
  // Labor Information
  laborInfo: {
    productionRoles: {
      title: string;
      description: string;
      hiringSeason: string;
    }[];
    geographies: string[];
  };
  
  // Trade Publications
  tradePublications: {
    magazines: string[];
    associations: string[];
    techJournals: string[];
    localNews: string[];
  };
  
  // Competitors
  competitors: {
    name: string;
    linkedinUrl: string;
    notes: string;
  }[];
  
  // Public Companies
  publicCompanies: {
    name: string;
    ticker: string;
    relevance: string;
  }[];
  
  // Custom Data Sources
  customDataSources: {
    source: string;
    apiUrl: string;
    description: string;
  }[];
  
  // Company Overview
  companyOverview: {
    primaryMarkets: string[];
    revenueRange: string;
    customerProfile: string;
    businessModel: string;
  };
}

const defaultFormData: IntakeFormData = {
  economicIndicators: {
    fredSeries: [],
    customIndicators: []
  },
  rawMaterials: [],
  laborInfo: {
    productionRoles: [],
    geographies: []
  },
  tradePublications: {
    magazines: [],
    associations: [],
    techJournals: [],
    localNews: []
  },
  competitors: [],
  publicCompanies: [],
  customDataSources: [],
  companyOverview: {
    primaryMarkets: [],
    revenueRange: '',
    customerProfile: '',
    businessModel: ''
  }
};

// Predefined options based on the document
const predefinedFredSeries = [
  'PCU327310327310 - Cement Manufacturing',
  'PCU32733273 - Cement & Concrete Products Manufacturing',
  'IPG3273SQ - Industrial Production NAICS 3273',
  'U33CNO - Construction Machinery New Orders',
  'WPU112 - Construction Machinery & Equipment PPI',
  'SOFR30DAYAVG - SOFR 30-Day Average',
  'HOUSTS - Housing Starts South',
  'HOUSTMW - Housing Starts Midwest',
  'HOUSTNE - Housing Starts Northeast',
  'HOUSTW - Housing Starts West',
  'TLHWYCONS - Public Construction: Highways and Streets'
];

const predefinedTradeAssociations = [
  'Portland Cement Association (PCA)',
  'National Ready Mixed Concrete Association (NRMCA)',
  'NSSGA',
  'American Concrete Institute (ACI)',
  'American Public Works Association',
  'American Shotcrete Association'
];

const predefinedTradeMagazines = [
  'Concrete Construction',
  'Concrete Producer',
  'Concrete International (ACI)',
  'Precast Inc.',
  'Modern Contractor Solutions',
  'Equipment Today',
  'World Cement',
  'Concrete News'
];

export const ClientIntakeForm: React.FC<ClientIntakeFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  existingData
}) => {
  const [formData, setFormData] = useState<IntakeFormData>(
    existingData || defaultFormData
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const addArrayItem = (section: string, subsection?: string) => {
    setFormData(prev => {
      const newData = { ...prev };
      if (subsection) {
        (newData as any)[section][subsection].push('');
      } else {
        (newData as any)[section].push({});
      }
      return newData;
    });
  };

  const removeArrayItem = (section: string, index: number, subsection?: string) => {
    setFormData(prev => {
      const newData = { ...prev };
      if (subsection) {
        (newData as any)[section][subsection].splice(index, 1);
      } else {
        (newData as any)[section].splice(index, 1);
      }
      return newData;
    });
  };

  const updateArrayItem = (section: string, index: number, value: any, subsection?: string, field?: string) => {
    setFormData(prev => {
      const newData = { ...prev };
      if (subsection && field) {
        (newData as any)[section][subsection][index][field] = value;
      } else if (subsection) {
        (newData as any)[section][subsection][index] = value;
      } else if (field) {
        (newData as any)[section][index][field] = value;
      } else {
        (newData as any)[section][index] = value;
      }
      return newData;
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Client Intake Form</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-6 w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="economic">Economic</TabsTrigger>
              <TabsTrigger value="materials">Materials</TabsTrigger>
              <TabsTrigger value="labor">Labor</TabsTrigger>
              <TabsTrigger value="publications">Publications</TabsTrigger>
              <TabsTrigger value="competition">Competition</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Company Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="revenueRange">Revenue Range</Label>
                    <Input
                      id="revenueRange"
                      value={formData.companyOverview.revenueRange}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        companyOverview: { ...prev.companyOverview, revenueRange: e.target.value }
                      }))}
                      placeholder="e.g., $10M - $50M"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerProfile">Customer Profile</Label>
                    <Textarea
                      id="customerProfile"
                      value={formData.companyOverview.customerProfile}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        companyOverview: { ...prev.companyOverview, customerProfile: e.target.value }
                      }))}
                      placeholder="Describe typical customers and their characteristics"
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessModel">Business Model</Label>
                    <Textarea
                      id="businessModel"
                      value={formData.companyOverview.businessModel}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        companyOverview: { ...prev.companyOverview, businessModel: e.target.value }
                      }))}
                      placeholder="Describe primary business model and revenue streams"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="economic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Economic Indicators</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>FRED Economic Series</Label>
                    <div className="space-y-2 mt-2">
                      {predefinedFredSeries.map((series, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.economicIndicators.fredSeries.includes(series)}
                            onChange={(e) => {
                              const newSeries = e.target.checked
                                ? [...formData.economicIndicators.fredSeries, series]
                                : formData.economicIndicators.fredSeries.filter(s => s !== series);
                              setFormData(prev => ({
                                ...prev,
                                economicIndicators: { ...prev.economicIndicators, fredSeries: newSeries }
                              }));
                            }}
                          />
                          <span className="text-sm">{series}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label>Custom Economic Indicators</Label>
                    {formData.economicIndicators.customIndicators.map((indicator, index) => (
                      <div key={index} className="flex items-center space-x-2 mt-2">
                        <Input
                          value={indicator}
                          onChange={(e) => updateArrayItem('economicIndicators', index, e.target.value, 'customIndicators')}
                          placeholder="Enter custom economic indicator"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeArrayItem('economicIndicators', index, 'customIndicators')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addArrayItem('economicIndicators', 'customIndicators')}
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Custom Indicator
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="materials" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Raw Materials Impact on Margin</CardTitle>
                </CardHeader>
                <CardContent>
                  {formData.rawMaterials.map((material, index) => (
                    <div key={index} className="space-y-3 p-4 border rounded-lg mb-4">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">Material {index + 1}</h4>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeArrayItem('rawMaterials', index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <Label>Material Name</Label>
                          <Input
                            value={material.material}
                            onChange={(e) => updateArrayItem('rawMaterials', index, e.target.value, undefined, 'material')}
                            placeholder="e.g., Limestone (CaCO₃)"
                          />
                        </div>
                        <div>
                          <Label>Significance Level</Label>
                          <Input
                            value={material.significance}
                            onChange={(e) => updateArrayItem('rawMaterials', index, e.target.value, undefined, 'significance')}
                            placeholder="High/Medium/Low"
                          />
                        </div>
                        <div>
                          <Label>Cost Impact</Label>
                          <Input
                            value={material.costImpact}
                            onChange={(e) => updateArrayItem('rawMaterials', index, e.target.value, undefined, 'costImpact')}
                            placeholder="% of total costs"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addArrayItem('rawMaterials')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Raw Material
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="labor" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Labor Cost Index</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Production Roles</Label>
                    {formData.laborInfo.productionRoles.map((role, index) => (
                      <div key={index} className="space-y-3 p-4 border rounded-lg mb-4">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">Role {index + 1}</h4>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeArrayItem('laborInfo', index, 'productionRoles')}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <Label>Job Title</Label>
                            <Input
                              value={role.title}
                              onChange={(e) => updateArrayItem('laborInfo', index, e.target.value, 'productionRoles', 'title')}
                              placeholder="e.g., Process Engineer"
                            />
                          </div>
                          <div>
                            <Label>Description</Label>
                            <Input
                              value={role.description}
                              onChange={(e) => updateArrayItem('laborInfo', index, e.target.value, 'productionRoles', 'description')}
                              placeholder="Role responsibilities"
                            />
                          </div>
                          <div>
                            <Label>Hiring Season</Label>
                            <Input
                              value={role.hiringSeason}
                              onChange={(e) => updateArrayItem('laborInfo', index, e.target.value, 'productionRoles', 'hiringSeason')}
                              placeholder="e.g., Spring, Year-round"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addArrayItem('laborInfo', 'productionRoles')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Production Role
                    </Button>
                  </div>

                  <div>
                    <Label>Key Geographies for Hiring</Label>
                    {formData.laborInfo.geographies.map((geo, index) => (
                      <div key={index} className="flex items-center space-x-2 mt-2">
                        <Input
                          value={geo}
                          onChange={(e) => updateArrayItem('laborInfo', index, e.target.value, 'geographies')}
                          placeholder="e.g., Des Moines, IA"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeArrayItem('laborInfo', index, 'geographies')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addArrayItem('laborInfo', 'geographies')}
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Geography
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="publications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Trade Publications & News Sources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Trade Associations</Label>
                    <div className="space-y-2 mt-2">
                      {predefinedTradeAssociations.map((association, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.tradePublications.associations.includes(association)}
                            onChange={(e) => {
                              const newAssociations = e.target.checked
                                ? [...formData.tradePublications.associations, association]
                                : formData.tradePublications.associations.filter(a => a !== association);
                              setFormData(prev => ({
                                ...prev,
                                tradePublications: { ...prev.tradePublications, associations: newAssociations }
                              }));
                            }}
                          />
                          <span className="text-sm">{association}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Trade Magazines</Label>
                    <div className="space-y-2 mt-2">
                      {predefinedTradeMagazines.map((magazine, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.tradePublications.magazines.includes(magazine)}
                            onChange={(e) => {
                              const newMagazines = e.target.checked
                                ? [...formData.tradePublications.magazines, magazine]
                                : formData.tradePublications.magazines.filter(m => m !== magazine);
                              setFormData(prev => ({
                                ...prev,
                                tradePublications: { ...prev.tradePublications, magazines: newMagazines }
                              }));
                            }}
                          />
                          <span className="text-sm">{magazine}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Local News Sources</Label>
                    {formData.tradePublications.localNews.map((news, index) => (
                      <div key={index} className="flex items-center space-x-2 mt-2">
                        <Input
                          value={news}
                          onChange={(e) => updateArrayItem('tradePublications', index, e.target.value, 'localNews')}
                          placeholder="e.g., Des Moines Register"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeArrayItem('tradePublications', index, 'localNews')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addArrayItem('tradePublications', 'localNews')}
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Local News Source
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="competition" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Competitive Intelligence</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Key Competitors</Label>
                    {formData.competitors.map((competitor, index) => (
                      <div key={index} className="space-y-3 p-4 border rounded-lg mb-4">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">Competitor {index + 1}</h4>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeArrayItem('competitors', index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <Label>Company Name</Label>
                            <Input
                              value={competitor.name}
                              onChange={(e) => updateArrayItem('competitors', index, e.target.value, undefined, 'name')}
                              placeholder="e.g., ProAll"
                            />
                          </div>
                          <div>
                            <Label>LinkedIn URL</Label>
                            <Input
                              value={competitor.linkedinUrl}
                              onChange={(e) => updateArrayItem('competitors', index, e.target.value, undefined, 'linkedinUrl')}
                              placeholder="LinkedIn corporate page URL"
                            />
                          </div>
                          <div>
                            <Label>Notes</Label>
                            <Input
                              value={competitor.notes}
                              onChange={(e) => updateArrayItem('competitors', index, e.target.value, undefined, 'notes')}
                              placeholder="Key differentiators, market position"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addArrayItem('competitors')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Competitor
                    </Button>
                  </div>

                  <div>
                    <Label>Public Companies to Track</Label>
                    {formData.publicCompanies.map((company, index) => (
                      <div key={index} className="space-y-3 p-4 border rounded-lg mb-4">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">Public Company {index + 1}</h4>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeArrayItem('publicCompanies', index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <Label>Company Name</Label>
                            <Input
                              value={company.name}
                              onChange={(e) => updateArrayItem('publicCompanies', index, e.target.value, undefined, 'name')}
                              placeholder="e.g., Caterpillar"
                            />
                          </div>
                          <div>
                            <Label>Stock Ticker</Label>
                            <Input
                              value={company.ticker}
                              onChange={(e) => updateArrayItem('publicCompanies', index, e.target.value, undefined, 'ticker')}
                              placeholder="e.g., CAT"
                            />
                          </div>
                          <div>
                            <Label>Relevance</Label>
                            <Input
                              value={company.relevance}
                              onChange={(e) => updateArrayItem('publicCompanies', index, e.target.value, undefined, 'relevance')}
                              placeholder="Why this company is relevant to track"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addArrayItem('publicCompanies')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Public Company
                    </Button>
                  </div>

                  <div>
                    <Label>Custom Data Sources</Label>
                    {formData.customDataSources.map((source, index) => (
                      <div key={index} className="space-y-3 p-4 border rounded-lg mb-4">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">Data Source {index + 1}</h4>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeArrayItem('customDataSources', index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <Label>Source Name</Label>
                            <Input
                              value={source.source}
                              onChange={(e) => updateArrayItem('customDataSources', index, e.target.value, undefined, 'source')}
                              placeholder="e.g., NRMCA API"
                            />
                          </div>
                          <div>
                            <Label>API URL</Label>
                            <Input
                              value={source.apiUrl}
                              onChange={(e) => updateArrayItem('customDataSources', index, e.target.value, undefined, 'apiUrl')}
                              placeholder="API endpoint or data source URL"
                            />
                          </div>
                          <div>
                            <Label>Description</Label>
                            <Input
                              value={source.description}
                              onChange={(e) => updateArrayItem('customDataSources', index, e.target.value, undefined, 'description')}
                              placeholder="What data this source provides"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addArrayItem('customDataSources')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Data Source
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Save Intake Form
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};