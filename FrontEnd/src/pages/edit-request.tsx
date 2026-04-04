import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { Label } from "../components/label";
import { Textarea } from "../components/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/card";
import { Alert, AlertDescription } from "../components/alert";
import { Heart, AlertCircle, Save } from "lucide-react";
import { store, type BloodGroup, type BloodRequest } from "../lib/store";
import { toast } from "sonner";

export default function EditRequest() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [request, setRequest] = useState<BloodRequest | null>(null);
  const [canEdit, setCanEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form state
  const [bloodGroup, setBloodGroup] = useState<BloodGroup | "">("");
  const [hospitalName, setHospitalName] = useState("");
  const [patientName, setPatientName] = useState("");
  const [reason, setReason] = useState("");
  const [requiredTiming, setRequiredTiming] = useState("");
  const [attenderPhone, setAttenderPhone] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/expired");
      return;
    }

    const validation = store.validateToken(token);
    if (!validation.valid) {
      navigate("/expired");
      return;
    }

    const req = store.getRequestByToken(token);
    if (!req) {
      navigate(`/request/${token}`);
      return;
    }

    // Check if request can be edited (only pending requests can be edited)
    if (req.status !== "pending") {
      setCanEdit(false);
      setRequest(req);
      setLoading(false);
      return;
    }

    setRequest(req);
    setCanEdit(true);
    setBloodGroup(req.bloodGroup);
    setHospitalName(req.hospitalName);
    setPatientName(req.patientName);
    setReason(req.reason);
    setRequiredTiming(req.requiredTiming);
    setAttenderPhone(req.attenderPhone);
    setLoading(false);
  }, [token, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!request || !bloodGroup) return;

    const updated = store.updateRequest(request.id, {
      bloodGroup: bloodGroup as BloodGroup,
      hospitalName,
      patientName,
      reason,
      requiredTiming,
      attenderPhone,
    });

    if (updated) {
      toast.success("Request updated successfully!");
      setRequest(updated);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!request) {
    return null;
  }

  if (!canEdit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="pt-12 pb-8 text-center">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl mb-2">Cannot Edit Request</h2>
            <p className="text-muted-foreground mb-6">
              This request has already been {request.status}. You can no longer
              edit it.
            </p>
            <div className="p-4 bg-muted rounded-lg text-sm space-y-2 text-left">
              <p>
                <strong>Request ID:</strong> {request.id}
              </p>
              <p>
                <strong>Patient:</strong> {request.patientName}
              </p>
              <p>
                <strong>Blood Group:</strong> {request.bloodGroup}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="capitalize">{request.status}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <Heart className="w-8 h-8 text-white fill-white" />
          </div>
          <h1 className="text-3xl mb-2">Edit Blood Request</h1>
          <p className="text-muted-foreground">
            Update your blood request details
          </p>
        </div>

        <Alert className="mb-6 border-blue-500 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            You can edit until admin approval or link expiry
          </AlertDescription>
        </Alert>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Update Request Details</CardTitle>
            <CardDescription>Request ID: {request.id}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="bloodGroup">Blood Group *</Label>
                <Select
                  value={bloodGroup}
                  onValueChange={(v) => setBloodGroup(v as BloodGroup)}
                  required
                >
                  <SelectTrigger id="bloodGroup" className="bg-white">
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patientName">Patient Name *</Label>
                  <Input
                    id="patientName"
                    type="text"
                    placeholder="Enter patient name"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    required
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hospitalName">Hospital Name *</Label>
                  <Input
                    id="hospitalName"
                    type="text"
                    placeholder="Enter hospital name"
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    required
                    className="bg-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Blood Requirement *</Label>
                <Textarea
                  id="reason"
                  placeholder="Describe the reason (e.g., surgery, accident, treatment)"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  rows={4}
                  className="bg-white resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="requiredTiming">Required Date & Time *</Label>
                  <Input
                    id="requiredTiming"
                    type="datetime-local"
                    value={requiredTiming}
                    onChange={(e) => setRequiredTiming(e.target.value)}
                    required
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="attenderPhone">Attender Phone Number *</Label>
                  <Input
                    id="attenderPhone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={attenderPhone}
                    onChange={(e) => setAttenderPhone(e.target.value)}
                    required
                    className="bg-white"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Changes will be saved immediately
        </p>
      </div>
    </div>
  );
}
