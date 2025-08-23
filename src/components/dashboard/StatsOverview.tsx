import { MetricCard } from "@/components/ui/metric-card";
import { BarChart3, Database, Users, Zap } from "lucide-react";

export function StatsOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Queries"
        value="12,456"
        change="+12% from last month"
        changeType="positive"
        trend="up"
        icon={Database}
        className="animate-fade-in"
      />
      <MetricCard
        title="Active Dashboards"
        value="234"
        change="+8% from last month"
        changeType="positive"
        trend="up"
        icon={BarChart3}
        className="animate-fade-in [animation-delay:100ms]"
      />
      <MetricCard
        title="Active Users"
        value="1,234"
        change="+23% from last month"
        changeType="positive"
        trend="up"
        icon={Users}
        className="animate-fade-in [animation-delay:200ms]"
      />
      <MetricCard
        title="Data Points"
        value="2.4M"
        change="+5% from last month"
        changeType="positive"
        trend="up"
        icon={Zap}
        className="animate-fade-in [animation-delay:300ms]"
      />
    </div>
  );
}