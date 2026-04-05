import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "../components/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/card";
import { Badge } from "../components/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/select";
import { Label } from "../components/label";
import { Separator } from "../components/separator";
import {
  ArrowLeft,
  Heart,
  Hospital,
  User,
  Phone,
  Clock,
  FileText,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { store, type BloodRequest, type RequestStatus } from "../lib/store";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

export default function RequestDetails() {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { id } = useParams();
  const [request, setRequest] = useState<BloodRequest | null>(null);
  const [status, setStatus] = useState<RequestStatus>("pending");

  useEffect(() => {
    if (!auth.accessToken) {
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
    setStatus(req.status);
  }, [id, navigate]);

  const handleStatusUpdate = () => {
    if (!request) return;

    store.updateRequestStatus(request.id, status);
    toast.success(`Request ${status}!`);
    setRequest({ ...request, status });
  };

  const handleApprove = () => {
    if (!request) return;

    store.updateRequestStatus(request.id, "approved");
    toast.success("Request approved!");
    setRequest({ ...request, status: "approved" });
    setStatus("approved");
  };

  const handleReject = () => {
    if (!request) return;

    store.updateRequestStatus(request.id, "rejected");
    toast.error("Request rejected");
    setRequest({ ...request, status: "rejected" });
    setStatus("rejected");
  };

  const handleGenerateImage = () => {
    if (!request) return;
    navigate(`/admin/image/${request.id}`);
  };

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/admin/dashboard")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl">Request Details</h1>
              <p className="text-sm text-muted-foreground">
                View and manage request
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Status Card */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">
                    {request.bloodGroup}
                  </span>
                </div>
                <div>
                  <CardTitle>{request.patientName}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Request ID: {request.id}
                  </p>
                </div>
              </div>
              <Badge
                variant={
                  request.status === "approved"
                    ? "default"
                    : request.status === "rejected"
                      ? "destructive"
                      : request.status === "processed"
                        ? "outline"
                        : "secondary"
                }
                className="capitalize text-base px-4 py-2 self-start sm:self-center"
              >
                {request.status}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Request Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Hospital className="w-4 h-4" />
                  <span>Hospital</span>
                </div>
                <p className="font-medium">{request.hospitalName}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <User className="w-4 h-4" />
                  <span>Patient Name</span>
                </div>
                <p className="font-medium">{request.patientName}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Heart className="w-4 h-4" />
                  <span>Blood Group</span>
                </div>
                <p className="font-medium text-primary text-lg">
                  {request.bloodGroup}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Phone className="w-4 h-4" />
                  <span>Contact Number</span>
                </div>
                <p className="font-medium">{request.attenderPhone}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Required Timing</span>
                </div>
                <p className="font-medium">
                  {formatDate(request.requiredTiming)}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Submitted On</span>
                </div>
                <p className="font-medium">{formatDate(request.createdAt)}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <FileText className="w-4 h-4" />
                <span>Reason for Blood Requirement</span>
              </div>
              <p className="p-4 bg-muted rounded-lg">{request.reason}</p>
            </div>
          </CardContent>
        </Card>

        {/* Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Manage Request</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Update Status</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as RequestStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="processed">Processed</SelectItem>
                </SelectContent>
              </Select>
              {status !== request.status && (
                <Button
                  onClick={handleStatusUpdate}
                  className="w-full sm:w-auto"
                >
                  Update Status
                </Button>
              )}
            </div>

            <Separator />

            <div className="flex flex-col sm:flex-row gap-3">
              {request.status === "pending" && (
                <>
                  <Button onClick={handleApprove} className="flex-1">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Request
                  </Button>
                  <Button
                    onClick={handleReject}
                    variant="destructive"
                    className="flex-1"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject Request
                  </Button>
                </>
              )}

              {request.status === "approved" && (
                <Button onClick={handleGenerateImage} className="flex-1">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Generate Shareable Image
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
