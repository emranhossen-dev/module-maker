"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { sampleCourseData, CurriculumSchema } from "@/constants/sampleData";
import { Button } from "@/components/ui/button";
import { 
  Video, 
  Layers, 
  Briefcase, 
  Calendar, 
  Headphones, 
  HeartHandshake, 
  Award, 
  Sparkles,
  ArrowLeft,
  Printer,
  Info
} from "lucide-react";

// Content Block Interface for the auto-pagination chunker
interface ContentBlock {
  type: "milestone-header" | "module";
  milestoneId?: string | number;
  title: string;
  topics?: string[];
}

export default function PdfViewerPage() {
  const router = useRouter();
  const [curriculum, setCurriculum] = useState<CurriculumSchema | null>(null);
  const [pages, setPages] = useState<ContentBlock[][]>([]);

  // Load from local storage on component mount
  useEffect(() => {
    const data = localStorage.getItem("luminous-curriculum");
    let activeCurriculum: CurriculumSchema = sampleCourseData;

    if (data) {
      try {
        activeCurriculum = JSON.parse(data) as CurriculumSchema;
      } catch (e) {
        console.error("Failed to parse curriculum from local storage.", e);
      }
    }
    setCurriculum(activeCurriculum);

    // Run dynamic pagination chunker
    const chunked = chunkCurriculumIntoPages(activeCurriculum.milestones);
    setPages(chunked);
  }, []);

  // Helper to map icon name to Lucide components
  const getIconComponent = (name?: string) => {
    switch (name) {
      case "Video": return Video;
      case "Layers": return Layers;
      case "Briefcase": return Briefcase;
      case "Calendar": return Calendar;
      case "Headphones": return Headphones;
      case "HeartHandshake": return HeartHandshake;
      case "Award": return Award;
      default: return Sparkles;
    }
  };

  // Pagination height chunker algorithm
  const chunkCurriculumIntoPages = (milestones: any[]): ContentBlock[][] => {
    const pagesList: ContentBlock[][] = [];
    let currentPageList: ContentBlock[] = [];
    let currentHeight = 0;
    const maxContentHeight = 710; // Content height limit for A4 (leaving space for letterhead, footer & paddings)

    milestones.forEach((milestone) => {
      const milestoneHeaderHeight = 90; // Height of milestone badge + title bar
      
      // Calculate first module height
      const firstModule = milestone.modules?.[0];
      let firstModuleHeight = 0;
      if (firstModule) {
        const topicsCount = firstModule.topics?.length || 0;
        firstModuleHeight = 60 + (topicsCount * 24) + 15;
      }

      // Check if Milestone Header + First Module overflows the remaining height
      const requiredInitialHeight = milestoneHeaderHeight + firstModuleHeight;

      if (currentHeight + requiredInitialHeight > maxContentHeight && currentPageList.length > 0) {
        pagesList.push(currentPageList);
        currentPageList = [];
        currentHeight = 0;
      }

      currentPageList.push({
        type: "milestone-header",
        milestoneId: milestone.milestoneId,
        title: milestone.milestoneTitle
      });
      currentHeight += milestoneHeaderHeight;

      milestone.modules.forEach((module: any, modIdx: number) => {
        const topicsCount = module.topics?.length || 0;
        // Module height calculation: base height + topics spacing + bottom margin
        const moduleHeight = 60 + (topicsCount * 24) + 15;

        // If this module overflows (and it's not the first one, since we checked the first module already), start a new page
        if (modIdx > 0 && currentHeight + moduleHeight > maxContentHeight && currentPageList.length > 0) {
          pagesList.push(currentPageList);
          currentPageList = [];
          currentHeight = 0;

          // Repeat Milestone Header on new page as Continuation
          currentPageList.push({
            type: "milestone-header",
            milestoneId: milestone.milestoneId,
            title: `${milestone.milestoneTitle} (Continued)`
          });
          currentHeight += milestoneHeaderHeight;
        }

        currentPageList.push({
          type: "module",
          title: module.moduleTitle,
          topics: module.topics || []
        });
        currentHeight += moduleHeight;
      });
    });

    if (currentPageList.length > 0) {
      pagesList.push(currentPageList);
    }

    return pagesList;
  };

  if (!curriculum) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
        Loading curriculum workspace...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-outfit">
      
      {/* ----------------- NO-PRINT FLOATING CONTROLS ----------------- */}
      <div className="no-print bg-slate-950/90 border-b border-slate-800/60 sticky top-0 z-50 backdrop-blur-md py-4 px-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => router.push("/")}
            variant="outline" 
            size="sm" 
            className="text-xs text-slate-300 border-slate-800 hover:bg-slate-900 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Editor
          </Button>
          <div className="h-4 w-px bg-slate-800" />
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">PDF Presentation Preview</h2>
            <p className="text-[10px] text-slate-400">Review layout page-breaks before physical printing or exporting.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Instructions banner */}
          <div className="flex items-center gap-2 bg-indigo-950/40 border border-indigo-900/30 text-indigo-300 text-[10px] px-3.5 py-1.5 rounded-lg max-w-sm">
            <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>
              <strong>Print settings:</strong> Set Layout: <strong>Portrait</strong>, Paper Size: <strong>A4</strong>, Margins: <strong>None</strong>, and <strong>Background Graphics</strong>: Checked.
            </span>
          </div>

          <Button 
            onClick={() => window.print()}
            className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg shadow-purple-600/20 flex items-center gap-1.5 transition-all hover:scale-[1.02]"
          >
            <Printer className="w-4 h-4" /> Print Syllabus
          </Button>
        </div>
      </div>

      {/* ----------------- PHYSICAL A4 PAGES RENDERER ----------------- */}
      <div className="flex-1 overflow-y-auto py-8 print:py-0 flex flex-col items-center select-none print:select-text">
        
        {/* PAGE 1: GORGEOUS BROCHURE COVER PAGE */}
        <div className="pdf-page bg-white flex flex-col justify-between relative overflow-hidden shadow-2xl">
          {/* Decorative Purple Shape (Top-Right) */}
          <div className="absolute top-0 right-0 w-[240mm] h-[240mm] bg-purple-100/60 rounded-full -mr-[110mm] -mt-[110mm] opacity-70 z-0" />
          
          {/* Padded Content Wrapper for Page 1 */}
          <div className="p-12 flex-1 flex flex-col justify-between z-10 w-full h-full">
            {/* Centered Large Logo Header */}
            <div className="flex flex-col items-center text-center mt-4 w-full">
              <div className="w-full max-w-[480px] h-20 flex items-center justify-center bg-white mb-3 rounded-xl border border-slate-200/80 shadow-sm p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={curriculum.logoUrl || "https://i.ibb.co.com/Y71spNg4/logo.jpg"} 
                  alt="Luminous Centre Logo" 
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>

            {/* Centered Hero Curriculum Title & Description */}
            <div className="my-auto max-w-2xl space-y-5 flex flex-col items-center text-center py-6 mx-auto">
              <span className="inline-flex bg-purple-150 text-purple-700 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider w-fit shadow-xs font-outfit">
                {curriculum.courseSubtitle}
              </span>
              
              <h1 className="text-[40px] font-black text-slate-900 leading-[1.12] tracking-tight font-outfit break-words max-w-xl">
                {curriculum.courseTitle}
              </h1>

              <span className="inline-block bg-indigo-600 text-white text-[10px] font-black px-4 py-1.5 rounded-lg uppercase tracking-widest w-fit shadow-md shadow-indigo-600/20">
                {curriculum.batchLabel}
              </span>

              <p className="text-slate-650 text-sm font-semibold leading-relaxed pt-4 border-t border-slate-100 font-siliguri max-w-xl">
                {curriculum.courseDescription}
              </p>
            </div>

            {/* Stat Details Grid */}
            <div className="grid grid-cols-3 gap-y-6 gap-x-4 bg-slate-50/90 border border-slate-100 p-6 rounded-2xl shadow-sm">
              {curriculum.stats.slice(0, 6).map((stat, sIdx) => {
                const Icon = getIconComponent(stat.iconName);
                return (
                  <div key={sIdx} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-650/20 shrink-0">
                      <Icon className="w-4.5 h-4.5 stroke-[2.5]" />
                    </div>
                    <div>
                      <p className="text-[15px] font-black text-slate-900 leading-tight tracking-tight">{stat.value}</p>
                      <p className="text-[9px] uppercase tracking-wider text-slate-500 font-bold leading-tight mt-0.5">{stat.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cover Page Footer Banner */}
            <div className="flex justify-center items-center border-t border-slate-150 pt-5 mt-6">
              <a 
                href={`https://${curriculum.websiteUrl}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-stretch rounded-xl overflow-hidden border border-purple-600 shadow-md cursor-pointer hover:opacity-90 transition-opacity"
              >
                <span className="bg-purple-600 text-white text-xs font-black px-5 py-2.5 flex items-center uppercase tracking-wider">
                  {curriculum.enrollText}
                </span>
                <span className="bg-white text-slate-900 border-l border-purple-600 text-xs font-black px-5 py-2.5 flex items-center tracking-wider font-outfit">
                  {curriculum.websiteUrl}
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* PAGES 2+: CURRICULUM SYLLABUS PAGES */}
        {pages.map((pageBlocks, pIdx) => {
          const currentPageNumber = pIdx + 2; // Page 1 is the cover page

          return (
            <div key={pIdx} className="pdf-page bg-white flex flex-col justify-between relative shadow-2xl">
              
              {/* Full-width Letterhead Banner Image */}
              <div className="w-full overflow-hidden z-10 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="https://i.ibb.co.com/jP2zSRLG/Whats-App-Image-2026-06-25-at-1-03-56-PM.jpg" 
                  alt="Luminous Centre Letterhead Banner" 
                  className="w-full h-auto object-contain border-b border-slate-100"
                />
              </div>

              {/* Padded Content Wrapper for Page 2+ */}
              <div className="px-12 pb-12 pt-6 flex-1 flex flex-col justify-between z-10 overflow-hidden w-full h-full">
                
                {/* Syllabus Content Tree */}
                <div className="space-y-6">
                  {pageBlocks.map((block, bIdx) => {
                    
                    // Render Milestone Header block
                    if (block.type === "milestone-header") {
                      return (
                        <div key={bIdx} className="flex flex-col mb-4">
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Milestone</span>
                          <div className="flex items-stretch gap-1">
                            <div className="bg-indigo-600 text-white font-black text-xs px-3.5 flex items-center justify-center rounded-l-xl shadow-sm">
                              {block.milestoneId}
                            </div>
                            <div className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold text-[11px] px-4 py-2.5 rounded-r-xl flex items-center shadow-sm uppercase tracking-wide">
                              {block.title}
                            </div>
                          </div>
                        </div>
                      );
                    }

                    // Render Module Block
                    return (
                      <div key={bIdx} className="relative bg-slate-50/70 border border-slate-100 p-5 rounded-2xl shadow-xs">
                        {/* Vertical timeline line */}
                        <div className="absolute left-6 top-6 bottom-6 w-[2px] bg-indigo-500/25" />
                        
                        {/* Module Title */}
                        <div className="relative z-10 flex items-start gap-2.5 pl-6">
                          <div className="absolute -left-[5px] top-[4px] w-2.5 h-2.5 rounded-full bg-indigo-650 ring-4 ring-white" />
                          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                            <span className="text-indigo-600">📂</span> {block.title}
                          </h4>
                        </div>
                        
                        {/* Indented Topics */}
                        <ul className="pl-12 mt-3.5 space-y-2 relative z-10">
                          {block.topics?.map((topic, tIdx) => (
                            <li key={tIdx} className="text-[11px] text-slate-650 font-semibold leading-relaxed list-disc marker:text-indigo-500 font-siliguri">
                              {topic}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>

                {/* Syllabus Page Footer */}
                <div className="flex justify-between items-center border-t border-slate-150 pt-4 mt-6">
                  <a 
                    href={`https://${curriculum.websiteUrl}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-stretch rounded-lg overflow-hidden border border-purple-600 shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <span className="bg-purple-600 text-white text-[9px] font-black px-3.5 py-1.5 flex items-center uppercase tracking-wider">
                      {curriculum.enrollText}
                    </span>
                    <span className="bg-white text-slate-900 border-l border-purple-600 text-[10px] font-black px-3.5 py-1.5 flex items-center tracking-wider font-outfit">
                      {curriculum.websiteUrl}
                    </span>
                  </a>
                  <span className="text-[11px] font-black text-slate-400 font-outfit">
                    {currentPageNumber}
                  </span>
                </div>

              </div>

            </div>
          );
        })}

      </div>
    </div>
  );
}
