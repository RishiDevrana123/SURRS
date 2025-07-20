import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Camera, MapPin, Clock, AlertTriangle, CheckCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Sample user reports data
  const [reports] = useState([
    {
      id: 1,
      type: "Pothole",
      location: "Main St & 5th Ave",
      status: "In Progress",
      severity: "High",
      reportedAt: "2024-01-15T10:30:00Z",
      estimatedMaterial: "12 kg asphalt, 3 bags cement",
      image: "https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?w=300&h=200&fit=crop"
    },
    {
      id: 2,
      type: "Waterlogged Area",
      location: "Park Avenue",
      status: "Resolved",
      severity: "Medium",
      reportedAt: "2024-01-14T14:20:00Z",
      estimatedMaterial: "Drainage pipe cleaning",
      image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=300&h=200&fit=crop"
    },
    {
      id: 3,
      type: "Sewage Overflow",
      location: "Elm Street",
      status: "Pending",
      severity: "High",
      reportedAt: "2024-01-16T08:45:00Z",
      estimatedMaterial: "Emergency response required",
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=200&fit=crop"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved": return "success";
      case "In Progress": return "warning";
      case "Pending": return "destructive";
      default: return "secondary";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High": return "destructive";
      case "Medium": return "warning";
      case "Low": return "secondary";
      default: return "secondary";
    }
  };

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">SURRS Citizen</h1>
                <p className="text-sm text-muted-foreground">Welcome back, John Doe</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="municipal" onClick={() => navigate("/report")}>
                <Plus className="w-4 h-4 mr-2" />
                New Report
              </Button>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Reports</p>
                  <p className="text-2xl font-bold text-foreground">{reports.length}</p>
                </div>
                <Camera className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Resolved</p>
                  <p className="text-2xl font-bold text-success">
                    {reports.filter(r => r.status === "Resolved").length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold text-warning">
                    {reports.filter(r => r.status === "In Progress").length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">High Priority</p>
                  <p className="text-2xl font-bold text-destructive">
                    {reports.filter(r => r.severity === "High").length}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Action */}
        <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-primary to-accent text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Report an Issue</h3>
            <p className="text-lg opacity-90 mb-6">
              Help keep your community safe by reporting infrastructure problems
            </p>
            <Button variant="outline" size="lg" className="bg-white text-primary hover:bg-white/90" onClick={() => navigate("/report")}>
              <Camera className="w-5 h-5 mr-2" />
              Start New Report
            </Button>
          </CardContent>
        </Card>

        {/* Reports List */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Your Reports
            </CardTitle>
            <CardDescription>
              Track the status of your submitted infrastructure reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="flex flex-col md:flex-row gap-4 p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
                  <img
                    src={report.image}
                    alt={report.type}
                    className="w-full md:w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-foreground">{report.type}</h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {report.location}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={getStatusColor(report.status) as any}>
                          {report.status}
                        </Badge>
                        <Badge variant={getSeverityColor(report.severity) as any}>
                          {report.severity}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Material Estimate:</strong> {report.estimatedMaterial}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Reported: {new Date(report.reportedAt).toLocaleDateString()} at {new Date(report.reportedAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;