// 🎯 Configurações
const INERCIA_MS = 300; // tempo após parar o scroll
const EASING = 0.12; // 0.08 ~ 0.2 para ajustar suavidade
const INTENSIDADE = 0.2; // força do deslocamento (menor = mais sutil)

const states = [...document.querySelectorAll(".element")].map((el) => ({
  el,
  current: 0, // posição atual aplicada
  target: 0, // posição desejada calculada
}));

let lastScrollTime = 0;
let rafId = null;

function computeTargets(windowHeight) {
  // Calcula o alvo (target) de cada elemento com base na posição no viewport
  for (const s of states) {
    const rect = s.el.getBoundingClientRect();
    // Só computa quando o elemento tem chance de estar visível (pequena margem)
    if (rect.bottom > -100 && rect.top < windowHeight + 100) {
      const offset = rect.top - windowHeight * 0.8;
      s.target = Math.min(0, offset * INTENSIDADE); // move para cima (<= 0)
    }
  }
}

function renderFrame() {
  const now = performance.now();
  const windowHeight = window.innerHeight;

  // Atualiza alvos continuamente (para acompanhar o scroll e a inércia)
  computeTargets(windowHeight);

  let stillAnimating = false;

  for (const s of states) {
    // Lerp (interpolação) em direção ao alvo
    s.current += (s.target - s.current) * EASING;

    // Aplica transform
    s.el.style.transform = `translateY(${s.current}px)`;

    // Opcional: leve ajuste de opacidade (remova se não quiser)
    // s.el.style.opacity = 1 - Math.min(0.15, Math.abs(s.current) / 300);

    // Verifica se ainda há movimento perceptível
    if (Math.abs(s.target - s.current) > 0.5) {
      stillAnimating = true;
    }
  }

  // Mantém rodando enquanto há diferença OU dentro da janela de inércia
  const dentroDaInercia = now - lastScrollTime < INERCIA_MS;

  if (stillAnimating || dentroDaInercia) {
    rafId = requestAnimationFrame(renderFrame);
  } else {
    rafId = null; // para o loop até novo scroll
  }
}

// Evento de scroll: marca horário e inicia RAF se necessário
function onScroll() {
  lastScrollTime = performance.now();
  if (rafId == null) {
    rafId = requestAnimationFrame(renderFrame);
  }
}

// Também reanima quando redimensiona (layout muda)
function onResize() {
  lastScrollTime = performance.now();
  if (rafId == null) {
    rafId = requestAnimationFrame(renderFrame);
  }
}

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onResize);
onScroll(); // dispara uma vez ao carregar
