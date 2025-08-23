import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { QueryEditor } from "@/components/query/QueryEditor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";
import { TrendingUp, Activity, Award, Zap } from "lucide-react";

const chartData = [
  { name: "Jan", transactions: 4000, value: 2400 },
  { name: "Feb", transactions: 3000, value: 1398 },
  { name: "Mar", transactions: 2000, value: 9800 },
  { name: "Apr", transactions: 2780, value: 3908 },
  { name: "May", transactions: 1890, value: 4800 },
  { name: "Jun", transactions: 2390, value: 3800 },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Header 
            title="Analytics Dashboard" 
            subtitle="Monitor Starknet network activity and performance"
          />
          
          <main className="p-6 space-y-6">
            {/* Stats Overview */}
            <StatsOverview />

            {/* Charts Section */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="glass glow-chart">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-chart-primary" />
                    <span>Transaction Volume</span>
                    <Badge variant="secondary">Live</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="transactionGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--chart-primary))" stopOpacity={0.8}/>
                          <stop offset="100%" stopColor="hsl(var(--chart-primary))" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px"
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="transactions" 
                        stroke="hsl(var(--chart-primary))" 
                        fill="url(#transactionGradient)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-chart-secondary" />
                    <span>Network Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px"
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="hsl(var(--chart-secondary))" 
                        strokeWidth={3}
                        dot={{ fill: "hsl(var(--chart-secondary))", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Query Editor Section */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-primary animate-pulse-glow" />
                  <span>Quick Query</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <QueryEditor />
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-chart-warning" />
                  <span>Recent Bounties</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { title: "Starknet DeFi TVL Analysis", reward: "500 STRK", status: "Active" },
                    { title: "Transaction Fee Optimization", reward: "750 STRK", status: "Completed" },
                    { title: "NFT Market Analytics", reward: "300 STRK", status: "Active" },
                  ].map((bounty, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/20 transition-all">
                      <div>
                        <h4 className="font-medium">{bounty.title}</h4>
                        <p className="text-sm text-muted-foreground">Reward: {bounty.reward}</p>
                      </div>
                      <Badge variant={bounty.status === "Active" ? "default" : "secondary"}>
                        {bounty.status}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button className="w-full">
                    View All Bounties
                  </Button>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
