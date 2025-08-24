import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BarChart3, PieChart, LineChart, Table } from "lucide-react";
import { Chart } from "@/components/ui/chart";

const visualTypes = [
  { id: "bar", label: "Bar Chart", icon: BarChart3 },
  { id: "pie", label: "Pie Chart", icon: PieChart },
  { id: "line", label: "Line Chart", icon: LineChart },
  { id: "table", label: "Table", icon: Table },
];

interface QueryVisualizerProps {
  data: any[];
  onVisualizationSave: (config: VisualizationConfig) => void;
}

export interface VisualizationConfig {
  type: string;
  xAxis?: string;
  yAxis?: string;
  aggregation?: string;
}

export function QueryVisualizer({ data, onVisualizationSave }: QueryVisualizerProps) {
  const [config, setConfig] = useState<VisualizationConfig>({
    type: "bar",
    xAxis: "",
    yAxis: "",
  });

  const columns = data.length > 0 ? Object.keys(data[0]) : [];
  const numericColumns = columns.filter(col => 
    data.some(row => typeof row[col] === 'number')
  );

  const handleSave = () => {
    onVisualizationSave(config);
  };

  return (
    <Card className="mt-4">
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Visualization Type</Label>
            <Select 
              value={config.type} 
              onValueChange={value => setConfig(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {visualTypes.map(type => (
                  <SelectItem key={type.id} value={type.id}>
                    <div className="flex items-center">
                      <type.icon className="w-4 h-4 mr-2" />
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>X-Axis</Label>
            <Select 
              value={config.xAxis || ""} 
              onValueChange={value => setConfig(prev => ({ ...prev, xAxis: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {columns.map(col => (
                  <SelectItem key={col} value={col}>{col}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Y-Axis</Label>
            <Select 
              value={config.yAxis || ""} 
              onValueChange={value => setConfig(prev => ({ ...prev, yAxis: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {numericColumns.map(col => (
                  <SelectItem key={col} value={col}>{col}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(config.type === "bar" || config.type === "pie") && (
            <div className="space-y-2">
              <Label>Aggregation</Label>
              <Select 
                value={config.aggregation || "sum"} 
                onValueChange={value => setConfig(prev => ({ ...prev, aggregation: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sum">Sum</SelectItem>
                  <SelectItem value="avg">Average</SelectItem>
                  <SelectItem value="count">Count</SelectItem>
                  <SelectItem value="min">Min</SelectItem>
                  <SelectItem value="max">Max</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave}>
            Save Visualization
          </Button>
        </div>

        <div className="h-64">
          {config.xAxis && config.yAxis && (
            <Chart 
              type={config.type as any}
              data={data}
              xAxis={config.xAxis}
              yAxis={config.yAxis}
              aggregation={config.aggregation}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
