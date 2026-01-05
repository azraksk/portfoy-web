const calendarBody = document.getElementById("calendarBody");
const monthYear = document.getElementById("monthYear");
const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");

let currentDate = new Date();

// Takvimde görünecek kısa etkinlik isimleri
const events = {
  "2026-01-05": "Algoritma Dersi",
  "2026-01-10": "Veri Yapıları Projesi",
  "2026-01-15": "Seminer: Yapay Zeka",
  "2026-01-20": "Python Workshop",
  "2026-01-25": "Staj Başvurusu"
};

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

  // Boş kutular
  for (let i = 0; i < emptyDays; i++) {
    const emptyDiv = document.createElement("div");
    emptyDiv.className = "day empty";
    calendarBody.appendChild(emptyDiv);
  }

  // Günler
  for (let day = 1; day <= daysInMonth; day++) {
    const dayDiv = document.createElement("div");
    dayDiv.className = "day";

    const dateSpan = document.createElement("span");
    dateSpan.className = "date";
    dateSpan.textContent = day;

    dayDiv.appendChild(dateSpan);

    const fullDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    if (events[fullDate]) {
      const eventDiv = document.createElement("div");
      eventDiv.className = "event";
      eventDiv.textContent = events[fullDate];
      dayDiv.appendChild(eventDiv);

      // 👉 Gün tıklanınca detay sayfasına git
      dayDiv.addEventListener("click", () => {
        window.location.href = `gun.html?date=${fullDate}`;
      });
    }

    calendarBody.appendChild(dayDiv);
  }
}

prevMonth.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
});

nextMonth.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
});

renderCalendar(currentDate);
