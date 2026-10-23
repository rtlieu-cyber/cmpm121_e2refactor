export {};

const canvas = document.querySelector<HTMLCanvasElement>("#rover-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>("#rover-readout")!;
let x = 2;
let y = 2;
let direction = 0;

interface Command {
  label: string;
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
  label: "Forward",
  execute() {
    const curr = directions[direction];
    x = Math.max(0, Math.min(4, x + curr.xoffset));
    y = Math.max(0, Math.min(4, y + curr.yoffset));
    drawRover();
  },
};

const RightCmd: Command = {
  label: "Right",
  execute() {
    direction = (direction + 1) % directions.length;
    drawRover();
  },
};

const CommandQueue: Command[] = [];

function InvokeThee(Command: Command) {
  Command.execute();
}

function drawQueue() {
  const pendingList = document.querySelector<HTMLOListElement>(
    "#rover-pending",
  );
  pendingList?.replaceChildren();
  CommandQueue.forEach((command) => {
    const item = document.createElement("li");
    item.textContent = command.label;
    pendingList?.append(item);
  });
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
  CommandQueue.push(ForwardCmd);
  drawQueue();
};
document.querySelector<HTMLButtonElement>("#rover-right")!.onclick = () => {
  CommandQueue.push(RightCmd);
  drawQueue();
};
document.querySelector<HTMLButtonElement>("#rover-reset")!.onclick = () => {
  x = 2;
  y = 2;
  direction = 0;
  CommandQueue.length = 0;
  drawQueue();
  drawRover();
};
document.querySelector<HTMLButtonElement>("#rover-run")!.onclick = () => {
  CommandQueue.forEach((command) => {
    InvokeThee(command);
  });
  CommandQueue.length = 0;
  drawQueue();
  drawRover();
};
document.querySelector<HTMLButtonElement>("#rover-clear")!.onclick = () => {
  CommandQueue.length = 0;
  drawQueue();
  drawRover();
};
drawRover();
