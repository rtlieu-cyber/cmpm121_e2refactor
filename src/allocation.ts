export {};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;
let producers = 2;

function update() {
  const results = calc(producers);
  draw_members(results);
  draw_resources(results);
  text_update(results);
}

interface ShiftedProdNums {
  production: number;
  consumption: number;
  balance: number;
  producers: number;
}

interface ResourceDisplay {
  label: string;
  color: string;
  howmany: number;
}

function calc(producers: number): ShiftedProdNums {
  const production = producers * 3;
  const consumption = 6;

  const calcresult: ShiftedProdNums = {
    production,
    consumption,
    balance: production - consumption,
    producers,
  };
  return calcresult;
}

function text_update(results: ShiftedProdNums) {
  readout.textContent =
    `Assigned: ${results.producers}/6 · Production: ${results.production} · Consumption: ${results.consumption} · Balance: ${
      results.balance > 0 ? "+" : ""
    }${results.balance}`;
}

function draw_members(results: ShiftedProdNums) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i < results.producers ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = i < results.producers ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Assigned to production: ${results.producers} / 6`, 18, 76);
}

function draw_resources(results: ShiftedProdNums) {
  const resources_to_draw: ResourceDisplay[] = [
    {
      label: "Production",
      color: "#27766b",
      howmany: results.production,
    },
    {
      label: "Consumption",
      color: "#a44d23",
      howmany: results.consumption,
    },
  ];

  resources_to_draw.forEach((resource, index) => {
    ctx.fillStyle = "#233e43";
    ctx.fillText(
      `${resource.label}: ${resource.howmany}`,
      18,
      102 + index * 52,
    );
    ctx.fillStyle = `${resource.color}`;
    ctx.fillRect(18, 110 + index * 52, resource.howmany * 14, 20);
  });
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  producers = Math.max(0, producers - 1);
  update();
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  producers = Math.min(6, producers + 1);
  update();
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    producers = 2;
    update();
  };
update();
