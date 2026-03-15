// db/spcourses.js

/*
  Self-Paced Course Database

  This file stores ALL course curriculum.

  Structure:
  course-slug
      └ title
      └ image
      └ duration
      └ lessons
      └ modules[]
            └ title
            └ lessons[]
                  └ title
                  └ video
                  └ free (true = preview lesson)

  Later you can easily add:
  "sql": { ... }
  "python": { ... }
  "power-bi": { ... }
  "tableau": { ... }
*/

// db/spcourses.js

/*
Self-Paced Course Database
All courses must follow the SAME structure.

course
  └ modules
        └ lessons
*/

export const spcourses = {

  /* ================= EXCEL ================= */

  "advance-excel": {

    slug: "advance-excel",

    /* ---------------- HERO SECTION DATA ---------------- */

    hero: {

      title: "Data Analyst",

      subtitle:
        "Master Excel from basics to advanced dashboards, automation and data analysis. Build real industry projects and get job-ready skills.",

      tags: [
        { label: "Beginner to Advanced", icon: "target" },
        { label: "Self-Paced", icon: "clock" },
        { label: "Online", icon: "online" }
      ],

      stats: {
        rating: "4.7",
        students: "400+",
        projects: "5+",
        guarantee: "100%"
      },

      pricing: {
        price: "5999",
        discountPrice: "2999",
        discount: "50% OFF"
      },

      image: "/course/excel.jpg"

    },

    /* --- OVERVIEW  Section -----*/

    instructor: {
      name: "Rahul Sharma",
      title: "Microsoft Excel Trainer",
      experience: "10+ Years Experience"
    },

    details: {
      certificate: true,
      lifetimeAccess: true,
      downloadableResources: false,
      mobileAccess: true
    },

    requirements: [
      "Basic computer knowledge",
      "Laptop or desktop",
      "Microsoft Excel installed"
    ],

    tools: [
      "Microsoft Excel",
      "Pivot Tables",
      "Power Query",
      "Excel Charts",
      "Macros & Automation"
    ],

    overview: [
      "Build real-world business dashboards",
      "Master Excel formulas & functions",
      "Analyze large datasets professionally",
      "Create pivot tables and dynamic charts",
      "Automate reports using macros",
      "Build portfolio projects"
    ],

    /* ---- CURRICULUM SECTION ---- */

    freePreview: [
      {
        title: "Course Introduction",
        durationSeconds: 83,
        video: "/videos/excel-intro.mp4",
        description: "Overview of what you will learn in this course"
      },
      {
        title: "Excel Interface Tour",
        durationSeconds: 600,
        video: "/videos/excel-interface.mp4",
        description: "Understanding Excel layout and tools"
      }
    ],

    curriculum: [

      {
        moduleTitle: "Excel Fundamentals",
        moduleDescription:
          "Learn Excel interface, formatting and basic formulas.",

        lessons: [
          {
            lessonTitle: "Excel Interface Explained",
            durationSeconds: 620,
            video: "/videos/excel1.mp4",
            preview: false
          },
          {
            lessonTitle: "Basic Excel Formulas",
            durationSeconds: 765,
            video: "/videos/excel2.mp4",
            preview: false
          }
        ]
      },

      {
        moduleTitle: "Intermediate Excel Skills",
        moduleDescription:
          "Learn sorting, filtering and conditional formatting.",

        lessons: [
          {
            lessonTitle: "Sorting & Filtering Data",
            durationSeconds: 690,
            video: "/videos/excel-filter.mp4",
            preview: false
          },
          {
            lessonTitle: "Conditional Formatting",
            durationSeconds: 580,
            video: "/videos/excel-format.mp4",
            preview: false
          }
        ]
      },

      {
        moduleTitle: "Advanced Excel & Dashboards",
        moduleDescription:
          "Create professional dashboards and automate reports.",

        lessons: [
          {
            lessonTitle: "Pivot Tables Masterclass",
            durationSeconds: 900,
            video: "/videos/excel3.mp4",
            preview: false
          },
          {
            lessonTitle: "Creating Excel Dashboards",
            durationSeconds: 1100,
            video: "/videos/excel4.mp4",
            preview: false
          }
        ]
      }

    ],

    videoProtection: {
      disableDownload: true,
      disableRightClick: true,
      disablePictureInPicture: true,
      preventScreenCapture: true
    }

  }

};

  /* ================= SQL ================= */ /*

  "sql": {
    title: "SQL for Data Analytics",
    image: "/course/sql.jpg",
    rating: "4.7",
    students: "900+",
    projects: "5",
    description:
      "Learn SQL from basics to advanced analytics queries used by data analysts.",

    modules: [
      {
        title: "SQL Fundamentals",
        lessons: []
      },
      {
        title: "Basic Queries",
        lessons: []
      },
      {
        title: "Aggregation",
        lessons: []
      },
      {
        title: "SQL JOINs",
        lessons: []
      }
    ]
  },
*/

  /* ================= POWER BI ================= */ /*

  "power-bi": {
    title: "Power BI",
    image: "/course/powerbi.jpg",
    rating: "4.8",
    students: "800+",
    projects: "5",
    description:
      "Create powerful dashboards and business intelligence reports using Power BI.",

    modules: [
      { title: "Power BI Introduction", lessons: [] },
      { title: "Data Import", lessons: [] },
      { title: "Power Query", lessons: [] },
      { title: "Data Modeling", lessons: [] },
      { title: "DAX Fundamentals", lessons: [] }
    ]
  },

*/
  /* ================= TABLEAU ================= */ /*

  "tableau": {
    title: "Tableau",
    image: "/course/tableau.jpg",
    rating: "4.7",
    students: "600+",
    projects: "5",
    description:
      "Build professional data visualization dashboards using Tableau.",

    modules: [
      { title: "Tableau Introduction", lessons: [] },
      { title: "Connecting Data", lessons: [] },
      { title: "Basic Charts", lessons: [] },
      { title: "Calculated Fields", lessons: [] },
      { title: "Dashboard Design", lessons: [] }
    ]
  },
*/

  /* ================= PYTHON ================= */ /*

  "python": {
    title: "Python for Data Analytics",
    image: "/course/python.jpg",
    rating: "4.8",
    students: "700+",
    projects: "6",
    description:
      "Learn Python programming for automation, data analysis and visualization.",

    modules: [
      { title: "Python Introduction", lessons: [] },
      { title: "Variables & Data Types", lessons: [] },
      { title: "Conditions", lessons: [] },
      { title: "Loops", lessons: [] },
      { title: "Data Structures", lessons: [] }
    ]
  }  

}; */

/*
HOW TO ADD NEW COURSES LATER

Example:

"sql": {
   title:"SQL",
   image:"/course/sql.jpg",
   duration:"9 Modules",
   lessons:"60+ Lessons",
   modules:[ ... ]
}

Just copy the same structure.
*/