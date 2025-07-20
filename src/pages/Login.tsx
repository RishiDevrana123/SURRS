import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, User, Shield, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (role: 'citizen' | 'admin') => {
    setIsLoading(true);
    
    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Login Successful",
        description: `Welcome to SURRS ${role === 'admin' ? 'Admin' : 'Citizen'} Dashboard`,
      });
      
      if (role === 'admin') {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-foreground">SURRS</span>
          </div>
          <p className="text-muted-foreground">Access your urban resilience dashboard</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Choose your role to access the appropriate dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="citizen" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="citizen" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Citizen
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Municipal Admin
                </TabsTrigger>
              </TabsList>

              <TabsContent value="citizen" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="citizen-email">Email</Label>
                  <Input
                    id="citizen-email"
                    type="email"
                    placeholder="citizen@example.com"
                    defaultValue="john.doe@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="citizen-password">Password</Label>
                  <Input
                    id="citizen-password"
                    type="password"
                    placeholder="Enter your password"
                    defaultValue="password123"
                  />
                </div>
                <Button
                  className="w-full"
                  variant="municipal"
                  onClick={() => handleLogin('citizen')}
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In as Citizen"}
                </Button>
              </TabsContent>

              <TabsContent value="admin" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Municipal Email</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@municipality.gov"
                    defaultValue="admin@cityworks.gov"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="Enter admin password"
                    defaultValue="admin123"
                  />
                </div>
                <Button
                  className="w-full"
                  variant="emergency"
                  onClick={() => handleLogin('admin')}
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In as Admin"}
                </Button>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Demo credentials are pre-filled for hackathon presentation
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Info */}
        <Card className="mt-6 border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <h4 className="font-semibold text-sm mb-2">Demo Information</h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Citizen access: Report and track infrastructure issues</p>
              <p>• Admin access: Municipal dashboard with analytics</p>
              <p>• Both roles have pre-loaded sample data</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;