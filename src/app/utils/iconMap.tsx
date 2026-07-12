import React, { ComponentType } from 'react';
import type { LucideProps } from 'lucide-react';
import {
  AlertCircle, AlertTriangle, Flag, Zap, Circle, CheckCircle2, XCircle,
  Clock, Star, Shield, Layers, Bug, Monitor, Sparkles, Network, PenTool,
  Pointer, FileText, Eye, BarChart2, TrendingUp, Tag, Bookmark, Wrench,
  Target, Activity, Flame, ArrowUp, Minus, MessageSquare, Lightbulb,
} from 'lucide-react';

export const ICON_MAP: Record<string, ComponentType<LucideProps>> = {
  AlertCircle,
  AlertTriangle,
  Flag,
  Zap,
  Circle,
  CheckCircle2,
  XCircle,
  Clock,
  Star,
  Shield,
  Layers,
  Bug,
  Monitor,
  Sparkles,
  Network,
  PenTool,
  Pointer,
  FileText,
  Eye,
  BarChart2,
  TrendingUp,
  Tag,
  Bookmark,
  Wrench,
  Target,
  Activity,
  Flame,
  ArrowUp,
  Minus,
  MessageSquare,
  Lightbulb,
};

export const ICON_KEYS: string[] = Object.keys(ICON_MAP);

export function DynamicIcon({
  name,
  className,
  strokeWidth,
  style,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}) {
  const Icon = ICON_MAP[name] ?? AlertCircle;
  return <Icon className={className} strokeWidth={strokeWidth} style={style} />;
}

export const COLOR_PRESETS: string[] = [
  '#C0375A',
  '#D95C4A',
  '#D97B3A',
  '#E8B84B',
  '#3AA68A',
  '#3A9EB5',
  '#3A5CA6',
  '#7B5EA6',
  '#6BB5AA',
  '#4274BA',
  '#6B7280',
  '#FF6B6B',
  '#FFD93D',
  '#6BCB77',
  '#4D96FF',
  '#FF6FC8',
  '#9B5DE5',
  '#F9FAFB',
];
