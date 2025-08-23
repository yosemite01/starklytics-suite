import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts";
import { 
  TrendingUp, 
  BarChart3, 
  PieChart as PieChartIcon, 
  LineChart as LineChartIcon,
  Download,
  RefreshCw,
  Activity
} from "lucide-react";

const RPC_ENDPOINT = "https://36c4832f2e9b.ngrok-free.app";

// Sample data - would be fetched from RPC endpoint
const sampleData = [
  { name: "Jan", transactions: 4000, volume: 2400, users: 240 },
  { name: "Feb", transactions: 3000, volume: 1398, users: 221 },
  { name: "Mar", transactions: 2000, volume: 9800, users: 229 },
  { name: "Apr", transactions: 2780, volume: 3908, users: 200 },
  { name: "May", transactions: 1890, volume: 4800, users: 218 },
  { name: "Jun", transactions: 2390, volume: 3800, users: 250 },
];

const pieData = [
  { name: "DeFi", value: 400, color: "hsl(var(--chart-1))" },
  { name: "NFT", value: 300, color: "hsl(var(--chart-2))" },
  { name: "Gaming", value: 200, color: "hsl(var(--chart-3))" },
  { name: "Social", value: 100, color: "hsl(var(--chart-4))" },
];

type ChartType = "bar" | "line" | "area" | "pie";
type DataMetric = "transactions" | "volume" | "users";

export default function DataVisualization() {
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [selectedMetric, setSelectedMetric] = useState<DataMetric>("transactions");
  const [data, setData] = useState(sampleData);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Simulate API call to RPC endpoint
      console.log(`Fetching data from ${RPC_ENDPOINT}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In real implementation, fetch from your RPC endpoint
      setData(sampleData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedMetric]);

  const renderChart = () => {
    const commonProps = {
      width: "100%",
      height: 300,
      data: data,
    };

    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer {...commonProps}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--background))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Bar dataKey={selectedMetric} fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case "line":
        return (
          <ResponsiveContainer {...commonProps}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--background))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Line 
                type="monotone" 
                dataKey={selectedMetric} 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case "area":
        return (
          <ResponsiveContainer {...commonProps}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--background))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Area 
                type="monotone" 
                dataKey={selectedMetric} 
                stroke="hsl(var(--primary))" 
                fill="hsl(var(--primary))"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  const exportChart = () => {
    // Export functionality
    console.log("Exporting chart data:", { chartType, selectedMetric, data });
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header 
          title="Data Visualization" 
          subtitle="Interactive charts and analytics for Starknet data"
        />
        
        <main className="flex-1 p-6 space-y-6">
          {/* Controls */}
          <Card className="glass border-border">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>Visualization Controls</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  Live Data
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium">Chart Type:</label>
                  <Select value={chartType} onValueChange={(value: ChartType) => setChartType(value)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bar">
                        <div className="flex items-center space-x-2">
                          <BarChart3 className="w-4 h-4" />
                          <span>Bar Chart</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="line">
                        <div className="flex items-center space-x-2">
                          <LineChartIcon className="w-4 h-4" />
                          <span>Line Chart</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="area">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="w-4 h-4" />
                          <span>Area Chart</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="pie">
                        <div className="flex items-center space-x-2">
                          <PieChartIcon className="w-4 h-4" />
                          <span>Pie Chart</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {chartType !== "pie" && (
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium">Metric:</label>
                    <Select value={selectedMetric} onValueChange={(value: DataMetric) => setSelectedMetric(value)}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="transactions">Transactions</SelectItem>
                        <SelectItem value="volume">Volume</SelectItem>
                        <SelectItem value="users">Users</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex items-center space-x-2 ml-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchData}
                    disabled={loading}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportChart}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Chart */}
          <Card className="glass border-border">
            <CardHeader>
              <CardTitle className="capitalize">
                {chartType} Chart - {chartType !== "pie" ? selectedMetric : "Category Distribution"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-80">
                  <div className="flex flex-col items-center space-y-4">
                    <RefreshCw className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading chart data...</p>
                  </div>
                </div>
              ) : (
                <div className="h-80">
                  {renderChart()}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Data Source Info */}
          <Card className="glass border-border">
            <CardHeader>
              <CardTitle>Data Source</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-sm font-medium">RPC Endpoint</p>
                    <p className="text-xs text-muted-foreground">{RPC_ENDPOINT}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Network</p>
                    <p className="text-xs text-muted-foreground">Starknet Mainnet</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Last Updated</p>
                    <p className="text-xs text-muted-foreground">{new Date().toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}