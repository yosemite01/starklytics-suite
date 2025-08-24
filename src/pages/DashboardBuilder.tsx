import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/database.types";
import type { DashboardsInsert } from '@/integrations/supabase/dashboard.types';
import { Plus, BarChart3, PieChart, LineChart, Table, Save, Eye, Grid, Layout, History, Download } from "lucide-react";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
// The resizable styles are included in react-grid-layout

// Constants
const RPC_ENDPOINT = "https://36c4832f2e9b.ngrok-free.app";

const BREAKPOINTS = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
const COLS = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };

const INITIAL_LAYOUT: Layout = {
  lg: [],
  md: [],
  sm: [],
  xs: [],
  xxs: []
};

const widgetTypes = [
  { type: "chart" as WidgetType, name: "Bar Chart", icon: BarChart3 },
  { type: "pie" as WidgetType, name: "Pie Chart", icon: PieChart },
  { type: "line" as WidgetType, name: "Line Chart", icon: LineChart },
  { type: "table" as WidgetType, name: "Table", icon: Table },
];

// Types
type BreakPoint = "lg" | "md" | "sm" | "xs" | "xxs";
type WidgetType = "chart" | "pie" | "line" | "table";

interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Layout {
  lg: LayoutItem[];
  md: LayoutItem[];
  sm: LayoutItem[];
  xs: LayoutItem[];
  xxs: LayoutItem[];
}

interface SerializedLayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface SerializedLayout {
  lg: SerializedLayoutItem[];
  md: SerializedLayoutItem[];
  sm: SerializedLayoutItem[];
  xs: SerializedLayoutItem[];
  xxs: SerializedLayoutItem[];
}

interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  query: string;
  x: number;
  y: number;
  w: number;
  h: number;
  data?: Json;
}

interface DashboardState {
  layouts: Layout;
  widgets: Widget[];
}

// Helper functions
const ResponsiveGridLayout = WidthProvider(Responsive);

const serializeDashboardState = (state: DashboardState) => ({
  layouts: state.layouts,
  widgets: state.widgets
});

// Main Component
function DashboardBuilder() {
  const { toast } = useToast();
  const [dashboardName, setDashboardName] = useState("");
  const [dashboardDescription, setDashboardDescription] = useState("");
  const [dashboardState, setDashboardState] = useState<DashboardState>({
    layouts: INITIAL_LAYOUT,
    widgets: []
  });
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);

  const addWidget = (type: WidgetType) => {
    const newWidget: Widget = {
      id: `widget-${Date.now()}`,
      type,
      title: `New ${type} widget`,
      query: "",
      x: (dashboardState.widgets.length * 4) % COLS.lg,
      y: Math.floor(dashboardState.widgets.length * 4 / COLS.lg) * 4,
      w: 4,
      h: 4
    };
    
    const layout = {
      i: newWidget.id,
      x: newWidget.x,
      y: newWidget.y,
      w: newWidget.w,
      h: newWidget.h
    };

    setDashboardState(prev => ({
      ...prev,
      layouts: {
        ...prev.layouts,
        lg: [...prev.layouts.lg, layout],
        md: [...prev.layouts.md, {...layout, w: Math.min(layout.w, COLS.md)}],
        sm: [...prev.layouts.sm, {...layout, w: Math.min(layout.w, COLS.sm)}],
        xs: [...prev.layouts.xs, {...layout, w: Math.min(layout.w, COLS.xs)}],
        xxs: [...prev.layouts.xxs, {...layout, w: Math.min(layout.w, COLS.xxs)}],
      },
      widgets: [...prev.widgets, newWidget]
    }));
  };

  const updateWidget = (id: string, updates: Partial<Widget>) => {
    setDashboardState(prev => ({
      ...prev,
      widgets: prev.widgets.map(w => w.id === id ? { ...w, ...updates } : w)
    }));
  };

  const onLayoutChange = (_: any[], layouts: Layout) => {
    setDashboardState(prev => ({
      ...prev,
      layouts
    }));
  };

  const saveDashboard = async () => {
    try {
      if (!dashboardName) {
        toast({
          title: "Error",
          description: "Please enter a dashboard name",
          variant: "destructive",
        });
        return;
      }

      const session = await supabase.auth.getSession();
      if (!session.data.session?.user) {
        toast({
          title: "Error",
          description: "Please sign in to save dashboards",
          variant: "destructive",
        });
        return;
      }

      const serializedState = serializeDashboardState(dashboardState);
      const dashboardData: DashboardsInsert = {
        user_id: session.data.session.user.id,
        name: dashboardName,
        description: dashboardDescription,
        layouts: serializedState.layouts as Json,
        widgets: serializedState.widgets as Json,
        rpc_endpoint: RPC_ENDPOINT,
      };

      const { error } = await supabase
        .from('dashboards')
        .insert([dashboardData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Dashboard saved successfully",
      });
    } catch (error) {
      console.error("Error saving dashboard:", error);
      toast({
        title: "Error",
        description: "Failed to save dashboard",
        variant: "destructive",
      });
    }
  };

  const loadHistory = async () => {
    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session?.user) {
        toast({
          title: "Error",
          description: "Please sign in to view dashboard history",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('dashboards')
        .select('*')
        .eq('user_id', session.data.session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Found ${data.length} saved dashboards`,
      });
      
      // TODO: Show history in a modal
      console.log("Dashboard history:", data);
    } catch (error) {
      console.error("Error loading history:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard history",
        variant: "destructive",
      });
    }
  };

  const exportDashboard = () => {
    try {
      const dashboardData = {
        name: dashboardName,
        description: dashboardDescription,
        layouts: dashboardState.layouts,
        widgets: dashboardState.widgets,
        rpc_endpoint: RPC_ENDPOINT,
      };

      const dataStr = JSON.stringify(dashboardData, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportName = `${dashboardName || 'dashboard'}_${Date.now()}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportName);
      linkElement.click();

      toast({
        title: "Success",
        description: "Dashboard exported successfully",
      });
    } catch (error) {
      console.error("Error exporting dashboard:", error);
      toast({
        title: "Error",
        description: "Failed to export dashboard",
        variant: "destructive",
      });
    }
  };

  // Get selected widget for configuration
  const selectedWidgetData = dashboardState.widgets.find(w => w.id === selectedWidget);

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
                <Button onClick={loadHistory} variant="outline">
                  <History className="w-4 h-4 mr-2" />
                  History
                </Button>
                <Button onClick={exportDashboard} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button onClick={saveDashboard} className="glow-primary">
                  <Save className="w-4 h-4 mr-2" />
                  Save Dashboard
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {dashboardState.widgets.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                  <Plus className="w-12 h-12 mb-4 opacity-50" />
                  <p>Add widgets from the palette above to start building your dashboard</p>
                </div>
              ) : (
                <ResponsiveGridLayout
                  className="layout"
                  layouts={dashboardState.layouts}
                  onLayoutChange={onLayoutChange}
                  breakpoints={BREAKPOINTS}
                  cols={COLS}
                  rowHeight={60}
                  isDraggable={true}
                  isResizable={true}
                  margin={[10, 10]}
                >
                  {dashboardState.widgets.map((widget) => (
                    <div key={widget.id} data-grid={{ x: widget.x, y: widget.y, w: widget.w, h: widget.h }}>
                      <Card
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
                              {widget.query || "No query defined"}
                            </code>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </ResponsiveGridLayout>
              )}
            </CardContent>
          </Card>

          {/* Widget Configuration */}
          {selectedWidget && selectedWidgetData && (
            <Card className="glass border-border">
              <CardHeader>
                <CardTitle>Widget Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Widget Title</Label>
                    <Input
                      value={selectedWidgetData.title}
                      onChange={(e) => updateWidget(selectedWidgetData.id, { title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Widget Type</Label>
                    <Input value={selectedWidgetData.type} disabled className="capitalize" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label>SQL Query</Label>
                    <Textarea
                      value={selectedWidgetData.query}
                      onChange={(e) => updateWidget(selectedWidgetData.id, { query: e.target.value })}
                      placeholder="Enter your SQL query here"
                      className="font-mono text-sm"
                      rows={4}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
      <Toaster />
    </div>
  );
}

export default DashboardBuilder;