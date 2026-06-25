"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { sampleCourseData, CurriculumSchema, CourseStat } from "@/constants/sampleData";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Sparkles, 
  Braces, 
  Settings, 
  Layers, 
  Plus, 
  Trash2, 
  ChevronRight, 
  CheckCircle, 
  AlertTriangle,
  RefreshCw,
  Eye,
  FileText
} from "lucide-react";

export default function PremiumModuleMaker() {
  const router = useRouter();
  
  // Core curriculum state initialized with sample data
  const [curriculum, setCurriculum] = useState<CurriculumSchema>(sampleCourseData);
  const [jsonInput, setJsonInput] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"json" | "metadata" | "stats" | "milestones">("json");
  const [jsonError, setJsonError] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  // Sync state to JSON text input on load or when form changes
  useEffect(() => {
    setJsonInput(JSON.stringify(curriculum, null, 2));
  }, [curriculum]);

  // Load sample data
  const handleLoadSample = () => {
    setCurriculum(sampleCourseData);
    setJsonError("");
    showSuccess("Sample data loaded successfully!");
  };

  // Clear data
  const handleClearData = () => {
    const emptyCurriculum: CurriculumSchema = {
      courseTitle: "",
      courseSubtitle: "",
      courseDescription: "",
      logoUrl: "https://i.ibb.co.com/Y71spNg4/logo.jpg",
      websiteUrl: "luminouscentre.org",
      enrollText: "Enroll Now!",
      batchLabel: "BATCH 1",
      stats: [],
      milestones: []
    };
    setCurriculum(emptyCurriculum);
    setJsonError("");
    showSuccess("Editor cleared.");
  };

  // Helper to show temporary success message
  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  // Validate and parse JSON input
  const handleJsonChange = (val: string) => {
    setJsonInput(val);
    if (!val.trim()) {
      setJsonError("JSON input is empty.");
      return;
    }
    try {
      const parsed = JSON.parse(val) as CurriculumSchema;
      // Basic structural validation
      if (typeof parsed !== "object" || parsed === null) {
        throw new Error("JSON must be a valid object.");
      }
      if (typeof parsed.courseTitle !== "string") {
        throw new Error("Missing 'courseTitle' string property.");
      }
      if (!Array.isArray(parsed.milestones)) {
        throw new Error("'milestones' must be an array.");
      }
      
      setCurriculum(parsed);
      setJsonError("");
    } catch (err: any) {
      setJsonError(err.message || "Invalid JSON format!");
    }
  };

  // Update a simple key-value in curriculum
  const updateMetaField = (key: keyof CurriculumSchema, value: string) => {
    setCurriculum((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  // Update stat item
  const updateStatItem = (index: number, field: keyof CourseStat, value: string) => {
    setCurriculum((prev) => {
      const updatedStats = [...prev.stats];
      updatedStats[index] = { ...updatedStats[index], [field]: value };
      return { ...prev, stats: updatedStats };
    });
  };

  // Add a new stat item
  const addStatItem = () => {
    setCurriculum((prev) => ({
      ...prev,
      stats: [...prev.stats, { label: "New Stat", value: "100+", iconName: "Briefcase" }]
    }));
  };

  // Remove a stat item
  const removeStatItem = (index: number) => {
    setCurriculum((prev) => ({
      ...prev,
      stats: prev.stats.filter((_, idx) => idx !== index)
    }));
  };

  // Milestone tree manipulation functions
  const addMilestone = () => {
    setCurriculum((prev) => {
      const newMId = (prev.milestones.length > 0)
        ? String(Math.max(...prev.milestones.map((m) => parseFloat(String(m.milestoneId)) || 0)) + 1)
        : "1";
      return {
        ...prev,
        milestones: [
          ...prev.milestones,
          {
            milestoneId: newMId,
            milestoneTitle: `Milestone ${newMId}: Course Title`,
            modules: []
          }
        ]
      };
    });
  };

  const removeMilestone = (mIdx: number) => {
    setCurriculum((prev) => ({
      ...prev,
      milestones: prev.milestones.filter((_, idx) => idx !== mIdx)
    }));
  };

  const updateMilestoneTitle = (mIdx: number, val: string) => {
    setCurriculum((prev) => {
      const updated = [...prev.milestones];
      updated[mIdx].milestoneTitle = val;
      return { ...prev, milestones: updated };
    });
  };

  const updateMilestoneId = (mIdx: number, val: string) => {
    setCurriculum((prev) => {
      const updated = [...prev.milestones];
      updated[mIdx].milestoneId = val;
      return { ...prev, milestones: updated };
    });
  };

  const addModule = (mIdx: number) => {
    setCurriculum((prev) => {
      const updated = [...prev.milestones];
      const m = updated[mIdx];
      const newModId = (m.modules.length > 0)
        ? String(m.modules.length + 1)
        : "1";
      m.modules.push({
        moduleId: newModId,
        moduleTitle: `Module ${newModId}: Title Here`,
        topics: ["Topic 1"]
      });
      return { ...prev, milestones: updated };
    });
  };

  const removeModule = (mIdx: number, modIdx: number) => {
    setCurriculum((prev) => {
      const updated = [...prev.milestones];
      updated[mIdx].modules = updated[mIdx].modules.filter((_, idx) => idx !== modIdx);
      return { ...prev, milestones: updated };
    });
  };

  const updateModuleTitle = (mIdx: number, modIdx: number, val: string) => {
    setCurriculum((prev) => {
      const updated = [...prev.milestones];
      updated[mIdx].modules[modIdx].moduleTitle = val;
      return { ...prev, milestones: updated };
    });
  };

  const updateModuleId = (mIdx: number, modIdx: number, val: string) => {
    setCurriculum((prev) => {
      const updated = [...prev.milestones];
      updated[mIdx].modules[modIdx].moduleId = val;
      return { ...prev, milestones: updated };
    });
  };

  const addTopic = (mIdx: number, modIdx: number) => {
    setCurriculum((prev) => {
      const updated = [...prev.milestones];
      updated[mIdx].modules[modIdx].topics.push("New Topic Description");
      return { ...prev, milestones: updated };
    });
  };

  const removeTopic = (mIdx: number, modIdx: number, tIdx: number) => {
    setCurriculum((prev) => {
      const updated = [...prev.milestones];
      updated[mIdx].modules[modIdx].topics = updated[mIdx].modules[modIdx].topics.filter((_, idx) => idx !== tIdx);
      return { ...prev, milestones: updated };
    });
  };

  const updateTopicText = (mIdx: number, modIdx: number, tIdx: number, val: string) => {
    setCurriculum((prev) => {
      const updated = [...prev.milestones];
      updated[mIdx].modules[modIdx].topics[tIdx] = val;
      return { ...prev, milestones: updated };
    });
  };

  // Compile local storage and redirect to PDF route
  const handleGeneratePdf = () => {
    if (jsonError) {
      alert("Please fix JSON errors before generating the PDF.");
      return;
    }
    if (!curriculum.courseTitle.trim()) {
      alert("Course Title is required.");
      return;
    }
    
    // Save to local storage
    localStorage.setItem("luminous-curriculum", JSON.stringify(curriculum));
    
    // Navigate to /pdf page
    router.push("/pdf");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-outfit">
      
      {/* Dynamic Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center bg-white p-0.5 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="https://i.ibb.co.com/Y71spNg4/logo.jpg" 
                alt="Luminous Centre Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
                Luminous <span className="text-indigo-400 font-medium text-sm">Centre</span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium tracking-wider -mt-1 uppercase">Premium Module Creator</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLoadSample}
              className="text-xs text-slate-300 border-slate-800 hover:bg-slate-900"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Load Sample
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClearData}
              className="text-xs text-red-400 border-slate-800 hover:bg-red-950/20 hover:border-red-900/30"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear
            </Button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT PANEL: EDITORS (7 Columns) */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          
          {/* Action Header Card */}
          <Card className="bg-slate-900/40 border-slate-900 shadow-xl overflow-hidden backdrop-blur-sm">
            <div className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  Syllabus Builder <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
                </h1>
                <p className="text-slate-400 text-xs mt-1">
                  JSON পেস্ট করুন অথবা নিচের ফর্ম ব্যবহার করে সম্পূর্ণ কাস্টমাইজড কারিকুলাম পিডিএফ তৈরি করুন।
                </p>
              </div>
              <Button 
                onClick={handleGeneratePdf} 
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs tracking-wide uppercase px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 flex items-center gap-1.5 transition-all hover:scale-[1.02]"
              >
                <FileText className="w-4 h-4" /> Ready to Print PDF
              </Button>
            </div>
            {successMsg && (
              <div className="bg-emerald-500/10 border-t border-emerald-500/20 px-5 py-2 flex items-center gap-2 text-xs text-emerald-400">
                <CheckCircle className="w-4 h-4" /> {successMsg}
              </div>
            )}
          </Card>

          {/* Form / JSON Tab Selector */}
          <div className="bg-slate-900/80 p-1.5 rounded-xl border border-slate-900 flex space-x-1">
            <button
              onClick={() => setActiveTab("json")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTab === "json" 
                  ? "bg-indigo-600 text-white shadow-sm" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <Braces className="w-3.5 h-3.5" /> Paste JSON
            </button>
            <button
              onClick={() => setActiveTab("metadata")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTab === "metadata" 
                  ? "bg-indigo-600 text-white shadow-sm" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <Settings className="w-3.5 h-3.5" /> Branding Details
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTab === "stats" 
                  ? "bg-indigo-600 text-white shadow-sm" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> Stats Grid
            </button>
            <button
              onClick={() => setActiveTab("milestones")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTab === "milestones" 
                  ? "bg-indigo-600 text-white shadow-sm" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Milestones & Syllabus
            </button>
          </div>

          {/* TAB CONTENT: JSON EDITOR */}
          {activeTab === "json" && (
            <Card className="bg-slate-900/50 border-slate-900 flex-1 flex flex-col">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-slate-200">Paste Curriculum JSON</CardTitle>
                  <CardDescription className="text-[11px] text-slate-500">
                    Paste raw JSON curriculum formatted as defined in CurriculumSchema
                  </CardDescription>
                </div>
                {jsonError ? (
                  <span className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Error
                  </span>
                ) : (
                  <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Syntax OK
                  </span>
                )}
              </CardHeader>
              <CardContent className="flex-1 p-5 pt-0 flex flex-col">
                <Textarea
                  value={jsonInput}
                  onChange={(e) => handleJsonChange(e.target.value)}
                  className="font-mono text-xs bg-slate-950 border-slate-800 text-emerald-400 h-96 flex-1 focus-visible:ring-1 focus-visible:ring-indigo-500 rounded-xl"
                  placeholder="Paste JSON structure here..."
                />
                {jsonError && (
                  <div className="mt-3 p-3 bg-red-950/20 border border-red-900/30 rounded-lg text-xs text-red-400 font-mono">
                    ⚠️ Error: {jsonError}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* TAB CONTENT: BRANDING METADATA */}
          {activeTab === "metadata" && (
            <Card className="bg-slate-900/50 border-slate-900">
              <CardHeader>
                <CardTitle className="text-sm font-bold text-slate-200">Branding & Course Details</CardTitle>
                <CardDescription className="text-[11px] text-slate-500">
                  Manage core title, labels, descriptions, and logos.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">Course Title</label>
                    <input
                      type="text"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
                      value={curriculum.courseTitle}
                      onChange={(e) => updateMetaField("courseTitle", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">Course Subtitle Badge</label>
                    <input
                      type="text"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
                      value={curriculum.courseSubtitle}
                      onChange={(e) => updateMetaField("courseSubtitle", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">Course Description (Bengali/English)</label>
                  <textarea
                    rows={3}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500 font-siliguri"
                    value={curriculum.courseDescription}
                    onChange={(e) => updateMetaField("courseDescription", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">Logo Image URL</label>
                    <input
                      type="text"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500 font-mono"
                      value={curriculum.logoUrl}
                      onChange={(e) => updateMetaField("logoUrl", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">Website URL Link</label>
                    <input
                      type="text"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500 font-mono"
                      value={curriculum.websiteUrl}
                      onChange={(e) => updateMetaField("websiteUrl", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">Enroll Text</label>
                    <input
                      type="text"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
                      value={curriculum.enrollText}
                      onChange={(e) => updateMetaField("enrollText", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">Batch Label (Pill)</label>
                    <input
                      type="text"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
                      value={curriculum.batchLabel}
                      onChange={(e) => updateMetaField("batchLabel", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* TAB CONTENT: STATS GRID */}
          {activeTab === "stats" && (
            <Card className="bg-slate-900/50 border-slate-900">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-slate-200">Stats Grid Badges</CardTitle>
                  <CardDescription className="text-[11px] text-slate-500">
                    Define up to 6 custom badges displayed in the grid on page 1.
                  </CardDescription>
                </div>
                <Button onClick={addStatItem} size="sm" className="bg-indigo-650/40 text-indigo-400 hover:bg-indigo-950 text-[10px] font-bold">
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Badge
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {curriculum.stats.map((stat, sIdx) => (
                  <div key={sIdx} className="bg-slate-950 p-3 rounded-lg border border-slate-900 flex items-center gap-3">
                    <div className="flex-1 grid grid-cols-3 gap-2">
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase tracking-wider block mb-0.5">Value</span>
                        <input
                          type="text"
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                          value={stat.value}
                          onChange={(e) => updateStatItem(sIdx, "value", e.target.value)}
                        />
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase tracking-wider block mb-0.5">Label</span>
                        <input
                          type="text"
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                          value={stat.label}
                          onChange={(e) => updateStatItem(sIdx, "label", e.target.value)}
                        />
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase tracking-wider block mb-0.5">Icon (Lucide)</span>
                        <select
                          className="w-full bg-slate-900 border border-slate-800 rounded px-1.5 py-1 text-xs text-white"
                          value={stat.iconName || ""}
                          onChange={(e) => updateStatItem(sIdx, "iconName", e.target.value)}
                        >
                          <option value="Video">Video / Camera</option>
                          <option value="Layers">Layers / Folder</option>
                          <option value="Briefcase">Briefcase / Projects</option>
                          <option value="Calendar">Calendar / Duration</option>
                          <option value="Headphones">Headphones / Support</option>
                          <option value="HeartHandshake">HeartHandshake / Jobs</option>
                          <option value="Award">Award / Ribbon</option>
                        </select>
                      </div>
                    </div>
                    <Button 
                      onClick={() => removeStatItem(sIdx)}
                      variant="ghost" 
                      size="icon" 
                      className="text-red-500 hover:bg-red-950/20 hover:text-red-400 mt-4 h-7 w-7"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
                {curriculum.stats.length === 0 && (
                  <p className="text-center py-6 text-xs text-slate-500">No stats added yet. Add some stats to show on the cover page.</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* TAB CONTENT: MILESTONES FORM TREE */}
          {activeTab === "milestones" && (
            <Card className="bg-slate-900/50 border-slate-900 max-h-[600px] overflow-y-auto">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-slate-200">Syllabus Structure Editor</CardTitle>
                  <CardDescription className="text-[11px] text-slate-500">
                    Add milestones, modules, and topic bullets visually.
                  </CardDescription>
                </div>
                <Button onClick={addMilestone} size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold">
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Milestone
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {curriculum.milestones.map((milestone, mIdx) => (
                  <div key={mIdx} className="border border-slate-800 rounded-xl p-4 bg-slate-950/60 space-y-4">
                    {/* Milestone header fields */}
                    <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                      <div className="w-16">
                        <span className="text-[9px] text-slate-500 uppercase tracking-widest block mb-0.5">ID / No.</span>
                        <input
                          type="text"
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white text-center font-bold"
                          value={String(milestone.milestoneId)}
                          onChange={(e) => updateMilestoneId(mIdx, e.target.value)}
                        />
                      </div>
                      <div className="flex-1">
                        <span className="text-[9px] text-slate-500 uppercase tracking-widest block mb-0.5">Milestone Title</span>
                        <input
                          type="text"
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white font-bold"
                          value={milestone.milestoneTitle}
                          onChange={(e) => updateMilestoneTitle(mIdx, e.target.value)}
                        />
                      </div>
                      <Button 
                        onClick={() => removeMilestone(mIdx)}
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:bg-red-950/20 mt-4 h-8 w-8"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Modules List inside Milestone */}
                    <div className="space-y-4 pl-4 border-l border-slate-800/80">
                      {milestone.modules.map((module, modIdx) => (
                        <div key={modIdx} className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/40 space-y-3">
                          {/* Module ID & Title */}
                          <div className="flex items-center gap-2">
                            <div className="w-14">
                              <input
                                type="text"
                                className="w-full bg-slate-950 border border-slate-850 rounded px-1.5 py-1 text-xs text-white text-center font-semibold"
                                value={String(module.moduleId)}
                                onChange={(e) => updateModuleId(mIdx, modIdx, e.target.value)}
                                placeholder="Id"
                              />
                            </div>
                            <div className="flex-1">
                              <input
                                type="text"
                                className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1 text-xs text-white font-bold"
                                value={module.moduleTitle}
                                onChange={(e) => updateModuleTitle(mIdx, modIdx, e.target.value)}
                                placeholder="Module Title"
                              />
                            </div>
                            <Button 
                              onClick={() => removeModule(mIdx, modIdx)}
                              variant="ghost" 
                              size="icon" 
                              className="text-red-400 hover:bg-red-950/30 h-7 w-7"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>

                          {/* Topics inside Module */}
                          <div className="space-y-2 pl-4">
                            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Topic List Bullets</span>
                            {module.topics.map((topic, tIdx) => (
                              <div key={tIdx} className="flex items-center gap-2">
                                <span className="text-slate-600 text-xs">•</span>
                                <input
                                  type="text"
                                  className="flex-1 bg-slate-950 border border-slate-850 rounded px-2 py-1 text-xs text-slate-300"
                                  value={topic}
                                  onChange={(e) => updateTopicText(mIdx, modIdx, tIdx, e.target.value)}
                                />
                                <Button 
                                  onClick={() => removeTopic(mIdx, modIdx, tIdx)}
                                  variant="ghost" 
                                  size="icon" 
                                  className="text-red-450 hover:bg-red-950/30 h-6 w-6"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                            <Button 
                              onClick={() => addTopic(mIdx, modIdx)}
                              variant="outline" 
                              size="sm" 
                              className="text-[9px] h-6 border-slate-800 text-slate-400 hover:bg-slate-900 mt-1"
                            >
                              <Plus className="w-3 h-3 mr-1" /> Add Topic Line
                            </Button>
                          </div>
                        </div>
                      ))}

                      <Button 
                        onClick={() => addModule(mIdx)}
                        variant="outline" 
                        size="sm" 
                        className="text-[10px] h-7 border-indigo-500/20 text-indigo-400 hover:bg-indigo-950"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" /> Add Module
                      </Button>
                    </div>
                  </div>
                ))}
                {curriculum.milestones.length === 0 && (
                  <p className="text-center py-6 text-xs text-slate-500">No milestones yet. Create one to begin your syllabus.</p>
                )}
              </CardContent>
            </Card>
          )}

        </div>

        {/* RIGHT PANEL: LIVE TREE STRUCTURAL PREVIEW (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="bg-slate-900/40 border-slate-900 shadow-xl overflow-hidden backdrop-blur-sm sticky top-20 max-h-[calc(100vh-120px)] flex flex-col">
            <CardContent className="p-5 overflow-y-auto flex-1 space-y-4">
              
              {/* Dynamic Branding Preview Header */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-4 text-center flex flex-col items-center">
                {curriculum.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={curriculum.logoUrl} alt="Logo" className="w-16 h-16 rounded-xl object-cover border border-slate-800 shadow-sm" />
                ) : (
                  <div className="w-16 h-16 bg-indigo-650 rounded-xl" />
                )}
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-white leading-tight">{curriculum.courseTitle || "No Course Title"}</h4>
                  <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider block">{curriculum.courseSubtitle}</span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed line-clamp-2 border-t border-slate-900 pt-2.5 font-siliguri w-full">
                  {curriculum.courseDescription || "No description provided."}
                </p>
                <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono border-t border-slate-900 pt-2 w-full">
                  <span>🚀 {curriculum.batchLabel}</span>
                  <span>🌐 {curriculum.websiteUrl}</span>
                </div>
              </div>

              {/* Stats badges preview */}
              <div className="grid grid-cols-3 gap-2">
                {curriculum.stats.slice(0, 6).map((stat, idx) => (
                  <div key={idx} className="bg-slate-900/60 p-2 rounded-lg border border-slate-850/60 text-center">
                    <span className="text-white font-extrabold text-[11px] block">{stat.value}</span>
                    <span className="text-slate-500 text-[8px] uppercase tracking-wider block font-medium truncate">{stat.label}</span>
                  </div>
                ))}
              </div>

              {/* Letterhead Banner Mockup Preview */}
              <div className="border border-slate-900 rounded-lg overflow-hidden shrink-0 mt-4 opacity-80 hover:opacity-100 transition-opacity">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="https://i.ibb.co.com/jP2zSRLG/Whats-App-Image-2026-06-25-at-1-03-56-PM.jpg" 
                  alt="Luminous Letterhead Preview" 
                  className="w-full h-auto object-contain"
                />
              </div>

              {/* Milestones Tree List */}
              <div className="space-y-4 border-t border-slate-900 pt-4">
                {curriculum.milestones.map((milestone, mIdx) => (
                  <div key={mIdx} className="space-y-2">
                    {/* Milestone header badge preview */}
                    <div className="bg-indigo-950/30 border border-indigo-900/30 text-indigo-300 px-3 py-1.5 rounded-lg flex items-center gap-2">
                      <span className="bg-indigo-650 text-white font-black text-[9px] w-5 h-5 rounded flex items-center justify-center">
                        {milestone.milestoneId}
                      </span>
                      <span className="text-xs font-extrabold tracking-wide truncate uppercase">
                        {milestone.milestoneTitle || "Unnamed Milestone"}
                      </span>
                    </div>

                    {/* Modules inside Milestone */}
                    <div className="pl-6 space-y-2.5 border-l border-slate-850">
                      {milestone.modules.map((module, modIdx) => (
                        <div key={modIdx} className="space-y-1">
                          <h5 className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                            <ChevronRight className="w-3.5 h-3.5 text-indigo-500" />
                            {module.moduleTitle || "Unnamed Module"}
                          </h5>
                          {/* Topics List */}
                          <ul className="pl-8 space-y-0.5">
                            {module.topics.map((topic, tIdx) => (
                              <li key={tIdx} className="text-[10px] text-slate-500 font-semibold list-disc marker:text-indigo-650/60 font-siliguri">
                                {topic}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {curriculum.milestones.length === 0 && (
                  <div className="text-center py-10 text-slate-600 text-xs">
                    Syllabus tree is empty. Load sample or add items on the left to see the preview.
                  </div>
                )}
              </div>

            </CardContent>
          </Card>
        </div>

      </main>

      {/* Footer Branding */}
      <footer className="border-t border-slate-900 py-6 mt-12 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-600 text-xs font-medium">
          <p>© 2026 Luminous Centre. All Rights Reserved. Dynamic Module Builder Engine.</p>
        </div>
      </footer>
    </div>
  );
}