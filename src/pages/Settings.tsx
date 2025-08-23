import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Database, 
  Monitor, 
  Globe,
  Save,
  RefreshCw,
  Key,
  AlertTriangle,
  Check
} from "lucide-react";

const RPC_ENDPOINT = "https://36c4832f2e9b.ngrok-free.app";

interface UserSettings {
  username: string;
  email: string;
  bio: string;
  role: string;
  theme: "dark" | "light" | "system";
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    bounties: boolean;
    queries: boolean;
  };
  privacy: {
    profilePublic: boolean;
    showActivity: boolean;
    allowMessages: boolean;
  };
  api: {
    rpcEndpoint: string;
    maxQueries: number;
    timeout: number;
  };
}

export default function Settings() {
  const [settings, setSettings] = useState<UserSettings>({
    username: "analytics_user",
    email: "user@starklytics.dev",
    bio: "Data analyst exploring Starknet ecosystem",
    role: "Analyst",
    theme: "dark",
    language: "en",
    timezone: "UTC",
    notifications: {
      email: true,
      push: false,
      bounties: true,
      queries: true,
    },
    privacy: {
      profilePublic: false,
      showActivity: true,
      allowMessages: true,
    },
    api: {
      rpcEndpoint: RPC_ENDPOINT,
      maxQueries: 100,
      timeout: 30000,
    },
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const updateSettings = (section: keyof UserSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: typeof prev[section] === "object" 
        ? { ...prev[section], [key]: value }
        : value
    }));
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Saving settings:", settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    // Reset settings to default values
    setSettings({
      username: "analytics_user",
      email: "user@starklytics.dev",
      bio: "",
      role: "User",
      theme: "system",
      language: "en",
      timezone: "UTC",
      notifications: {
        email: true,
        push: false,
        bounties: true,
        queries: true,
      },
      privacy: {
        profilePublic: false,
        showActivity: true,
        allowMessages: true,
      },
      api: {
        rpcEndpoint: RPC_ENDPOINT,
        maxQueries: 50,
        timeout: 30000,
      },
    });
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header 
          title="Settings" 
          subtitle="Manage your account and application preferences"
        />
        
        <main className="flex-1 p-6 space-y-6">
          {/* Save Controls */}
          <Card className="glass border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <SettingsIcon className="w-5 h-5" />
                  <span className="font-medium">Application Settings</span>
                  {saved && (
                    <Badge variant="secondary" className="text-green-400">
                      <Check className="w-3 h-3 mr-1" />
                      Saved
                    </Badge>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={resetToDefaults}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                  <Button onClick={saveSettings} disabled={saving} className="glow-primary">
                    {saving ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Settings */}
          <Card className="glass border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Profile Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={settings.username}
                    onChange={(e) => updateSettings("username", "", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => updateSettings("email", "", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  value={settings.bio}
                  onChange={(e) => updateSettings("bio", "", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={settings.role} onValueChange={(value) => updateSettings("role", "", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="User">User</SelectItem>
                    <SelectItem value="Analyst">Analyst</SelectItem>
                    <SelectItem value="Developer">Developer</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card className="glass border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Monitor className="w-5 h-5" />
                <span>Appearance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select value={settings.theme} onValueChange={(value: "dark" | "light" | "system") => updateSettings("theme", "", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={settings.language} onValueChange={(value) => updateSettings("language", "", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={settings.timezone} onValueChange={(value) => updateSettings("timezone", "", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">Eastern Time</SelectItem>
                      <SelectItem value="PST">Pacific Time</SelectItem>
                      <SelectItem value="CET">Central European</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="glass border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={settings.notifications.email}
                    onCheckedChange={(checked) => updateSettings("notifications", "email", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Browser push notifications</p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={settings.notifications.push}
                    onCheckedChange={(checked) => updateSettings("notifications", "push", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="bounty-notifications">Bounty Updates</Label>
                    <p className="text-sm text-muted-foreground">New bounties and submissions</p>
                  </div>
                  <Switch
                    id="bounty-notifications"
                    checked={settings.notifications.bounties}
                    onCheckedChange={(checked) => updateSettings("notifications", "bounties", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="query-notifications">Query Results</Label>
                    <p className="text-sm text-muted-foreground">Query completion notifications</p>
                  </div>
                  <Switch
                    id="query-notifications"
                    checked={settings.notifications.queries}
                    onCheckedChange={(checked) => updateSettings("notifications", "queries", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card className="glass border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Privacy & Security</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="public-profile">Public Profile</Label>
                    <p className="text-sm text-muted-foreground">Make your profile visible to others</p>
                  </div>
                  <Switch
                    id="public-profile"
                    checked={settings.privacy.profilePublic}
                    onCheckedChange={(checked) => updateSettings("privacy", "profilePublic", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-activity">Show Activity</Label>
                    <p className="text-sm text-muted-foreground">Display your recent activity</p>
                  </div>
                  <Switch
                    id="show-activity"
                    checked={settings.privacy.showActivity}
                    onCheckedChange={(checked) => updateSettings("privacy", "showActivity", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allow-messages">Allow Messages</Label>
                    <p className="text-sm text-muted-foreground">Receive messages from other users</p>
                  </div>
                  <Switch
                    id="allow-messages"
                    checked={settings.privacy.allowMessages}
                    onCheckedChange={(checked) => updateSettings("privacy", "allowMessages", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Settings */}
          <Card className="glass border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="w-5 h-5" />
                <span>API Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rpc-endpoint">RPC Endpoint</Label>
                  <Input
                    id="rpc-endpoint"
                    value={settings.api.rpcEndpoint}
                    onChange={(e) => updateSettings("api", "rpcEndpoint", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Starknet RPC endpoint for data queries</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="max-queries">Max Queries per Hour</Label>
                    <Input
                      id="max-queries"
                      type="number"
                      value={settings.api.maxQueries}
                      onChange={(e) => updateSettings("api", "maxQueries", parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeout">Query Timeout (ms)</Label>
                    <Input
                      id="timeout"
                      type="number"
                      value={settings.api.timeout}
                      onChange={(e) => updateSettings("api", "timeout", parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="glass border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                <span>Danger Zone</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
                <div>
                  <p className="font-medium">Delete Account</p>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <Button variant="destructive" size="sm">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}