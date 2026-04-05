import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/card";
import { Input } from "../components/input";
import { Label } from "../components/label";
import { Switch } from "../components/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/table";
import { Badge } from "../components/badge";
import {
  Heart,
  ArrowLeft,
  Plus,
  Edit2,
  UserX,
  Save,
  Palette,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

interface AppSettings {
  primaryColor: string;
  defaultExpiryHours: number;
  allowEditBeforeApproval: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Volunteer";
  status: "Active" | "Disabled";
}

// Mock data - in real app, this would come from backend
const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@bloodrequest.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: "2",
    name: "John Volunteer",
    email: "john@bloodrequest.com",
    role: "Volunteer",
    status: "Active",
  },
];

export default function Settings() {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [settings, setSettings] = useState<AppSettings>({
    primaryColor: "#E53935",
    defaultExpiryHours: 5,
    allowEditBeforeApproval: true,
  });
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "Volunteer" as "Admin" | "Volunteer",
  });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);

  useEffect(() => {
    if (!auth.accessToken) {
      navigate("/");
      return;
    }
    // Load settings from localStorage
    const savedSettings = localStorage.getItem("appSettings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, [navigate]);

  const handleSaveSettings = () => {
    localStorage.setItem("appSettings", JSON.stringify(settings));
    toast.success("Settings saved successfully!");
  };

  const handleCreateUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error("Please fill all fields");
      return;
    }

    const user: User = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: "Active",
    };

    setUsers([...users, user]);
    setNewUser({ name: "", email: "", password: "", role: "Volunteer" });
    setIsCreateUserOpen(false);
    toast.success(`User ${user.name} created successfully!`);
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? {
              ...user,
              status:
                user.status === "Active"
                  ? ("Disabled" as const)
                  : ("Active" as const),
            }
          : user,
      ),
    );
    toast.success("User status updated");
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsEditUserOpen(true);
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;

    setUsers(
      users.map((user) => (user.id === editingUser.id ? editingUser : user)),
    );
    setIsEditUserOpen(false);
    setEditingUser(null);
    toast.success("User updated successfully!");
  };

  const presetColors = [
    { name: "Red", value: "#E53935" },
    { name: "Blue", value: "#1E88E5" },
    { name: "Green", value: "#43A047" },
    { name: "Purple", value: "#8E24AA" },
    { name: "Orange", value: "#FB8C00" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/admin/dashboard")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <div>
                <h1 className="text-xl">Settings</h1>
                <p className="text-sm text-muted-foreground">
                  Configure system preferences
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Theme & Appearance */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                <CardTitle>Theme & Appearance</CardTitle>
              </div>
              <CardDescription>
                Customize the primary color used in generated blood request
                images
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Primary Color</Label>

                {/* Preset Colors */}
                <div className="flex flex-wrap gap-3">
                  {presetColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() =>
                        setSettings({ ...settings, primaryColor: color.value })
                      }
                      className={`w-12 h-12 rounded-lg border-2 transition-all ${
                        settings.primaryColor === color.value
                          ? "border-gray-900 scale-110"
                          : "border-gray-200 hover:scale-105"
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}

                  {/* Custom Color Picker */}
                  <div className="relative">
                    <input
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          primaryColor: e.target.value,
                        })
                      }
                      className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
                      title="Custom color"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Selected:</span>
                  <code className="px-2 py-1 bg-muted rounded">
                    {settings.primaryColor}
                  </code>
                </div>
              </div>

              {/* Preview Card */}
              <div className="space-y-2">
                <Label>Preview</Label>
                <div
                  className="relative w-full max-w-md aspect-square rounded-lg overflow-hidden shadow-lg"
                  style={{ backgroundColor: settings.primaryColor }}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8 text-center">
                    <div className="mb-4">
                      <Heart className="w-16 h-16 fill-white" />
                    </div>
                    <h2 className="text-3xl font-bold mb-2">URGENT</h2>
                    <h3 className="text-5xl font-bold mb-4">O+</h3>
                    <p className="text-xl mb-2">Blood Needed</p>
                    <div className="text-sm opacity-90">
                      <p className="font-medium">City General Hospital</p>
                      <p>Contact: +91 98765 43210</p>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 bg-white text-gray-900 px-3 py-1 rounded-full text-xs font-medium">
                    Preview
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Request Link Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Request Link Configuration</CardTitle>
              <CardDescription>
                Set default values for generated request links
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="expiry">Default Expiry Time (hours)</Label>
                <Input
                  id="expiry"
                  type="number"
                  min="1"
                  max="24"
                  value={settings.defaultExpiryHours}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      defaultExpiryHours: parseInt(e.target.value) || 5,
                    })
                  }
                  className="max-w-xs"
                />
                <p className="text-sm text-muted-foreground">
                  Links will expire after this many hours by default
                </p>
              </div>

              <div className="flex items-center justify-between max-w-xl">
                <div className="space-y-0.5">
                  <Label htmlFor="allow-edit">
                    Allow editing before approval
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Users can edit their submitted requests before admin
                    approval
                  </p>
                </div>
                <Switch
                  id="allow-edit"
                  checked={settings.allowEditBeforeApproval}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      allowEditBeforeApproval: checked,
                    })
                  }
                />
              </div>

              <Button onClick={handleSaveSettings}>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>

          {/* User Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    Manage admin and volunteer users
                  </CardDescription>
                </div>
                <Dialog
                  open={isCreateUserOpen}
                  onOpenChange={setIsCreateUserOpen}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create New User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New User</DialogTitle>
                      <DialogDescription>
                        Add a new admin or volunteer to the system
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          placeholder="Enter full name"
                          value={newUser.name}
                          onChange={(e) =>
                            setNewUser({ ...newUser, name: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="email@example.com"
                          value={newUser.email}
                          onChange={(e) =>
                            setNewUser({ ...newUser, email: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter password"
                          value={newUser.password}
                          onChange={(e) =>
                            setNewUser({ ...newUser, password: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select
                          value={newUser.role}
                          onValueChange={(value) =>
                            setNewUser({
                              ...newUser,
                              role: value as "Admin" | "Volunteer",
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Volunteer">Volunteer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleCreateUser} className="w-full">
                        Create User
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.name}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.role === "Admin" ? "default" : "secondary"
                            }
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.status === "Active" ? "default" : "outline"
                            }
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditUser(user)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleUserStatus(user.id)}
                            >
                              <UserX className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and role
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editingUser.name}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select
                  value={editingUser.role}
                  onValueChange={(value) =>
                    setEditingUser({
                      ...editingUser,
                      role: value as "Admin" | "Volunteer",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Volunteer">Volunteer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleUpdateUser} className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  Update User
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditUserOpen(false);
                    setEditingUser(null);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
