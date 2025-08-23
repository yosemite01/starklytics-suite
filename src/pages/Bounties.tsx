import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Clock, DollarSign, Users } from "lucide-react";

const bounties = [
  {
    id: 1,
    title: "Starknet DeFi TVL Analysis Dashboard",
    description: "Create a comprehensive dashboard showing Total Value Locked across all DeFi protocols on Starknet",
    reward: "500 STRK",
    deadline: "2024-02-15",
    status: "Active",
    participants: 12,
    difficulty: "Medium"
  },
  {
    id: 2,
    title: "NFT Market Trends Visualization",
    description: "Build interactive charts showing NFT trading volume, floor prices, and collection performance",
    reward: "750 STRK",
    deadline: "2024-02-20",
    status: "Active",
    participants: 8,
    difficulty: "Hard"
  },
  {
    id: 3,
    title: "Gas Usage Optimization Report",
    description: "Analyze gas consumption patterns and identify optimization opportunities",
    reward: "300 STRK",
    deadline: "2024-02-10",
    status: "Completed",
    participants: 15,
    difficulty: "Easy"
  }
];

const Bounties = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Header 
            title="Analytics Bounties" 
            subtitle="Contribute to Starknet analytics and earn rewards"
          />
          
          <main className="p-6 space-y-6">
            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="glass">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-8 h-8 text-chart-warning" />
                    <div>
                      <p className="text-2xl font-bold">24</p>
                      <p className="text-xs text-muted-foreground">Active Bounties</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="glass">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-8 h-8 text-chart-success" />
                    <div>
                      <p className="text-2xl font-bold">12.5K</p>
                      <p className="text-xs text-muted-foreground">Total Rewards (STRK)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="glass">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="w-8 h-8 text-chart-primary" />
                    <div>
                      <p className="text-2xl font-bold">156</p>
                      <p className="text-xs text-muted-foreground">Active Participants</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="glass">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-8 h-8 text-chart-secondary" />
                    <div>
                      <p className="text-2xl font-bold">48</p>
                      <p className="text-xs text-muted-foreground">Completed This Month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bounties List */}
            <div className="space-y-4">
              {bounties.map((bounty) => (
                <Card key={bounty.id} className="glass hover:shadow-elevated transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-xl">{bounty.title}</CardTitle>
                        <p className="text-muted-foreground">{bounty.description}</p>
                      </div>
                      <Badge 
                        variant={bounty.status === "Active" ? "default" : "secondary"}
                        className={bounty.status === "Active" ? "glow-primary" : ""}
                      >
                        {bounty.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-chart-success" />
                          <span className="font-semibold text-chart-success">{bounty.reward}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Due {bounty.deadline}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{bounty.participants} participants</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {bounty.difficulty}
                        </Badge>
                      </div>
                      <Button 
                        disabled={bounty.status === "Completed"}
                        className={bounty.status === "Active" ? "glow-primary" : ""}
                      >
                        {bounty.status === "Active" ? "Join Bounty" : "View Results"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Create Bounty */}
            <Card className="glass">
              <CardContent className="p-6 text-center">
                <Trophy className="w-12 h-12 text-chart-warning mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Create Your Own Bounty</h3>
                <p className="text-muted-foreground mb-4">
                  Have an analytics challenge? Create a bounty and let the community solve it.
                </p>
                <Button className="glow-primary">
                  Create New Bounty
                </Button>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Bounties;