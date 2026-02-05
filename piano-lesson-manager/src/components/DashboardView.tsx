"use client";

import { Users, Wallet, Calendar, TrendingUp, Music } from "lucide-react";

// ダミーデータ（後でGoogle Sheetsと連携）
const stats = [
    { label: "生徒数", value: "8", icon: Users, color: "text-violet-400", bgColor: "bg-violet-500/10" },
    { label: "今月の収入", value: "¥96,000", icon: Wallet, color: "text-emerald-400", bgColor: "bg-emerald-500/10" },
    { label: "今週のレッスン", value: "12", icon: Calendar, color: "text-cyan-400", bgColor: "bg-cyan-500/10" },
];

const recentStudents = [
    { id: 1, name: "田中 美咲", piece: "月光ソナタ 第1楽章", progress: 75, color: "bg-pink-500" },
    { id: 2, name: "鈴木 健一", piece: "エリーゼのために", progress: 90, color: "bg-blue-500" },
    { id: 3, name: "佐藤 由美", piece: "ノクターン Op.9-2", progress: 45, color: "bg-emerald-500" },
];

export default function DashboardView() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <header>
                <h2 className="text-3xl font-bold text-gradient mb-2">ダッシュボード</h2>
                <p className="text-slate-400">教室の概要を確認できます</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="glass-card p-6 hover:scale-[1.02] transition-transform">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                                    <Icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                <TrendingUp className="w-5 h-5 text-emerald-400" />
                            </div>
                            <p className="text-3xl font-bold mb-1">{stat.value}</p>
                            <p className="text-sm text-slate-400">{stat.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Recent Students */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">最近のレッスン</h3>
                    <button className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
                        すべて見る →
                    </button>
                </div>
                <div className="glass-card divide-y divide-slate-800">
                    {recentStudents.map((student) => (
                        <div key={student.id} className="p-5 flex items-center gap-4 hover:bg-slate-800/30 transition-colors">
                            <div className={`w-12 h-12 rounded-xl ${student.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                                {student.name[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{student.name}</p>
                                <p className="text-sm text-slate-400 truncate flex items-center gap-2">
                                    <Music className="w-3.5 h-3.5" />
                                    {student.piece}
                                </p>
                            </div>
                            <div className="w-32">
                                <div className="flex justify-between text-xs mb-1.5">
                                    <span className="text-slate-500">進捗</span>
                                    <span className="text-violet-400 font-medium">{student.progress}%</span>
                                </div>
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full progress-bar rounded-full transition-all duration-500"
                                        style={{ width: `${student.progress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Quick Actions */}
            <section>
                <h3 className="text-xl font-semibold mb-4">クイックアクション</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "生徒を追加", icon: Users, color: "from-violet-500 to-purple-600" },
                        { label: "レッスン記録", icon: Music, color: "from-cyan-500 to-blue-600" },
                        { label: "経費を入力", icon: Wallet, color: "from-emerald-500 to-green-600" },
                        { label: "予定を確認", icon: Calendar, color: "from-amber-500 to-orange-600" },
                    ].map((action) => {
                        const Icon = action.icon;
                        return (
                            <button
                                key={action.label}
                                className={`p-4 rounded-2xl bg-gradient-to-br ${action.color} hover:scale-105 transition-all shadow-lg hover:shadow-xl group`}
                            >
                                <Icon className="w-6 h-6 text-white mb-2 group-hover:scale-110 transition-transform" />
                                <p className="text-sm font-medium text-white">{action.label}</p>
                            </button>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
