"use client";

import { useState } from "react";
import {
    Plus,
    Search,
    Music,
    Phone,
    MapPin,
    Calendar,
    ChevronRight,
    X,
    Check,
    Trash2,
    Edit3,
    History,
} from "lucide-react";

// 型定義
interface Piece {
    id: number;
    title: string;
    progress: number;
    status: "active" | "completed";
    startedAt: string;
    completedAt?: string;
}

interface Student {
    id: number;
    name: string;
    phone: string;
    address: string;
    lessonDay: string;
    pieces: Piece[];
    color: string;
}

// ダミーデータ（後でGoogle Sheets連携）
const INITIAL_STUDENTS: Student[] = [
    {
        id: 1,
        name: "田中 美咲",
        phone: "090-1234-5678",
        address: "江東区清澄白河",
        lessonDay: "毎週火曜 14:00",
        color: "bg-pink-500",
        pieces: [
            { id: 101, title: "月光ソナタ 第1楽章", progress: 75, status: "active", startedAt: "2026/01/10" },
            { id: 102, title: "エリーゼのために", progress: 100, status: "completed", startedAt: "2025/10/01", completedAt: "2025/12/20" },
        ],
    },
    {
        id: 2,
        name: "鈴木 健一",
        phone: "080-9876-5432",
        address: "中央区月島",
        lessonDay: "毎週木曜 19:00",
        color: "bg-blue-500",
        pieces: [
            { id: 201, title: "ノクターン Op.9-2", progress: 45, status: "active", startedAt: "2026/01/15" },
        ],
    },
    {
        id: 3,
        name: "佐藤 由美",
        phone: "070-5555-1234",
        address: "江東区門前仲町",
        lessonDay: "毎週土曜 10:00",
        color: "bg-emerald-500",
        pieces: [
            { id: 301, title: "トルコ行進曲", progress: 90, status: "active", startedAt: "2025/11/01" },
            { id: 302, title: "華麗なる大円舞曲", progress: 20, status: "active", startedAt: "2026/02/01" },
        ],
    },
];

export default function StudentsView() {
    const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"active" | "completed">("active");

    // 検索フィルター
    const filteredStudents = students.filter((s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // 進捗更新
    const handleUpdateProgress = (studentId: number, pieceId: number, progress: number) => {
        setStudents((prev) =>
            prev.map((s) =>
                s.id === studentId
                    ? {
                        ...s,
                        pieces: s.pieces.map((p) =>
                            p.id === pieceId ? { ...p, progress } : p
                        ),
                    }
                    : s
            )
        );
        if (selectedStudent?.id === studentId) {
            setSelectedStudent((prev) =>
                prev
                    ? {
                        ...prev,
                        pieces: prev.pieces.map((p) =>
                            p.id === pieceId ? { ...p, progress } : p
                        ),
                    }
                    : null
            );
        }
    };

    // 曲を合格にする
    const handleCompletePiece = (studentId: number, pieceId: number) => {
        const today = new Date().toLocaleDateString("ja-JP");
        setStudents((prev) =>
            prev.map((s) =>
                s.id === studentId
                    ? {
                        ...s,
                        pieces: s.pieces.map((p) =>
                            p.id === pieceId
                                ? { ...p, status: "completed", progress: 100, completedAt: today }
                                : p
                        ),
                    }
                    : s
            )
        );
        if (selectedStudent?.id === studentId) {
            setSelectedStudent((prev) =>
                prev
                    ? {
                        ...prev,
                        pieces: prev.pieces.map((p) =>
                            p.id === pieceId
                                ? { ...p, status: "completed", progress: 100, completedAt: today }
                                : p
                        ),
                    }
                    : null
            );
        }
    };

    // 新しい曲を追加
    const handleAddPiece = (studentId: number) => {
        const title = prompt("新しい曲名を入力してください");
        if (!title) return;
        const newPiece: Piece = {
            id: Date.now(),
            title,
            progress: 0,
            status: "active",
            startedAt: new Date().toLocaleDateString("ja-JP"),
        };
        setStudents((prev) =>
            prev.map((s) =>
                s.id === studentId ? { ...s, pieces: [newPiece, ...s.pieces] } : s
            )
        );
        if (selectedStudent?.id === studentId) {
            setSelectedStudent((prev) =>
                prev ? { ...prev, pieces: [newPiece, ...prev.pieces] } : null
            );
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gradient mb-2">生徒管理</h2>
                    <p className="text-slate-400">生徒情報と練習中の曲を管理</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-3 premium-gradient rounded-xl font-medium text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                    <Plus className="w-5 h-5" />
                    生徒を追加
                </button>
            </header>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                    type="text"
                    placeholder="生徒名で検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-500 focus:border-violet-500/50 transition-colors"
                />
            </div>

            {/* Students Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStudents.map((student) => (
                    <button
                        key={student.id}
                        onClick={() => setSelectedStudent(student)}
                        className="glass-card p-5 text-left hover:bg-slate-800/50 transition-all group"
                    >
                        <div className="flex items-start gap-4">
                            <div
                                className={`w-14 h-14 rounded-xl ${student.color} flex items-center justify-center text-white font-bold text-xl shadow-lg`}
                            >
                                {student.name[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-lg truncate">{student.name}</p>
                                <p className="text-sm text-slate-400 flex items-center gap-1.5 mt-1">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {student.lessonDay}
                                </p>
                                <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {student.address}
                                </p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-violet-400 transition-colors" />
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-800">
                            <p className="text-xs text-slate-500 mb-2">
                                練習中: {student.pieces.filter((p) => p.status === "active").length}曲
                            </p>
                            <div className="flex gap-2 flex-wrap">
                                {student.pieces
                                    .filter((p) => p.status === "active")
                                    .slice(0, 2)
                                    .map((piece) => (
                                        <span
                                            key={piece.id}
                                            className="text-xs px-2.5 py-1 bg-violet-500/10 text-violet-300 rounded-full"
                                        >
                                            {piece.title.length > 12
                                                ? piece.title.slice(0, 12) + "..."
                                                : piece.title}
                                        </span>
                                    ))}
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {/* Student Detail Modal */}
            {selectedStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={() => setSelectedStudent(null)}
                    />
                    <div className="relative z-10 w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-8 max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setSelectedStudent(null)}
                            className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Profile */}
                        <div className="flex items-center gap-5 mb-8">
                            <div
                                className={`w-20 h-20 rounded-2xl ${selectedStudent.color} flex items-center justify-center text-white font-bold text-3xl shadow-xl`}
                            >
                                {selectedStudent.name[0]}
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">{selectedStudent.name}</h3>
                                <p className="text-slate-400 flex items-center gap-2 mt-1">
                                    <Phone className="w-4 h-4" />
                                    {selectedStudent.phone}
                                </p>
                                <p className="text-slate-500 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    {selectedStudent.address}
                                </p>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-2 p-1 bg-slate-800/50 rounded-xl w-fit mb-6">
                            <button
                                onClick={() => setActiveTab("active")}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${activeTab === "active"
                                        ? "bg-violet-500/20 text-violet-300"
                                        : "text-slate-500 hover:text-slate-300"
                                    }`}
                            >
                                <Music className="w-4 h-4" />
                                練習中 ({selectedStudent.pieces.filter((p) => p.status === "active").length})
                            </button>
                            <button
                                onClick={() => setActiveTab("completed")}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${activeTab === "completed"
                                        ? "bg-emerald-500/20 text-emerald-300"
                                        : "text-slate-500 hover:text-slate-300"
                                    }`}
                            >
                                <History className="w-4 h-4" />
                                合格履歴 ({selectedStudent.pieces.filter((p) => p.status === "completed").length})
                            </button>
                        </div>

                        {/* Pieces List */}
                        <div className="space-y-4">
                            {activeTab === "active" && (
                                <>
                                    <button
                                        onClick={() => handleAddPiece(selectedStudent.id)}
                                        className="w-full py-4 border-2 border-dashed border-slate-700 hover:border-violet-500/50 rounded-xl text-slate-500 hover:text-violet-400 font-medium transition-all flex items-center justify-center gap-2"
                                    >
                                        <Plus className="w-5 h-5" />
                                        新しい曲を追加
                                    </button>
                                    {selectedStudent.pieces
                                        .filter((p) => p.status === "active")
                                        .map((piece) => (
                                            <div
                                                key={piece.id}
                                                className="glass-card p-5 space-y-4"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h4 className="font-semibold text-lg">{piece.title}</h4>
                                                        <p className="text-sm text-slate-500">
                                                            開始: {piece.startedAt}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() =>
                                                            handleCompletePiece(selectedStudent.id, piece.id)
                                                        }
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg font-medium text-sm transition-colors"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                        合格！
                                                    </button>
                                                </div>
                                                <div>
                                                    <div className="flex justify-between text-sm mb-2">
                                                        <span className="text-slate-500">進捗</span>
                                                        <span className="text-violet-400 font-medium">
                                                            {piece.progress}%
                                                        </span>
                                                    </div>
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="100"
                                                        value={piece.progress}
                                                        onChange={(e) =>
                                                            handleUpdateProgress(
                                                                selectedStudent.id,
                                                                piece.id,
                                                                parseInt(e.target.value)
                                                            )
                                                        }
                                                        className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer accent-violet-500"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                </>
                            )}
                            {activeTab === "completed" && (
                                <>
                                    {selectedStudent.pieces.filter((p) => p.status === "completed")
                                        .length === 0 ? (
                                        <p className="text-center py-12 text-slate-600">
                                            まだ合格した曲はありません
                                        </p>
                                    ) : (
                                        selectedStudent.pieces
                                            .filter((p) => p.status === "completed")
                                            .map((piece) => (
                                                <div
                                                    key={piece.id}
                                                    className="flex items-center gap-4 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl"
                                                >
                                                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                                                        <Music className="w-5 h-5 text-emerald-400" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-emerald-100">
                                                            {piece.title}
                                                        </h4>
                                                        <p className="text-xs text-emerald-500/60">
                                                            合格: {piece.completedAt}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Add Student Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={() => setIsAddModalOpen(false)}
                    />
                    <div className="relative z-10 w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8">
                        <button
                            onClick={() => setIsAddModalOpen(false)}
                            className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <h3 className="text-2xl font-bold text-gradient mb-6">新規生徒の登録</h3>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const form = e.target as HTMLFormElement;
                                const formData = new FormData(form);
                                const colors = ["bg-pink-500", "bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-violet-500"];
                                const newStudent: Student = {
                                    id: Date.now(),
                                    name: formData.get("name") as string,
                                    phone: formData.get("phone") as string,
                                    address: formData.get("address") as string,
                                    lessonDay: formData.get("lessonDay") as string,
                                    color: colors[Math.floor(Math.random() * colors.length)],
                                    pieces: [],
                                };
                                setStudents([newStudent, ...students]);
                                setIsAddModalOpen(false);
                            }}
                            className="space-y-5"
                        >
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">
                                    お名前
                                </label>
                                <input
                                    name="name"
                                    required
                                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-100 focus:border-violet-500/50"
                                    placeholder="例: 山田 花子"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">
                                    電話番号
                                </label>
                                <input
                                    name="phone"
                                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-100 focus:border-violet-500/50"
                                    placeholder="例: 090-1234-5678"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">
                                    住所（出張先）
                                </label>
                                <input
                                    name="address"
                                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-100 focus:border-violet-500/50"
                                    placeholder="例: 江東区清澄白河"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">
                                    レッスン日時
                                </label>
                                <input
                                    name="lessonDay"
                                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-100 focus:border-violet-500/50"
                                    placeholder="例: 毎週火曜 14:00"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-4 premium-gradient rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all"
                            >
                                登録する
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
