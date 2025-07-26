const track = document.querySelector(".logo-marquee__track");
const group = document.querySelector(".logo-marquee__group");

for (let i = 0; i < 4; i++) {
  const clone = group.cloneNode(true);
  track.appendChild(clone);
}
