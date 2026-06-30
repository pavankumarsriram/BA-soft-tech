import React from 'react';
import {
  UserCheck,
  Zap,
  Terminal,
  Cloud,
  RefreshCw,
  Server,
  UserPlus,
  TrendingUp,
  Users,
  Globe,
  Cpu,
  Briefcase,
  Target,
  Code,
  Layers,
  Smartphone,
  MousePointer,
  GitBranch,
  Brain,
  Database,
  BarChart2,
  Settings,
  Smile,
  Activity,
  Shield,
  CheckCircle
} from 'lucide-react';

interface IconRendererProps {
  name: string;
  className?: string;
}

export default function IconRenderer({ name, className = 'h-5 w-5' }: IconRendererProps) {
  switch (name) {
    case 'UserCheck': return <UserCheck className={className} />;
    case 'Zap': return <Zap className={className} />;
    case 'Terminal': return <Terminal className={className} />;
    case 'Cloud': return <Cloud className={className} />;
    case 'RefreshCw': return <RefreshCw className={className} />;
    case 'Server': return <Server className={className} />;
    case 'UserPlus': return <UserPlus className={className} />;
    case 'TrendingUp': return <TrendingUp className={className} />;
    case 'Users': return <Users className={className} />;
    case 'Globe': return <Globe className={className} />;
    case 'Cpu': return <Cpu className={className} />;
    case 'Briefcase': return <Briefcase className={className} />;
    case 'Target': return <Target className={className} />;
    case 'Code': return <Code className={className} />;
    case 'Layers': return <Layers className={className} />;
    case 'Smartphone': return <Smartphone className={className} />;
    case 'MousePointer': return <MousePointer className={className} />;
    case 'GitBranch': return <GitBranch className={className} />;
    case 'Brain': return <Brain className={className} />;
    case 'Database': return <Database className={className} />;
    case 'BarChart2': return <BarChart2 className={className} />;
    case 'Settings': return <Settings className={className} />;
    case 'Smile': return <Smile className={className} />;
    case 'Activity': return <Activity className={className} />;
    case 'Shield': return <Shield className={className} />;
    case 'CheckCircle': return <CheckCircle className={className} />;
    default: return <Zap className={className} />;
  }
}
