
import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { formatCurrency, calculateProgress } from '@/lib/mockData';
import { Search, Plus } from 'lucide-react';

const Wishlist: React.FC = () => {
  const { products, savingsPlans } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getProductProgress = (productId: string): number => {
    return calculateProgress(productId);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold">Your Wishlist</h1>
        <Button asChild>
          <Link to="/wishlist/add">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>
      
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => {
            const progress = getProductProgress(product.id);
            const savingsPlan = savingsPlans.find(plan => plan.productId === product.id);
            
            return (
              <Card key={product.id} className="flex flex-col h-full">
                <CardHeader className="pb-4">
                  <div className="aspect-video relative overflow-hidden rounded-md bg-gray-100 mb-2">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-secondary">
                        <span className="text-muted-foreground text-sm">No image</span>
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription className="flex justify-between">
                    <span>{formatCurrency(product.price)}</span>
                    <span>Added {new Date(product.dateAdded).toLocaleDateString()}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Savings Progress</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  
                  {savingsPlan && (
                    <div className="text-sm text-muted-foreground">
                      <p>Saving {formatCurrency(savingsPlan.contributionAmount)} per {savingsPlan.frequency}</p>
                      <p>Allocated: {formatCurrency(savingsPlan.allocated)} of {formatCurrency(product.price)}</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-2">
                  <Button asChild variant="outline" className="w-full">
                    <Link to={`/wishlist/${product.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <h3 className="text-lg font-medium mb-2">No products found</h3>
            {searchTerm ? (
              <p className="text-muted-foreground text-center mb-4">
                No products matched your search. Try a different term or clear the search.
              </p>
            ) : (
              <p className="text-muted-foreground text-center mb-4">
                You haven't added any products to your wishlist yet.
              </p>
            )}
            <Button asChild>
              <Link to="/wishlist/add">Add Your First Product</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Wishlist;
