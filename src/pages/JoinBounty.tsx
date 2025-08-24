import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function JoinBounty() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Header title="Join Bounty" subtitle="Participate in a bounty challenge" />
          <main className="p-6">
            <Card className="glass max-w-xl mx-auto">
              <CardHeader>
                <CardTitle>Join a Bounty</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">This is a placeholder for joining a bounty. Integrate with bounty details and join logic as needed.</p>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}