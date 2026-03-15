"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { spcourses } from "@/db/spcourses";
import CourseHero from "@/components/CourseHero";

import {
  BookOpen,
  Star,
  Users,
  Award,
  Target,
  ChevronDown,
  ChevronUp
} from "lucide-react";

export default function CourseDetailPage() {

  const params = useParams();
  const slug = params.slug;

  const course = spcourses?.[slug];

  const [tab, setTab] = useState("overview");
  const [openModule, setOpenModule] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);

  /* NEW STATES FOR PROGRESS */
  const [progress, setProgress] = useState(0);
  const [watchedSeconds, setWatchedSeconds] = useState(0);
  const [lastAllowedTime, setLastAllowedTime] = useState(0);

  const videoRef = useRef(null);

  /* TOTAL COURSE TIME */
  const getTotalCourseSeconds = () => {

    let total = 0;

    course.curriculum.forEach((module) => {
      module.lessons.forEach((lesson) => {

        if (lesson.durationSeconds) {
          total += lesson.durationSeconds;
        }

      });
    });

    return total || 1;

  };

  /* TRACK WATCH TIME */
  const handleTimeUpdate = (e) => {

    const current = e.target.currentTime;

    /* prevent skip */
    if (current > lastAllowedTime + 1) {
      e.target.currentTime = lastAllowedTime;
      return;
    }

    setLastAllowedTime(current);

    setWatchedSeconds((prev) => {

      const totalWatched = prev + 1;

      const percent =
        (totalWatched / getTotalCourseSeconds()) * 100;

      setProgress(Math.min(percent.toFixed(1), 100));

      return totalWatched;

    });

  };

  /* Prevent right click */
  useEffect(() => {
    const disableRightClick = (e) => e.preventDefault();
    document.addEventListener("contextmenu", disableRightClick);
    return () => document.removeEventListener("contextmenu", disableRightClick);
  }, []);

  /* Prevent keyboard skip */
  useEffect(() => {

    const blockKeys = (e) => {

      if (
        e.key === "ArrowRight" ||
        e.key === "ArrowLeft" ||
        e.key === "l" ||
        e.key === "j"
      ) {
        e.preventDefault();
      }

    };

    window.addEventListener("keydown", blockKeys);

    return () => window.removeEventListener("keydown", blockKeys);

  }, []);

  /* Basic screen recording deterrent */ /*
  useEffect(() => {
    const handleBlur = () => {
      document.body.style.filter = "brightness(0)";
    };

    const handleFocus = () => {
      document.body.style.filter = "brightness(1)";
    };

    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, []); */

  if (!course) {
    return <div className="pt-40 text-center">Course not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO */}
        <CourseHero course={course} />

      {/* TABS */}
      <section className="bg-white border-t border-b sticky top-[0px] z-20">
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

          {/* CURRICULUM */}
          {tab === "curriculum" && (

            <div className="space-y-8">

                {/* FREE PREVIEW */}
                    <div className="bg-white rounded-2xl border p-6">

                    <h2 className="text-2xl font-bold mb-6">
                    Free Preview
                    </h2>

                    {course.freePreview.map((video, i) => (

                    <div key={i} className="mb-6">

                    <h3 className="font-semibold mb-2">
                    {video.title}
                    </h3>

                    <button
                    onClick={() => setActiveVideo(video.video)}
                    className="text-green-600 font-medium"
                    >
                    ▶ Play Preview
                    </button>

                    </div>

                    ))}

                    </div>

              {/* VIDEO PLAYER */}
              {activeVideo && (

                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">

                  <div className="relative w-full max-w-5xl">

                    <button
                      onClick={() => setActiveVideo(null)}
                      className="absolute -top-12 right-0 bg-white text-black w-10 h-10 rounded-full flex items-center justify-center shadow"
                    >
                      X
                    </button>

                    <div className="w-full flex justify-center">

                      <video
                        ref={videoRef}
                        controls
                        autoPlay
                        playsInline
                        controlsList="nodownload"
                        //disablePictureInPicture
                        className="max-h-[85vh] max-w-full rounded-xl bg-black object-contain"
                        src={activeVideo}

                        onTimeUpdate={handleTimeUpdate}

                        onSeeking={(e) => {
                          if (e.target.currentTime > lastAllowedTime) {
                            e.target.currentTime = lastAllowedTime;
                          }
                        }}

                        onRateChange={(e) => {
                          if (e.target.playbackRate !== 1) {
                            e.target.playbackRate = 1;
                          }
                        }}

                      />

                    </div>

                  </div>

                </div>

              )}

              {/* MODULES */}
              <div className="bg-white rounded-2xl border">

                {course.curriculum.map((module, i) => (

                  <div key={i} className="border-b">

                    <button
                      onClick={() =>
                        setOpenModule(openModule === i ? null : i)
                      }
                      className="w-full p-5 flex justify-between items-center"
                    >

                      <span className="font-semibold">
                        {module.moduleTitle}
                      </span>

                      {openModule === i ? <ChevronUp /> : <ChevronDown />}

                    </button>

                    {openModule === i && (

                      <div className="p-5 bg-gray-50 space-y-4">

                        {module.lessons.map((lesson, j) => (

                          <div
                            key={j}
                            className="bg-white rounded-lg border p-4 flex justify-between items-center hover:bg-gray-50 transition"
                          >

                            <span>{lesson.lessonTitle}</span>

                            <button
                              onClick={() => {
                                setActiveVideo(lesson.video);
                                setLastAllowedTime(0);
                              }}
                              className="text-green-600 font-semibold flex items-center gap-2"
                            >
                              ▶ Play
                            </button>

                          </div>

                        ))}

                      </div>

                    )}

                  </div>

                ))}

              </div>

            </div>

          )}

        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-700">
        <div className="max-w-4xl mx-auto px-4 text-center">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-white"
          >

            <h2 className="text-3xl font-bold mb-4">
              Start Your Learning Journey
            </h2>

            <p className="text-green-100 mb-8">
              Join thousands of students building real skills.
            </p>

            <motion.button
              className="bg-white text-green-600 px-8 py-4 rounded-xl font-bold flex items-center gap-3 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BookOpen className="w-5 h-5" />
              Enroll Now
            </motion.button>

          </motion.div>

        </div>
      </section>

    </div>
  );
}