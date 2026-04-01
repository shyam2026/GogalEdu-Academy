"use client";

import { spcourses } from "@/db/spcourses";
import { trackEvent } from "@/utils/trackEvent";

export default function LinksPage() {

  
    const handleClick = (name, href) => {
    trackEvent("click", { name, href });
    window.location.href = href;
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f9fafb",
      display: "flex",
      justifyContent: "center",
      padding: "40px 16px"
    }}>

      <div style={{ width: "100%", maxWidth: "480px" }}>

        {/* HERO */}
        <div style={{
          background: "linear-gradient(135deg,#059669,#047857)",
          color: "#fff",
          padding: "28px",
          borderRadius: "20px",
          textAlign: "center"
        }}>
          <h1 style={{ margin: 0 }}>GogalEdu Academy</h1>
          <p style={{ fontSize: "13px", opacity: 0.9 }}>
            Build your career in Data Analytics 🚀
          </p>

          <div style={{
            marginTop: "10px",
            fontSize: "12px",
            fontWeight: "600"
          }}>
            ⭐ 5,000+ Students | 4.9 Rating
          </div>
        </div>

        {/* 🔥 MAIN CTA */}
        <button
          onClick={() => handleClick("Explore Courses", "/courses")}
          style={{
            width: "100%",
            marginTop: "16px",
            padding: "14px",
            borderRadius: "12px",
            background: "#059669",
            color: "#fff",
            border: "none",
            fontWeight: "700"
          }}
        >
          🚀 Explore All Courses
        </button>

        {/* SECTION */}
        <h3 style={{
          marginTop: "20px",
          fontSize: "14px",
          color: "#047857"
        }}>
          🎯 Self-Paced Courses
        </h3>

        {/* DYNAMIC COURSES */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginTop: "10px"
        }}>
          {Object.values(spcourses).map((course) => (
            <div
              key={course.slug}
              onClick={() =>
                handleClick(course.title, `/courses/self-paced/${course.slug}`)
              }
              style={{
                background: "#fff",
                padding: "14px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
              }}
            >
              <div style={{
                fontSize: "20px",
                background: "#ecfdf5",
                padding: "10px",
                borderRadius: "10px"
              }}>
                {course.icon}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "600" }}>
                  {course.title}
                </div>
                <div style={{
                  fontSize: "12px",
                  color: "#6b7280"
                }}>
                  {course.desc}
                </div>
              </div>

              <div style={{ color: "#059669" }}>→</div>
            </div>
          ))}
        </div>

      </div>

      {/* WHATSAPP */}
      <a
        href="https://wa.me/917011418073"
        target="_blank"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "#25D366",
          color: "#fff",
          padding: "14px 16px",
          borderRadius: "50px"
        }}
      >
        💬
      </a>

    </div>
  );
}