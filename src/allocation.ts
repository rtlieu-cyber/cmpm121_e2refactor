export {};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;
let num_producers = 2;
const consumption = 6;

function update() {
  const production = num_producers * 3;
  const balance = production - consumption;

  draw_members();
  draw_resources(production);

  readout.textContent =
    `Assigned: ${num_producers}/6 · Production: ${production} · Consumption: ${consumption} · Balance: ${
      balance > 0 ? "+" : ""
    }${balance}`;
}

function draw_members() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i < num_producers ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = i < num_producers ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${num_producers} / 6`, 18, 76);
}

function draw_resources(produce: number) {
  ctx.fillText(`Production: ${produce}`, 18, 102);
  ctx.fillStyle = "#27766b";
  ctx.fillRect(18, 110, produce * 14, 20);
  ctx.fillStyle = "#233e43";
  ctx.fillText(`Consumption: ${consumption}`, 18, 154);
  ctx.fillStyle = "#a44d23";
  ctx.fillRect(18, 162, consumption * 14, 20);
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  num_producers = Math.max(0, num_producers - 1);
  update();
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  num_producers = Math.min(6, num_producers + 1);
  update();
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    num_producers = 2;
    update();
  };
update();
