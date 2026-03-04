const track = document.getElementById("machineTrack");
const cards = Array.from(track.querySelectorAll(".machine-card"));
const buttons = document.querySelectorAll(".carousel-btn");
let activeIndex = 0;

const setActive = (index) => {
  activeIndex = index;
  cards.forEach((card, i) => {
    card.classList.toggle("active", i === index);
  });
  const activeCard = cards[index];
  const offset = activeCard.offsetLeft - (track.clientWidth - activeCard.clientWidth) / 2;
  track.scrollTo({ left: offset, behavior: "smooth" });
};

cards.forEach((card, index) => {
  card.addEventListener("click", () => setActive(index));
});

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const dir = btn.dataset.dir === "next" ? 1 : -1;
    let next = activeIndex + dir;
    if (next < 0) next = cards.length - 1;
    if (next >= cards.length) next = 0;
    setActive(next);
  });
});

setInterval(() => {
  let next = activeIndex + 1;
  if (next >= cards.length) next = 0;
  setActive(next);
}, 4500);

setActive(0);
