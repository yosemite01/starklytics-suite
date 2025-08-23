import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Save, Download, History, Database } from "lucide-react";

export function QueryEditor() {
  const [query, setQuery] = useState(
    `-- Starknet Analytics Query
SELECT 
  block_number,
  transaction_count,
  gas_used,
  timestamp
FROM blocks 
WHERE timestamp >= NOW() - INTERVAL '7 days'
ORDER BY block_number DESC
LIMIT 100;`
  );
  const [isRunning, setIsRunning] = useState(false);

  const runQuery = async () => {
    setIsRunning(true);
    // Simulate query execution
    setTimeout(() => {
      setIsRunning(false);
    }, 2000);
  };

  return (
    <div className="space-y-4">
      {/* Query Editor Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Database className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">SQL Query Editor</h3>
          <Badge variant="secondary">
            Starknet Mainnet
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <History className="w-4 h-4 mr-2" />
            History
          </Button>
          <Button variant="outline" size="sm">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Query Editor */}
      <Card className="glass glow-chart">
        <CardContent className="p-0">
          <div className="border-b border-border">
            <div className="flex items-center justify-between px-4 py-2 bg-muted/20">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-chart-error rounded-full"></div>
                <div className="w-3 h-3 bg-chart-warning rounded-full"></div>
                <div className="w-3 h-3 bg-chart-success rounded-full"></div>
                <span className="ml-2 text-xs text-muted-foreground">query.sql</span>
              </div>
              <Button 
                onClick={runQuery}
                disabled={isRunning}
                className="glow-primary"
              >
                <Play className="w-4 h-4 mr-2" />
                {isRunning ? "Running..." : "Run Query"}
              </Button>
            </div>
          </div>
          <div className="relative">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-80 p-4 bg-transparent border-none resize-none focus:outline-none font-mono text-sm"
              placeholder="Enter your SQL query here..."
              spellCheck={false}
            />
            {/* Line numbers */}
            <div className="absolute left-0 top-0 p-4 text-xs text-muted-foreground font-mono select-none pointer-events-none">
              {query.split('\n').map((_, i) => (
                <div key={i} className="leading-5">
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Query Results */}
      {isRunning ? (
        <Card className="glass">
          <CardContent className="p-8 text-center">
            <div className="animate-pulse-glow">
              <Database className="w-12 h-12 text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Executing query...</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="glass">
          <CardContent className="p-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-2 text-muted-foreground">Block Number</th>
                    <th className="text-left p-2 text-muted-foreground">Transactions</th>
                    <th className="text-left p-2 text-muted-foreground">Gas Used</th>
                    <th className="text-left p-2 text-muted-foreground">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(5)].map((_, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-muted/20">
                      <td className="p-2 font-mono">{123456 - i}</td>
                      <td className="p-2">{Math.floor(Math.random() * 100) + 50}</td>
                      <td className="p-2 font-mono">{(Math.random() * 1000000).toFixed(0)}</td>
                      <td className="p-2 text-muted-foreground">
                        {new Date(Date.now() - i * 60000).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}