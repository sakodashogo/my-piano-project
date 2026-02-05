"use client";

import { useState, useEffect } from "react";
import { Calendar, MapPin, User } from "lucide-react";

const SCHEDULE = [
    { id: 1, title: "田中 美咲", time: "14:00 - 15:00", location: "江東区清澄白河", piece: "月光ソナタ 第1楽章", color: "bg-pink-500" },
    { id: 2, title: "鈴木 健一", time: "19:00 - 20:00", location: "中央区月島", piece: "ノクターン Op.9-2", color: "bg-blue-500" },
];

const UPCOMING = [
    { day: "明日", date: "2月6日（木）", lessons: 2 },
    { day: "土曜日", date: "2月8日（土）", lessons: 3 },
    { day: "来週火曜", date: "2月11日（火）", lessons: 2 },
];

export default function ScheduleView() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const today = new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "long" });

    if (!mounted) return null;

    return (
        <div className="space-y-6">
            <header>
                <h2 className="text-3xl font-bold text-gradient mb-2">スケジュール</h2>
                <p className="text-slate-400">{today}</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2"><Calendar className="w-5 h-5 text-violet-400" />今日のレッスン</h3>
                    {SCHEDULE.length === 0 ? (
                        <div className="glass-card p-12 text-center"><p className="text-slate-500">今日の予定はありません</p></div>
                    ) : (
                        <div className="space-y-4">
                            {SCHEDULE.map((item, index) => (
                                <div key={item.id} className="glass-card p-5 flex gap-5">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-4 h-4 rounded-full ${item.color}`} />
                                        {index < SCHEDULE.length - 1 && <div className="w-0.5 flex-1 bg-slate-700 mt-2" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-3">
                                            <div><h4 className="text-lg font-semibold">{item.title}</h4><p className="text-sm text-slate-500">{item.piece}</p></div>
                                            <span className="text-sm font-medium text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full">{item.time}</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-slate-400"><span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{item.location}</span></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">今後の予定</h3>
                    <div className="glass-card divide-y divide-slate-800">
                        {UPCOMING.map((item) => (
                            <div key={item.day} className="p-4 flex items-center justify-between">
                                <div><p className="font-medium">{item.day}</p><p className="text-sm text-slate-500">{item.date}</p></div>
                                <span className="flex items-center gap-1.5 text-sm text-slate-400"><User className="w-4 h-4" />{item.lessons}件</span>
                            </div>
                        ))}
                    </div>
                    <div className="glass-card p-5">
                        <p className="text-sm text-slate-400 mb-3">Googleカレンダー連携</p>
                        <button className="w-full py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl font-medium text-slate-300 flex items-center justify-center gap-2"><Calendar className="w-4 h-4" />カレンダーを開く</button>
                        <p className="text-xs text-slate-600 mt-3 text-center">※ Google Calendar API連携は今後実装予定</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
