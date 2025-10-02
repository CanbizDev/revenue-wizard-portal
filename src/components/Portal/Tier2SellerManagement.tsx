import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import AddTier2SellerForm from '@/components/Forms/AddTier2SellerForm';
import { 
  Building2, 
  UserPlus,
  Edit,
  Trash2
} from 'lucide-react';

const Tier2SellerManagement: React.FC = () => {
  const [tier2Sellers, setTier2Sellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddTier2SellerOpen, setIsAddTier2SellerOpen] = useState(false);
  const { toast } = useToast();

  const loadTier2Sellers = async () => {
    try {
      setLoading(true);
      const tier2Data = await apiService.getAllTier2Sellers();
      setTier2Sellers(tier2Data);
    } catch (error: any) {
      console.error('Error loading tier2 sellers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load Tier-2 sellers',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTier2Seller = async (sellerId: string) => {
    try {
      await apiService.deleteTier2Seller(sellerId);
      toast({
        title: 'Success',
        description: 'Tier-2 seller deleted successfully'
      });
      loadTier2Sellers();
    } catch (error: any) {
      console.error('Error deleting tier2 seller:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete tier2 seller',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    loadTier2Sellers();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Tier-2 Seller Management</h2>
          <p className="text-gray-600">Manage your subsidiary seller accounts</p>
        </div>
        <Button className="flex items-center space-x-2 w-full sm:w-auto" onClick={() => setIsAddTier2SellerOpen(true)}>
          <UserPlus className="h-4 w-4" />
          <span>Add Tier-2 Seller</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Tier-2 Sellers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tier2Sellers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No Tier-2 sellers found. Add your first Tier-2 seller to get started.
              </div>
            ) : (
              tier2Sellers.map((seller) => (
                <div key={seller.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-lg space-y-3 sm:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        {seller.logo_url ? (
                          <img src={seller.logo_url} alt={seller.name} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <Building2 className="h-5 w-5 text-purple-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{seller.name}</h3>
                        <p className="text-sm text-gray-500">{seller.admin_email}</p>
                        <p className="text-xs text-gray-400">{seller.subdomain}.reportingportal.ai</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 text-sm text-gray-600 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-center">
                      <p className="font-medium">{seller.clientß_count || 0}</p>
                      <p className="text-xs">Clients</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">₹{seller.revenue || 0}</p>
                      <p className="text-xs">Revenue</p>
                    </div>
                    <Badge 
                      variant={seller.status === 'active' ? 'default' : 'secondary'}
                      className={seller.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                    >
                      {seller.status || 'active'}
                    </Badge>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => console.log('Edit tier2 seller:', seller.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteTier2Seller(seller.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <AddTier2SellerForm
        isOpen={isAddTier2SellerOpen}
        onClose={() => setIsAddTier2SellerOpen(false)}
        onSuccess={loadTier2Sellers}
      />
    </div>
  );
};

export default Tier2SellerManagement;