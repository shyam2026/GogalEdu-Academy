// db/CourseData.js
//
// ═══════════════════════════════════════════════════════════════
// GOGALEDU ACADEMY — COURSE DATABASE
// ═══════════════════════════════════════════════════════════════
//
// DATA SCHEMA PER COURSE:
//   id, title, slug, duration, mode, level, rating, reviews,
//   students, project, image, achievementGoal,
//   syllabus[]:
//     month       — "Month N: Title"
//     tool        — which tool is primary this month (for project unlock logic)
//                   "Excel" | "SQL" | "Power BI" | "Python" | "Tableau" | "Capstone" | null
//     projects[]  — 4 projects per tool month, 1 for capstone, 1 isFinal for final
//     isFinalMonth— true on the last month (triggers certificate eligibility)
//     weeks[]:
//       title     — "Week N: Title"
//       topics[]  — { title: string, video: string }
//       quiz[]    — { question, options[4], answer (0-indexed) }
//                   IMPORTANT: answer index is NEVER shown to students in UI
//
// VIDEO PATH CONVENTION:
//   /videos/{slug}/m{month}-w{week}-t{topic}.mp4
//   e.g. /videos/data-analyst/m1-w1-t1.mp4
//
// PROJECT PATH CONVENTION:
//   /projects/{slug}-m{month}-p{project}.pdf
//
// ADDING A NEW COURSE:
//   1. Copy any existing course object
//   2. Update all fields (id must be unique)
//   3. Add course image to /public/course/
//   4. Add videos to /public/videos/{slug}/
//   5. Add project PDFs to /public/projects/
// ═══════════════════════════════════════════════════════════════

export const CourseData = [

  // ═══════════════════════════════════════════════════════════════
  // COURSE 1 — DATA ANALYST
  // ═══════════════════════════════════════════════════════════════
  {
    id: 1,
    title: "Data Analyst",
    slug: "data-analyst-course",
    duration: "6 Months",
    mode: "Online/Offline",
    level: "Beginner to Advanced",
    rating: 4.9,
    reviews: "1.3k",
    students: "1.5k+",
    project: "25",
    achievementGoal: "Master Data Cleaning, Analysis, Excel, SQL, and Dashboards to Turn Raw Data into Real Business Insights.",
    image: "/course/data-analyst.png",
    bonusAddOns: [
      "Internship after completion",
      "Alumni Network",
      "Real world client projects for interested students",
      "Multiple offer letter"
    ],

    syllabus: [

      // ──────────────────────────────────────────────────────────
      // MONTH 1 — Excel
      // ──────────────────────────────────────────────────────────
      {
        month: "Month 1: Introduction to Data & Excel Mastery",
        tool: "Excel", // ← triggers 4 Excel projects below
        projects: [
          { id: "da-m1-p1", title: "Sales Performance Dashboard",      description: "Build an automated monthly sales report with dynamic charts, KPI cards and conditional formatting using real sales data.",       tool: "Excel", downloadFile: "/projects/data-analyst-m1-p1.pdf", downloadFileName: "DA_Month1_Project1_SalesDashboard.pdf",      isFinal: false },
          { id: "da-m1-p2", title: "HR Attendance & Leave Tracker",     description: "Design an Excel tracker for employee attendance, leave balances and department-wise summary with pivot charts.",                  tool: "Excel", downloadFile: "/projects/data-analyst-m1-p2.pdf", downloadFileName: "DA_Month1_Project2_HRTracker.pdf",             isFinal: false },
          { id: "da-m1-p3", title: "Financial Expense Summary Report",  description: "Create a multi-sheet financial report with income vs expense comparison, trend lines and automated summary formulas.",            tool: "Excel", downloadFile: "/projects/data-analyst-m1-p3.pdf", downloadFileName: "DA_Month1_Project3_FinancialReport.pdf",       isFinal: false },
          { id: "da-m1-p4", title: "Inventory Stock Management Sheet",  description: "Build a dynamic inventory tracker with reorder alerts, stock-level bars and conditional formatting for low stock items.",          tool: "Excel", downloadFile: "/projects/data-analyst-m1-p4.pdf", downloadFileName: "DA_Month1_Project4_InventoryManagement.pdf",  isFinal: false }
          // ↓ ADD MORE MONTH 1 PROJECTS HERE
        ],
        weeks: [
          {
            title: "Week 1: Introduction to Data Analysis",
            topics: [
              { title: "What is Data Analysis?",                          video: "/videos/excel-intro.mp4" },
              { title: "Types of Data",                                   video: "/videos/data-analyst/m1-w1-t2.mp4" },
              { title: "Data Analytics Life Cycle",                       video: "/videos/data-analyst/m1-w1-t3.mp4" },
              { title: "Role & Responsibilities of a Data Analyst",       video: "/videos/data-analyst/m1-w1-t4.mp4" }
              // ↓ ADD MORE WEEK 1 TOPICS HERE
            ],
            quiz: [
              { question: "What is the primary goal of Data Analysis?",
                options: ["Create websites", "Extract insights and meaning from raw data", "Write programs", "Design databases"],
                answer: 1 },
              { question: "Which is NOT a type of data?",
                options: ["Structured", "Unstructured", "Semi-structured", "Hyper-structured"],
                answer: 3 },
              { question: "Which stage comes FIRST in the Data Analytics Life Cycle?",
                options: ["Visualisation", "Modelling", "Data Collection", "Reporting"],
                answer: 2 },
              { question: "A Data Analyst primarily works with:",
                options: ["Only code", "Hardware devices", "Data to find patterns and insights for business decisions", "Network infrastructure"],
                answer: 2 }
              // ↓ ADD MORE WEEK 1 QUIZ QUESTIONS HERE
            ]
          },
          {
            title: "Week 2: Advanced Excel",
            topics: [
              { title: "Functions & Formulas (VLOOKUP, INDEX-MATCH, IF, SUMIFS)",  video: "/videos/data-analyst/m1-w2-t1.mp4" },
              { title: "Pivot Tables & Charts",                                     video: "/videos/data-analyst/m1-w2-t2.mp4" },
              { title: "Data Cleaning & Formatting",                                video: "/videos/data-analyst/m1-w2-t3.mp4" },
              { title: "Dashboards in Excel",                                       video: "/videos/data-analyst/m1-w2-t4.mp4" },
              { title: "Case Study: Sales Dashboard in Excel",                      video: "/videos/data-analyst/m1-w2-t5.mp4" }
              // ↓ ADD MORE WEEK 2 TOPICS HERE
            ],
            quiz: [
              { question: "VLOOKUP searches for a value in which direction?",
                options: ["Left to right across columns", "Vertically top to bottom in the first column", "Any direction", "Bottom to top"],
                answer: 1 },
              { question: "Which Excel function returns a value from a range based on row and column position?",
                options: ["VLOOKUP", "SUMIF", "INDEX-MATCH", "COUNTIF"],
                answer: 2 },
              { question: "A Pivot Table is used to:",
                options: ["Format cell colours", "Summarise and group large datasets interactively", "Write macros", "Create dropdown lists"],
                answer: 1 },
              { question: "SUMIFS allows you to sum values:",
                options: ["Based on one condition only", "Based on multiple conditions", "Without any condition", "Only across sheets"],
                answer: 1 }
              // ↓ ADD MORE WEEK 2 QUIZ QUESTIONS HERE
            ]
          }
        ]
      },

      // ──────────────────────────────────────────────────────────
      // MONTH 2 — SQL
      // ──────────────────────────────────────────────────────────
      {
        month: "Month 2: SQL for Data Analysts",
        tool: "SQL",
        projects: [
          { id: "da-m2-p1", title: "E-commerce Order Analytics",       description: "Write SQL queries to analyse order trends, top customers and product performance from an e-commerce database.",             tool: "SQL", downloadFile: "/projects/data-analyst-m2-p1.pdf", downloadFileName: "DA_Month2_Project1_EcommerceSQL.pdf",         isFinal: false },
          { id: "da-m2-p2", title: "Employee Database Queries",         description: "Query an HR employee database to extract salary bands, department headcounts and attrition analysis using JOINs.",          tool: "SQL", downloadFile: "/projects/data-analyst-m2-p2.pdf", downloadFileName: "DA_Month2_Project2_EmployeeDatabase.pdf",      isFinal: false },
          { id: "da-m2-p3", title: "Customer Segmentation Analysis",    description: "Segment customers by purchase frequency and spend using GROUP BY, HAVING and subqueries on a retail dataset.",              tool: "SQL", downloadFile: "/projects/data-analyst-m2-p3.pdf", downloadFileName: "DA_Month2_Project3_CustomerSegmentation.pdf", isFinal: false },
          { id: "da-m2-p4", title: "Product Performance Report",        description: "Generate a product-level performance report using window functions, running totals and RANK() on a sales database.",         tool: "SQL", downloadFile: "/projects/data-analyst-m2-p4.pdf", downloadFileName: "DA_Month2_Project4_ProductPerformance.pdf",    isFinal: false }
          // ↓ ADD MORE MONTH 2 PROJECTS HERE
        ],
        weeks: [
          {
            title: "Week 3: SQL Basics",
            topics: [
              { title: "DBMS & RDBMS",                                   video: "/videos/data-analyst/m2-w1-t1.mp4" },
              { title: "SELECT, WHERE, ORDER BY, GROUP BY",               video: "/videos/data-analyst/m2-w1-t2.mp4" },
              { title: "Data Filtering & Sorting",                        video: "/videos/data-analyst/m2-w1-t3.mp4" }
              // ↓ ADD MORE WEEK 3 TOPICS HERE
            ],
            quiz: [
              { question: "RDBMS stands for:",
                options: ["Real Database Management System", "Relational Database Management System", "Remote Database Module System", "Rapid Data Management Software"],
                answer: 1 },
              { question: "Which SQL clause is used to filter rows?",
                options: ["ORDER BY", "GROUP BY", "WHERE", "HAVING"],
                answer: 2 },
              { question: "ORDER BY sorts results in what order by default?",
                options: ["Descending", "Ascending", "Random", "Alphabetical only"],
                answer: 1 }
              // ↓ ADD MORE WEEK 3 QUIZ QUESTIONS HERE
            ]
          },
          {
            title: "Week 4: Advanced SQL",
            topics: [
              { title: "JOINS (INNER, OUTER, LEFT, RIGHT)",               video: "/videos/data-analyst/m2-w2-t1.mp4" },
              { title: "Subqueries, Views, Stored Procedures",             video: "/videos/data-analyst/m2-w2-t2.mp4" },
              { title: "Aggregate Functions",                              video: "/videos/data-analyst/m2-w2-t3.mp4" },
              { title: "Real-world Query Practice (E-Commerce / HR)",      video: "/videos/data-analyst/m2-w2-t4.mp4" }
              // ↓ ADD MORE WEEK 4 TOPICS HERE
            ],
            quiz: [
              { question: "INNER JOIN returns:",
                options: ["All rows from both tables", "Only matching rows from both tables", "All rows from left table only", "All rows from right table only"],
                answer: 1 },
              { question: "A subquery is:",
                options: ["A stored procedure", "A query written inside another query", "A type of JOIN", "A table alias"],
                answer: 1 },
              { question: "Which aggregate function returns the total count of rows?",
                options: ["SUM()", "AVG()", "COUNT()", "MAX()"],
                answer: 2 }
              // ↓ ADD MORE WEEK 4 QUIZ QUESTIONS HERE
            ]
          }
        ]
      },

      // ──────────────────────────────────────────────────────────
      // MONTH 3 — Power BI
      // ──────────────────────────────────────────────────────────
      {
        month: "Month 3: Power BI (Business Intelligence)",
        tool: "Power BI",
        projects: [
          { id: "da-m3-p1", title: "Sales KPI Dashboard",                description: "Build an interactive sales dashboard with KPI cards, bar charts, slicers and drill-through from region to product.",         tool: "Power BI", downloadFile: "/projects/data-analyst-m3-p1.pdf", downloadFileName: "DA_Month3_Project1_SalesKPI.pdf",             isFinal: false },
          { id: "da-m3-p2", title: "Marketing Campaign Dashboard",        description: "Visualise campaign performance, lead conversion rates and ROI across channels with dynamic Power BI filters.",                tool: "Power BI", downloadFile: "/projects/data-analyst-m3-p2.pdf", downloadFileName: "DA_Month3_Project2_MarketingDashboard.pdf",    isFinal: false },
          { id: "da-m3-p3", title: "Finance P&L Dashboard",               description: "Create a Profit & Loss dashboard with YTD calculations, variance analysis and monthly trend lines using DAX.",               tool: "Power BI", downloadFile: "/projects/data-analyst-m3-p3.pdf", downloadFileName: "DA_Month3_Project3_FinanceDashboard.pdf",      isFinal: false },
          { id: "da-m3-p4", title: "Operations Performance Dashboard",     description: "Track operational KPIs, delivery timelines and supplier performance with drill-through and trend analysis.",                  tool: "Power BI", downloadFile: "/projects/data-analyst-m3-p4.pdf", downloadFileName: "DA_Month3_Project4_OperationsDashboard.pdf",  isFinal: false }
          // ↓ ADD MORE MONTH 3 PROJECTS HERE
        ],
        weeks: [
          {
            title: "Week 5: Power BI Basics",
            topics: [
              { title: "Introduction to Power BI",                        video: "/videos/data-analyst/m3-w1-t1.mp4" },
              { title: "Power Query Editor",                              video: "/videos/data-analyst/m3-w1-t2.mp4" },
              { title: "Data Transformation",                             video: "/videos/data-analyst/m3-w1-t3.mp4" }
              // ↓ ADD MORE WEEK 5 TOPICS HERE
            ],
            quiz: [
              { question: "Power Query Editor is used for:",
                options: ["Writing DAX measures", "Cleaning and transforming data before loading", "Publishing reports", "Creating relationships"],
                answer: 1 },
              { question: "Power BI Desktop is:",
                options: ["A paid cloud tool", "A free Windows application for building reports", "A mobile app only", "A database engine"],
                answer: 1 },
              { question: "Data transformation in Power BI happens in:",
                options: ["The report view", "Power Query Editor", "DAX Studio", "The data model view"],
                answer: 1 }
              // ↓ ADD MORE WEEK 5 QUIZ QUESTIONS HERE
            ]
          },
          {
            title: "Week 6: DAX & Visualization",
            topics: [
              { title: "DAX Measures & Calculated Columns",               video: "/videos/data-analyst/m3-w2-t1.mp4" },
              { title: "Creating Interactive Dashboards",                  video: "/videos/data-analyst/m3-w2-t2.mp4" },
              { title: "Publishing on Power BI Service",                   video: "/videos/data-analyst/m3-w2-t3.mp4" },
              { title: "Case Study: Sales Performance Dashboard",          video: "/videos/data-analyst/m3-w2-t4.mp4" }
              // ↓ ADD MORE WEEK 6 TOPICS HERE
            ],
            quiz: [
              { question: "DAX stands for:",
                options: ["Data Analysis Expressions", "Data Aggregation XML", "Dynamic Analysis Extension", "Data Access Exchange"],
                answer: 0 },
              { question: "A DAX Measure differs from a Calculated Column because:",
                options: ["Measures are static", "Measures evaluate dynamically based on filter context", "Columns are faster", "There is no difference"],
                answer: 1 },
              { question: "A Slicer in Power BI is used to:",
                options: ["Delete data", "Filter visuals interactively on a report page", "Write DAX", "Connect data sources"],
                answer: 1 }
              // ↓ ADD MORE WEEK 6 QUIZ QUESTIONS HERE
            ]
          }
        ]
      },

      // ──────────────────────────────────────────────────────────
      // MONTH 4 — Python
      // ──────────────────────────────────────────────────────────
      {
        month: "Month 4: Python for Data Analysis",
        tool: "Python",
        projects: [
          { id: "da-m4-p1", title: "Customer Data Analysis",              description: "Load and clean a customer dataset using Pandas, compute key metrics and visualise trends with Matplotlib.",                  tool: "Python", downloadFile: "/projects/data-analyst-m4-p1.pdf", downloadFileName: "DA_Month4_Project1_CustomerAnalysis.pdf",     isFinal: false },
          { id: "da-m4-p2", title: "Sales Trend Analysis with Python",    description: "Analyse monthly sales trends, calculate moving averages and visualise patterns using Pandas and Seaborn.",                   tool: "Python", downloadFile: "/projects/data-analyst-m4-p2.pdf", downloadFileName: "DA_Month4_Project2_SalesTrend.pdf",            isFinal: false },
          { id: "da-m4-p3", title: "HR Attrition EDA",                    description: "Perform exploratory data analysis on HR attrition data — segment by department, visualise distributions and find drivers.",   tool: "Python", downloadFile: "/projects/data-analyst-m4-p3.pdf", downloadFileName: "DA_Month4_Project3_HRAttrition.pdf",           isFinal: false },
          { id: "da-m4-p4", title: "Stock Price EDA",                     description: "Download historical stock data, compute daily returns and volatility, and present insights with Matplotlib charts.",          tool: "Python", downloadFile: "/projects/data-analyst-m4-p4.pdf", downloadFileName: "DA_Month4_Project4_StockPriceEDA.pdf",         isFinal: false }
          // ↓ ADD MORE MONTH 4 PROJECTS HERE
        ],
        weeks: [
          {
            title: "Week 7: Python Basics",
            topics: [
              { title: "Introduction to Python",                           video: "/videos/data-analyst/m4-w1-t1.mp4" },
              { title: "Variables, Data Types, Loops, Functions",          video: "/videos/data-analyst/m4-w1-t2.mp4" },
              { title: "Pandas & NumPy Basics",                            video: "/videos/data-analyst/m4-w1-t3.mp4" }
              // ↓ ADD MORE WEEK 7 TOPICS HERE
            ],
            quiz: [
              { question: "A Pandas DataFrame is:",
                options: ["A single column of data", "A 2-dimensional labelled data structure with rows and columns", "A list of numbers", "A dictionary only"],
                answer: 1 },
              { question: "Which command reads a CSV file in Pandas?",
                options: ["pd.read_excel()", "pd.open_csv()", "pd.read_csv()", "pd.load_csv()"],
                answer: 2 },
              { question: "NumPy is primarily used for:",
                options: ["Web scraping", "Numerical computing with arrays", "Database management", "Building dashboards"],
                answer: 1 }
              // ↓ ADD MORE WEEK 7 QUIZ QUESTIONS HERE
            ]
          },
          {
            title: "Week 8: Data Analysis with Python",
            topics: [
              { title: "Data Cleaning in Pandas",                          video: "/videos/data-analyst/m4-w2-t1.mp4" },
              { title: "Exploratory Data Analysis (EDA)",                   video: "/videos/data-analyst/m4-w2-t2.mp4" },
              { title: "Matplotlib & Seaborn Basics",                       video: "/videos/data-analyst/m4-w2-t3.mp4" },
              { title: "Case Study: EDA on a Real Dataset",                 video: "/videos/data-analyst/m4-w2-t4.mp4" }
              // ↓ ADD MORE WEEK 8 TOPICS HERE
            ],
            quiz: [
              { question: "dropna() in Pandas is used to:",
                options: ["Add missing values", "Remove rows or columns with NaN values", "Sort data", "Group data"],
                answer: 1 },
              { question: "Seaborn is built on top of:",
                options: ["NumPy only", "Pandas only", "Matplotlib", "Plotly"],
                answer: 2 },
              { question: "EDA stands for:",
                options: ["External Data Analysis", "Exploratory Data Analysis", "Extended Data Aggregation", "Embedded Data Architecture"],
                answer: 1 }
              // ↓ ADD MORE WEEK 8 QUIZ QUESTIONS HERE
            ]
          }
        ]
      },

      // ──────────────────────────────────────────────────────────
      // MONTH 5 — Tableau / Data Visualization
      // ──────────────────────────────────────────────────────────
      {
        month: "Month 5: Data Visualization & Storytelling",
        tool: "Tableau",
        projects: [
          { id: "da-m5-p1", title: "Regional Sales Dashboard (Tableau)",   description: "Build an interactive regional sales dashboard with maps, filters, bar charts and drill-through in Tableau.",              tool: "Tableau", downloadFile: "/projects/data-analyst-m5-p1.pdf", downloadFileName: "DA_Month5_Project1_RegionalSales.pdf",       isFinal: false },
          { id: "da-m5-p2", title: "Customer Behaviour Dashboard",          description: "Analyse customer segments, purchase patterns and retention using scatter plots and LOD expressions in Tableau.",            tool: "Tableau", downloadFile: "/projects/data-analyst-m5-p2.pdf", downloadFileName: "DA_Month5_Project2_CustomerBehaviour.pdf",   isFinal: false },
          { id: "da-m5-p3", title: "HR Analytics Dashboard (Tableau)",      description: "Visualise attrition, headcount trends, department performance and salary bands in Tableau with interactive filters.",       tool: "Tableau", downloadFile: "/projects/data-analyst-m5-p3.pdf", downloadFileName: "DA_Month5_Project3_HRAnalytics.pdf",         isFinal: false },
          { id: "da-m5-p4", title: "Financial Performance Dashboard",        description: "Build a Tableau P&L dashboard with trend analysis, variance charts and dual-axis KPI views.",                              tool: "Tableau", downloadFile: "/projects/data-analyst-m5-p4.pdf", downloadFileName: "DA_Month5_Project4_FinancialPerformance.pdf",isFinal: false }
          // ↓ ADD MORE MONTH 5 PROJECTS HERE
        ],
        weeks: [
          {
            title: "Week 9: Tableau & Advanced Visualization",
            topics: [
              { title: "Tableau Basics / Advanced BI Techniques",           video: "/videos/data-analyst/m5-w1-t1.mp4" },
              { title: "Storytelling with Data",                            video: "/videos/data-analyst/m5-w1-t2.mp4" },
              { title: "Connecting Live Data Sources",                       video: "/videos/data-analyst/m5-w1-t3.mp4" },
              { title: "Visualization Best Practices",                       video: "/videos/data-analyst/m5-w1-t4.mp4" }
              // ↓ ADD MORE WEEK 9 TOPICS HERE
            ],
            quiz: [
              { question: "In Tableau, Dimensions are:",
                options: ["Numeric values to aggregate", "Categorical fields used to group data", "Always dates", "Calculated fields only"],
                answer: 1 },
              { question: "A Level of Detail (LOD) expression in Tableau is used to:",
                options: ["Change chart type", "Compute at a different granularity from the current view", "Connect to a database", "Format colours"],
                answer: 1 },
              { question: "Best practice for data storytelling is:",
                options: ["Use as many chart types as possible", "Lead with the key insight and support with visuals", "Use only pie charts", "Never use colour"],
                answer: 1 }
              // ↓ ADD MORE WEEK 9 QUIZ QUESTIONS HERE
            ]
          },
          {
            title: "Week 10: Capstone Preparation",
            topics: [
              { title: "Choose a Real Dataset (Finance, Health, HR, E-commerce)", video: "/videos/data-analyst/m5-w2-t1.mp4" },
              { title: "Project Planning & Scope Definition",                      video: "/videos/data-analyst/m5-w2-t2.mp4" }
              // ↓ ADD MORE WEEK 10 TOPICS HERE
            ],
            quiz: [
              { question: "What is the first step when starting a data analysis project?",
                options: ["Build a dashboard immediately", "Define the business question and understand the data", "Run machine learning models", "Present to stakeholders"],
                answer: 1 },
              { question: "Which of these is a good source of free real-world datasets?",
                options: ["Google Forms", "Kaggle", "Microsoft Paint", "Adobe XD"],
                answer: 1 }
              // ↓ ADD MORE WEEK 10 QUIZ QUESTIONS HERE
            ]
          }
        ]
      },

      // ──────────────────────────────────────────────────────────
      // MONTH 6 — Capstone + Career (FINAL MONTH)
      // ──────────────────────────────────────────────────────────
      {
        month: "Month 6: Capstone Project + Career Preparation",
        tool: "Capstone",
        isFinalMonth: true, // ← certificate eligibility starts here
        projects: [
          {
            id: "da-m6-capstone",
            title: "Capstone Project — End-to-End Data Analysis",
            description: "Choose a real-world dataset and perform full EDA, cleaning, SQL queries, Power BI or Tableau dashboard, and Python analysis. Submit a complete Jupyter Notebook + dashboard.",
            tool: "Capstone",
            downloadFile: "/projects/data-analyst-m6-capstone.pdf",
            downloadFileName: "DA_Month6_CapstoneBrief.pdf",
            isFinal: false
          },
          {
            id: "da-m6-final",
            title: "Final Project — Portfolio Presentation",
            description: "Present your capstone project as a professional portfolio piece. Include a written summary, dashboard screenshots, SQL scripts and Jupyter Notebook. This is your final assessment.",
            tool: "Final",
            downloadFile: "/projects/data-analyst-m6-final.pdf",
            downloadFileName: "DA_Month6_FinalProjectBrief.pdf",
            isFinal: true  // ← admin must accept this to unlock certificate
          }
          // ↓ ADD MORE CAPSTONE PROJECTS HERE
        ],
        weeks: [
          {
            title: "Week 11: Final Project",
            topics: [
              { title: "Apply All Learned Skills",                          video: "/videos/data-analyst/m6-w1-t1.mp4" },
              { title: "Create a Dynamic Dashboard or Analysis Report",     video: "/videos/data-analyst/m6-w1-t2.mp4" },
              { title: "Project Presentation & Evaluation",                 video: "/videos/data-analyst/m6-w1-t3.mp4" }
              // ↓ ADD MORE WEEK 11 TOPICS HERE
            ],
            quiz: [
              { question: "An end-to-end data analysis project should include:",
                options: ["Only visualisation", "Data loading, cleaning, analysis, visualisation and insight communication", "Only SQL queries", "Only Python code"],
                answer: 1 },
              { question: "A good dashboard for a portfolio should:",
                options: ["Show all data without filtering", "Be clean, interactive and highlight key business insights", "Use maximum colours", "Only include text"],
                answer: 1 }
              // ↓ ADD MORE WEEK 11 QUIZ QUESTIONS HERE
            ]
          },
          {
            title: "Week 12: Career Readiness",
            topics: [
              { title: "Resume Building for Data Analyst",                  video: "/videos/data-analyst/m6-w2-t1.mp4" },
              { title: "LinkedIn Profile & Portfolio Creation",             video: "/videos/data-analyst/m6-w2-t2.mp4" },
              { title: "Interview Preparation (Technical + HR)",            video: "/videos/data-analyst/m6-w2-t3.mp4" },
              { title: "Mock Interviews + FAQs for Data Analyst Roles",     video: "/videos/data-analyst/m6-w2-t4.mp4" }
              // ↓ ADD MORE WEEK 12 TOPICS HERE
            ],
            quiz: [
              { question: "Which section of a Data Analyst resume should highlight SQL, Python, Excel and Power BI?",
                options: ["Education section", "Hobbies section", "Technical Skills section", "References section"],
                answer: 2 },
              { question: "A strong portfolio project should demonstrate:",
                options: ["Only Excel skills", "End-to-end data skills with a business impact story", "Only Python code", "Only charts"],
                answer: 1 }
              // ↓ ADD MORE WEEK 12 QUIZ QUESTIONS HERE
            ]
          }
        ]
      }

      // ↓ ADD MORE MONTHS HERE

    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // COURSE 2 — BUSINESS ANALYST
  // ═══════════════════════════════════════════════════════════════
  {
    id: 2,
    title: "Business Analyst",
    slug: "business-analyst-course",
    duration: "6 Months",
    mode: "Online/Offline",
    level: "Beginner to Advanced",
    rating: 4.9,
    reviews: "1.1k",
    students: "1.3k+",
    project: "25",
    image: "/course/business-analyst.png",
    achievementGoal: "Learn Business Requirements, Documentation and Analytics to Bridge the gap between Data, Processes, and Decisions.",
    bonusAddOns: [
      "Internship after completion",
      "Alumni Network",
      "Real world client projects for interested students",
      "Multiple offer letter"
    ],
    syllabus: [
      {
        month: "Month 1: Business Analysis Foundations & Excel",
        tool: "Excel",
        projects: [
          { id: "ba-m1-p1", title: "Financial ROI Dashboard in Excel",    description: "Build a return-on-investment tracker with scenario analysis, charts and automated formula calculations.",                    tool: "Excel", downloadFile: "/projects/business-analyst-m1-p1.pdf", downloadFileName: "BA_Month1_Project1_ROIDashboard.pdf",         isFinal: false },
          { id: "ba-m1-p2", title: "Project Tracker & Status Report",     description: "Create an Excel project tracker with milestone timelines, RAG status indicators and automated progress calculations.",        tool: "Excel", downloadFile: "/projects/business-analyst-m1-p2.pdf", downloadFileName: "BA_Month1_Project2_ProjectTracker.pdf",       isFinal: false },
          { id: "ba-m1-p3", title: "Sales Pipeline Analysis",             description: "Analyse a sales pipeline with stage conversions, deal values and win/loss analysis using pivot tables.",                      tool: "Excel", downloadFile: "/projects/business-analyst-m1-p3.pdf", downloadFileName: "BA_Month1_Project3_SalesPipeline.pdf",        isFinal: false },
          { id: "ba-m1-p4", title: "Budget vs Actuals Comparison",        description: "Build a monthly budget vs actual expense comparison sheet with variance analysis and dynamic charts.",                         tool: "Excel", downloadFile: "/projects/business-analyst-m1-p4.pdf", downloadFileName: "BA_Month1_Project4_BudgetActuals.pdf",        isFinal: false }
        ],
        weeks: [
          {
            title: "Week 1: Introduction to Business Analysis",
            topics: [
              { title: "What is Business Analysis?",                        video: "/videos/business-analyst/m1-w1-t1.mp4" },
              { title: "Key Roles and Responsibilities",                    video: "/videos/business-analyst/m1-w1-t2.mp4" },
              { title: "Stakeholders and SDLC Models",                      video: "/videos/business-analyst/m1-w1-t3.mp4" }
            ],
            quiz: [
              { question: "A Business Analyst primarily acts as:",
                options: ["A software developer", "A bridge between business needs and technical solutions", "A network engineer", "A financial auditor"],
                answer: 1 },
              { question: "SDLC stands for:",
                options: ["Software Design Life Cycle", "System Development Life Cycle", "Structured Data Learning Cycle", "Standard Design Language Components"],
                answer: 1 },
              { question: "A stakeholder in a project is:",
                options: ["Only the client", "Anyone who has an interest in or is affected by the project", "Only the developers", "Only the manager"],
                answer: 1 }
            ]
          },
          {
            title: "Week 2: Advanced Excel for BAs",
            topics: [
              { title: "Functions (IF, VLOOKUP, INDEX-MATCH, etc.)",        video: "/videos/business-analyst/m1-w2-t1.mp4" },
              { title: "Scenario Analysis",                                  video: "/videos/business-analyst/m1-w2-t2.mp4" },
              { title: "PivotTables, Charts and Dashboard Preparation",      video: "/videos/business-analyst/m1-w2-t3.mp4" },
              { title: "Case Study: Financial ROI Dashboard",                video: "/videos/business-analyst/m1-w2-t4.mp4" }
            ],
            quiz: [
              { question: "Scenario analysis in Excel is used to:",
                options: ["Format cells", "Evaluate multiple what-if situations and their outcomes", "Sort data", "Remove duplicates"],
                answer: 1 },
              { question: "INDEX-MATCH is preferred over VLOOKUP because:",
                options: ["It is easier to type", "It is more flexible and can search left-to-right or right-to-left", "It works only on numbers", "It is slower"],
                answer: 1 }
            ]
          }
        ]
      },
      {
        month: "Month 2: SQL for Business Analysts",
        tool: "SQL",
        projects: [
          { id: "ba-m2-p1", title: "Business KPI Data Extraction",        description: "Write SQL queries to extract and compute business KPIs from a transactional database.",                                        tool: "SQL", downloadFile: "/projects/business-analyst-m2-p1.pdf", downloadFileName: "BA_Month2_Project1_KPIExtraction.pdf",         isFinal: false },
          { id: "ba-m2-p2", title: "Customer Retention Query Set",         description: "Build a set of SQL queries to analyse customer retention, churn rate and repeat purchase patterns.",                           tool: "SQL", downloadFile: "/projects/business-analyst-m2-p2.pdf", downloadFileName: "BA_Month2_Project2_CustomerRetention.pdf",     isFinal: false },
          { id: "ba-m2-p3", title: "Sales Region Performance Report",      description: "Use JOINs and GROUP BY to produce a regional sales performance report with rankings.",                                          tool: "SQL", downloadFile: "/projects/business-analyst-m2-p3.pdf", downloadFileName: "BA_Month2_Project3_RegionPerformance.pdf",    isFinal: false },
          { id: "ba-m2-p4", title: "Product Profitability Analysis",       description: "Calculate gross margin, return rates and profitability per product category using aggregate SQL queries.",                       tool: "SQL", downloadFile: "/projects/business-analyst-m2-p4.pdf", downloadFileName: "BA_Month2_Project4_ProductProfitability.pdf", isFinal: false }
        ],
        weeks: [
          {
            title: "Week 3: SQL Basics",
            topics: [
              { title: "Database Concepts",                                  video: "/videos/business-analyst/m2-w1-t1.mp4" },
              { title: "SELECT, WHERE, GROUP BY, ORDER BY Queries",          video: "/videos/business-analyst/m2-w1-t2.mp4" }
            ],
            quiz: [
              { question: "GROUP BY in SQL is used to:",
                options: ["Sort results", "Group rows with the same value for aggregation", "Filter individual rows", "Join tables"],
                answer: 1 },
              { question: "Which SQL command retrieves data from a table?",
                options: ["INSERT", "UPDATE", "SELECT", "DELETE"],
                answer: 2 }
            ]
          },
          {
            title: "Week 4: Advanced SQL for BAs",
            topics: [
              { title: "JOINS, Subqueries",                                  video: "/videos/business-analyst/m2-w2-t1.mp4" },
              { title: "Real-world Data Extraction Scenarios",               video: "/videos/business-analyst/m2-w2-t2.mp4" }
            ],
            quiz: [
              { question: "LEFT JOIN returns:",
                options: ["Only matching rows", "All rows from left table and matching rows from right", "Only right table rows", "No rows"],
                answer: 1 },
              { question: "A subquery is placed:",
                options: ["After the FROM clause only", "Inside another query using parentheses", "Only in SELECT", "Outside the main query"],
                answer: 1 }
            ]
          }
        ]
      },
      {
        month: "Month 3: Power BI / Tableau for BAs",
        tool: "Power BI",
        projects: [
          { id: "ba-m3-p1", title: "Business KPI Dashboard",               description: "Build a Power BI dashboard showing company-wide KPIs with slicers, trend lines and drill-through pages.",                    tool: "Power BI", downloadFile: "/projects/business-analyst-m3-p1.pdf", downloadFileName: "BA_Month3_Project1_KPIDashboard.pdf",       isFinal: false },
          { id: "ba-m3-p2", title: "Stakeholder Reporting Dashboard",       description: "Create a management-level reporting dashboard for stakeholders with summary metrics and actionable insights.",                 tool: "Power BI", downloadFile: "/projects/business-analyst-m3-p2.pdf", downloadFileName: "BA_Month3_Project2_StakeholderReport.pdf",  isFinal: false },
          { id: "ba-m3-p3", title: "Customer Journey Analytics",            description: "Visualise customer funnel stages, drop-off points and conversion rates in an interactive Power BI report.",                    tool: "Power BI", downloadFile: "/projects/business-analyst-m3-p3.pdf", downloadFileName: "BA_Month3_Project3_CustomerJourney.pdf",    isFinal: false },
          { id: "ba-m3-p4", title: "Operational Efficiency Dashboard",      description: "Track process cycle times, bottlenecks and efficiency KPIs using Power BI visuals with conditional formatting.",               tool: "Power BI", downloadFile: "/projects/business-analyst-m3-p4.pdf", downloadFileName: "BA_Month3_Project4_OperationalEfficiency.pdf",isFinal: false }
        ],
        weeks: [
          {
            title: "Week 5: BI Tool Introduction",
            topics: [
              { title: "Connecting to Data Sources",                         video: "/videos/business-analyst/m3-w1-t1.mp4" },
              { title: "Cleaning and Transforming Data",                     video: "/videos/business-analyst/m3-w1-t2.mp4" }
            ],
            quiz: [
              { question: "Power Query is used in Power BI for:",
                options: ["Writing DAX", "Cleaning and transforming data before loading", "Publishing reports", "Creating relationships"],
                answer: 1 }
            ]
          },
          {
            title: "Week 6: Dashboard Development",
            topics: [
              { title: "DAX / Calculated Fields",                            video: "/videos/business-analyst/m3-w2-t1.mp4" },
              { title: "Publishing and Sharing Insights",                    video: "/videos/business-analyst/m3-w2-t2.mp4" },
              { title: "Project: Business KPI Dashboard",                    video: "/videos/business-analyst/m3-w2-t3.mp4" }
            ],
            quiz: [
              { question: "CALCULATE in DAX modifies:",
                options: ["The data source", "The filter context for a measure", "The visual type", "The chart colour"],
                answer: 1 },
              { question: "Power BI Service is used to:",
                options: ["Build data models locally", "Publish and share reports online", "Write Python code", "Create SQL tables"],
                answer: 1 }
            ]
          }
        ]
      },
      {
        month: "Month 4: Business Processes & Documentation",
        tool: null,
        weeks: [
          {
            title: "Week 7: Understanding Business Processes",
            topics: [
              { title: "BPMN (Business Process Model and Notation)",        video: "/videos/business-analyst/m4-w1-t1.mp4" },
              { title: "Process Improvement Methodologies",                 video: "/videos/business-analyst/m4-w1-t2.mp4" }
            ],
            quiz: [
              { question: "BPMN is used to:",
                options: ["Write code", "Model and document business processes visually", "Create financial reports", "Design databases"],
                answer: 1 },
              { question: "Which methodology focuses on eliminating waste from processes?",
                options: ["Agile", "Lean", "BPMN", "Waterfall"],
                answer: 1 }
            ]
          },
          {
            title: "Week 8: Business Documentation",
            topics: [
              { title: "BRD, FRD, Use Cases, User Stories",                 video: "/videos/business-analyst/m4-w2-t1.mp4" },
              { title: "UML Diagrams",                                       video: "/videos/business-analyst/m4-w2-t2.mp4" }
            ],
            quiz: [
              { question: "BRD stands for:",
                options: ["Business Reporting Document", "Business Requirements Document", "Basic Resource Definition", "Backend Resource Data"],
                answer: 1 },
              { question: "A User Story format is:",
                options: ["As a [user], I want [goal], so that [reason]", "IF [condition] THEN [action]", "GIVEN [context] WHEN [event]", "FOR [user] DO [action]"],
                answer: 0 }
            ]
          }
        ]
      },
      {
        month: "Month 5: Tools + Soft Skills for BAs",
        tool: null,
        weeks: [
          {
            title: "Week 9: Tools for Business Analysts",
            topics: [
              { title: "Jira / Trello for Agile",                           video: "/videos/business-analyst/m5-w1-t1.mp4" },
              { title: "Wireframing Tools (Balsamiq, Figma)",               video: "/videos/business-analyst/m5-w1-t2.mp4" }
            ],
            quiz: [
              { question: "Jira is primarily used for:",
                options: ["Building websites", "Agile project and issue tracking", "Creating dashboards", "Writing SQL"],
                answer: 1 },
              { question: "A wireframe is:",
                options: ["A network diagram", "A low-fidelity visual layout of a screen or page", "A database schema", "A test case document"],
                answer: 1 }
            ]
          },
          {
            title: "Week 10: Communication & Soft Skills",
            topics: [
              { title: "Stakeholder Management",                             video: "/videos/business-analyst/m5-w2-t1.mp4" },
              { title: "Presentation Techniques",                            video: "/videos/business-analyst/m5-w2-t2.mp4" }
            ],
            quiz: [
              { question: "Effective stakeholder management involves:",
                options: ["Avoiding all communication", "Understanding stakeholder needs, setting clear expectations and communicating regularly", "Only sending email updates", "Delegating all tasks"],
                answer: 1 }
            ]
          }
        ]
      },
      {
        month: "Month 6: Capstone + Career Preparation",
        tool: "Capstone",
        isFinalMonth: true,
        projects: [
          {
            id: "ba-m6-capstone",
            title: "Capstone — End-to-End Business Analysis Case",
            description: "Perform requirement gathering, write a BRD, build a dashboard in Power BI and present findings to a mock stakeholder panel.",
            tool: "Capstone",
            downloadFile: "/projects/business-analyst-m6-capstone.pdf",
            downloadFileName: "BA_Month6_CapstoneBrief.pdf",
            isFinal: false
          },
          {
            id: "ba-m6-final",
            title: "Final Project — BA Portfolio Submission",
            description: "Submit your complete Business Analyst portfolio including BRD, process diagrams, dashboard and presentation deck. This is your final assessed deliverable.",
            tool: "Final",
            downloadFile: "/projects/business-analyst-m6-final.pdf",
            downloadFileName: "BA_Month6_FinalProjectBrief.pdf",
            isFinal: true
          }
        ],
        weeks: [
          {
            title: "Week 11: Capstone Project",
            topics: [
              { title: "End-to-End Business Analysis on a Case Scenario",    video: "/videos/business-analyst/m6-w1-t1.mp4" },
              { title: "Requirement Gathering, Documentation and Presentation", video: "/videos/business-analyst/m6-w1-t2.mp4" }
            ],
            quiz: [
              { question: "A complete BA deliverable includes:",
                options: ["Only a dashboard", "Requirements document, process diagrams, and a stakeholder presentation", "Only wireframes", "Only SQL queries"],
                answer: 1 }
            ]
          },
          {
            title: "Week 12: Interview Preparation",
            topics: [
              { title: "BA Resume & LinkedIn Profile Optimisation",          video: "/videos/business-analyst/m6-w2-t1.mp4" },
              { title: "Case-based Mock Interviews + Agile/Scrum FAQ",       video: "/videos/business-analyst/m6-w2-t2.mp4" }
            ],
            quiz: [
              { question: "In an Agile environment, a Sprint is:",
                options: ["A type of database query", "A time-boxed iteration where a team delivers a working increment", "A BA documentation template", "A wireframing technique"],
                answer: 1 }
            ]
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // COURSE 3 — MIS ANALYST
  // ═══════════════════════════════════════════════════════════════
  {
    id: 3,
    title: "MIS Analyst",
    slug: "mis-analyst-course",
    duration: "3 Months",
    mode: "Online/Offline",
    level: "Beginner to Advanced",
    rating: 4.8,
    reviews: "820+",
    students: "950+",
    project: "15",
    image: "/course/mis-analyst.png",
    achievementGoal: "Become an Expert in Reporting, Automation and Dashboards using Excel and Power BI for Daily Business Operations.",
    bonusAddOns: [
      "Internship after completion",
      "Alumni Network",
      "Real world client projects for interested students",
      "Multiple offer letter"
    ],
    syllabus: [
      {
        month: "Month 1: Excel Mastery & Reporting",
        tool: "Excel",
        projects: [
          { id: "mis-m1-p1", title: "Daily Sales MIS Report",              description: "Build an automated daily sales MIS report with dynamic charts, conditional formatting and summary KPIs.",                    tool: "Excel", downloadFile: "/projects/mis-analyst-m1-p1.pdf", downloadFileName: "MIS_Month1_Project1_DailySalesReport.pdf",     isFinal: false },
          { id: "mis-m1-p2", title: "Stock & Inventory MIS Tracker",       description: "Design an inventory tracker with reorder alerts, stock level indicators and automated purchase order calculations.",           tool: "Excel", downloadFile: "/projects/mis-analyst-m1-p2.pdf", downloadFileName: "MIS_Month1_Project2_InventoryTracker.pdf",     isFinal: false },
          { id: "mis-m1-p3", title: "HR Attendance MIS Dashboard",         description: "Create a monthly HR attendance dashboard tracking leave, overtime and department-wise headcount using pivot tables.",          tool: "Excel", downloadFile: "/projects/mis-analyst-m1-p3.pdf", downloadFileName: "MIS_Month1_Project3_HRAttendanceDashboard.pdf",isFinal: false },
          { id: "mis-m1-p4", title: "Finance Expense MIS Report",          description: "Build a multi-department expense tracking report with budget vs actual comparison and variance trend charts.",                 tool: "Excel", downloadFile: "/projects/mis-analyst-m1-p4.pdf", downloadFileName: "MIS_Month1_Project4_FinanceExpenseReport.pdf", isFinal: false }
        ],
        weeks: [
          {
            title: "Week 1: Introduction to MIS",
            topics: [
              { title: "Role of an MIS Analyst",                            video: "/videos/mis-analyst/m1-w1-t1.mp4" },
              { title: "Types of MIS Reports: Daily, Weekly, Monthly",      video: "/videos/mis-analyst/m1-w1-t2.mp4" },
              { title: "Business Terms: Sales, Inventory, Finance, HR",     video: "/videos/mis-analyst/m1-w1-t3.mp4" }
            ],
            quiz: [
              { question: "MIS stands for:",
                options: ["Management Information System", "Monthly Internal Summary", "Master Index System", "Managed Intelligence Software"],
                answer: 0 },
              { question: "An MIS Analyst primarily:",
                options: ["Writes software code", "Collects, organises and reports business data for management decisions", "Manages HR processes", "Handles customer support"],
                answer: 1 }
            ]
          },
          {
            title: "Week 2: Advanced Excel Essentials",
            topics: [
              { title: "Formulas: VLOOKUP, INDEX-MATCH, SUMIFS, TEXT, DATE", video: "/videos/mis-analyst/m1-w2-t1.mp4" },
              { title: "Data Cleaning & Formatting",                          video: "/videos/mis-analyst/m1-w2-t2.mp4" },
              { title: "Tables & Named Ranges",                               video: "/videos/mis-analyst/m1-w2-t3.mp4" }
            ],
            quiz: [
              { question: "Named Ranges in Excel are used to:",
                options: ["Rename worksheets", "Give meaningful names to cell ranges for easier formula writing", "Format cells", "Create charts"],
                answer: 1 },
              { question: "SUMIFS allows summing based on:",
                options: ["One condition only", "Multiple conditions simultaneously", "No conditions", "Only text values"],
                answer: 1 }
            ]
          },
          {
            title: "Week 3: Pivot Tables & Data Analysis",
            topics: [
              { title: "Pivot Tables & Pivot Charts",                        video: "/videos/mis-analyst/m1-w3-t1.mp4" },
              { title: "Data Grouping, Filtering, Slicers",                  video: "/videos/mis-analyst/m1-w3-t2.mp4" },
              { title: "Dashboard Creation using Excel",                     video: "/videos/mis-analyst/m1-w3-t3.mp4" }
            ],
            quiz: [
              { question: "A Slicer in Excel is used to:",
                options: ["Cut cells", "Interactively filter Pivot Table data", "Delete rows", "Merge cells"],
                answer: 1 },
              { question: "A Pivot Table is most useful for:",
                options: ["Writing formulas", "Quickly summarising large datasets by different categories", "Formatting text", "Creating drop-down lists"],
                answer: 1 }
            ]
          },
          {
            title: "Week 4: Excel Automation",
            topics: [
              { title: "Excel Macros (Recording Basic Macros)",              video: "/videos/mis-analyst/m1-w4-t1.mp4" },
              { title: "Conditional Formatting for Dynamic Reports",         video: "/videos/mis-analyst/m1-w4-t2.mp4" },
              { title: "Case Study: Daily Sales & Stock MIS Report",         video: "/videos/mis-analyst/m1-w4-t3.mp4" }
            ],
            quiz: [
              { question: "A Macro in Excel is:",
                options: ["A type of chart", "A recorded sequence of actions that can be replayed automatically", "A cell format", "A data type"],
                answer: 1 },
              { question: "Conditional Formatting in Excel is used to:",
                options: ["Add borders to all cells", "Automatically apply colours or icons based on data values", "Sort data", "Remove duplicates"],
                answer: 1 }
            ]
          }
        ]
      },
      {
        month: "Month 2: SQL & Power BI for MIS",
        tool: "SQL",
        projects: [
          { id: "mis-m2-p1", title: "Attendance MIS SQL Report",           description: "Write SQL queries to generate daily attendance and leave summary reports from an HR database.",                               tool: "SQL", downloadFile: "/projects/mis-analyst-m2-p1.pdf", downloadFileName: "MIS_Month2_Project1_AttendanceSQL.pdf",         isFinal: false },
          { id: "mis-m2-p2", title: "Sales MIS Data Extraction",           description: "Extract and aggregate weekly sales data by region and product using SQL queries and GROUP BY.",                                tool: "SQL", downloadFile: "/projects/mis-analyst-m2-p2.pdf", downloadFileName: "MIS_Month2_Project2_SalesMISData.pdf",          isFinal: false },
          { id: "mis-m2-p3", title: "Power BI HR MIS Dashboard",           description: "Build a Power BI HR dashboard showing headcount, attrition and performance metrics with slicers.",                            tool: "Power BI", downloadFile: "/projects/mis-analyst-m2-p3.pdf", downloadFileName: "MIS_Month2_Project3_HRMISDashboard.pdf",    isFinal: false },
          { id: "mis-m2-p4", title: "Power BI Sales MIS Dashboard",        description: "Create a Power BI sales report with KPI cards, trend lines and drill-through from regional to product level.",                 tool: "Power BI", downloadFile: "/projects/mis-analyst-m2-p4.pdf", downloadFileName: "MIS_Month2_Project4_SalesMISDashboard.pdf",  isFinal: false }
        ],
        weeks: [
          {
            title: "Week 5: SQL Basics for MIS Reports",
            topics: [
              { title: "Introduction to Databases",                          video: "/videos/mis-analyst/m2-w1-t1.mp4" },
              { title: "SELECT, WHERE, ORDER BY, GROUP BY",                  video: "/videos/mis-analyst/m2-w1-t2.mp4" },
              { title: "Practical SQL Reporting Queries",                    video: "/videos/mis-analyst/m2-w1-t3.mp4" }
            ],
            quiz: [
              { question: "SQL is used by MIS Analysts to:",
                options: ["Design websites", "Query databases to extract data for reports", "Build mobile apps", "Create Excel charts"],
                answer: 1 },
              { question: "HAVING in SQL filters:",
                options: ["Individual rows before grouping", "Groups after aggregation (GROUP BY results)", "Column names", "Database names"],
                answer: 1 }
            ]
          },
          {
            title: "Week 6: Intermediate SQL",
            topics: [
              { title: "JOINS, Aggregations",                                video: "/videos/mis-analyst/m2-w2-t1.mp4" },
              { title: "Case Study: Generating Attendance MIS Data",         video: "/videos/mis-analyst/m2-w2-t2.mp4" }
            ],
            quiz: [
              { question: "INNER JOIN returns rows:",
                options: ["From left table only", "Only where there is a match in both tables", "From right table only", "All rows from both tables"],
                answer: 1 }
            ]
          },
          {
            title: "Week 7: Power BI Introduction",
            topics: [
              { title: "Connecting Excel/SQL Data",                          video: "/videos/mis-analyst/m2-w3-t1.mp4" },
              { title: "Data Load & Transform (Power Query)",                video: "/videos/mis-analyst/m2-w3-t2.mp4" }
            ],
            quiz: [
              { question: "Power Query in Power BI is used to:",
                options: ["Write DAX", "Clean and transform data before loading to the model", "Publish reports", "Set up scheduled refresh"],
                answer: 1 }
            ]
          },
          {
            title: "Week 8: Dashboard Reporting in Power BI",
            topics: [
              { title: "Visuals: Cards, Tables, Charts, KPIs",              video: "/videos/mis-analyst/m2-w4-t1.mp4" },
              { title: "Publishing & Sharing Reports",                       video: "/videos/mis-analyst/m2-w4-t2.mp4" },
              { title: "Project: HR or Sales Dashboard",                     video: "/videos/mis-analyst/m2-w4-t3.mp4" }
            ],
            quiz: [
              { question: "A KPI Card in Power BI shows:",
                options: ["All data in a table format", "A single key metric with optional target and trend", "A map of locations", "A text box"],
                answer: 1 }
            ]
          }
        ]
      },
      {
        month: "Month 3: Automation, Insights & Career Prep",
        tool: "Capstone",
        isFinalMonth: true,
        projects: [
          {
            id: "mis-m3-capstone",
            title: "Capstone — End-to-End MIS Dashboard",
            description: "Build a complete MIS reporting system using Excel + Power BI + SQL. Include a daily report, a dashboard and an automated email summary template.",
            tool: "Capstone",
            downloadFile: "/projects/mis-analyst-m3-capstone.pdf",
            downloadFileName: "MIS_Month3_CapstoneBrief.pdf",
            isFinal: false
          },
          {
            id: "mis-m3-final",
            title: "Final Project — MIS Portfolio Submission",
            description: "Submit your final MIS project including Excel reports, Power BI dashboard, SQL scripts and a written management summary. This is your final assessed deliverable.",
            tool: "Final",
            downloadFile: "/projects/mis-analyst-m3-final.pdf",
            downloadFileName: "MIS_Month3_FinalProjectBrief.pdf",
            isFinal: true
          }
        ],
        weeks: [
          {
            title: "Week 9: MIS Automation Tools",
            topics: [
              { title: "Excel Power Query",                                  video: "/videos/mis-analyst/m3-w1-t1.mp4" },
              { title: "Email Automation using Outlook + Excel",             video: "/videos/mis-analyst/m3-w1-t2.mp4" },
              { title: "Introduction to Python for MIS (Optional)",          video: "/videos/mis-analyst/m3-w1-t3.mp4" }
            ],
            quiz: [
              { question: "Power Query in Excel allows you to:",
                options: ["Format cells only", "Import, clean and transform data from external sources automatically", "Write VBA macros", "Create pivot charts"],
                answer: 1 }
            ]
          },
          {
            title: "Week 10: Business Insights & Storytelling",
            topics: [
              { title: "Turning Data into Insights",                         video: "/videos/mis-analyst/m3-w2-t1.mp4" },
              { title: "Writing Data-Driven Emails & Summaries",             video: "/videos/mis-analyst/m3-w2-t2.mp4" }
            ],
            quiz: [
              { question: "A good MIS summary email to management should:",
                options: ["Include all raw data", "Highlight key metrics, trends and recommended actions concisely", "Be at least 5 pages", "Only contain charts"],
                answer: 1 }
            ]
          },
          {
            title: "Week 11: Capstone Project",
            topics: [
              { title: "Create End-to-End MIS Dashboard (Excel + Power BI + SQL)", video: "/videos/mis-analyst/m3-w3-t1.mp4" },
              { title: "Present Summary Email + Meeting Report",                    video: "/videos/mis-analyst/m3-w3-t2.mp4" }
            ],
            quiz: [
              { question: "An end-to-end MIS system should include:",
                options: ["Only charts", "Data extraction (SQL), cleaning (Excel/Power Query), reporting (Power BI) and distribution (email)", "Only a database", "Only a dashboard"],
                answer: 1 }
            ]
          },
          {
            title: "Week 12: Interview & Portfolio Prep",
            topics: [
              { title: "Resume Writing for MIS Roles",                       video: "/videos/mis-analyst/m3-w4-t1.mp4" },
              { title: "Mock Interviews & Case-based Questions",             video: "/videos/mis-analyst/m3-w4-t2.mp4" },
              { title: "LinkedIn Profile & Portfolio Setup",                 video: "/videos/mis-analyst/m3-w4-t3.mp4" }
            ],
            quiz: [
              { question: "Which skills should feature prominently on an MIS Analyst resume?",
                options: ["Only Excel", "Excel, SQL, Power BI and data reporting experience with measurable achievements", "Only SQL", "Only Power BI"],
                answer: 1 }
            ]
          }
        ]
      }
    ]
  }

  // // ═══════════════════════════════════════════════════════════════
  // // COURSE 4 — FINANCIAL ANALYST
  // // ═══════════════════════════════════════════════════════════════
  // {
  //   id: 4,
  //   title: "Financial Analyst",
  //   slug: "financial-analyst-course",
  //   duration: "3 Months",
  //   mode: "Online/Offline",
  //   level: "Beginner to Advanced",
  //   rating: 4.8,
  //   reviews: "640+",
  //   students: "750+",
  //   project: "12",
  //   image: "/course/financial-analyst.png",
  //   achievementGoal: "Master Financial Modelling, Ratio Analysis and Forecasting to Build a Career in Corporate Finance and Investment Analysis.",
  //   bonusAddOns: [
  //     "Internship after completion",
  //     "Alumni Network",
  //     "Real world client projects for interested students",
  //     "Multiple offer letter"
  //   ],
  //   syllabus: [
  //     {
  //       month: "Month 1: Financial Fundamentals & Excel Modelling",
  //       tool: "Excel",
  //       projects: [
  //         { id: "fa-m1-p1", title: "Financial Ratio Analysis Report",      description: "Calculate and interpret liquidity, profitability and solvency ratios from a real company's financial statements.",          tool: "Excel", downloadFile: "/projects/financial-analyst-m1-p1.pdf", downloadFileName: "FA_Month1_Project1_RatioAnalysis.pdf",         isFinal: false },
  //         { id: "fa-m1-p2", title: "3-Statement Financial Model",          description: "Build an integrated Income Statement, Balance Sheet and Cash Flow model with dynamic assumptions and formulas.",              tool: "Excel", downloadFile: "/projects/financial-analyst-m1-p2.pdf", downloadFileName: "FA_Month1_Project2_3StatementModel.pdf",       isFinal: false },
  //         { id: "fa-m1-p3", title: "Revenue Forecasting Model",            description: "Create a 12-month revenue forecast using historical trends, growth assumptions and scenario analysis.",                        tool: "Excel", downloadFile: "/projects/financial-analyst-m1-p3.pdf", downloadFileName: "FA_Month1_Project3_RevenueForecast.pdf",        isFinal: false },
  //         { id: "fa-m1-p4", title: "Budget vs Actuals Variance Report",    description: "Build a monthly budget tracker with variance analysis, percentage deviation and management commentary template.",              tool: "Excel", downloadFile: "/projects/financial-analyst-m1-p4.pdf", downloadFileName: "FA_Month1_Project4_BudgetVariance.pdf",        isFinal: false }
  //       ],
  //       weeks: [
  //         {
  //           title: "Week 1: Financial Statements & Accounting Basics",
  //           topics: [
  //             { title: "Income Statement, Balance Sheet & Cash Flow",        video: "/videos/financial-analyst/m1-w1-t1.mp4" },
  //             { title: "Key Financial Terms and Concepts",                   video: "/videos/financial-analyst/m1-w1-t2.mp4" },
  //             { title: "Reading Real Company Financial Statements",          video: "/videos/financial-analyst/m1-w1-t3.mp4" }
  //           ],
  //           quiz: [
  //             { question: "The Income Statement shows:",
  //               options: ["What a company owns and owes", "Revenue, expenses and net profit over a period", "Cash inflows and outflows", "Owner equity only"],
  //               answer: 1 },
  //             { question: "Net Profit is calculated as:",
  //               options: ["Revenue - Cost of Goods Sold", "Revenue - All Operating and Non-Operating Expenses", "Gross Profit - Tax", "Revenue + Expenses"],
  //               answer: 1 }
  //           ]
  //         },
  //         {
  //           title: "Week 2: Financial Ratio Analysis & Excel Modelling",
  //           topics: [
  //             { title: "Liquidity, Profitability and Solvency Ratios",      video: "/videos/financial-analyst/m1-w2-t1.mp4" },
  //             { title: "Excel Financial Modelling Techniques",               video: "/videos/financial-analyst/m1-w2-t2.mp4" },
  //             { title: "Scenario and Sensitivity Analysis",                  video: "/videos/financial-analyst/m1-w2-t3.mp4" }
  //           ],
  //           quiz: [
  //             { question: "Current Ratio measures:",
  //               options: ["Profitability", "Short-term liquidity (ability to pay current liabilities)", "Long-term solvency", "Revenue growth"],
  //               answer: 1 },
  //             { question: "Sensitivity analysis in financial modelling is used to:",
  //               options: ["Format charts", "Test how changes in assumptions affect the output", "Sort data", "Calculate tax"],
  //               answer: 1 }
  //           ]
  //         },
  //         {
  //           title: "Week 3: Forecasting & Budgeting",
  //           topics: [
  //             { title: "Revenue and Expense Forecasting Methods",            video: "/videos/financial-analyst/m1-w3-t1.mp4" },
  //             { title: "Building Budgets and Variance Reports",              video: "/videos/financial-analyst/m1-w3-t2.mp4" }
  //           ],
  //           quiz: [
  //             { question: "A bottom-up forecasting approach builds from:",
  //               options: ["Top-level revenue targets down", "Individual unit/product level estimates up to total", "Industry benchmarks", "Historical averages only"],
  //               answer: 1 }
  //           ]
  //         },
  //         {
  //           title: "Week 4: Valuation Basics",
  //           topics: [
  //             { title: "DCF (Discounted Cash Flow) Basics",                  video: "/videos/financial-analyst/m1-w4-t1.mp4" },
  //             { title: "Comparable Company Analysis",                        video: "/videos/financial-analyst/m1-w4-t2.mp4" }
  //           ],
  //           quiz: [
  //             { question: "DCF valuation is based on:",
  //               options: ["Current stock price", "Present value of expected future cash flows", "Book value of assets", "Market capitalisation"],
  //               answer: 1 }
  //           ]
  //         }
  //       ]
  //     },
  //     {
  //       month: "Month 2: SQL & Power BI for Finance",
  //       tool: "SQL",
  //       projects: [
  //         { id: "fa-m2-p1", title: "Financial Data SQL Queries",           description: "Write SQL queries to extract revenue, cost and margin data from a financial transactions database.",                          tool: "SQL", downloadFile: "/projects/financial-analyst-m2-p1.pdf", downloadFileName: "FA_Month2_Project1_FinancialSQL.pdf",          isFinal: false },
  //         { id: "fa-m2-p2", title: "Finance Power BI Dashboard",           description: "Build a finance KPI dashboard in Power BI with P&L trends, budget vs actuals and month-over-month comparisons.",               tool: "Power BI", downloadFile: "/projects/financial-analyst-m2-p2.pdf", downloadFileName: "FA_Month2_Project2_FinanceDashboard.pdf",   isFinal: false },
  //         { id: "fa-m2-p3", title: "Cash Flow Analysis Dashboard",         description: "Create a Power BI cash flow tracker showing inflows, outflows and working capital trends over 12 months.",                     tool: "Power BI", downloadFile: "/projects/financial-analyst-m2-p3.pdf", downloadFileName: "FA_Month2_Project3_CashFlowDashboard.pdf",  isFinal: false },
  //         { id: "fa-m2-p4", title: "Investment Portfolio Tracker",         description: "Build an Excel + Power BI tool to track investment portfolio performance, returns and diversification.",                         tool: "Power BI", downloadFile: "/projects/financial-analyst-m2-p4.pdf", downloadFileName: "FA_Month2_Project4_PortfolioTracker.pdf",   isFinal: false }
  //       ],
  //       weeks: [
  //         {
  //           title: "Week 5: SQL for Financial Data",
  //           topics: [
  //             { title: "Querying Financial Databases",                       video: "/videos/financial-analyst/m2-w1-t1.mp4" },
  //             { title: "Aggregations for Financial Reporting",               video: "/videos/financial-analyst/m2-w1-t2.mp4" }
  //           ],
  //           quiz: [
  //             { question: "To calculate total revenue by quarter in SQL, you would use:",
  //               options: ["DELETE statement", "GROUP BY quarter with SUM(revenue)", "ORDER BY only", "WHERE only"],
  //               answer: 1 }
  //           ]
  //         },
  //         {
  //           title: "Week 6: Power BI for Finance",
  //           topics: [
  //             { title: "Finance Dashboard Design Principles",                video: "/videos/financial-analyst/m2-w2-t1.mp4" },
  //             { title: "YTD, MTD and DAX Time Intelligence",                 video: "/videos/financial-analyst/m2-w2-t2.mp4" },
  //             { title: "Case Study: P&L Dashboard",                          video: "/videos/financial-analyst/m2-w2-t3.mp4" }
  //           ],
  //           quiz: [
  //             { question: "TOTALYTD in DAX calculates:",
  //               options: ["Last month's total", "Year-to-date cumulative total", "Lifetime total", "Daily average"],
  //               answer: 1 }
  //           ]
  //         },
  //         {
  //           title: "Week 7: Advanced Financial Analysis",
  //           topics: [
  //             { title: "Working Capital Analysis",                           video: "/videos/financial-analyst/m2-w3-t1.mp4" },
  //             { title: "Break-even Analysis",                                video: "/videos/financial-analyst/m2-w3-t2.mp4" }
  //           ],
  //           quiz: [
  //             { question: "Break-even point is where:",
  //               options: ["Profit is maximised", "Total Revenue equals Total Costs (zero profit or loss)", "Cash flow is highest", "Market share is 50%"],
  //               answer: 1 }
  //           ]
  //         },
  //         {
  //           title: "Week 8: Financial Presentations & Communication",
  //           topics: [
  //             { title: "Presenting Financial Data to Non-Finance Audiences", video: "/videos/financial-analyst/m2-w4-t1.mp4" },
  //             { title: "Creating Executive Financial Summaries",             video: "/videos/financial-analyst/m2-w4-t2.mp4" }
  //           ],
  //           quiz: [
  //             { question: "When presenting financial data to senior management, you should:",
  //               options: ["Show all detailed data", "Lead with key insights and keep it concise and visual", "Only show positive results", "Avoid using charts"],
  //               answer: 1 }
  //           ]
  //         }
  //       ]
  //     },
  //     {
  //       month: "Month 3: Industry Projects & Career Prep",
  //       tool: "Capstone",
  //       isFinalMonth: true,
  //       projects: [
  //         {
  //           id: "fa-m3-capstone",
  //           title: "Capstone — Company Financial Analysis",
  //           description: "Select a real listed company. Perform ratio analysis, build a financial model, create a Power BI dashboard and write an investment brief.",
  //           tool: "Capstone",
  //           downloadFile: "/projects/financial-analyst-m3-capstone.pdf",
  //           downloadFileName: "FA_Month3_CapstoneBrief.pdf",
  //           isFinal: false
  //         },
  //         {
  //           id: "fa-m3-final",
  //           title: "Final Project — Financial Analyst Portfolio",
  //           description: "Submit your complete financial analyst portfolio: Excel model, Power BI dashboard, SQL scripts and written investment recommendation. Final assessed deliverable.",
  //           tool: "Final",
  //           downloadFile: "/projects/financial-analyst-m3-final.pdf",
  //           downloadFileName: "FA_Month3_FinalProjectBrief.pdf",
  //           isFinal: true
  //         }
  //       ],
  //       weeks: [
  //         {
  //           title: "Week 9: Industry Projects",
  //           topics: [
  //             { title: "Real Company Financial Modelling",                   video: "/videos/financial-analyst/m3-w1-t1.mp4" },
  //             { title: "Sector-specific Analysis (BFSI, FMCG, IT)",        video: "/videos/financial-analyst/m3-w1-t2.mp4" }
  //           ],
  //           quiz: [
  //             { question: "When analysing a banking sector company, a key ratio is:",
  //               options: ["Current Ratio", "Net Interest Margin (NIM)", "Inventory Turnover", "Gross Margin"],
  //               answer: 1 }
  //           ]
  //         },
  //         {
  //           title: "Week 10: Career Preparation",
  //           topics: [
  //             { title: "Financial Analyst Resume & LinkedIn",               video: "/videos/financial-analyst/m3-w2-t1.mp4" },
  //             { title: "Interview Questions: Technical + Case Study",       video: "/videos/financial-analyst/m3-w2-t2.mp4" }
  //           ],
  //           quiz: [
  //             { question: "A Financial Analyst role typically requires proficiency in:",
  //               options: ["Only Excel", "Excel, SQL, financial modelling, and data visualisation (Power BI/Tableau)", "Only Python", "Only SQL"],
  //               answer: 1 }
  //           ]
  //         },
  //         {
  //           title: "Week 11: Capstone Submission & Final Project",
  //           topics: [
  //             { title: "Final Project Presentation",                         video: "/videos/financial-analyst/m3-w3-t1.mp4" },
  //             { title: "Portfolio Review & Feedback",                        video: "/videos/financial-analyst/m3-w3-t2.mp4" }
  //           ],
  //           quiz: [
  //             { question: "A complete financial analyst portfolio should include:",
  //               options: ["Only a resume", "Financial model, dashboard, SQL scripts and a written analysis/brief", "Only certificates", "Only charts"],
  //               answer: 1 }
  //           ]
  //         }
  //       ]
  //     }
  //   ]
  // },

  // // ═══════════════════════════════════════════════════════════════
  // // COURSE 5 — HR ANALYST
  // // ═══════════════════════════════════════════════════════════════
  // {
  //   id: 5,
  //   title: "HR Analyst",
  //   slug: "hr-analyst-course",
  //   duration: "3 Months",
  //   mode: "Online/Offline",
  //   level: "Beginner to Advanced",
  //   rating: 4.7,
  //   reviews: "510+",
  //   students: "620+",
  //   project: "12",
  //   image: "/course/hr-analyst.png",
  //   achievementGoal: "Analyse Workforce Data, Build HR Dashboards and Use Data to Support People Strategy and Business Decision-Making.",
  //   bonusAddOns: [
  //     "Internship after completion",
  //     "Alumni Network",
  //     "Real world client projects for interested students",
  //     "Multiple offer letter"
  //   ],
  //   syllabus: [
  //     {
  //       month: "Month 1: HR Fundamentals & Excel for HR",
  //       tool: "Excel",
  //       projects: [
  //         { id: "hr-m1-p1", title: "HR Headcount & Attrition Report",     description: "Build an Excel report tracking monthly headcount, new hires, exits and attrition rate with automated calculations.",            tool: "Excel", downloadFile: "/projects/hr-analyst-m1-p1.pdf", downloadFileName: "HR_Month1_Project1_HeadcountAttrition.pdf",   isFinal: false },
  //         { id: "hr-m1-p2", title: "Employee Performance Tracker",         description: "Design an Excel performance rating tracker with distribution analysis and department-wise performance charts.",                   tool: "Excel", downloadFile: "/projects/hr-analyst-m1-p2.pdf", downloadFileName: "HR_Month1_Project2_PerformanceTracker.pdf",    isFinal: false },
  //         { id: "hr-m1-p3", title: "Payroll Cost Analysis Report",         description: "Analyse payroll costs by department, grade and location using pivot tables and variance analysis.",                              tool: "Excel", downloadFile: "/projects/hr-analyst-m1-p3.pdf", downloadFileName: "HR_Month1_Project3_PayrollAnalysis.pdf",       isFinal: false },
  //         { id: "hr-m1-p4", title: "Recruitment Funnel Tracker",           description: "Build a recruitment pipeline tracker showing applications, shortlists, interviews and offers with conversion rates.",             tool: "Excel", downloadFile: "/projects/hr-analyst-m1-p4.pdf", downloadFileName: "HR_Month1_Project4_RecruitmentFunnel.pdf",     isFinal: false }
  //       ],
  //       weeks: [
  //         {
  //           title: "Week 1: Introduction to HR Analytics",
  //           topics: [
  //             { title: "What is HR Analytics?",                              video: "/videos/hr-analyst/m1-w1-t1.mp4" },
  //             { title: "Key HR Metrics: Attrition, Tenure, Headcount",      video: "/videos/hr-analyst/m1-w1-t2.mp4" },
  //             { title: "HR Data Sources and Types",                          video: "/videos/hr-analyst/m1-w1-t3.mp4" }
  //           ],
  //           quiz: [
  //             { question: "HR Analytics is used to:",
  //               options: ["Only manage payroll", "Use data to make informed people and workforce decisions", "Only track leave", "Only manage recruitment"],
  //               answer: 1 },
  //             { question: "Attrition rate measures:",
  //               options: ["Number of hires", "Percentage of employees leaving the organisation in a period", "Average salary", "Training completion rate"],
  //               answer: 1 }
  //           ]
  //         },
  //         {
  //           title: "Week 2: Excel for HR Data",
  //           topics: [
  //             { title: "HR Formulas: VLOOKUP, COUNTIFS, AVERAGEIFS",        video: "/videos/hr-analyst/m1-w2-t1.mp4" },
  //             { title: "Employee Data Cleaning and Formatting",              video: "/videos/hr-analyst/m1-w2-t2.mp4" },
  //             { title: "Pivot Tables for HR Reporting",                      video: "/videos/hr-analyst/m1-w2-t3.mp4" }
  //           ],
  //           quiz: [
  //             { question: "COUNTIFS is used to count rows:",
  //               options: ["With no conditions", "Meeting multiple conditions simultaneously", "Only one condition", "In visible rows only"],
  //               answer: 1 }
  //           ]
  //         }
  //       ]
  //     },
  //     {
  //       month: "Month 2: SQL & Power BI for HR",
  //       tool: "Power BI",
  //       projects: [
  //         { id: "hr-m2-p1", title: "HR Attrition SQL Analysis",            description: "Write SQL queries to identify attrition patterns by department, tenure band and exit reason.",                                  tool: "SQL", downloadFile: "/projects/hr-analyst-m2-p1.pdf", downloadFileName: "HR_Month2_Project1_AttritionSQL.pdf",          isFinal: false },
  //         { id: "hr-m2-p2", title: "HR Analytics Power BI Dashboard",      description: "Build a comprehensive HR dashboard in Power BI with headcount, attrition, diversity and performance metrics.",                   tool: "Power BI", downloadFile: "/projects/hr-analyst-m2-p2.pdf", downloadFileName: "HR_Month2_Project2_HRDashboard.pdf",        isFinal: false },
  //         { id: "hr-m2-p3", title: "Diversity & Inclusion Dashboard",      description: "Create a Power BI D&I report showing gender ratio, age distribution and department diversity with interactive filters.",         tool: "Power BI", downloadFile: "/projects/hr-analyst-m2-p3.pdf", downloadFileName: "HR_Month2_Project3_DiversityDashboard.pdf", isFinal: false },
  //         { id: "hr-m2-p4", title: "Learning & Development Tracker",       description: "Track training completion rates, course scores and L&D spend by department using Power BI.",                                     tool: "Power BI", downloadFile: "/projects/hr-analyst-m2-p4.pdf", downloadFileName: "HR_Month2_Project4_LDTracker.pdf",          isFinal: false }
  //       ],
  //       weeks: [
  //         {
  //           title: "Week 5: SQL for HR Data",
  //           topics: [
  //             { title: "Querying Employee Databases",                        video: "/videos/hr-analyst/m2-w1-t1.mp4" },
  //             { title: "Aggregations for HR Metrics",                       video: "/videos/hr-analyst/m2-w1-t2.mp4" }
  //           ],
  //           quiz: [
  //             { question: "To find average salary by department in SQL, you use:",
  //               options: ["ORDER BY only", "GROUP BY department with AVG(salary)", "WHERE only", "SELECT DISTINCT"],
  //               answer: 1 }
  //           ]
  //         },
  //         {
  //           title: "Week 6: Power BI for HR Analytics",
  //           topics: [
  //             { title: "HR Dashboard Design Principles",                     video: "/videos/hr-analyst/m2-w2-t1.mp4" },
  //             { title: "People Analytics Visualisations",                    video: "/videos/hr-analyst/m2-w2-t2.mp4" },
  //             { title: "Case Study: Attrition Dashboard",                    video: "/videos/hr-analyst/m2-w2-t3.mp4" }
  //           ],
  //           quiz: [
  //             { question: "A good HR dashboard should show:",
  //               options: ["Only individual employee data", "Aggregated metrics like attrition rate, headcount trend and performance distribution", "Only payroll totals", "Only training data"],
  //               answer: 1 }
  //           ]
  //         }
  //       ]
  //     },
  //     {
  //       month: "Month 3: Advanced HR Analytics & Career Prep",
  //       tool: "Capstone",
  //       isFinalMonth: true,
  //       projects: [
  //         {
  //           id: "hr-m3-capstone",
  //           title: "Capstone — Workforce Analytics Report",
  //           description: "Analyse a real HR dataset: compute attrition drivers, build a Power BI dashboard, write SQL queries and present a workforce strategy recommendation.",
  //           tool: "Capstone",
  //           downloadFile: "/projects/hr-analyst-m3-capstone.pdf",
  //           downloadFileName: "HR_Month3_CapstoneBrief.pdf",
  //           isFinal: false
  //         },
  //         {
  //           id: "hr-m3-final",
  //           title: "Final Project — HR Analyst Portfolio",
  //           description: "Submit your complete HR Analyst portfolio: dashboard, SQL queries, Excel reports and a written people analytics insight report. Final assessed deliverable.",
  //           tool: "Final",
  //           downloadFile: "/projects/hr-analyst-m3-final.pdf",
  //           downloadFileName: "HR_Month3_FinalProjectBrief.pdf",
  //           isFinal: true
  //         }
  //       ],
  //       weeks: [
  //         {
  //           title: "Week 9: Predictive HR Analytics",
  //           topics: [
  //             { title: "Attrition Prediction Concepts",                      video: "/videos/hr-analyst/m3-w1-t1.mp4" },
  //             { title: "Workforce Planning & Headcount Forecasting",         video: "/videos/hr-analyst/m3-w1-t2.mp4" }
  //           ],
  //           quiz: [
  //             { question: "Predictive HR analytics helps organisations:",
  //               options: ["Only track current data", "Anticipate future workforce trends like attrition and hiring needs", "Only automate payroll", "Only manage leave"],
  //               answer: 1 }
  //           ]
  //         },
  //         {
  //           title: "Week 10: HR Storytelling & Stakeholder Reports",
  //           topics: [
  //             { title: "Presenting HR Data to Leadership",                   video: "/videos/hr-analyst/m3-w2-t1.mp4" },
  //             { title: "Building HR Strategy Decks",                        video: "/videos/hr-analyst/m3-w2-t2.mp4" }
  //           ],
  //           quiz: [
  //             { question: "When presenting HR analytics to business leaders, you should focus on:",
  //               options: ["Raw data tables", "Business impact of HR metrics (e.g. attrition cost, productivity loss)", "Technical SQL details", "System architecture"],
  //               answer: 1 }
  //           ]
  //         },
  //         {
  //           title: "Week 11–12: Capstone & Career Preparation",
  //           topics: [
  //             { title: "HR Analyst Resume & LinkedIn",                       video: "/videos/hr-analyst/m3-w3-t1.mp4" },
  //             { title: "Mock Interviews & HR Analytics FAQs",               video: "/videos/hr-analyst/m3-w3-t2.mp4" },
  //             { title: "Final Portfolio Submission",                         video: "/videos/hr-analyst/m3-w3-t3.mp4" }
  //           ],
  //           quiz: [
  //             { question: "Key skills on an HR Analyst resume include:",
  //               options: ["Only communication skills", "Excel, SQL, Power BI, HR metrics and people analytics experience", "Only HR policy knowledge", "Only Python"],
  //               answer: 1 }
  //           ]
  //         }
  //       ]
  //     }
  //   ]
  // }

  // // ↓ ADD MORE COURSES BELOW THIS LINE
  // // ─────────────────────────────────────────────────────────────
  // // To add a new course, copy any course object above and:
  // //   1. Set a unique id (next in sequence)
  // //   2. Update slug, title, image, achievementGoal
  // //   3. Update all syllabus months, weeks, topics, quizzes, projects
  // //   4. Set tool: "Excel"|"SQL"|"Power BI"|"Python"|"Tableau"|"Capstone"|null
  // //   5. Set isFinalMonth: true on the last month
  // //   6. Set isFinal: true on the final project (certificate trigger)
  // // ─────────────────────────────────────────────────────────────

];