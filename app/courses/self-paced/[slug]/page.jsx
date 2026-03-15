// app/courses/[slug]/page.jsx
"use client";


import { useState } from "react";
import { motion } from 'framer-motion';
import { useParams } from "next/navigation";
import {
  BookOpen,
  Star,
  Users,
  Award,
  Target,
  ChevronDown,
  ChevronUp
} from "lucide-react";




// COURSE DATA
const courses = {
  "advance-excel": {
    title: "Advance Excel",
    image: "/course/excel.jpg",
    rating: "4.8",
    students: "1200+",
    projects: "5",
    description:
      "Master Excel from basics to advanced dashboards, automation and data analysis.",
    modules: [
      "Excel Fundamentals",
      "Formulas & Functions",
      "Data Cleaning",
      "Intermediate Excel",
      "Pivot Tables",
      "Advanced Excel Functions",
      "Data Visualization",
      "Excel Dashboards",
      "Automation with Macros",
      "Industry Projects"
    ]
  },


  sql: {
    title: "SQL for Data Analytics",
    image: "/course/sql.jpg",
    rating: "4.7",
    students: "900+",
    projects: "5",
    description:
      "Learn SQL from basics to advanced analytics queries used by data analysts.",
    modules: [
      "SQL Fundamentals",
      "Basic Queries",
      "Aggregation",
      "SQL JOINs",
      "Advanced SQL Queries",
      "CRUD Operations",
      "Analytical SQL",
      "Performance Optimization",
      "Industry SQL Projects"
    ]
  },


  "power-bi": {
    title: "Power BI",
    image: "/course/powerbi.jpg",
    rating: "4.8",
    students: "800+",
    projects: "5",
    description:
      "Create powerful dashboards and business intelligence reports using Power BI.",
    modules: [
      "Power BI Introduction",
      "Data Import",
      "Power Query",
      "Data Modeling",
      "DAX Fundamentals",
      "Data Visualization",
      "Advanced DAX",
      "Power BI Service",
      "Industry Projects"
    ]
  },


  tableau: {
    title: "Tableau",
    image: "/course/tableau.jpg",
    rating: "4.7",
    students: "600+",
    projects: "5",
    description:
      "Build professional data visualization dashboards using Tableau.",
    modules: [
      "Tableau Introduction",
      "Connecting Data",
      "Basic Charts",
      "Calculated Fields",
      "Dashboard Design",
      "Advanced Analytics",
      "Advanced Charts",
      "Publishing Dashboards",
      "Industry Projects"
    ]
  },


  python: {
    title: "Python for Data Analytics",
    image: "/course/python.jpg",
    rating: "4.8",
    students: "700+",
    projects: "6",
    description:
      "Learn Python programming for automation, data analysis and visualization.",
    modules: [
      "Python Introduction",
      "Variables & Data Types",
      "Conditions",
      "Loops",
      "Data Structures",
      "Data Analysis with Pandas",
      "Data Visualization",
      "Working with Real Data",
      "Automation with Python",
      "Industry Projects"
    ]
  }
};




export default function CourseDetailPage() {
  const params = useParams();
  const slug = params.slug;


  const course = courses[slug];


  const [tab, setTab] = useState("overview");
  const [openModule, setOpenModule] = useState(null);


  if (!course) {
    return <div className="pt-40 text-center">Course not found</div>;
  }


  return (
    <div className="min-h-screen bg-gray-50">


      {/* HERO */}
      <section className="pt-36 pb-12">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-3 gap-10">


          {/* LEFT */}
          <div className="lg:col-span-2">


            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {course.title}
            </h1>


            <p className="text-gray-600 mb-8">
              {course.description}
            </p>


            {/* STATS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">


              <div className="bg-white p-4 rounded-xl border text-center">
                <div className="text-xl font-bold">{course.rating}</div>
                <Star className="mx-auto text-yellow-500" />
                <div className="text-xs text-gray-500">Rating</div>
              </div>


              <div className="bg-white p-4 rounded-xl border text-center">
                <div className="text-xl font-bold">{course.students}</div>
                <Users className="mx-auto text-green-600" />
                <div className="text-xs text-gray-500">Students</div>
              </div>


              <div className="bg-white p-4 rounded-xl border text-center">
                <div className="text-xl font-bold">{course.projects}</div>
                <Target className="mx-auto text-green-600" />
                <div className="text-xs text-gray-500">Projects</div>
              </div>


              <div className="bg-white p-4 rounded-xl border text-center">
                <div className="text-xl font-bold">100%</div>
                <Award className="mx-auto text-green-600" />
                <div className="text-xs text-gray-500">Fee Return</div>
              </div>


            </div>


          </div>




          {/* RIGHT CARD */}
          <div>


            <div className="bg-white rounded-2xl border shadow-lg overflow-hidden">


              <img
                src={course.image}
                className="w-full h-48 object-cover"
              />


              <div className="p-6">
                <button className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold">
                  Enroll Now
                </button>
              </div>


            </div>


          </div>


        </div>
      </section>






      {/* TABS */}
      <section className="bg-white border-t border-b sticky top-[70px] z-20">
        <div className="max-w-7xl mx-auto px-4 flex gap-8">


          <button
            onClick={() => setTab("overview")}
            className={`py-4 font-semibold ${
              tab === "overview"
                ? "border-b-2 border-green-600 text-green-600"
                : "text-gray-500"
            }`}
          >
            Overview
          </button>


          <button
            onClick={() => setTab("curriculum")}
            className={`py-4 font-semibold ${
              tab === "curriculum"
                ? "border-b-2 border-green-600 text-green-600"
                : "text-gray-500"
            }`}
          >
            Curriculum
          </button>


        </div>
      </section>






      {/* CONTENT */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4">


          {tab === "overview" && (
            <div className="bg-white rounded-2xl p-6 border">


              <h2 className="text-2xl font-bold mb-4">
                What You'll Achieve
              </h2>


              <ul className="grid md:grid-cols-2 gap-4">
                <li>✔ Build real projects</li>
                <li>✔ Master industry tools</li>
                <li>✔ Build professional portfolio</li>
                <li>✔ Get job-ready skills</li>
              </ul>


            </div>
          )}


          {tab === "curriculum" && (
            <div className="bg-white rounded-2xl border">


              {course.modules.map((module, i) => (
                <div key={i} className="border-b">


                  <button
                    onClick={() =>
                      setOpenModule(openModule === i ? null : i)
                    }
                    className="w-full p-5 flex justify-between items-center"
                  >


                    <span className="font-semibold">
                      Module {i + 1}: {module}
                    </span>


                    {openModule === i ? (
                      <ChevronUp />
                    ) : (
                      <ChevronDown />
                    )}


                  </button>


                  {openModule === i && (
                    <div className="p-5 bg-gray-50 text-sm text-gray-600">
                      Lessons and topics inside this module will appear here.
                    </div>
                  )}


                </div>
              ))}


            </div>
          )}


        </div>
      </section>




      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-white"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Start Your Journey Today
            </h2>
            <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of students who have transformed their careers with our industry-focused curriculum
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="bg-white text-green-600 cursor-pointer px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center gap-3 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <BookOpen className="w-5 h-5" />
                <span>Enroll Now</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>


    </div>
  );
}
