
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertTriangle, MapPin, Camera, TrendingUp } from "lucide-react";
import Navigation from "@/components/Navigation";
import DamageMap from "@/components/DamageMap";

interface AnalysisResult {
  area_name: string;
  damage_score: number;
  original_explanation: string;
  justification: string;
  image_name: string;
}

interface AnalysisData {
  id: string;
  timestamp: string;
  result: AnalysisResult;
  images: Array<{ name: string; url: string }>;
}

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  useEffect(() => {
    if (location.state?.analysisData) {
      setAnalysisData(location.state.analysisData);
    } else {
      // Try to get latest analysis from localStorage
      const analyses = JSON.parse(localStorage.getItem('analyses') || '[]');
      if (analyses.length > 0) {
        setAnalysisData(analyses[0]);
      } else {
        navigate('/upload');
      }
    }
  }, [location.state, navigate]);

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">No Analysis Data</h1>
          <p className="text-slate-600 mb-6">Please upload images to start analysis.</p>
          <Button onClick={() => navigate('/upload')} className="bg-blue-600 hover:bg-blue-700">
            Upload Images
          </Button>
        </div>
      </div>
    );
  }

  const { result, images } = analysisData;
  const targetImage = images.find(img => img.name === result.image_name) || images[0];

  const getDamageColor = (score: number) => {
    if (score >= 8) return "bg-red-500";
    if (score >= 6) return "bg-orange-500";
    if (score >= 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getDamageSeverity = (score: number) => {
    if (score >= 8) return "Critical";
    if (score >= 6) return "High";
    if (score >= 4) return "Moderate";
    return "Low";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Damage Assessment Results
            </h1>
            <p className="text-slate-600">
              Analysis completed on {new Date(analysisData.timestamp).toLocaleString()}
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Damage Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{result.damage_score}/10</div>
                <Badge className={`${getDamageColor(result.damage_score)} text-white mt-2`}>
                  {getDamageSeverity(result.damage_score)} Damage
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Affected Area</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {result.area_name && result.area_name !== "N/A" ? result.area_name : "Unknown"}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Most severely affected region
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Images Analyzed</CardTitle>
                <Camera className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{images.length}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Satellite images processed
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Most Affected Image */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <span>Most Affected Area</span>
                </CardTitle>
                <CardDescription>
                  Image showing the highest damage score: {result.image_name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video rounded-lg overflow-hidden mb-4">
                  <img
                    src={targetImage.url}
                    alt={result.image_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Analysis Summary</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {result.original_explanation}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Detailed Assessment</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {result.justification}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-blue-500" />
                  <span>Geographic Location</span>
                </CardTitle>
                <CardDescription>
                  {result.area_name && result.area_name !== "N/A" 
                    ? `Showing location: ${result.area_name}`
                    : "Geographic visualization of the affected area"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DamageMap 
                  areaName={result.area_name && result.area_name !== "N/A" ? result.area_name : null}
                  damageScore={result.damage_score}
                />
              </CardContent>
            </Card>
          </div>

          {/* All Images */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>All Analyzed Images</CardTitle>
              <CardDescription>
                Complete set of satellite images used in this analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden">
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <p className="text-xs text-slate-600 mt-2 truncate" title={image.name}>
                      {image.name}
                    </p>
                    {image.name === result.image_name && (
                      <Badge className="absolute top-2 right-2 bg-red-500 text-white text-xs">
                        Most Affected
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-center space-x-4 mt-8">
            <Button onClick={() => navigate('/upload')} className="bg-blue-600 hover:bg-blue-700">
              New Analysis
            </Button>
            <Button onClick={() => navigate('/history')} variant="outline">
              View History
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
