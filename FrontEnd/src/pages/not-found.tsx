import { useNavigate } from "react-router";
import { Card, CardContent } from "../components/card";
import { Button } from "../components/button";
import { FileQuestion, Home } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="pt-12 pb-8 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileQuestion className="w-10 h-10 text-gray-600" />
          </div>

          <h1 className="text-6xl mb-2">404</h1>
          <h2 className="text-2xl mb-3">Page Not Found</h2>

          <p className="text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved
          </p>

          <Button onClick={() => navigate("/")}>
            <Home className="w-4 h-4 mr-2" />
            Go to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
