
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Shield, Satellite, Brain, Map, ArrowRight, Upload, BarChart3, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-slate-900">DisasterScope</span>
            </div>
            <Link to="/auth">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            AI-Powered Satellite Image Analysis
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Assess disaster damage with cutting-edge artificial intelligence. Upload satellite imagery 
            and get detailed damage assessments for informed disaster response planning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Start Analysis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Advanced Disaster Assessment Technology
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Our platform combines satellite imagery with artificial intelligence to provide 
            rapid, accurate damage assessments for disaster response teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Satellite className="h-12 w-12 text-blue-600" />
              </div>
              <CardTitle>Satellite Integration</CardTitle>
              <CardDescription>
                Upload and process high-resolution satellite imagery from multiple sources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>• Multi-format image support</li>
                <li>• Batch processing capabilities</li>
                <li>• Real-time analysis</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Brain className="h-12 w-12 text-green-600" />
              </div>
              <CardTitle>AI-Powered Analysis</CardTitle>
              <CardDescription>
                Advanced machine learning algorithms identify and assess damage patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>• Damage severity scoring</li>
                <li>• Pattern recognition</li>
                <li>• Automated reporting</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Map className="h-12 w-12 text-red-600" />
              </div>
              <CardTitle>Geographic Mapping</CardTitle>
              <CardDescription>
                Visualize damage assessments with interactive maps and location data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>• Interactive damage maps</li>
                <li>• Location identification</li>
                <li>• Impact zone visualization</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              How DisasterScope Works
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Three simple steps to get comprehensive disaster damage assessments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-blue-100 rounded-full p-4">
                  <Upload className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">1. Upload Images</h3>
              <p className="text-slate-600">
                Upload satellite images of disaster-affected areas. Our platform supports 
                multiple image formats and batch processing.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-green-100 rounded-full p-4">
                  <BarChart3 className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">2. AI Analysis</h3>
              <p className="text-slate-600">
                Our advanced AI algorithms analyze the imagery, identifying damage patterns 
                and calculating severity scores automatically.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-red-100 rounded-full p-4">
                  <Users className="h-8 w-8 text-red-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">3. Get Results</h3>
              <p className="text-slate-600">
                Receive detailed damage assessments with interactive maps, severity scores, 
                and actionable insights for response planning.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Disaster Response?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join disaster response teams worldwide who trust DisasterScope for rapid, 
            accurate damage assessments.
          </p>
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-slate-50">
              Get Started Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-blue-400" />
              <span className="text-lg font-bold">DisasterScope</span>
            </div>
            <p className="text-slate-400">
              © 2024 DisasterScope. AI-powered disaster assessment technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
