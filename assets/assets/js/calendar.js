const calendarBody = document.getElementById("calendarBody");
const monthYear = document.getElementById("monthYear");
const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");
const modalOverlay = document.getElementById("modalOverlay");
const closeModal = document.getElementById("closeModal");
const modalDate = document.getElementById("modalDate");
const modalContent = document.getElementById("modalContent");
const monthEventsContainer = document.getElementById("monthEvents");
const eventForm = document.getElementById("eventForm");
const eventDateInput = document.getElementById("eventDate");
const eventTitleInput = document.getElementById("eventTitle");
const eventMessage = document.getElementById("eventMessage");

let currentDate = new Date();

// Sertifika ve örnek sabit etkinlikler
const staticEvents = [
  { startDate: "2025-12-05", endDate: "2025-12-05", title: "Geleceğin Kadın Liderleri Sertifikası" },
  { startDate: "2025-11-10", endDate: "2025-11-10", title: "Akbank Generative AI Bootcamp Sertifikası" },
  { startDate: "2025-10-08", endDate: "2025-10-08", title: "Yeni Nesil Kariyer Okulu Sertifikası" },
  { startDate: "2025-10-20", endDate: "2025-10-20", title: "Yapay Zekaya İlk Adım Sertifikası" },
  { startDate: "2025-08-12", endDate: "2025-08-12", title: "Cybersecurity - ADBI Sertifikası" },
  { startDate: "2025-08-25", endDate: "2025-08-25", title: "Huawei HCIA-AI Sertifikası" },
  { startDate: "2025-06-15", endDate: "2025-06-15", title: "BTK Siber Güvenliğe Giriş Sertifikası" },
  { startDate: "2025-03-10", endDate: "2025-03-10", title: "Wings of Tech Etkinliği" }
];

function normalizeEvent(e) {
  // Eski kayıtlar {date, title}
  if (e.startDate || e.endDate) {
    return {
      startDate: e.startDate || e.endDate,
      endDate: e.endDate || e.startDate,
      title: e.title
    };
  }
  return {
    startDate: e.date,
    endDate: e.date,
    title: e.title
  };
}

function loadUserEvents() {
  try {
    const raw = localStorage.getItem("calendarEvents");
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeEvent);
  } catch (e) {
    console.error("Etkinlikler okunamadı", e);
    return [];
  }
}

function saveUserEvents(events) {
  localStorage.setItem("calendarEvents", JSON.stringify(events));
}

function getAllEvents() {
  return [...staticEvents, ...loadUserEvents()];
}

function groupEventsByDate(events) {
  return events.reduce((acc, ev) => {
    const start = new Date(ev.startDate);
    const end = new Date(ev.endDate || ev.startDate);
    const cur = new Date(start);

    while (cur <= end) {
      const y = cur.getFullYear();
      const m = String(cur.getMonth() + 1).padStart(2, "0");
      const d = String(cur.getDate()).padStart(2, "0");
      const key = `${y}-${m}-${d}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(ev);
      cur.setDate(cur.getDate() + 1);
    }
    return acc;
  }, {});
}

function showDayModal(dateStr, eventsForDay) {
  modalDate.textContent = new Date(dateStr).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  if (!eventsForDay || !eventsForDay.length) {
    modalContent.textContent = "Bu güne ait etkinlik yok.";
  } else {
    modalContent.innerHTML = eventsForDay
      .map((e) => `• ${e.title}`)
      .join("<br>");
  }

  modalOverlay.classList.add("active");
}

function renderMonthEvents(date) {
  if (!monthEventsContainer) return;
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const allEvents = getAllEvents();

  const firstOfMonth = new Date(year, month - 1, 1);
  const lastOfMonth = new Date(year, month, 0);

  const monthEvents = allEvents.filter((e) => {
    const start = new Date(e.startDate);
    const end = new Date(e.endDate || e.startDate);
    return end >= firstOfMonth && start <= lastOfMonth;
  });

  if (!monthEvents.length) {
    monthEventsContainer.innerHTML = "<p>Bu ay için kayıtlı etkinlik yok.</p>";
    return;
  }

  monthEvents.sort((a, b) => (a.startDate < b.startDate ? -1 : 1));

  monthEventsContainer.innerHTML = monthEvents
    .map(
      (e) =>
        `<div class="event-list-item"><span class="event-list-date">${
          (function () {
            const s = new Date(e.startDate).toLocaleDateString("tr-TR");
            const en = e.endDate
              ? new Date(e.endDate).toLocaleDateString("tr-TR")
              : null;
            return !en || s === en ? s : s + " - " + en;
          })()
        }</span><span class="event-list-title">${e.title}</span></div>`
    )
    .join("");
}

function renderCalendar(date) {
  calendarBody.innerHTML = "";

  const year = date.getFullYear();
  const month = date.getMonth();

  monthYear.textContent = date.toLocaleString("tr-TR", {
    month: "long",
    year: "numeric"
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const emptyDays = (firstDay + 6) % 7;

  const grouped = groupEventsByDate(getAllEvents());

  for (let i = 0; i < emptyDays; i++) {
    const emptyDiv = document.createElement("div");
    emptyDiv.className = "day empty";
    calendarBody.appendChild(emptyDiv);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayDiv = document.createElement("div");
    dayDiv.className = "day";

    const dateSpan = document.createElement("span");
    dateSpan.className = "date";
    dateSpan.textContent = day;
    dayDiv.appendChild(dateSpan);

    const fullDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    const eventsForDay = grouped[fullDate] || [];

    if (eventsForDay.length) {
      const eventDiv = document.createElement("div");
      eventDiv.className = "event";
      eventDiv.textContent = eventsForDay[0].title;
      dayDiv.classList.add("has-event");
      dayDiv.appendChild(eventDiv);
    }

    dayDiv.addEventListener("click", () => {
      showDayModal(fullDate, eventsForDay);
    });

    calendarBody.appendChild(dayDiv);
  }

  renderMonthEvents(date);
}

prevMonth.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
});

nextMonth.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
});

if (closeModal && modalOverlay) {
  closeModal.addEventListener("click", () => {
    modalOverlay.classList.remove("active");
  });
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove("active");
    }
  });
}

if (eventForm) {
  eventForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const dateVal = eventDateInput.value;
    const titleVal = eventTitleInput.value.trim();

    if (!dateVal || !titleVal) return;

    const userEvents = loadUserEvents();
    userEvents.push({ date: dateVal, title: titleVal });
    saveUserEvents(userEvents);

    eventForm.reset();
    eventMessage.textContent = "Etkinlik takvime kaydedildi.";

    renderCalendar(currentDate);
  });
}

renderCalendar(currentDate);
