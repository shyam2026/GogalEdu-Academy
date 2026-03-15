 "use client";


import { motion } from "framer-motion";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle,
  Star,
  Users,
  Award,
  Target,
  Clock,
  ArrowRight,
  Briefcase,
  BadgeCheck,
  PlayCircle
} from "lucide-react";


const selfPacedCourses = [
  {
    slug: "advance-excel",
    title: "Advance Excel",
    image: "/course/excel.jpg",
    mode: "Self Paced",
    goal: "Master formulas, pivot tables, dashboards and automation.",
    modules: ["Basics", "Functions", "Dashboards"]
  },
  {
    slug: "sql",
    title: "SQL",
    image: "/course/sql.jpg",
    mode: "Self Paced",
    goal: "Learn database queries, joins, filtering and analytics.",
    modules: ["Queries", "Joins", "Analytics"]
  },
  {
    slug: "power-bi",
    title: "Power BI",
    image: "/course/powerbi.jpg",
    mode: "Self Paced",
    goal: "Create interactive dashboards and business reports.",
    modules: ["Data Model", "DAX", "Dashboards"]
  },
  {
    slug: "tableau",
    title: "Tableau",
    image: "/course/tableau.jpg",
    mode: "Self Paced",
    goal: "Build professional data visualizations and dashboards.",
    modules: ["Charts", "Dashboard", "Story"]
  },
  {
    slug: "python",
    title: "Python",
    image: "/course/python.jpg",
    mode: "Self Paced",
    goal: "Learn Python programming for data analysis and automation.",
    modules: ["Basics", "Pandas", "Projects"]
  }
];


export default function SelfPacedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">


      {/* HERO */}
      <section className="pt-36 pb-20 text-center">
        <div className="max-w-4xl mx-auto px-4">


          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Self-Paced <span className="text-green-600">Online Courses</span>
          </h1>


          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto -mb-5 leading-relaxed">
            Learn anytime at your own pace with industry-focused training.
            Complete projects, earn certification and even get your course
            fee returned.
          </p>


        </div>
      </section>


     




      {/* Stats Section */}
<motion.div
    className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto mt-0"    
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  {[
    { number: "5+", label: "Self-Paced Courses", icon: BookOpen },
    { number: "400+", label: "Students", icon: Users },
    { number: "100%", label: "Refund Model", icon: CheckCircle },
    { number: "4.7/5", label: "Rating", icon: Star },
  ].map((stat, index) => {
    const IconComponent = stat.icon;


    return (
      <motion.div
        key={stat.label}
        className="bg-white rounded-2xl p-6 border border-gray-200/60 shadow-lg text-center"
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg mx-auto mb-3">
          <IconComponent className="w-6 h-6" />
        </div>


        <div className="text-2xl font-bold text-gray-900 mb-1">
          {stat.number}
        </div>


        <div className="text-sm text-gray-600 font-medium">
          {stat.label}
        </div>
      </motion.div>
    );
  })}
</motion.div>






      {/* COURSES GRID */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50 mt-14">
        <div className="max-w-7xl mx-auto px-4">


           <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 -mt-8 text-center">
            Available{" "}
            <span className="bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
                Self-Paced Courses
            </span>
           </h2>


      {/* Description */}
        <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            Choose a course and start learning immediately.
            </p>
        </div>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">


            {selfPacedCourses.map((course,index)=>(
           
            <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full">


            {/* Image */}
            <div className="relative h-40 overflow-hidden">
            <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover"
            />


            <div className="absolute top-3 left-3 bg-green-600 text-white text-sm px-4 py-1 rounded-lg">
            Self Paced
            </div>


            </div>


            {/* Content */}
            <div className="p-5 flex flex-col flex-1">


            <h3 className="text-lg font-bold text-gray-900 mb-2">
            {course.title}
            </h3>


            {/* Duration */}
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">


            {/* <span>⏱ {course.duration}</span>


            <span>💻 {course.mode}</span> */}


            </div>


            {/* Rating */}
            <div className="flex items-center text-sm text-gray-600 mb-3">


            <span className="text-yellow-500 mr-1"></span>


            {course.rating}


            </div>


            {/* Goal */}
            <p className="text-sm text-gray-600 bg-green-50 p-2 rounded-md mb-3">
            <span className="font-semibold text-green-700">Goal: </span>
            {course.goal}
            </p>


            {/* Modules */}
            <div className="flex flex-wrap gap-2 mb-4">


            {course.modules.map((module,i)=>(
            <span
            key={i}
            className="bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs font-medium border border-green-100"
            >
            {module}
            </span>
            ))}


            </div>


            {/* Button */}
            <div className="mt-auto">


            <Link
            href={`/courses/self-paced/${course.slug}`}
                className="w-full flex items-center justify-center gap-2
                bg-green-600 text-white py-2.5 rounded-lg font-semibold
                transition-all duration-300 hover:bg-green-700 hover:gap-3"
            >
            Explore Course →
            </Link>


            </div>


            </div>


            </div>


            ))}


            </div>
        </div>
      </section>


     




      {/* HOW IT WORKS */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto text-center px-4">


          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12 text-center">
            How The{" "}
            <span className="bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
                Refund Model Works
            </span>
            </h2>


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mt-12">


  {/* Step 1 */}
  <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 group">


    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-lg font-bold">
      <BookOpen className="text-green-600 w-7 h-7" />
    </div>


    <h3 className="font-semibold text-gray-900 mb-2">
      Enroll in Course
    </h3>


    <p className="text-sm text-gray-600">
      Register and get instant access to course materials.
    </p>


  </div>




  {/* Step 2 */}
  <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 group">


    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-lg font-bold">
      <PlayCircle className="text-green-600 w-7 h-7" />
    </div>


    <h3 className="font-semibold text-gray-900 mb-2">
      Complete Lessons
    </h3>


    <p className="text-sm text-gray-600">
      Study the modules at your own pace anytime.
    </p>


  </div>




  {/* Step 3 */}
  <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 group">


    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-lg font-bold">
      <Target className="text-green-600 w-7 h-7" />
    </div>


    <h3 className="font-semibold text-gray-900 mb-2">
      Submit All Projects
    </h3>


    <p className="text-sm text-gray-600">
      Apply your knowledge by completing all projects.
    </p>


  </div>




  {/* Step 4 */}
  <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 group">


    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-lg font-bold">
      <Award className="text-green-600 w-7 h-7" />
    </div>


    <h3 className="font-semibold text-gray-900 mb-2">
      Get Certificate + Refund
    </h3>


    <p className="text-sm text-gray-600">
      Receive certification and your full course fee back.
    </p>


  </div>


</div>


        </div>
      </section>




      {/* BENEFITS */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4">


          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12 text-center">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
                Self-Paced Learning?
            </span>
            </h2>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">


            {/* Flexible Learning */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-green-300 shadow-sm hover:shadow-xl transition-all duration-300">
               
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition">
                <Clock className="text-green-600 w-7 h-7" />
                </div>


                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Flexible Learning
                </h3>


                <p className="text-gray-600 text-sm leading-relaxed">
                Study whenever you want without fixed schedules and learn completely at your own pace.
                </p>


            </div>




            {/* Real Projects */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-green-300 shadow-sm hover:shadow-xl transition-all duration-300">
               
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition">
                <Target className="text-green-600 w-7 h-7" />
                </div>


                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Real Industry Projects
                </h3>


                <p className="text-gray-600 text-sm leading-relaxed">
                Work on practical industry-level projects to build a strong portfolio.
                </p>


            </div>




            {/* Certification */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-green-300 shadow-sm hover:shadow-xl transition-all duration-300">
               
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition">
                <Award className="text-green-600 w-7 h-7" />
                </div>


                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Verified Certification
                </h3>


                <p className="text-gray-600 text-sm leading-relaxed">
                Receive an industry-recognized certificate after completing the course and project.
                </p>


            </div>


            </div>


        </div>
      </section>




<section className="py-16 bg-white/50 backdrop-blur-sm">
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">


    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 sm:p-12 border border-gray-200/60 shadow-sm">


      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12 text-center">
    Ready to Start Your{" "}
    <span className="bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
        Learning Journey?
    </span>
    </h2>


      {/* Description */}
      <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
        Join thousands of students who are upgrading their careers with our
        flexible self-paced courses and real industry projects.
      </p>


      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">


        <a
          href="tel:+917011418073"
          className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg"
        >
          Call for Free Demo
        </a>


        <a
          // href="/contact"
          href="tel:+917011418073"
          className="border border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-gray-400 hover:bg-white transition-all duration-300 shadow-sm flex items-center justify-center"
        >
          Contact Counselor
        </a>


      </div>


      <div className="flex flex-wrap justify-center gap-10 mt-12">


  <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-sm font-medium">
    <Briefcase className="w-5 h-5 text-green-600" />
    Industry Projects
  </div>


  <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-sm font-medium">
    <Award className="w-5 h-5 text-green-600" />
    Certificate Included
  </div>


  <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-sm font-medium">
    <BadgeCheck className="w-5 h-5 text-green-600" />
    100% Fee Return
  </div>


</div>


    </div>


  </div>
</section>


    </div>
  );
}
