"use client";

import { Users, Wallet, Calendar, TrendingUp } from "lucide-react";

const STATS = [
    { label: "生徒数", value: "3", icon: Users, color: "text-pink-400" },
    { label: "今月の収入", value: "¥36,000", icon: Wallet, color: "text-emerald-400" },
    { label: "今日のレッスン", value: "2", icon: Calendar, color: "text-violet-400" },
];

const RECENT_LESSONS = [
    { name: "田中 美咲", piece: "月光ソナタ 第1楽章", time: "14:00", color: "bg-pink-500" },
    { name: "鈴木 健一", piece: "ノクターン Op.9-2", time: "19:00", color: "bg-blue-500" },
];

export default function DashboardView() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <header>
                <h2 className="text-3xl font-bold text-gradient mb-2">ダッシュボード</h2>
                <p className="text-slate-400">おかえりなさい！今日も素敵なレッスンを。</p>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {STATS.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="glass-card p-5 flex items-center gap-4">
                            <div className="p-3 bg-slate-800/50 rounded-xl">
                                <Icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">{stat.label}</p>
                                <p className="text-2xl font-bold">{stat.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Today's Schedule */}
            <section>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-violet-400" />
                    今日のレッスン
                </h3>
                <div className="glass-card divide-y divide-slate-800">
                    {RECENT_LESSONS.map((lesson) => (
                        <div key={lesson.name} className="p-4 flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl ${lesson.color} flex items-center justify-center text-white font-bold text-lg`}>
                                {lesson.name[0]}
                            </div>
                            <div className="flex-1">
                                <p className="font-medium">{lesson.name}</p>
                                <p className="text-sm text-slate-500">{lesson.piece}</p>
                            </div>
                            <span className="text-sm font-medium text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full">
                                {lesson.time}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Quick Actions */}
            <section>
                <h3 className="text-xl font-semibold mb-4">クイックアクション</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { label: "生徒を追加", icon: Users },
                        { label: "収支を記録", icon: Wallet },
                        { label: "予定を確認", icon: Calendar },
                        { label: "報告を作成", icon: TrendingUp },
                    ].map((action) => {
                        const Icon = action.icon;
                        return (
                            <button
                                key={action.label}
                                className="glass-card p-4 flex flex-col items-center gap-2 hover:bg-slate-800/50 transition-colors"
                            >
                                <Icon className="w-6 h-6 text-slate-400" />
                                <span className="text-sm font-medium text-slate-300">{action.label}</span>
                            </button>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
