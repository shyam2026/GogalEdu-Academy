// components/Quiz.jsx
// ─────────────────────────────────────────────────────────────────
// Module Quiz Component
//
// PROPS:
//   questions     — Array of { question, options, answer } from spcourses.js
//   moduleIndex   — 0-based index of the module this quiz belongs to
//   passedQuizzes — Array of moduleIndex values that have been passed
//   onPass        — Callback(moduleIndex) when student passes the quiz
//
// PASS CONDITION: ≥ 60% correct answers
// BEHAVIOR:
//   • If already passed → shows green "Quiz Passed" badge
//   • Otherwise → shows questions with radio buttons
//   • On submit → shows score, pass/fail feedback
//   • On fail   → shows Retry button to reset answers
// ─────────────────────────────────────────────────────────────────

"use client";

import { useState } from "react";
import { CheckCircle, XCircle, RefreshCw, Trophy } from "lucide-react";

export default function Quiz({ questions = [], moduleIndex, passedQuizzes = [], onPass }) {

  const [answers,   setAnswers]   = useState({});  // { questionIndex: selectedOptionIndex }
  const [submitted, setSubmitted] = useState(false);
  const [score,     setScore]     = useState(0);   // percentage 0-100

  // If already passed, just show success badge
  const alreadyPassed = passedQuizzes.includes(moduleIndex);

  // ── SUBMIT QUIZ ──────────────────────────────────────────────
  const handleSubmit = () => {
    // Count correct answers
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.answer) correct++;
    });

    const percentage = Math.round((correct / questions.length) * 100);
    setScore(percentage);
    setSubmitted(true);

    // Pass threshold: 60%
    if (percentage >= 60) {
      onPass(moduleIndex);
    }
  };

  // ── RETRY QUIZ ────────────────────────────────────────────────
  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  const passed = score >= 60;

  // ── ALL QUESTIONS ANSWERED CHECK ─────────────────────────────
  const allAnswered = questions.length > 0 &&
    questions.every((_, i) => answers[i] !== undefined);

  // ── ALREADY PASSED STATE ──────────────────────────────────────
  if (alreadyPassed) {
    return (
      <div className="mt-4 flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
        <Trophy className="text-green-600 flex-shrink-0" size={22} />
        <div>
          <p className="font-semibold text-green-700 text-sm">Module Quiz Passed!</p>
          <p className="text-green-600 text-xs">Next module is now unlocked.</p>
        </div>
      </div>
    );
  }

  // ── NO QUESTIONS ──────────────────────────────────────────────
  if (!questions || questions.length === 0) {
    return (
      <div className="mt-4 text-sm text-gray-400 text-center py-3">
        No quiz for this module.
      </div>
    );
  }

  return (
    <div className="mt-4 border border-gray-200 rounded-xl overflow-hidden">

      {/* ── Quiz Header ─────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 px-5 py-3 flex items-center gap-2">
        <Trophy size={18} className="text-white" />
        <span className="font-semibold text-white text-sm">
          Module Quiz — {questions.length} Question{questions.length !== 1 ? "s" : ""}
        </span>
        <span className="ml-auto text-green-100 text-xs">Pass mark: 60%</span>
      </div>

      <div className="p-5 bg-white space-y-5">

        {/* ── Questions ─────────────────────────────────────── */}
        {questions.map((q, i) => {
          const selected = answers[i];
          const isCorrect = submitted && selected === q.answer;
          const isWrong   = submitted && selected !== undefined && selected !== q.answer;

          return (
            <div key={i} className="space-y-2">
              <p className="font-medium text-gray-800 text-sm">
                {i + 1}. {q.question}
              </p>

              <div className="space-y-2">
                {q.options.map((option, j) => {
                  // Determine styling for each option after submit
                  let optionStyle = "border-gray-200 bg-white hover:border-green-400 hover:bg-green-50";
                  if (!submitted && selected === j) {
                    optionStyle = "border-green-500 bg-green-50";
                  }
                  if (submitted) {
                    if (j === q.answer) {
                      optionStyle = "border-green-500 bg-green-50"; // Always show correct
                    } else if (selected === j && j !== q.answer) {
                      optionStyle = "border-red-400 bg-red-50";     // Wrong selection
                    } else {
                      optionStyle = "border-gray-200 bg-white opacity-60";
                    }
                  }

                  return (
                    <label
                      key={j}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition text-sm ${optionStyle} ${submitted ? "cursor-default" : ""}`}
                    >
                      <input
                        type="radio"
                        name={`q-${moduleIndex}-${i}`}
                        checked={selected === j}
                        onChange={() => !submitted && setAnswers(prev => ({ ...prev, [i]: j }))}
                        disabled={submitted}
                        className="accent-green-600"
                      />
                      <span className="flex-1 text-gray-700">{option}</span>

                      {/* Show correct/wrong icons after submit */}
                      {submitted && j === q.answer && (
                        <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
                      )}
                      {submitted && selected === j && j !== q.answer && (
                        <XCircle size={16} className="text-red-500 flex-shrink-0" />
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* ── Result Banner (after submit) ──────────────────── */}
        {submitted && (
          <div className={`rounded-xl p-4 flex items-center gap-3 ${
            passed
              ? "bg-green-50 border border-green-200"
              : "bg-red-50 border border-red-200"
          }`}>
            {passed
              ? <Trophy size={22} className="text-green-600 flex-shrink-0" />
              : <XCircle size={22} className="text-red-500 flex-shrink-0" />
            }
            <div className="flex-1">
              <p className={`font-semibold text-sm ${passed ? "text-green-700" : "text-red-600"}`}>
                {passed
                  ? `Excellent! You scored ${score}% — Module Passed! 🎉`
                  : `You scored ${score}% — Need 60% to pass. Try again!`
                }
              </p>
              {passed && (
                <p className="text-green-600 text-xs mt-0.5">
                  Next module is now unlocked.
                </p>
              )}
            </div>

            {/* Retry button on failure */}
            {!passed && (
              <button
                onClick={handleRetry}
                className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
              >
                <RefreshCw size={13} />
                Retry
              </button>
            )}
          </div>
        )}

        {/* ── Submit Button (before submit) ─────────────────── */}
        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className={`w-full py-3 rounded-xl font-semibold text-sm transition ${
              allAnswered
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {allAnswered ? "Submit Quiz" : `Answer all ${questions.length} question${questions.length !== 1 ? "s" : ""} to submit`}
          </button>
        )}
      </div>
    </div>
  );
}