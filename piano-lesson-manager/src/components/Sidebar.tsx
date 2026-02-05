"use client";

import { useState } from "react";
import {
    Users,
    Wallet,
    FileText,
    Calendar,
    Music,
    LayoutDashboard,
    ChevronRight,
} from "lucide-react";

type View = "dashboard" | "students" | "finance" | "reports" | "schedule";

interface SidebarProps {
    activeView: View;
    onViewChange: (view: View) => void;
}

const menuItems: { id: View; label: string; icon: React.ElementType }[] = [
    { id: "dashboard", label: "ダッシュボード", icon: LayoutDashboard },
    { id: "students", label: "生徒管理", icon: Users },
    { id: "finance", label: "月謝・経費", icon: Wallet },
    { id: "reports", label: "レッスン報告", icon: FileText },
    { id: "schedule", label: "スケジュール", icon: Calendar },
];

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
    return (
        <aside className="w-64 h-screen bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 flex flex-col p-6 shrink-0">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-10">
                <div className="p-2.5 premium-gradient rounded-xl shadow-lg">
                    <Music className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="font-bold text-lg tracking-tight">Lesson Manager</h1>
                    <p className="text-xs text-slate-500">ピアノ教室運営</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-1.5 flex-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeView === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onViewChange(item.id)}
                            className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left group
                ${isActive
                                    ? "bg-violet-500/20 text-violet-300 shadow-lg shadow-violet-500/10"
                                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                                }
              `}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? "text-violet-400" : ""}`} />
                            <span className="font-medium flex-1">{item.label}</span>
                            {isActive && (
                                <ChevronRight className="w-4 h-4 text-violet-400" />
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="pt-6 border-t border-slate-800">
                <div className="glass-card p-4">
                    <p className="text-xs text-slate-500 mb-1">Google Sheets連携</p>
                    <p className="text-sm font-medium text-emerald-400 flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        準備完了
                    </p>
                </div>
            </div>
        </aside>
    );
}
