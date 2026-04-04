import { Card, CardContent } from "../components/card";
import { Button } from "../components/button";
import { AlertCircle, Clock, Mail } from "lucide-react";

export default function ExpiredLink() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardContent className="pt-12 pb-8 text-center">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-orange-600" />
          </div>

          <h1 className="text-3xl mb-3">Link Expired</h1>

          <p className="text-lg text-muted-foreground mb-8">
            This blood request link has expired or is invalid
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3 p-4 bg-muted rounded-lg text-left">
              <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium mb-1">Time Limited Links</h3>
                <p className="text-sm text-muted-foreground">
                  Request links are time-limited for security purposes
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-muted rounded-lg text-left">
              <Mail className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium mb-1">Need a New Link?</h3>
                <p className="text-sm text-muted-foreground">
                  Please contact the admin to generate a new request link
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              <strong>Emergency?</strong> Contact the hospital or blood bank
              directly for immediate assistance
            </p>
          </div>

          <Button
            variant="outline"
            className="mt-6"
            onClick={() =>
              (window.location.href = "mailto:admin@bloodrequest.com")
            }
          >
            Contact Admin
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
