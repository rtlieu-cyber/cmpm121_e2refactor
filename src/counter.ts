export {};

const canvas = document.querySelector<HTMLCanvasElement>("#counter-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#counter-readout",
)!;
const host = document.querySelector<HTMLDivElement>("#counter-panel-host")!;
const diagnostic = document.querySelector<HTMLParagraphElement>(
  "#counter-diagnostic",
)!;
let count = 0;
let panel: HTMLParagraphElement | null = null;
let panelUpdates = 0;

interface ShieldSnapshot {
  curr_charge: number;
  capacity: number;
  missing_charge: number;
}

const shieldEvent = new EventTarget();

function shieldCalc(count: number): ShieldSnapshot {
  const curr_charge = count;
  const capacity = 10;
  const missing_charge = capacity - count;

  const calced_result: ShieldSnapshot = {
    curr_charge,
    capacity,
    missing_charge,
  };

  return calced_result;
}

function drawMeter(shield: ShieldSnapshot) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < shield.capacity; i++) {
    ctx.fillStyle = i < shield.curr_charge ? "#27766b" : "#c9d2c9";
    ctx.fillRect(12 + i * 28, 24, 24, 48);
  }

  ctx.fillStyle = "#233e43";
  ctx.font = "16px system-ui";
  ctx.fillText(`${shield.curr_charge} / ${shield.capacity} shield`, 12, 100);
  readout.textContent =
    `Shield charge: ${shield.curr_charge} / ${shield.capacity}`;
}

function updateStats(shield: ShieldSnapshot) {
  panelUpdates++;
  diagnostic.textContent = `Inspector deliveries: ${panelUpdates}`;
  renderStats(shield);
}

function renderStats(shield: ShieldSnapshot) {
  if (!panel) return;
  panel.textContent =
    `Shield charge: ${shield.curr_charge} · Missing charge: ${shield.missing_charge}`;
}

shieldEvent.addEventListener("shield-change", (event) => {
  const snapshot = (event as CustomEvent<ShieldSnapshot>).detail;
  drawMeter(snapshot);
});

function setCount(next: number) {
  const bounded = Math.max(0, Math.min(10, next));
  if (bounded === count) return;
  count = bounded;
  const shield = shieldCalc(count);
  shieldEvent.dispatchEvent(
    new CustomEvent<ShieldSnapshot>("shield-change", { detail: shield }),
  );
  if (panel) updateStats(shield);
}

document.querySelector<HTMLButtonElement>("#counter-less")!.onclick = () => {
  setCount(count - 1);
};
document.querySelector<HTMLButtonElement>("#counter-more")!.onclick = () => {
  setCount(count + 1);
};
document.querySelector<HTMLButtonElement>("#counter-reset")!.onclick = () => {
  setCount(0);
};
document.querySelector<HTMLButtonElement>("#counter-open")!.onclick = () => {
  if (panel) return;
  panel = document.createElement("p");
  host.append(panel);
  renderStats(shieldCalc(count));
};
document.querySelector<HTMLButtonElement>("#counter-close")!.onclick = () => {
  if (!panel) return;
  panel.remove();
  panel = null;
};

shieldEvent.dispatchEvent(
  new CustomEvent<ShieldSnapshot>("shield-change", {
    detail: shieldCalc(count),
  }),
);
