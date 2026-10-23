export {};

const canvas = document.querySelector<HTMLCanvasElement>("#rover-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>("#rover-readout")!;
let x = 2;
let y = 2;
let direction = 0;

interface Command {
  execute(): void;
}

interface Direction {
  label: string;
  xoffset: number;
  yoffset: number;
}

const directions: Direction[] = [
  {
    label: "North",
    xoffset: 0,
    yoffset: -1,
  },
  {
    label: "East",
    xoffset: 1,
    yoffset: 0,
  },
  {
    label: "South",
    xoffset: 0,
    yoffset: 1,
  },
  {
    label: "West",
    xoffset: -1,
    yoffset: 0,
  },
];

const ForwardCmd: Command = {
  execute() {
    const curr = directions[direction];
    x = Math.max(0, Math.min(4, x + curr.xoffset));
    y = Math.max(0, Math.min(4, y + curr.yoffset));
    drawRover();
  },
};

const RightCmd: Command = {
  execute() {
    direction = (direction + 1) % directions.length;
    drawRover();
  },
};

function InvokeThee(Command: Command) {
  Command.execute();
}

function drawRover() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#718881";
  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 5; column++) {
      ctx.strokeRect(10 + column * 56, 10 + row * 56, 56, 56);
    }
  }
  ctx.save();
  ctx.translate(38 + x * 56, 38 + y * 56);
  ctx.rotate(direction * Math.PI / 2);
  ctx.fillStyle = "#27766b";
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(17, 16);
  ctx.lineTo(-17, 16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  readout.textContent = `Position: (${x}, ${y}) · Facing: ${
    directions[direction].label
  }`;
}

document.querySelector<HTMLButtonElement>("#rover-forward")!.onclick = () => {
  InvokeThee(ForwardCmd);
};
document.querySelector<HTMLButtonElement>("#rover-right")!.onclick = () => {
  InvokeThee(RightCmd);
};
document.querySelector<HTMLButtonElement>("#rover-reset")!.onclick = () => {
  x = 2;
  y = 2;
  direction = 0;
  drawRover();
};
drawRover();
