import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "../components/button";
import { Card, CardContent } from "../components/card";
import {
  ArrowLeft,
  Download,
  Share2,
  Heart,
  Phone,
  Clock,
  Hospital,
  AlertTriangle,
} from "lucide-react";
import { auth, store, type BloodRequest } from "../lib/store";
import { toast } from "sonner";
import html2canvas from "html2canvas";

export default function ImagePreview() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [request, setRequest] = useState<BloodRequest | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [primaryColor, setPrimaryColor] = useState("#E53935");
  const posterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      navigate("/");
      return;
    }

    if (!id) {
      navigate("/admin/dashboard");
      return;
    }

    const req = store.getRequestById(id);
    if (!req) {
      toast.error("Request not found");
      navigate("/admin/dashboard");
      return;
    }

    setRequest(req);

    // Load theme color from settings
    const savedSettings = localStorage.getItem("appSettings");
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      if (settings.primaryColor) {
        setPrimaryColor(settings.primaryColor);
      }
    }
  }, [id, navigate]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDownload = async () => {
    if (!posterRef.current) return;

    setDownloading(true);
    try {
      const canvas = await html2canvas(posterRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const link = document.createElement("a");
      link.download = `blood-request-${request?.patientName}-${request?.id}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      toast.success("Image downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download image");
      console.error(error);
    } finally {
      setDownloading(false);
    }
  };

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/admin/request/${id}`)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl">Shareable Image</h1>
              <p className="text-sm text-muted-foreground">
                Download and share on WhatsApp
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleDownload}
            disabled={downloading}
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            {downloading ? "Generating..." : "Download Image"}
          </Button>
          <Button variant="outline" className="flex-1">
            <Share2 className="w-4 h-4 mr-2" />
            Share Instructions
          </Button>
        </div>

        {/* Poster Preview */}
        <div className="flex justify-center">
          <div className="w-full max-w-xl">
            {/* Poster Card */}
            <div
              ref={posterRef}
              className="bg-white rounded-2xl shadow-2xl overflow-hidden"
              style={{ aspectRatio: "1/1.4" }}
            >
              {/* Header with Alert Design */}
              <div
                className="p-6 text-white relative overflow-hidden"
                style={{
                  background: `linear-gradient(to right, ${primaryColor}, ${primaryColor}dd)`,
                }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

                <div className="relative z-10">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <AlertTriangle className="w-8 h-8" />
                    <h1 className="text-2xl font-bold">URGENT</h1>
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                  <p className="text-center text-lg">Blood Donation Required</p>
                </div>
              </div>

              {/* Blood Group - Big & Bold */}
              <div
                className="py-8"
                style={{
                  backgroundColor: `${primaryColor}15`,
                  borderBottom: `4px solid ${primaryColor}`,
                }}
              >
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Blood Group Needed
                  </p>
                  <div
                    className="inline-flex items-center justify-center w-32 h-32 rounded-full shadow-lg"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <span className="text-white font-bold text-6xl">
                      {request.bloodGroup}
                    </span>
                  </div>
                </div>
              </div>

              {/* Details Section */}
              <div className="p-6 space-y-4">
                {/* Patient Name */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${primaryColor}20` }}
                    >
                      <Heart
                        className="w-5 h-5"
                        style={{ color: primaryColor }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">
                        Patient Name
                      </p>
                      <p className="font-bold text-lg truncate">
                        {request.patientName}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hospital */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Hospital className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Hospital</p>
                      <p className="font-bold truncate">
                        {request.hospitalName}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Required Time */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">
                        Required By
                      </p>
                      <p className="font-bold truncate">
                        {formatDate(request.requiredTiming)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reason */}
                <div
                  className="rounded-lg p-4 border-2"
                  style={{
                    backgroundColor: `${primaryColor}10`,
                    borderColor: `${primaryColor}40`,
                  }}
                >
                  <p className="text-xs text-muted-foreground mb-1">Reason</p>
                  <p className="font-medium text-sm leading-relaxed">
                    {request.reason}
                  </p>
                </div>

                {/* Contact */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-4 text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white/80">Contact Number</p>
                      <p className="font-bold text-lg">
                        {request.attenderPhone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-900 text-white p-4 text-center">
                <p className="text-sm font-medium">
                  🩸 Donate Blood, Save Lives 🩸
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Every donation counts
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Share Instructions */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-3">How to Share</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Download the image using the button above</li>
              <li>Open WhatsApp and go to your groups or contacts</li>
              <li>Share the image with relevant blood donor groups</li>
              <li>Include the contact number for faster response</li>
            </ol>
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Tip:</strong> Share in multiple WhatsApp groups to reach
                more potential donors quickly
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
