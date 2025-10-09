// Utilitário para animar altura (abre/fecha)
function animateHeight(el, open = true, duration = 200) {
  el.style.overflow = "hidden";
  const start = el.clientHeight;
  const end = open ? el.scrollHeight : 0;
  const startTime = performance.now();

  function frame(now) {
    const p = Math.min((now - startTime) / duration, 1);
    const h = start + (end - start) * p;
    el.style.height = h + "px";
    if (p < 1) requestAnimationFrame(frame);
    else if (!open) el.setAttribute("hidden", ""); // para o mobileNav
    else el.style.height = end + "px";
  }
  if (open) el.removeAttribute("hidden");
  requestAnimationFrame(frame);
}

// ===== Mega menu (desktop) =====
(function () {
  const trigger = document.querySelector(".menu-trigger");
  const mega = document.querySelector(".mega");
  if (!trigger || !mega) return;

  let isOpen = false;
  const openMega = () => {
    mega.classList.add("is-open");
    animateHeight(mega, true);
    isOpen = true;
    trigger.setAttribute("aria-expanded", "true");
  };
  const closeMega = () => {
    animateHeight(mega, false);
    mega.classList.remove("is-open");
    isOpen = false;
    trigger.setAttribute("aria-expanded", "false");
  };

  // Clique / foco
  trigger.addEventListener("click", (e) => {
    e.preventDefault();
    isOpen ? closeMega() : openMega();
  });

  // Fecha ao clicar fora
  document.addEventListener("click", (e) => {
    if (!isOpen) return;
    if (!mega.contains(e.target) && !trigger.contains(e.target)) closeMega();
  });

  // Acessibilidade: ESC fecha
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen) closeMega();
  });
})();

// ===== Mobile menu =====
(function () {
  const hambBtn = document.getElementById("hambBtn");
  const mobile = document.getElementById("mobileNav");
  const subBtn = document.querySelector(".nav-mobile .sub-trigger");
  const subList = document.querySelector(".nav-mobile .sub");

  if (!hambBtn || !mobile) return;

  let navOpen = false;
  hambBtn.addEventListener("click", () => {
    navOpen = !navOpen;
    hambBtn.setAttribute("aria-expanded", String(navOpen));
    animateHeight(mobile, navOpen, 220);
    // troca ícone
    hambBtn.innerHTML = navOpen
      ? '<i class="ri-close-line"></i>'
      : '<i class="ri-menu-line"></i>';
  });

  // Submenu Produtos (mobile)
  if (subBtn && subList) {
    let subOpen = false;
    subBtn.addEventListener("click", () => {
      subOpen = !subOpen;
      subBtn.setAttribute("aria-expanded", String(subOpen));
      // Rotaciona seta
      const icon = subBtn.querySelector("i");
      if (icon)
        icon.style.transform = subOpen ? "rotate(180deg)" : "rotate(0deg)";
      animateHeight(subList, subOpen, 200);
    });
  }

  // Fecha mobile ao clicar em um link
  mobile.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    if (navOpen) {
      navOpen = false;
      hambBtn.setAttribute("aria-expanded", "false");
      animateHeight(mobile, false, 180);
      hambBtn.innerHTML = '<i class="ri-menu-line"></i>';
    }
  });
})();
