
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Calendar, Camera, TrendingUp, Trash2 } from "lucide-react";
import Navigation from "@/components/Navigation";

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

const History = () => {
  const [analyses, setAnalyses] = useState<AnalysisData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAnalyses = JSON.parse(localStorage.getItem('analyses') || '[]');
    setAnalyses(storedAnalyses);
  }, []);

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

  const deleteAnalysis = (id: string) => {
    const updatedAnalyses = analyses.filter(analysis => analysis.id !== id);
    setAnalyses(updatedAnalyses);
    localStorage.setItem('analyses', JSON.stringify(updatedAnalyses));
  };

  const viewAnalysis = (analysis: AnalysisData) => {
    navigate('/dashboard', { state: { analysisData: analysis } });
  };

  if (analyses.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Analysis History</h1>
            <div className="bg-white rounded-lg shadow-lg p-12">
              <AlertTriangle className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-slate-900 mb-2">No Analyses Yet</h2>
              <p className="text-slate-600 mb-6">
                You haven't performed any damage assessments yet. Upload satellite images to get started.
              </p>
              <Button onClick={() => navigate('/upload')} className="bg-blue-600 hover:bg-blue-700">
                Start First Analysis
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Analysis History</h1>
            <p className="text-slate-600">
              View and manage your previous damage assessments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analyses.map((analysis) => {
              const targetImage = analysis.images.find(img => img.name === analysis.result.image_name) || analysis.images[0];
              
              return (
                <Card key={analysis.id} className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
                  <div className="aspect-video rounded-t-lg overflow-hidden relative">
                    <img
                      src={targetImage.url}
                      alt={analysis.result.image_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className={`${getDamageColor(analysis.result.damage_score)} text-white`}>
                        {getDamageSeverity(analysis.result.damage_score)}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4 text-red-500" />
                          <span>Score: {analysis.result.damage_score}/10</span>
                        </CardTitle>
                        <CardDescription className="flex items-center space-x-2 mt-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(analysis.timestamp).toLocaleDateString()}</span>
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteAnalysis(analysis.id);
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0 space-y-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900 mb-1">
                        Affected Area
                      </p>
                      <p className="text-sm text-slate-600">
                        {analysis.result.area_name && analysis.result.area_name !== "N/A" 
                          ? analysis.result.area_name 
                          : "Location not identified"
                        }
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-slate-900 mb-1 flex items-center space-x-1">
                        <Camera className="h-3 w-3" />
                        <span>Images Analyzed</span>
                      </p>
                      <p className="text-sm text-slate-600">
                        {analysis.images.length} satellite images
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-slate-600 line-clamp-3">
                        {analysis.result.original_explanation}
                      </p>
                    </div>
                    
                    <div className="pt-2">
                      <Button 
                        onClick={() => viewAnalysis(analysis)}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        size="sm"
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Button onClick={() => navigate('/upload')} className="bg-blue-600 hover:bg-blue-700">
              New Analysis
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
