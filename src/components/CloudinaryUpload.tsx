import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Camera, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CloudinaryUploadProps {
  onImageUpload: (imageUrl: string, analysisData?: any) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
}

interface AnalysisResult {
  area: number;
  depth: number;
  materialEstimate: {
    asphalt: string;
    cement: string;
  };
  severity: 'Low' | 'Medium' | 'High';
}

const CloudinaryUpload: React.FC<CloudinaryUploadProps> = ({
  onImageUpload,
  maxFiles = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp']
}) => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Mock AI analysis function (replace with actual Flask API call)
  const analyzeImage = async (imageUrl: string): Promise<AnalysisResult> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock analysis results
    const mockResults: AnalysisResult[] = [
      {
        area: 0.8,
        depth: 0.05,
        materialEstimate: { asphalt: '8 kg', cement: '2 bags' },
        severity: 'Medium'
      },
      {
        area: 1.2,
        depth: 0.08,
        materialEstimate: { asphalt: '15 kg', cement: '4 bags' },
        severity: 'High'
      },
      {
        area: 0.4,
        depth: 0.03,
        materialEstimate: { asphalt: '4 kg', cement: '1 bag' },
        severity: 'Low'
      }
    ];
    
    return mockResults[Math.floor(Math.random() * mockResults.length)];
  };

  // Mock Cloudinary upload function
  const uploadToCloudinary = async (file: File): Promise<string> => {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create a temporary URL for demo purposes
    const tempUrl = URL.createObjectURL(file);
    
    // In real implementation, this would be:
    // const formData = new FormData();
    // formData.append('file', file);
    // formData.append('upload_preset', 'your_upload_preset');
    // const response = await fetch('https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', {
    //   method: 'POST',
    //   body: formData
    // });
    // const data = await response.json();
    // return data.secure_url;
    
    return tempUrl;
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => 
      acceptedTypes.includes(file.type) && file.size <= 10 * 1024 * 1024 // 10MB limit
    );

    if (validFiles.length === 0) {
      toast({
        title: "Invalid Files",
        description: "Please select valid image files (max 10MB each).",
        variant: "destructive"
      });
      return;
    }

    if (uploadedImages.length + validFiles.length > maxFiles) {
      toast({
        title: "Too Many Files",
        description: `Maximum ${maxFiles} images allowed.`,
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      for (const file of validFiles) {
        // Upload to Cloudinary
        const imageUrl = await uploadToCloudinary(file);
        
        // Add to uploaded images
        setUploadedImages(prev => [...prev, imageUrl]);
        
        // Analyze image with AI
        setIsAnalyzing(true);
        const analysisData = await analyzeImage(imageUrl);
        setIsAnalyzing(false);
        
        // Notify parent component
        onImageUpload(imageUrl, analysisData);
        
        toast({
          title: "Image Uploaded",
          description: "Image uploaded and analyzed successfully!",
        });
      }
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* Upload Button */}
      <Card className="border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              {isUploading ? (
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              ) : (
                <Camera className="w-6 h-6 text-primary" />
              )}
            </div>
            <div>
              <h3 className="font-semibold mb-2">Upload Pothole Images</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload images for AI-powered material estimation
              </p>
              <Button
                onClick={triggerFileInput}
                disabled={isUploading || uploadedImages.length >= maxFiles}
                variant="municipal"
              >
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Select Images'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Max {maxFiles} images, 10MB each. Supported: JPG, PNG, WebP
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Status */}
      {isAnalyzing && (
        <Card className="border border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
              <div>
                <p className="font-semibold text-primary">AI Analysis in Progress</p>
                <p className="text-sm text-muted-foreground">
                  Analyzing image for material estimation...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Uploaded Images */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {uploadedImages.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <img
                src={imageUrl}
                alt={`Upload ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-border"
              />
              <Button
                size="sm"
                variant="destructive"
                className="absolute top-2 right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CloudinaryUpload;