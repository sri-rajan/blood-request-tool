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
import { Heart, AlertCircle, CheckCircle2 } from "lucide-react";
import { store, type BloodGroup } from "../lib/store";
import { toast } from "sonner";

export default function RequestForm() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [isValidToken, setIsValidToken] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [requestId, setRequestId] = useState("");
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

    setIsValidToken(true);
    setLoading(false);
  }, [token, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!token || !bloodGroup) return;

    const request = store.addRequest({
      bloodGroup: bloodGroup as BloodGroup,
      hospitalName,
      patientName,
      reason,
      requiredTiming,
      attenderPhone,
    });

    store.linkRequest(token, request.id);
    setRequestId(request.id);
    setIsSubmitted(true);
    toast.success("Request submitted successfully!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-muted-foreground">Validating link...</p>
      </div>
    );
  }

  if (!isValidToken) {
    return null;
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="pt-12 pb-8 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl mb-2">Request Submitted!</h2>
            <p className="text-muted-foreground mb-6">
              Your blood request has been submitted successfully. The admin will
              review and approve your request shortly.
            </p>
            <div className="p-4 bg-muted rounded-lg text-sm space-y-2">
              <p>
                <strong>Request ID:</strong> {requestId}
              </p>
              <p>
                <strong>Patient:</strong> {patientName}
              </p>
              <p>
                <strong>Blood Group:</strong> {bloodGroup}
              </p>
            </div>
            <Button
              onClick={() => navigate(`/request/${token}/edit`)}
              variant="outline"
              className="mt-6 w-full"
            >
              Edit Request
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 p-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <Heart className="w-8 h-8 text-white fill-white" />
          </div>
          <h1 className="text-3xl mb-2">Blood Request Form</h1>
          <p className="text-muted-foreground">
            Fill in the details to submit your blood request
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Request Details</CardTitle>
            <CardDescription>
              Please provide accurate information for faster processing
            </CardDescription>
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

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You can edit this request until admin approval or link expiry
                </AlertDescription>
              </Alert>

              <Button type="submit" className="w-full">
                Submit Request
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Your request will be reviewed by the admin team
        </p>
      </div>
    </div>
  );
}
