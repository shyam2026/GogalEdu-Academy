export const trackEvent = (eventName, data) => {
  const payload = {
    event: eventName,
    data,
    time: new Date().toISOString(),
  };

  // Store locally (for now)
  const existing = JSON.parse(localStorage.getItem("events") || "[]");
  existing.push(payload);
  localStorage.setItem("events", JSON.stringify(existing));

  console.log("Tracked:", payload);

  // FUTURE: send to API
  // fetch("/api/track", { method: "POST", body: JSON.stringify(payload) });
};