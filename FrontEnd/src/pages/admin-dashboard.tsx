import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/card";
import { Badge } from "../components/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/dialog";
import { Label } from "../components/label";
import {
  Heart,
  LogOut,
  Link as LinkIcon,
  Copy,
  Clock,
  User,
  Plus,
  Filter,
  Settings,
} from "lucide-react";
// import {
//   auth,
//   store,
//   type BloodRequest,
//   type RequestStatus,
// } from "../lib/store";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "../components/tabs";
import { useAuth } from "../context/AuthContext";
// import type { BloodRequest, RequestStatus } from "../api/blood-request.api";
import { store, type BloodRequest, type RequestStatus } from "../lib/store";

export default function AdminDashboard() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<BloodRequest[]>([]);
  const [filter, setFilter] = useState<RequestStatus | "all">("all");
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [expiryHours, setExpiryHours] = useState(5);
  const [generatedLink, setGeneratedLink] = useState("");

  useEffect(() => {
    if (!auth.accessToken) {
      navigate("/");
      return;
    }
    loadRequests();
  }, [navigate]);

  useEffect(() => {
    if (filter === "all") {
      setFilteredRequests(requests);
    } else {
      setFilteredRequests(requests.filter((r) => r.status === filter));
    }
  }, [filter, requests]);

  const loadRequests = () => {
    setRequests(store.getRequests());
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleGenerateLink = () => {
    const link = store.generateLink(expiryHours);
    const fullUrl = `${window.location.origin}/request/${link.token}`;
    setGeneratedLink(fullUrl);
  };

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(generatedLink)
      .then(() => {
        toast.success("Link copied to clipboard!");
      })
      .catch(() => {
        // Fallback for when clipboard API is blocked
        const textArea = document.createElement("textarea");
        textArea.value = generatedLink;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand("copy");
          toast.success("Link copied to clipboard!");
        } catch (err) {
          toast.error("Failed to copy link. Please copy manually.");
        }
        document.body.removeChild(textArea);
      });
  };

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "approved":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      case "processed":
        return "bg-blue-500";
    }
  };

  const getStatusBadgeVariant = (
    status: RequestStatus,
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "pending":
        return "secondary";
      case "approved":
        return "default";
      case "rejected":
        return "destructive";
      case "processed":
        return "outline";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <div>
                <h1 className="text-xl">Blood Request Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  Admin Control Panel
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/admin/settings")}
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Requests
                  </p>
                  <p className="text-3xl mt-1">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-3xl mt-1">{stats.pending}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <p className="text-3xl mt-1">{stats.approved}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-green-600 fill-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                  <p className="text-3xl mt-1">{stats.rejected}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Dialog
            open={isGenerateModalOpen}
            onOpenChange={setIsGenerateModalOpen}
          >
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Generate Request Link
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate Request Link</DialogTitle>
                <DialogDescription>
                  Create a time-limited link for users to submit blood requests
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Link Expiry Time</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[2, 5, 10].map((hours) => (
                      <Button
                        key={hours}
                        variant={expiryHours === hours ? "default" : "outline"}
                        onClick={() => setExpiryHours(hours)}
                        className="w-full"
                      >
                        {hours} hrs
                      </Button>
                    ))}
                  </div>
                </div>

                {!generatedLink ? (
                  <Button onClick={handleGenerateLink} className="w-full">
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Generate Link
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="p-3 bg-muted rounded-lg break-all text-sm">
                      {generatedLink}
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleCopyLink} className="flex-1">
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Link
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setGeneratedLink("");
                          setIsGenerateModalOpen(false);
                        }}
                        className="flex-1"
                      >
                        Done
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Blood Requests</CardTitle>
              <Filter className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <Tabs
              value={filter}
              onValueChange={(v) => setFilter(v as RequestStatus | "all")}
            >
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
                <TabsTrigger value="processed">Processed</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {filter === "all"
                    ? "No requests yet"
                    : `No ${filter} requests`}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredRequests.map((request) => (
              <Card
                key={request.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/admin/request/${request.id}`)}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center justify-center w-14 h-14 bg-primary rounded-lg">
                          <span className="text-white font-bold text-lg">
                            {request.bloodGroup}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium">{request.patientName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {request.hospitalName}
                          </p>
                        </div>
                        <Badge
                          variant={getStatusBadgeVariant(request.status)}
                          className="capitalize"
                        >
                          {request.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>
                            Required: {formatDate(request.requiredTiming)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="w-4 h-4" />
                          <span>{request.attenderPhone}</span>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {request.reason}
                      </p>
                    </div>

                    <div className="flex sm:flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/request/${request.id}`);
                        }}
                        className="flex-1 sm:flex-none"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
