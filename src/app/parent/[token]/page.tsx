import { getStudentByToken } from "@/actions/parentActions";
import { Music, CheckCircle2, Clock, BookOpen, StickyNote, Calendar, User } from "lucide-react";

interface ParentPortalProps {
    params: Promise<{ token: string }>;
}

export default async function ParentPortalPage({ params }: ParentPortalProps) {
    const { token } = await params;
    const student = await getStudentByToken(token);

    if (!student) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
                <div className="text-center">
                    <div className="p-6 bg-rose-500/10 rounded-full w-fit mx-auto mb-6">
                        <User className="w-12 h-12 text-rose-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-4">アクセスできません</h1>
                    <p className="text-slate-400 max-w-md">
                        このリンクは無効か、期限切れの可能性があります。<br />
                        先生から新しいリンクを受け取ってください。
                    </p>
                </div>
            </div>
        );
    }

    const activePieces = student.pieces?.filter(p => p.status === "active") || [];
    const completedPieces = student.pieces?.filter(p => p.status === "completed") || [];
    const recentNotes = student.lessonNotes?.slice(0, 5) || [];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800 p-6">
                <div className="max-w-3xl mx-auto flex items-center gap-4">
                    <div className={`p-3 ${student.color || "bg-violet-500"} rounded-xl`}>
                        <Music className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">{student.name} さんの進捗</h1>
                        <p className="text-sm text-slate-400">保護者様向け閲覧ページ</p>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto p-6 space-y-8">
                {/* Student Info */}
                <section className="glass-card p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-violet-400" />
                        基本情報
                    </h2>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-slate-500 mb-1">レッスン曜日</p>
                            <p className="font-medium">{student.lessonDay || "未設定"}</p>
                        </div>
                        {student.birthDate && (
                            <div>
                                <p className="text-slate-500 mb-1">生年月日</p>
                                <p className="font-medium">{student.birthDate}</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Active Pieces */}
                <section className="glass-card p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-amber-400" />
                        練習中の曲 ({activePieces.length})
                    </h2>
                    {activePieces.length === 0 ? (
                        <p className="text-slate-500 text-center py-6">現在練習中の曲はありません</p>
                    ) : (
                        <div className="space-y-4">
                            {activePieces.map((piece) => (
                                <div key={piece.id} className="bg-slate-800/50 rounded-xl p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-medium">{piece.title}</h3>
                                        <span className="text-sm text-violet-400">{piece.progress}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full transition-all"
                                            style={{ width: `${piece.progress}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">
                                        開始: {piece.startedAt ? new Date(piece.startedAt).toLocaleDateString("ja-JP") : "未設定"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Completed Pieces */}
                <section className="glass-card p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        合格した曲 ({completedPieces.length})
                    </h2>
                    {completedPieces.length === 0 ? (
                        <p className="text-slate-500 text-center py-6">まだ合格した曲はありません</p>
                    ) : (
                        <div className="grid gap-3">
                            {completedPieces.slice(0, 10).map((piece) => (
                                <div key={piece.id} className="flex items-center justify-between p-3 bg-emerald-500/10 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                        <span>{piece.title}</span>
                                    </div>
                                    {piece.completedAt && (
                                        <span className="text-xs text-slate-500">
                                            {new Date(piece.completedAt).toLocaleDateString("ja-JP")}
                                        </span>
                                    )}
                                </div>
                            ))}
                            {completedPieces.length > 10 && (
                                <p className="text-center text-sm text-slate-500">
                                    ...他 {completedPieces.length - 10} 曲
                                </p>
                            )}
                        </div>
                    )}
                </section>

                {/* Recent Lesson Notes */}
                <section className="glass-card p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <StickyNote className="w-5 h-5 text-blue-400" />
                        最近のレッスンノート
                    </h2>
                    {recentNotes.length === 0 ? (
                        <p className="text-slate-500 text-center py-6">レッスンノートはまだありません</p>
                    ) : (
                        <div className="space-y-4">
                            {recentNotes.map((note) => (
                                <div key={note.id} className="border-l-2 border-blue-500 pl-4 py-2">
                                    <p className="text-sm text-slate-400 mb-1">
                                        {new Date(note.date).toLocaleDateString("ja-JP")}
                                    </p>
                                    <p className="text-slate-200 whitespace-pre-wrap">{note.content}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Footer */}
                <footer className="text-center py-8 text-slate-600 text-sm border-t border-slate-800">
                    <p>🎹 Piano Manager</p>
                    <p className="mt-1">このページは保護者様専用の閲覧ページです</p>
                </footer>
            </main>
        </div>
    );
}
