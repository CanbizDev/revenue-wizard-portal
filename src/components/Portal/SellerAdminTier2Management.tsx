import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import SellerAdminAddTier2SellerForm from '@/components/Forms/SellerAdminAddTier2SellerForm';
import { EditSellerForm } from '@/components/Forms/EditSellerForm';
import { 
  UserPlus,
  Edit,
  Trash2,
  Search
} from 'lucide-react';

interface SellerAdminTier2ManagementProps {
  currentTier1SellerId?: string;
  currentTier1SellerName?: string;
}

const SellerAdminTier2Management: React.FC<SellerAdminTier2ManagementProps> = ({ 
  currentTier1SellerId,
  currentTier1SellerName 
}) => {
  const [tier2Sellers, setTier2Sellers] = useState<any[]>([]);
  const [filteredSellers, setFilteredSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddTier2SellerOpen, setIsAddTier2SellerOpen] = useState(false);
  const [isEditSellerOpen, setIsEditSellerOpen] = useState(false);
  const [editingSeller, setEditingSeller] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const loadTier2Sellers = async () => {
    try {
      setLoading(true);
      const tier2Data = await apiService.getAllTier2Sellers();
      setTier2Sellers(tier2Data);
      setFilteredSellers(tier2Data);
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

  useEffect(() => {
    const filtered = tier2Sellers.filter(seller =>
      seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.admin_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.subdomain?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredSellers(filtered);
  }, [searchQuery, tier2Sellers]);

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
          <h2 className="text-xl sm:text-2xl font-bold">Tier-2 Seller Management</h2>
          <p className="text-muted-foreground">Manage your subsidiary seller accounts</p>
        </div>
        <Button 
          className="flex items-center space-x-2 w-full sm:w-auto" 
          onClick={() => setIsAddTier2SellerOpen(true)}
        >
          <UserPlus className="h-4 w-4" />
          <span>Add Tier-2 Seller</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle>Tier-2 Sellers</CardTitle>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search sellers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredSellers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                {searchQuery ? 'No sellers found matching your search.' : 'No Tier-2 sellers found. Add your first Tier-2 seller to get started.'}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Seller Details</TableHead>
                    <TableHead>Subdomain</TableHead>
                    
                    <TableHead>Projects</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSellers.map((seller) => (
                    <TableRow key={seller.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            {seller.logo_url ? (
                              <img 
                                src={seller.logo_url} 
                                alt={seller.name} 
                                className="w-8 h-8 rounded-full object-cover" 
                              />
                            ) : (
                              <span className="text-primary font-semibold text-sm">
                                {seller.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{seller.name}</div>
                            <div className="text-sm text-muted-foreground">{seller.admin_email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-mono text-sm">
                          {seller.subdomain}.reportingportal.ai
                        </div>
                      </TableCell>
                      {/* <TableCell>
                        <div className="font-medium">
                          {seller.commission_type === 'percentage' 
                            ? `${seller.commission_value || 0}%` 
                            : `₹${seller.commission_value || 0}`}
                        </div>
                      </TableCell> */}
                      <TableCell>
                        <div className="font-medium">{seller.project_count || 0}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">₹{seller.revenue || 0}</div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={seller.status === 'active' ? 'default' : 'secondary'}
                          className={
                            seller.status === 'active' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }
                        >
                          {seller.status || 'active'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingSeller(seller);
                              setIsEditSellerOpen(true);
                            }}
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <SellerAdminAddTier2SellerForm
        isOpen={isAddTier2SellerOpen}
        onClose={() => setIsAddTier2SellerOpen(false)}
        onSuccess={loadTier2Sellers}
        currentTier1SellerId={currentTier1SellerId}
        currentTier1SellerName={currentTier1SellerName}
      />

      <EditSellerForm
        isOpen={isEditSellerOpen}
        onClose={() => {
          setIsEditSellerOpen(false);
          setEditingSeller(null);
        }}
        seller={editingSeller}
        sellerType="tier2"
        onSuccess={() => {
          setIsEditSellerOpen(false);
          setEditingSeller(null);
          loadTier2Sellers();
        }}
      />
    </div>
  );
};

export default SellerAdminTier2Management;