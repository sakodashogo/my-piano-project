"use client";

import {
    LayoutDashboard,
    Users,
    Wallet,
    FileText,
    Calendar,
    Music,
    Mic2,
    BookOpen,
    X,
} from "lucide-react";

type View = "dashboard" | "students" | "finance" | "reports" | "schedule" | "recital" | "library";

interface SidebarProps {
    activeView: View;
    onViewChange: (view: View) => void;
    isOpen?: boolean;
    onClose?: () => void;
}

const NAV_ITEMS = [
    { id: "dashboard" as View, label: "ダッシュボード", icon: LayoutDashboard },
    { id: "students" as View, label: "生徒管理", icon: Users },
    { id: "finance" as View, label: "月謝・経費", icon: Wallet },
    { id: "reports" as View, label: "レッスン報告", icon: FileText },
    { id: "schedule" as View, label: "スケジュール", icon: Calendar },
    { id: "recital" as View, label: "発表会", icon: Mic2 },
    { id: "library" as View, label: "楽譜ライブラリ", icon: BookOpen },
];

export default function Sidebar({ activeView, onViewChange, isOpen = true, onClose }: SidebarProps) {
    const handleNavClick = (view: View) => {
        onViewChange(view);
        // モバイルではメニュー選択後に自動で閉じる
        if (onClose) {
            onClose();
        }
    };

    return (
        <>
            {/* モバイル用オーバーレイ背景 */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* サイドバー本体 */}
            <aside
                className={`
                    fixed lg:static inset-y-0 left-0 z-50
                    w-56 sm:w-64 h-screen border-r border-pink-200 bg-white lg:bg-white/90 
                    p-4 sm:p-6 flex flex-col shrink-0
                    transform transition-transform duration-300 ease-in-out
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                    lg:translate-x-0
                    safe-area-bottom
                    shadow-lg shadow-pink-100/50
                `}
            >
                {/* ヘッダー（モバイル用閉じるボタン付き） */}
                <div className="flex items-center justify-between mb-6 sm:mb-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 premium-gradient rounded-xl">
                            <Music className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg text-gray-700">Piano Manager</h1>
                            <p className="text-xs text-pink-400">レッスン管理システム</p>
                        </div>
                    </div>
                    {/* モバイル用閉じるボタン */}
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 text-gray-400 hover:text-pink-500 hover:bg-pink-50 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-2">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeView === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNavClick(item.id)}
                                className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-medium transition-all text-sm sm:text-base ${isActive
                                    ? "bg-pink-100 text-pink-600 border border-pink-300"
                                    : "text-gray-500 hover:text-pink-500 hover:bg-pink-50 active:bg-pink-100"
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="pt-6 border-t border-pink-100">
                    <p className="text-xs text-pink-400 text-center">
                        Play On Music
                    </p>
                </div>
            </aside>
        </>
    );
}
