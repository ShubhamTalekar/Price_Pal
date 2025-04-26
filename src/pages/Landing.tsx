
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartLine, Wallet, ShoppingBag, AlertCircle } from 'lucide-react';

const features = [
  {
    title: 'Track Your Products',
    description: 'Add products you want to buy and monitor their prices over time.',
    icon: <ShoppingBag className="h-6 w-6 text-primary" />
  },
  {
    title: 'Manage Your Savings',
    description: 'Create a virtual wallet and allocate funds to specific products.',
    icon: <Wallet className="h-6 w-6 text-primary" />
  },
  {
    title: 'Visualize Progress',
    description: 'See your savings progress and estimated completion date for each product.',
    icon: <ChartLine className="h-6 w-6 text-primary" />
  },
  {
    title: 'Get Notified',
    description: 'Receive alerts for price changes and when you\'ve saved enough to make a purchase.',
    icon: <AlertCircle className="h-6 w-6 text-primary" />
  }
];

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">Price</span>
            <span className="text-2xl font-bold">Pal</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button asChild variant="outline">
              <Link to="/login">Log In</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-secondary to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Track, Save, <span className="text-primary">Purchase</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Plan your purchases and track your savings progress with personalized savings plans.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button asChild size="lg" className="px-8">
              <Link to="/signup">Get Started</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="px-8">
              <Link to="/login">Log In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How PricePal Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Your Journey to Planned Purchases</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h3 className="text-xl font-semibold mb-2">Add Products</h3>
              <p className="text-muted-foreground">
                Add products you want to buy with their current prices and create a personalized savings plan.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h3 className="text-xl font-semibold mb-2">Save Money</h3>
              <p className="text-muted-foreground">
                Add funds to your wallet and allocate them to specific products based on your savings plan.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h3 className="text-xl font-semibold mb-2">Make Your Purchase</h3>
              <p className="text-muted-foreground">
                Once you've saved enough, PricePal notifies you that you're ready to buy your desired product.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Plan Your Next Purchase?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join PricePal today and take control of your shopping with smart savings plans.
          </p>
          <Button asChild size="lg" className="px-8">
            <Link to="/signup">Create Your Account</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <span className="text-xl font-bold text-primary">Price</span>
              <span className="text-xl font-bold">Pal</span>
            </div>
            <div className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} PricePal. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
