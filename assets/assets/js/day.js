// day.js
const params = new URLSearchParams(window.location.search);
const date = params.get("date");

const data = {
  "2026-01-15": {
    focus: "Yapay Zeka & Kariyer",
    duration: "3,5 saat",
    category: "Eğitim / Kişisel Gelişim",
    work: "Yapay zeka alanında kariyer yollarını ele alan çevrim içi bir seminere katıldım. Etkinlik boyunca yapay zekanın güncel kullanım alanları, sektör beklentileri ve kariyer planlaması üzerine notlar aldım.",
    learned: [
      "Yapay zekanın yazılım, veri bilimi ve siber güvenlik alanlarıyla kesişimi",
      "Yeni mezunlar için AI alanında öne çıkan yetkinlikler",
      "Teknik bilgi kadar problem çözme ve etik farkındalığın önemi"
    ],
    did: [
      "Seminer süresince detaylı notlar aldım",
      "Konuşmacıların paylaştığı kaynakları inceledim",
      "Kendi kariyer hedeflerimi AI odağında yeniden değerlendirdim"
    ],
    impact: "Yapay zeka alanında hangi konulara ağırlık vermem gerektiği netleşti. Öğrenme yol haritamı daha bilinçli oluşturarak teknik ve akademik gelişimime yön verdim."
  }
};

// Elementleri al
const dateTitle = document.getElementById("dateTitle");
const focusEl = document.getElementById("focus");
const durationEl = document.getElementById("duration");
const categoryEl = document.getElementById("category");
const workEl = document.getElementById("work");
const learnedEl = document.getElementById("learned");
const didEl = document.getElementById("did");
const impactEl = document.getElementById("impact");

// Eğer veri yoksa uyar
if (!date || !data[date]) {
  dateTitle.innerText = "Bu gün için kayıt yok";
  document.querySelector(".day-detail").style.opacity = "0.5";
} else {
  const d = data[date];

  // Başlık olarak tarihi göster
  dateTitle.innerText = new Date(date).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  focusEl.innerText = d.focus;
  durationEl.innerText = d.duration;
  categoryEl.innerText = d.category;
  workEl.innerText = d.work;
  impactEl.innerText = d.impact;

  // Liste alanlarını doldur
  learnedEl.innerHTML = "";
  d.learned.forEach(item => {
    const li = document.createElement("li");
    li.innerText = item;
    learnedEl.appendChild(li);
  });

  didEl.innerHTML = "";
  d.did.forEach(item => {
    const li = document.createElement("li");
    li.innerText = item;
    didEl.appendChild(li);
  });
}
