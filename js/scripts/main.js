// ===== Utilitário para animar altura (desktop/mega) =====
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
    else el.style.height = open ? end + "px" : "0px";
  }
  requestAnimationFrame(frame);
}

// ===== Utilitário para animar altura (MOBILE principal) =====
function animateHeightMobile(el, open = true, duration = 220) {
  el.style.overflow = "hidden";
  el.style.display = "block"; // garante que mede scrollHeight
  const start = el.clientHeight;
  const end = open ? el.scrollHeight : 0;
  const startTime = performance.now();

  function frame(now) {
    const p = Math.min((now - startTime) / duration, 1);
    const h = start + (end - start) * p;
    el.style.height = h + "px";
    if (p < 1) requestAnimationFrame(frame);
    else el.style.height = open ? end + "px" : "0px";
  }
  requestAnimationFrame(frame);
}

// ===== NOVO: anima sub + container juntos (corrige "não cresce tudo") =====
function animateSubAndContainer(
  subEl,
  containerEl,
  open = true,
  duration = 220
) {
  subEl.style.overflow = "hidden";
  containerEl.style.overflow = "hidden";

  const subStart = subEl.clientHeight; // geralmente 0 ao abrir
  const contStart = containerEl.clientHeight;

  // Altura final do submenu (conteúdo total)
  const subEnd = open ? subEl.scrollHeight : 0;

  // Quanto a altura do container precisa mudar para acompanhar o submenu
  const delta = subEnd - subStart;
  const contEnd = contStart + (open ? delta : -Math.abs(subStart)); // fecha até tirar o que abriu

  const startTime = performance.now();

  function frame(now) {
    const p = Math.min((now - startTime) / duration, 1);
    // (opcional) easing suave
    const t = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;

    const subH = subStart + (subEnd - subStart) * t;
    const contH = contStart + (contEnd - contStart) * t;

    subEl.style.height = subH + "px";
    containerEl.style.height = contH + "px";

    if (p < 1) requestAnimationFrame(frame);
    else {
      subEl.style.height = subEnd + "px";
      containerEl.style.height = contEnd + "px";
    }
  }
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

  // Clique
  trigger.addEventListener("click", (e) => {
    e.preventDefault();
    isOpen ? closeMega() : openMega();
  });

  // Clique fora
  document.addEventListener("click", (e) => {
    if (!isOpen) return;
    if (!mega.contains(e.target) && !trigger.contains(e.target)) closeMega();
  });

  // ESC fecha
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen) closeMega();
  });
})();

// ===== Mobile menu (usa funções MOBILE) =====
(function () {
  const hambBtn = document.getElementById("hambBtn");
  const mobile = document.getElementById("mobileNav");
  const subBtn = mobile?.querySelector(".sub-trigger");
  const subList = mobile?.querySelector(".sub");

  if (!hambBtn || !mobile) return;

  // Estado inicial
  mobile.style.height = "0px";
  if (subList) subList.style.height = "0px";

  let navOpen = false;
  hambBtn.addEventListener("click", () => {
    navOpen = !navOpen;
    hambBtn.setAttribute("aria-expanded", String(navOpen));
    // ao abrir/fechar o mobile, anima só o container
    animateHeightMobile(mobile, navOpen, 220);
    hambBtn.innerHTML = navOpen
      ? '<i class="ri-close-line"></i>'
      : '<i class="ri-menu-line"></i>';
  });

  // Submenu "Produtos" no mobile: anima sub + container JUNTOS
  if (subBtn && subList) {
    let subOpen = false;
    subBtn.addEventListener("click", () => {
      subOpen = !subOpen;
      subBtn.setAttribute("aria-expanded", String(subOpen));

      const icon = subBtn.querySelector("i");
      if (icon)
        icon.style.transform = subOpen ? "rotate(180deg)" : "rotate(0deg)";

      // aqui está o pulo do gato: cresce/encolhe o sub e o container ao mesmo tempo
      animateSubAndContainer(subList, mobile, subOpen, 220);
    });
  }

  // Fecha mobile ao clicar em qualquer link
  mobile.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a || !navOpen) return;
    navOpen = false;
    hambBtn.setAttribute("aria-expanded", "false");
    animateHeightMobile(mobile, false, 180);
    hambBtn.innerHTML = '<i class="ri-menu-line"></i>';
  });
})();
