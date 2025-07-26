import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, MapPin, ArrowLeft, Upload, Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import CloudinaryUpload from "@/components/CloudinaryUpload";

const ReportIssue = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    type: "",
    location: "",
    description: "",
    severity: "",
    image: null as File | null
  });
  const [materialEstimate, setMaterialEstimate] = useState<string | null>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [aiAnalysisResults, setAiAnalysisResults] = useState<any[]>([]);

  const issueTypes = [
    { value: "pothole", label: "Pothole" },
    { value: "waterlogged", label: "Waterlogged Area" },
    { value: "sewage", label: "Sewage Overflow" },
    { value: "drain", label: "Blocked Drain" },
    { value: "road", label: "Road Damage" }
  ];

  const severityLevels = [
    { value: "low", label: "Low - Minor inconvenience" },
    { value: "medium", label: "Medium - Moderate impact" },
    { value: "high", label: "High - Safety hazard" },
    { value: "critical", label: "Critical - Emergency" }
  ];

  const handleImageUpload = (imageUrl: string, analysisData?: any) => {
    setUploadedImages(prev => [...prev, imageUrl]);
    if (analysisData) {
      setAiAnalysisResults(prev => [...prev, analysisData]);
      // Auto-set severity based on AI analysis from Python Flask API
      if (!formData.severity) {
        setFormData(prev => ({ ...prev, severity: analysisData.severity.toLowerCase() }));
      }
      // Set material estimate from AI analysis
      setMaterialEstimate(`${analysisData.materialEstimate.asphalt} asphalt, ${analysisData.materialEstimate.cement} cement - Area: ${analysisData.area}m², Depth: ${analysisData.depth}m`);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setFormData(prev => ({
            ...prev,
            location: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
          }));
          toast({
            title: "Location Captured",
            description: "GPS coordinates have been recorded for your report.",
          });
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Could not get your location. Please enter manually.",
            variant: "destructive",
          });
        }
      );
    }
  };


  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setCurrentStep(3);
      toast({
        title: "Report Submitted Successfully",
        description: "Your infrastructure report has been sent to the municipal authorities.",
      });
    }, 2000);
  };

  if (currentStep === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-success to-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">Report Submitted!</h3>
            <p className="text-muted-foreground mb-6">
              Your report has been successfully submitted and assigned ID #IR-{Date.now().toString().slice(-6)}.
              You'll receive updates on the progress.
            </p>
            <div className="space-y-3">
              <Button className="w-full" variant="municipal" onClick={() => navigate("/dashboard")}>
                View All Reports
              </Button>
              <Button variant="outline" className="w-full" onClick={() => {
                setCurrentStep(1);
                setFormData({
                  type: "",
                  location: "",
                  description: "",
                  severity: "",
                  image: null
                });
                setMaterialEstimate(null);
              }}>
                Submit Another Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Report Infrastructure Issue</h1>
              <p className="text-sm text-muted-foreground">Help improve your community</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className={`text-sm font-medium ${currentStep >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                Issue Details
              </span>
              <span className={`text-sm font-medium ${currentStep >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                Photo & Location
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 2) * 100}%` }}
              />
            </div>
          </div>

          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                {currentStep === 1 ? "Issue Information" : "Photo & Location"}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 
                  ? "Provide details about the infrastructure issue"
                  : "Upload a photo and confirm location for AI analysis"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentStep === 1 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="issue-type">Issue Type</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the type of issue" />
                      </SelectTrigger>
                      <SelectContent>
                        {issueTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="severity">Severity Level</Label>
                    <Select value={formData.severity} onValueChange={(value) => setFormData(prev => ({ ...prev, severity: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="How severe is this issue?" />
                      </SelectTrigger>
                      <SelectContent>
                        {severityLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the issue in detail..."
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                    />
                  </div>

                  <Button 
                    className="w-full" 
                    variant="municipal"
                    onClick={() => setCurrentStep(2)}
                    disabled={!formData.type || !formData.severity || !formData.description}
                  >
                    Continue to Photo & Location
                  </Button>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <div className="space-y-4">
                    {/* Cloudinary Upload with AI Analysis */}
                    <CloudinaryUpload onImageUpload={handleImageUpload} />

                    {/* AI Analysis Results */}
                    {aiAnalysisResults.length > 0 && (
                      <Card className="border border-primary/20 bg-primary/5">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-primary">
                            <AlertTriangle className="w-5 h-5" />
                            AI Analysis Results (Python Flask API)
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {aiAnalysisResults.map((result, index) => (
                              <div key={index} className="p-4 bg-white rounded-lg border">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p><strong>Estimated Area:</strong> {result.area}m²</p>
                                    <p><strong>Estimated Depth:</strong> {result.depth}m</p>
                                  </div>
                                  <div>
                                    <p><strong>Asphalt Needed:</strong> {result.materialEstimate.asphalt}</p>
                                    <p><strong>Cement Needed:</strong> {result.materialEstimate.cement}</p>
                                  </div>
                                  <div className="col-span-2">
                                    <p><strong>Severity Assessment:</strong> 
                                      <span className={`ml-2 px-2 py-1 rounded text-xs ${
                                        result.severity === 'High' ? 'bg-red-100 text-red-800' :
                                        result.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-green-100 text-green-800'
                                      }`}>
                                        {result.severity}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <div className="flex gap-2">
                        <Input
                          id="location"
                          placeholder="Enter address or coordinates"
                          value={formData.location}
                          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        />
                        <Button variant="outline" onClick={getCurrentLocation}>
                          <MapPin className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {materialEstimate && (
                      <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="pt-6">
                          <h4 className="font-semibold text-sm mb-2">AI Material Estimate</h4>
                          <p className="text-sm text-muted-foreground">{materialEstimate}</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
                      Back
                    </Button>
                    <Button 
                      className="flex-1" 
                      variant="municipal"
                      onClick={handleSubmit}
                      disabled={uploadedImages.length === 0 || !formData.location || isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Report"
                      )}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;