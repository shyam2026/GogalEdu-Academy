// db/spcourses.js

/**
 * ================================================================
 * SELF-PACED COURSES DATABASE — GogalEdu Academy
 * ================================================================
 * HOW TO ADD A NEW COURSE:
 *  1. Copy the entire "advance-excel" object below
 *  2. Paste it as a new key using the URL slug as key
 *     e.g. "python-basics": { ... }
 *  3. Update all fields: title, pricing, curriculum, etc.
 *  4. Add the course card on the self-paced listing page
 *  5. Place course image in:   /public/course/your-image.jpg
 *  6. Place video files in:    /public/videos/your-video.mp4
 *  7. Place project files in:  /public/projects/your-file.pdf
 * ================================================================
 */

export const spcourses = {

  // ================================================================
  // COURSE: ADVANCED EXCEL
  // URL: /courses/self-paced/advance-excel
  // ================================================================
  "advance-excel": {

    slug: "advance-excel",

    // ── HERO ──────────────────────────────────────────────────────
    hero: {
      title: "Advanced Excel",
      subtitle:
        "Master Excel from basics to advanced dashboards, automation and data analysis. Build real industry projects and get job-ready skills.",

      // TAGS: Pill badges shown above title (max 3)
      tags: [
        { label: "Beginner to Advanced", icon: "target" },
        { label: "Self-Paced",           icon: "clock"  },
        { label: "Online",               icon: "online" }
      ],

      // STATS: Shown in the 4 stat cards
      stats: {
        rating:    "4.7",
        students:  "400+",
        projects:  "5+",
        guarantee: "100%"
      },

      // PRICING: Right-side enroll card
      pricing: {
        price:         "5999",   // Original (shown with strikethrough)
        discountPrice: "2999",   // Final price (shown in green)
        discount:      "50% OFF" // Badge on course image
      },

      // COURSE IMAGE: /public/course/filename.jpg
      image: "/course/excel.jpg"
    },

    // ── INSTRUCTOR ────────────────────────────────────────────────
    instructor: {
      name:       "Rahul Sharma",
      title:      "Microsoft Excel Trainer",
      experience: "10+ Years Experience"
      // avatar: "/instructors/rahul.jpg"  ← optional photo
    },

    // ── COURSE FEATURE BADGES ─────────────────────────────────────
    details: {
      certificate:           true,
      lifetimeAccess:        true,
      downloadableResources: false,
      mobileAccess:          true
    },

    // ── REQUIREMENTS ──────────────────────────────────────────────
    // ADD more strings for more prerequisite items
    requirements: [
      "Basic computer knowledge",
      "Laptop or desktop",
      "Microsoft Excel installed"
    ],

    // ── TOOLS USED ────────────────────────────────────────────────
    // ADD more strings for more tool badges
    tools: [
      "Microsoft Excel",
      "Pivot Tables",
      "Power Query",
      "Excel Charts",
      "Macros & Automation",
      "Excel Dashboards"
    ],

    // ── OVERVIEW CARDS ────────────────────────────────────────────
    // Each string = one card in the Overview tab grid
    // ADD more strings to add more overview feature cards
    overview: [
      "Build real-world business dashboards",
      "Master Excel formulas & functions",
      "Analyze large datasets professionally",
      "Create pivot tables and dynamic charts",
      "Automate reports using macros",
      "Build portfolio projects"
      // ↓ ADD MORE OVERVIEW POINTS HERE
    ],

    // ── FREE PREVIEW LESSONS ──────────────────────────────────────
    // Shown on course listing page without login
    // VIDEO: /public/videos/filename.mp4
    curriculum: [
    // freePreview: [
    {
      
        moduleTitle:       "Free Preview Lessons",
        moduleDescription: "Get a sneak peek of the course with these free preview lessons.",

        lessons: [
      {
        title:           "Course Introduction",
        durationSeconds: 83,
        video:           "/videos/excel-intro.mp4",
        description:     "Overview of what you will learn in this course"
      },
      {
        title:           "Excel Interface Tour",
        durationSeconds: 60,
        video:           "/videos/excel-interface.mp4",
        description:     "Understanding Excel layout and tools"
      }
      // ↓ ADD MORE FREE PREVIEW LESSONS HERE
    ]
      },
    // ],

    // ── CURRICULUM ────────────────────────────────────────────────
    //
    // LOCKING RULES (auto-handled by page.jsx):
    //   • First 3 lessons globally are always unlocked
    //   • Lesson N+1 unlocks when Lesson N is 90% watched
    //   • Module N+1 first lesson unlocks only after Module N quiz is passed
    //
    // VIDEO FILES: /public/videos/filename.mp4
    //   → Update the `video` field in each lesson
    //
    // TO ADD A MODULE:  Copy a module block, paste below the last one
    // TO ADD A LESSON:  Copy a lesson object, paste inside `lessons` array
    // TO ADD A QUESTION: Copy a question object, paste inside `quiz` array
    //
    // curriculum: [

      // ── Module 1 ─────────────────────────────────────────────
      {
        moduleTitle:       "Excel Fundamentals",
        moduleDescription: "Learn Excel interface, formatting and basic formulas.",

        lessons: [
          {
            lessonTitle:     "Excel Interface Explained",
            durationSeconds: 62,
            video:           "/videos/excel1.mp4",  // ← YOUR VIDEO PATH
            preview:         false
          },
          {
            lessonTitle:     "Basic Excel Formulas",
            durationSeconds: 76,
            video:           "/videos/excel2.mp4",  // ← YOUR VIDEO PATH
            preview:         false
          }
          // ↓ ADD MORE LESSONS FOR MODULE 1
        ],

        // Pass score: ≥60% — failing blocks Module 2
        quiz: [
          {
            question: "What does the SUM function do?",
            options:  ["Adds numbers", "Deletes cells", "Formats data", "Creates chart"],
            answer:   0   // 0 = "Adds numbers"
          }
          // ↓ ADD MORE QUIZ QUESTIONS FOR MODULE 1
        ]
      },

      // ── Module 2 ─────────────────────────────────────────────
      {
        moduleTitle:       "Intermediate Excel Skills",
        moduleDescription: "Learn sorting, filtering and conditional formatting.",

        lessons: [
          {
            lessonTitle:     "Sorting & Filtering Data",
            durationSeconds: 69,
            video:           "/videos/excel-filter.mp4", // ← YOUR VIDEO PATH
            preview:         false
          },
          {
            lessonTitle:     "Conditional Formatting",
            durationSeconds: 58,
            video:           "/videos/excel-format.mp4", // ← YOUR VIDEO PATH
            preview:         false
          }
          // ↓ ADD MORE LESSONS FOR MODULE 2
        ],

        quiz: [
          {
            question: "Which feature highlights cells based on conditions?",
            options:  ["VLOOKUP", "Conditional Formatting", "Pivot Table", "Sort A-Z"],
            answer:   1
          }
          // ↓ ADD MORE QUIZ QUESTIONS FOR MODULE 2
        ]
      },

      // ── Module 3 ─────────────────────────────────────────────
      {
        moduleTitle:       "Advanced Excel & Dashboards",
        moduleDescription: "Create professional dashboards and automate reports.",

        lessons: [
          {
            lessonTitle:     "Pivot Tables Masterclass",
            durationSeconds: 120,
            video:           "/videos/excel3.mp4",  // ← YOUR VIDEO PATH
            preview:         false
          },
          {
            lessonTitle:     "Creating Excel Dashboards",
            durationSeconds: 150,
            video:           "/videos/excel4.mp4",  // ← YOUR VIDEO PATH
            preview:         false
          }
          // ↓ ADD MORE LESSONS FOR MODULE 3
        ],

        quiz: [
          {
            question: "Pivot Tables are primarily used for?",
            options:  ["Formatting text", "Summarizing large datasets", "Writing macros", "Drawing shapes"],
            answer:   1
          }
          // ↓ ADD MORE QUIZ QUESTIONS FOR MODULE 3
        ]
      }

      // ↓ ADD NEW MODULES HERE
      // {
      //   moduleTitle: "New Module Title",
      //   moduleDescription: "Short description",
      //   lessons: [
      //     { lessonTitle: "Lesson Name", durationSeconds: 120, video: "/videos/file.mp4", preview: false }
      //   ],
      //   quiz: [
      //     { question: "Q?", options: ["A","B","C","D"], answer: 0 }
      //   ]
      // }

    ],

    // ── 5-IN-1 PROJECTS ───────────────────────────────────────────
    // Students download project brief (PDF/DOCX) and upload their work
    // Admin marks status: "pending" | "accepted" | "rejected"
    // FILE PATH: /public/projects/filename.pdf
    projects: [
      {
        id:               "project-1",
        title:            "Project 1: Sales Dashboard",
        description:      "Build a complete monthly sales dashboard with dynamic charts and KPI cards",
        downloadFile:     "/projects/excel-project1.pdf",      // ← FILE PATH
        downloadFileName: "Excel_Project1_SalesDashboard.pdf"  // ← FILE NAME SHOWN ON DOWNLOAD
      },
      {
        id:               "project-2",
        title:            "Project 2: Inventory Tracker",
        description:      "Create an automated inventory system with low-stock alerts",
        downloadFile:     "/projects/excel-project2.pdf",
        downloadFileName: "Excel_Project2_InventoryTracker.pdf"
      },
      {
        id:               "project-3",
        title:            "Project 3: HR Analytics",
        description:      "Analyze employee data with pivot tables and attendance charts",
        downloadFile:     "/projects/excel-project3.pdf",
        downloadFileName: "Excel_Project3_HRAnalytics.pdf"
      },
      {
        id:               "project-4",
        title:            "Project 4: Financial Model",
        description:      "Build a 12-month revenue and expense forecasting model",
        downloadFile:     "/projects/excel-project4.pdf",
        downloadFileName: "Excel_Project4_FinancialModel.pdf"
      },
      {
        id:               "project-5",
        title:            "Project 5: BI Report",
        description:      "Create a full Business Intelligence report with macro automation",
        downloadFile:     "/projects/excel-project5.pdf",
        downloadFileName: "Excel_Project5_BIReport.pdf"
      }
    ],

    // ── VIDEO SECURITY ────────────────────────────────────────────
    videoProtection: {
      disableDownload:  true,  // Removes browser download button
      disableRightClick: true, // Blocks right-click on video
      showWatermark:    true,  // "GogalEdu Academy" overlay on video
      pauseOnHide:      true   // Pauses when user switches tab/window
    }

  }

  // ================================================================
  // ↓ ADD NEW COURSES BELOW THIS LINE
  // ================================================================

  // "python-basics": {
  //   slug: "python-basics",
  //   hero: { title: "Python Basics", ... },
  //   ...
  // },

  // "sql-mastery": {
  //   slug: "sql-mastery",
  //   hero: { title: "SQL Mastery", ... },
  //   ...
  // }

};