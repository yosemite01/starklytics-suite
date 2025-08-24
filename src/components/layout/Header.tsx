import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Wallet, 
  User, 
  Moon, 
  Sun,
  Zap,
  Activity
} from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const [isDark, setIsDark] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('light');
  };

  const connectWallet = () => {
    setIsConnected(!isConnected);
  };

  return (
    <header className="glass border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Network Status */}
          {/* Docs Link */}
          <Link to="/docs">
            <Button variant="outline" size="sm" className="ml-2">
              Docs
            </Button>
          </Link>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Activity className="w-4 h-4 text-chart-success animate-pulse" />
              <span className="text-xs text-muted-foreground">Mainnet</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              <Zap className="w-3 h-3 mr-1" />
              Live
            </Badge>
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-chart-error rounded-full animate-pulse" />
          </Button>

          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          {/* Wallet Connection */}
          <Button 
            variant={isConnected ? "default" : "outline"}
            onClick={connectWallet}
            className={isConnected ? "glow-primary" : ""}
          >
            <Wallet className="w-4 h-4 mr-2" />
            {isConnected ? "0x1234...5678" : "Connect Wallet"}
          </Button>

          {/* User Menu */}
          <Button variant="ghost" size="icon">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}