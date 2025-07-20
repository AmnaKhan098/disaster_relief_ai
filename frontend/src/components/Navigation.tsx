
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Upload, BarChart3, History, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const Navigation = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/upload" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-slate-900">DisasterScope</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link to="/upload" className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors">
              <Upload className="h-4 w-4" />
              <span>Upload</span>
            </Link>
            <Link to="/dashboard" className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors">
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link to="/history" className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors">
              <History className="h-4 w-4" />
              <span>History</span>
            </Link>
            
            <div className="flex items-center space-x-4 border-l border-slate-200 pl-6">
              <div className="text-sm">
                <p className="font-medium text-slate-900">{user?.user_metadata?.full_name || "User"}</p>
                <p className="text-slate-600">{user?.email}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-slate-600 hover:text-red-600"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
