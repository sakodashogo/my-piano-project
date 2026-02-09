"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Music, Sparkles, Plus, X, Pencil, Trash2, History } from "lucide-react";
import { getStudents, Student } from "../actions/studentActions";
import { getTemplates, saveTemplate, updateTemplate, deleteTemplate, getReportHistory, saveReportHistory, ReportTemplate, ReportHistory } from "../actions/reportActions";

type TabType = "report" | "history";

export default function ReportsView() {
    const [students, setStudents] = useState<Student[]>([]);
    const [templates, setTemplates] = useState<ReportTemplate[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
    const [customText, setCustomText] = useState("");
    const [nextGoal, setNextGoal] = useState("");
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>("report");

    // Template editing
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<ReportTemplate | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // History
    const [reportHistory, setReportHistory] = useState<ReportHistory[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const [studentData, templateData] = await Promise.all([
            getStudents(),
            getTemplates(),
        ]);
        setStudents(studentData);
        setTemplates(templateData);
        if (templateData.length > 0) setSelectedTemplate(templateData[0]);
    };

    useEffect(() => {
        if (activeTab === "history") loadHistory();
    }, [activeTab]);

    const loadHistory = async () => {
        setLoadingHistory(true);
        const history = await getReportHistory();
        setReportHistory(history);
        setLoadingHistory(false);
    };

    const generateMessage = () => {
        if (!selectedStudent || !selectedTemplate) return "生徒とテンプレートを選択してください";

        let message = selectedTemplate.text;
        const activePiece = selectedStudent.pieces.find((p) => p.status === "active");
        const pieceTitle = activePiece ? activePiece.title : "練習曲";

        message = message.replace("{曲名}", pieceTitle);
        message = message.replace("{良かった点}", customText || "リズム感");
        message = message.replace("{次回の目標}", nextGoal || "表現力");
        message = message.replace("{アドバイス}", customText || "ゆっくり片手ずつ練習してみてください");
        return message;
    };

    const handleCopy = async () => {
        if (!selectedStudent || !selectedTemplate) return;
        const message = generateMessage();
        navigator.clipboard.writeText(message);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);

        // Save to history
        await saveReportHistory({
            studentId: selectedStudent.id,
            studentName: selectedStudent.name,
            date: new Date().toLocaleString("ja-JP"),
            message,
            templateLabel: selectedTemplate.label,
        });
    };

    const handleSaveTemplate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSaving) return;
        setIsSaving(true);
        try {
            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);

            const templateData = {
                label: formData.get("label") as string,
                text: formData.get("text") as string,
            };

            if (editingTemplate && editingTemplate.isCustom) {
                await updateTemplate({ ...editingTemplate, ...templateData });
            } else {
                await saveTemplate(templateData);
            }

            await loadData();
            setIsTemplateModalOpen(false);
            setEditingTemplate(null);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteTemplate = async (templateId: number) => {
        if (!confirm("このテンプレートを削除しますか？")) return;
        await deleteTemplate(templateId);
        await loadData();
    };

    return (
        <div className="space-y-6">
            <header>
                <h2 className="text-3xl font-bold text-gradient mb-2">レッスン報告</h2>
                <p className="text-gray-500">メッセージ生成・履歴</p>
            </header>

            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-white/80 rounded-xl w-fit flex-wrap border border-pink-200">
                <button onClick={() => setActiveTab("report")} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium ${activeTab === "report" ? "bg-pink-100 text-pink-600" : "text-gray-500 hover:text-gray-700 hover:bg-pink-50"}`}>
                    <Sparkles className="w-4 h-4" />報告作成
                </button>
                <button onClick={() => setActiveTab("history")} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium ${activeTab === "history" ? "bg-pink-100 text-pink-600" : "text-gray-500 hover:text-gray-700 hover:bg-pink-50"}`}>
                    <History className="w-4 h-4" />送信履歴
                </button>
            </div>

            {activeTab === "report" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        {/* Student selector */}
                        <div className="glass-card p-6">
                            <label className="block text-sm font-medium text-gray-600 mb-3">生徒を選択</label>
                            {students.length === 0 ? (
                                <p className="text-gray-400 text-sm">生徒データがありません</p>
                            ) : (
                                <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-2">
                                    {students.map((student) => {
                                        const activePiece = student.pieces.find((p) => p.status === "active");
                                        return (
                                            <button key={student.id} onClick={() => setSelectedStudent(student)} className={`p-4 rounded-xl text-left ${selectedStudent?.id === student.id ? "bg-pink-100 border border-pink-300" : "bg-white border border-pink-200 hover:bg-pink-50"}`}>
                                                <p className="font-medium text-gray-700">{student.name}</p>
                                                {activePiece && (
                                                    <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1"><Music className="w-3.5 h-3.5" />{activePiece.title}</p>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Template selector */}
                        <div className="glass-card p-6">
                            <div className="flex items-center justify-between mb-3">
                                <label className="text-sm font-medium text-gray-600">テンプレートを選択</label>
                                <button onClick={() => { setEditingTemplate(null); setIsTemplateModalOpen(true); }} className="text-xs text-pink-500 hover:text-pink-600 flex items-center gap-1">
                                    <Plus className="w-3 h-3" />新規作成
                                </button>
                            </div>
                            <div className="space-y-2">
                                {templates.map((template) => (
                                    <button
                                        key={template.id}
                                        onClick={() => setSelectedTemplate(template)}
                                        className={`w-full p-4 rounded-xl text-left flex items-center gap-2 transition-colors ${selectedTemplate?.id === template.id ? "bg-pink-100 border border-pink-300" : "bg-white border border-pink-200 hover:bg-pink-50"}`}
                                    >
                                        <div className="flex-1">
                                            <p className="font-medium flex items-center gap-2 text-gray-700">
                                                <Sparkles className="w-4 h-4 text-pink-500" />
                                                {template.label}
                                                {template.isCustom && <span className="text-xs px-2 py-0.5 bg-pink-100 text-pink-600 rounded-full">カスタム</span>}
                                            </p>
                                        </div>
                                        {template.isCustom && (
                                            <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                                                <button onClick={() => { setEditingTemplate(template); setIsTemplateModalOpen(true); }} className="p-1.5 hover:bg-gray-100 rounded-lg"><Pencil className="w-3.5 h-3.5 text-gray-600" /></button>
                                                <button onClick={() => handleDeleteTemplate(template.id)} className="p-1.5 hover:bg-rose-100 rounded-lg"><Trash2 className="w-3.5 h-3.5 text-rose-600" /></button>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Custom inputs */}
                        <div className="glass-card p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">今日良かった点</label>
                                <input type="text" value={customText} onChange={(e) => setCustomText(e.target.value)} className="w-full px-4 py-3 bg-white border border-pink-200 rounded-xl text-gray-700 placeholder:text-gray-400" placeholder="例: テンポが安定していた" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">次回の目標</label>
                                <input type="text" value={nextGoal} onChange={(e) => setNextGoal(e.target.value)} className="w-full px-4 py-3 bg-white border border-pink-200 rounded-xl text-gray-700 placeholder:text-gray-400" placeholder="例: 表現力を意識する" />
                            </div>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="glass-card p-6 flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-lg text-gray-700">プレビュー</h3>
                            <button onClick={handleCopy} disabled={!selectedStudent || !selectedTemplate} className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium ${copied ? "bg-emerald-100 text-emerald-700" : "bg-pink-100 text-pink-600 hover:bg-pink-200 disabled:opacity-50 disabled:cursor-not-allowed"}`}>
                                {copied ? <><Check className="w-4 h-4" />コピーしました</> : <><Copy className="w-4 h-4" />コピー</>}
                            </button>
                        </div>
                        <div className="flex-1 bg-white border border-pink-200 rounded-xl p-5 whitespace-pre-wrap text-gray-700 leading-relaxed">{generateMessage()}</div>
                        <p className="text-sm text-gray-500 mt-4 text-center">コピーしたメッセージをLINEに貼り付けて送信してください</p>
                    </div>
                </div>
            )}

            {activeTab === "history" && (
                <div className="glass-card">
                    <div className="p-5 border-b border-pink-100">
                        <h3 className="font-semibold text-lg text-gray-700">送信履歴</h3>
                    </div>
                    {loadingHistory ? (
                        <div className="p-8 text-center text-gray-400">読み込み中...</div>
                    ) : reportHistory.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">送信履歴はありません</div>
                    ) : (
                        <div className="divide-y divide-pink-100 max-h-[600px] overflow-y-auto">
                            {reportHistory.map((record) => (
                                <div key={record.id} className="p-5">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="font-medium text-gray-700">{record.studentName}</p>
                                        <span className="text-sm text-gray-500">{record.date}</span>
                                    </div>
                                    <p className="text-xs text-pink-500 mb-2">{record.templateLabel}</p>
                                    <p className="text-sm text-gray-600 whitespace-pre-wrap line-clamp-3">{record.message}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Template Modal */}
            {isTemplateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsTemplateModalOpen(false)} />
                    <div className="relative z-10 w-full max-w-lg bg-white border border-pink-200 rounded-3xl p-8 shadow-2xl">
                        <button onClick={() => setIsTemplateModalOpen(false)} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-700"><X className="w-6 h-6" /></button>
                        <h3 className="text-2xl font-bold text-gradient mb-6">{editingTemplate ? "テンプレートを編集" : "新規テンプレート"}</h3>
                        <form onSubmit={handleSaveTemplate} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">テンプレート名</label>
                                <input name="label" required defaultValue={editingTemplate?.label} className="w-full px-4 py-3 bg-white border border-pink-200 rounded-xl text-gray-700" placeholder="例: 発表会に向けて" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">テンプレート内容</label>
                                <textarea name="text" rows={8} required defaultValue={editingTemplate?.text} className="w-full px-4 py-3 bg-white border border-pink-200 rounded-xl text-gray-700" placeholder="利用可能な変数: {曲名}, {良かった点}, {次回の目標}, {アドバイス}" />
                                <p className="text-xs text-gray-500 mt-2">変数: {"{曲名}"}, {"{良かった点}"}, {"{次回の目標}"}, {"{アドバイス}"}</p>
                            </div>
                            <button type="submit" disabled={isSaving} className={`w-full py-4 premium-gradient rounded-xl font-bold text-white shadow-lg ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}>{isSaving ? "保存中..." : (editingTemplate ? "更新する" : "保存する")}</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
