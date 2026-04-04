import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { Label } from "../components/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/card";
import { Alert, AlertDescription } from "../components/alert";
import { Heart, AlertCircle } from "lucide-react";
import { auth } from "../lib/store";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (auth.login(email, password)) {
        auth.setAuthenticated(true);
        navigate("/admin/dashboard");
      } else {
        setError("Invalid email or password");
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <Heart className="w-8 h-8 text-white fill-white" />
          </div>
          <h1 className="text-3xl mb-2">Blood Request System</h1>
          <p className="text-muted-foreground">Admin Portal</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Sign in to manage blood requests</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@bloodrequest.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white"
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">
                Demo Credentials:
              </p>
              <p className="text-sm">
                <strong>Email:</strong> admin@bloodrequest.com
              </p>
              <p className="text-sm">
                <strong>Password:</strong> admin123
              </p>
            </div> */}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Saving lives, one donation at a time
        </p>
      </div>
    </div>
  );
}
