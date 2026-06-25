export interface CourseStat {
  label: string;
  value: string;
  iconName?: string;
}

export interface CurriculumSchema {
  courseTitle: string;
  courseSubtitle: string;
  courseDescription: string;
  logoUrl: string;
  websiteUrl: string;
  enrollText: string;
  batchLabel: string;
  stats: CourseStat[];
  milestones: {
    milestoneId: number | string;
    milestoneTitle: string;
    modules: {
      moduleId: number | string;
      moduleTitle: string;
      topics: string[];
    }[];
  }[];
}

export const sampleCourseData: CurriculumSchema = {
  courseTitle: "Full Stack Web Engineering",
  courseSubtitle: "AI-Driven Professional Program",
  courseDescription: "৭ মাসের সুপার গাইডেড Bootcamp, যেকোনো সমস্যায় ক্রেজি লেভেলের ২৪/৭ Support, ৩০+ প্রজেক্ট, ও প্রিমিয়াম জব প্লেমেন্ট সাপোর্ট-যার মাধ্যমে গত ৫ বছরে ৫৮০০+ শিক্ষার্থী সফলভাবে ক্যারিয়ার শুরু করেছে।",
  logoUrl: "https://i.ibb.co.com/Y71spNg4/logo.jpg",
  websiteUrl: "luminouscentre.org",
  enrollText: "Enroll Now!",
  batchLabel: "BATCH 14",
  stats: [
    { label: "Videos", value: "1000+", iconName: "Video" },
    { label: "Modules", value: "60+", iconName: "Layers" },
    { label: "Projects", value: "30+", iconName: "Briefcase" },
    { label: "Course Duration", value: "7 Month", iconName: "Calendar" },
    { label: "Support", value: "24/7", iconName: "Headphones" },
    { label: "Job Placement", value: "5800+", iconName: "HeartHandshake" }
  ],
  milestones: [
    {
      milestoneId: "0",
      milestoneTitle: "WELCOME TO THE WEB COURSE",
      modules: [
        {
          moduleId: "0",
          moduleTitle: "Module 0: Welcome to the Course",
          topics: [
            "0-1: Welcome Message",
            "0-2: How to access support systems & community rules",
            "0-3: Setting up expectations and career pathways"
          ]
        }
      ]
    },
    {
      milestoneId: "1",
      milestoneTitle: "WHAT MATTERS IN THIS COURSE?",
      modules: [
        {
          moduleId: "1",
          moduleTitle: "Module 1: Orientation - Install Necessary Tools",
          topics: [
            "1-1 How to access the course & course workflow",
            "1-2 Time management and building your own learning routine",
            "1-3 Everything you need to know about assignments & grading",
            "1-4 How to get Support Effectively from active mentors",
            "1-5 Install Visual Studio Code, Node, Git, GitHub",
            "1-6 (Only For Mac Users) Install VS Code, Node, Git SCM",
            "1-7 How to use Helpdesk and overall Course Rules",
            "1-8 Actionable Dashboard, Certificate, and AI Integration",
            "1-9 How to get the best out of this course and SCIC pathway"
          ]
        }
      ]
    },
    {
      milestoneId: "1.5",
      milestoneTitle: "AI MINDSET FOR DEVELOPERS",
      modules: [
        {
          moduleId: "1.5",
          moduleTitle: "Module 1.5.1: Understanding AI: Reality, Risks, and Mindset",
          topics: [
            "1-1 Why is AI advancing so rapidly, and what capabilities & limitations define it?",
            "1-2 Can AI Replace Developers? The truth about automation",
            "1-3 How NOT to Use AI (Common mistakes in learning syntax)",
            "1-4 How NOT to Fear AI (Beginner's Mindset shift)",
            "1-5 Developer vs AI Engineer Mindset: Building next-gen skills"
          ]
        }
      ]
    },
    {
      milestoneId: "2",
      milestoneTitle: "HTML & CSS BASICS FOR RESPONSIVE DESIGN",
      modules: [
        {
          moduleId: "2",
          moduleTitle: "Module 2: Intro to HTML & Semantic Structures",
          topics: [
            "2-1 HTML Boilerplate, tags, attributes, and header tags",
            "2-2 Semantic markup vs non-semantic tags (div, section, article)",
            "2-3 Working with media: Audio, Video, Images, and Embeds"
          ]
        },
        {
          moduleId: "3",
          moduleTitle: "Module 3: Styling Basics with CSS Custom Properties",
          topics: [
            "3-1 CSS selectors, cascades, specificity, and inheritance rules",
            "3-2 Box Model properties: Margin, Padding, Border, Box-sizing",
            "3-3 CSS variables (custom properties) and system layout patterns"
          ]
        }
      ]
    },
    {
      milestoneId: "3",
      milestoneTitle: "JAVASCRIPT FUNDAMENTALS & LOGIC",
      modules: [
        {
          moduleId: "4",
          moduleTitle: "Module 4: Variables, Operators & Control Flow",
          topics: [
            "4-1 Primitive data types and variable declarations (let, const, var)",
            "4-2 Conditional logic (if-else, switch, ternary operators)",
            "4-3 Loops and iterations (for, while, do-while, for-of)"
          ]
        },
        {
          moduleId: "5",
          moduleTitle: "Module 5: Arrays, Objects, and Functions",
          topics: [
            "5-1 Array methods: push, pop, shift, unshift, slice, splice",
            "5-2 Object creation, nesting, destructuring, and property shorthand",
            "5-3 Functions: declarations, expressions, arrow functions, and scoping"
          ]
        }
      ]
    }
  ]
};