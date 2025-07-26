import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MapPin, 
  AlertTriangle, 
  BarChart3, 
  Filter, 
  Cloud, 
  Droplets,
  LogOut,
  Users,
  CheckCircle,
  Clock,
  TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import MapView from "@/components/MapView";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedSeverity, setSelectedSeverity] = useState("all");

  // Sample reports data for admin view with coordinates for Leaflet.js
  const [reports] = useState([
    {
      id: 1,
      type: "Pothole",
      location: "Main St & 5th Ave",
      lat: 40.7128,
      lng: -74.0060,
      status: "In Progress",
      severity: "High",
      reportedBy: "John Doe",
      reportedAt: "2024-01-15T10:30:00Z",
      estimatedMaterial: "12 kg asphalt, 3 bags cement",
      estimatedCost: "$450",
      image: "https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?w=300&h=200&fit=crop"
    },
    {
      id: 2,
      type: "Waterlogged Area",
      location: "Park Avenue",
      lat: 40.7589,
      lng: -73.9851,
      status: "Resolved",
      severity: "Medium",
      reportedBy: "Jane Smith",
      reportedAt: "2024-01-14T14:20:00Z",
      estimatedMaterial: "Drainage pipe cleaning",
      estimatedCost: "$280",
      image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=300&h=200&fit=crop"
    },
    {
      id: 3,
      type: "Sewage Overflow",
      location: "Elm Street",
      lat: 40.7505,
      lng: -73.9934,
      status: "Pending",
      severity: "High",
      reportedBy: "Mike Johnson",
      reportedAt: "2024-01-16T08:45:00Z",
      estimatedMaterial: "Emergency response required",
      estimatedCost: "$1,200",
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=200&fit=crop"
    },
    {
      id: 4,
      type: "Blocked Drain",
      location: "Broadway & 42nd",
      lat: 40.7580,
      lng: -73.9855,
      status: "In Progress",
      severity: "Medium",
      reportedBy: "Sarah Wilson",
      reportedAt: "2024-01-17T16:15:00Z",
      estimatedMaterial: "Drain cleaning equipment",
      estimatedCost: "$180",
      image: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=300&h=200&fit=crop"
    }
  ]);

  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [showMap, setShowMap] = useState(true);

  const [weatherData] = useState({
    temperature: 18,
    condition: "Partly Cloudy",
    humidity: 65,
    precipitation: 20,
    riskLevel: "Medium"
  });

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

  const filteredReports = reports.filter(report => {
    const typeMatch = selectedFilter === "all" || report.type.toLowerCase().includes(selectedFilter);
    const severityMatch = selectedSeverity === "all" || report.severity.toLowerCase() === selectedSeverity;
    return typeMatch && severityMatch;
  });

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === "Pending").length,
    inProgress: reports.filter(r => r.status === "In Progress").length,
    resolved: reports.filter(r => r.status === "Resolved").length,
    highSeverity: reports.filter(r => r.severity === "High").length,
    totalCost: reports.reduce((sum, r) => sum + parseInt(r.estimatedCost.replace(/[\$,]/g, "")), 0)
  };

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "Administrator session ended.",
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
              <div className="w-8 h-8 bg-gradient-to-r from-destructive to-warning rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">SURRS Municipal Admin</h1>
                <p className="text-sm text-muted-foreground">City Infrastructure Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="text-sm">
                {reports.filter(r => r.status === "Pending").length} Pending
              </Badge>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <BarChart3 className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Reports</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <AlertTriangle className="w-6 h-6 text-destructive mx-auto mb-2" />
              <p className="text-2xl font-bold text-destructive">{stats.pending}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Clock className="w-6 h-6 text-warning mx-auto mb-2" />
              <p className="text-2xl font-bold text-warning">{stats.inProgress}</p>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-6 h-6 text-success mx-auto mb-2" />
              <p className="text-2xl font-bold text-success">{stats.resolved}</p>
              <p className="text-xs text-muted-foreground">Resolved</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 text-destructive mx-auto mb-2" />
              <p className="text-2xl font-bold text-destructive">{stats.highSeverity}</p>
              <p className="text-xs text-muted-foreground">High Priority</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <span className="text-xl">💰</span>
              <p className="text-lg font-bold text-foreground">${stats.totalCost.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Est. Cost</p>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Map with Leaflet.js & OpenStreetMap */}
        {showMap && (
          <div className="mb-8">
            <MapView 
              reports={filteredReports} 
              onReportSelect={(report) => setSelectedReport(report)}
            />
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Reports Management */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Infrastructure Reports
                    </CardTitle>
                    <CardDescription>
                      Manage and respond to citizen-reported issues
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant={showMap ? "municipal" : "outline"} 
                      size="sm"
                      onClick={() => setShowMap(!showMap)}
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      {showMap ? "Hide Map" : "Show Map"}
                    </Button>
                    <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="pothole">Potholes</SelectItem>
                        <SelectItem value="waterlogged">Waterlogged</SelectItem>
                        <SelectItem value="sewage">Sewage</SelectItem>
                        <SelectItem value="drain">Drains</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Severity</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredReports.map((report) => (
                    <div key={report.id} className="flex gap-4 p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
                      <img
                        src={report.image}
                        alt={report.type}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-foreground">{report.type}</h4>
                            <p className="text-sm text-muted-foreground">{report.location}</p>
                            <p className="text-xs text-muted-foreground">By: {report.reportedBy}</p>
                          </div>
                          <div className="flex flex-col gap-1">
                            <Badge variant={getStatusColor(report.status) as any} className="text-xs">
                              {report.status}
                            </Badge>
                            <Badge variant={getSeverityColor(report.severity) as any} className="text-xs">
                              {report.severity}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            {new Date(report.reportedAt).toLocaleDateString()}
                          </span>
                          <span className="font-medium text-foreground">
                            Est: {report.estimatedCost}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weather & Analytics */}
          <div className="space-y-6">
            {/* Weather Card */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-accent to-primary text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Cloud className="w-5 h-5" />
                  Weather Alert System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Temperature</span>
                    <span className="font-bold">{weatherData.temperature}°C</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Condition</span>
                    <span>{weatherData.condition}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Rain Chance</span>
                    <span className="flex items-center gap-1">
                      <Droplets className="w-4 h-4" />
                      {weatherData.precipitation}%
                    </span>
                  </div>
                  <div className="border-t border-white/20 pt-4">
                    <div className="flex items-center justify-between">
                      <span>Flood Risk</span>
                      <Badge variant="secondary" className="bg-warning/20 text-white border-white/30">
                        {weatherData.riskLevel}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="emergency" className="w-full justify-start">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Emergency Response
                </Button>
                <Button variant="municipal" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Dispatch Crew
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            {/* Regional Stats */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Regional Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Downtown</span>
                    <Badge variant="destructive">3 issues</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Midtown</span>
                    <Badge variant="secondary">1 issue</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Uptown</span>
                    <Badge variant="outline">0 issues</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;