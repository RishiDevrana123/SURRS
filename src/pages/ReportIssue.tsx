import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, MapPin, ArrowLeft, Upload, Loader2, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      
      // Simulate AI analysis for material estimation
      setTimeout(() => {
        if (formData.type === "pothole") {
          setMaterialEstimate("Estimated materials: 15kg asphalt mix, 2 bags cement, 0.5m³ aggregate");
        } else if (formData.type === "waterlogged") {
          setMaterialEstimate("Estimated solution: Drainage pipe cleaning, 3 drain covers");
        } else if (formData.type === "sewage") {
          setMaterialEstimate("Emergency response required: Professional cleaning crew");
        } else {
          setMaterialEstimate("Material estimate will be calculated by municipal engineers");
        }
      }, 2000);
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
                    <div className="space-y-2">
                      <Label>Upload Photo</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <label htmlFor="image-upload" className="cursor-pointer">
                          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload photo of the issue
                          </p>
                        </label>
                      </div>
                      {formData.image && (
                        <p className="text-sm text-success">✓ Image uploaded: {formData.image.name}</p>
                      )}
                    </div>

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
                      disabled={!formData.image || !formData.location || isSubmitting}
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