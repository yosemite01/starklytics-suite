import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  BarChart3, 
  PieChart, 
  LineChart, 
  Table, 
  Save,
  Eye,
  Grid,
  Layout
} from "lucide-react";

const RPC_ENDPOINT = "https://36c4832f2e9b.ngrok-free.app";

const widgetTypes = [
  { type: "chart", name: "Bar Chart", icon: BarChart3 },
  { type: "pie", name: "Pie Chart", icon: PieChart },
  { type: "line", name: "Line Chart", icon: LineChart },
  { type: "table", name: "Data Table", icon: Table },
];

interface Widget {
  id: string;
  type: string;
  title: string;
  query: string;
  position: { x: number; y: number; w: number; h: number };
}

export default function DashboardBuilder() {
  const [dashboardName, setDashboardName] = useState("");
  const [dashboardDescription, setDashboardDescription] = useState("");
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);

  const addWidget = (type: string) => {
    const newWidget: Widget = {
      id: Date.now().toString(),
      type,
      title: `New ${type} Widget`,
      query: "SELECT * FROM starknet_transactions LIMIT 10",
      position: { x: 0, y: 0, w: 4, h: 4 }
    };
    setWidgets([...widgets, newWidget]);
  };

  const updateWidget = (id: string, updates: Partial<Widget>) => {
    setWidgets(widgets.map(w => w.id === id ? { ...w, ...updates } : w));
  };

  const saveDashboard = async () => {
    try {
      const dashboardData = {
        name: dashboardName,
        description: dashboardDescription,
        widgets,
        rpc_endpoint: RPC_ENDPOINT
      };
      
      console.log("Saving dashboard:", dashboardData);
      // TODO: Integrate with Supabase to save dashboard
    } catch (error) {
      console.error("Error saving dashboard:", error);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header 
          title="Dashboard Builder" 
          subtitle="Create and customize your analytics dashboards"
        />
        
        <main className="flex-1 p-6 space-y-6">
          {/* Dashboard Settings */}
          <Card className="glass border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Layout className="w-5 h-5" />
                <span>Dashboard Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dashboard-name">Dashboard Name</Label>
                  <Input
                    id="dashboard-name"
                    placeholder="Enter dashboard name"
                    value={dashboardName}
                    onChange={(e) => setDashboardName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rpc-endpoint">RPC Endpoint</Label>
                  <Input
                    id="rpc-endpoint"
                    value={RPC_ENDPOINT}
                    disabled
                    className="text-muted-foreground"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dashboard-description">Description</Label>
                <Textarea
                  id="dashboard-description"
                  placeholder="Describe your dashboard"
                  value={dashboardDescription}
                  onChange={(e) => setDashboardDescription(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Widget Palette */}
          <Card className="glass border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Grid className="w-5 h-5" />
                <span>Widget Palette</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {widgetTypes.map((widget) => (
                  <Button
                    key={widget.type}
                    variant="outline"
                    className="h-20 flex flex-col items-center space-y-2 hover:bg-primary/10 hover:border-primary"
                    onClick={() => addWidget(widget.type)}
                  >
                    <widget.icon className="w-6 h-6" />
                    <span className="text-sm">{widget.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Dashboard Canvas */}
          <Card className="glass border-border min-h-[400px]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Eye className="w-5 h-5" />
                <span>Dashboard Preview</span>
              </CardTitle>
              <div className="flex space-x-2">
                <Button onClick={saveDashboard} className="glow-primary">
                  <Save className="w-4 h-4 mr-2" />
                  Save Dashboard
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {widgets.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                  <Plus className="w-12 h-12 mb-4 opacity-50" />
                  <p>Add widgets from the palette above to start building your dashboard</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {widgets.map((widget) => (
                    <Card 
                      key={widget.id}
                      className={`cursor-pointer transition-all border-2 ${
                        selectedWidget === widget.id 
                          ? 'border-primary glow-primary' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedWidget(widget.id)}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">{widget.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-muted/50 rounded-lg h-32 flex items-center justify-center">
                          <span className="text-muted-foreground capitalize">
                            {widget.type} Preview
                          </span>
                        </div>
                        <div className="mt-2">
                          <Label className="text-xs text-muted-foreground">Query:</Label>
                          <code className="block text-xs bg-muted/30 p-1 rounded mt-1 truncate">
                            {widget.query}
                          </code>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Widget Configuration */}
          {selectedWidget && (
            <Card className="glass border-border">
              <CardHeader>
                <CardTitle>Widget Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(() => {
                  const widget = widgets.find(w => w.id === selectedWidget);
                  if (!widget) return null;
                  
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Widget Title</Label>
                        <Input
                          value={widget.title}
                          onChange={(e) => updateWidget(widget.id, { title: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Widget Type</Label>
                        <Input value={widget.type} disabled className="capitalize" />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <Label>SQL Query</Label>
                        <Textarea
                          value={widget.query}
                          onChange={(e) => updateWidget(widget.id, { query: e.target.value })}
                          placeholder="Enter your SQL query here"
                          className="font-mono text-sm"
                          rows={4}
                        />
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}