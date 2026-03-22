export function drawSky(ctx, width, height) {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "#9ad9ff");
  gradient.addColorStop(0.6, "#bde9ff");
  gradient.addColorStop(1, "#e8f7c8");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

export function drawMountain(ctx, x, baseY, width, height, color = "#6b88a8") {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, baseY);
  ctx.lineTo(x + width * 0.5, baseY - height);
  ctx.lineTo(x + width, baseY);
  ctx.closePath();
  ctx.fill();
}

export function drawTree(ctx, x, baseY, size, color = "#1f5f3b") {
  const trunkW = size * 0.16;
  const trunkH = size * 0.38;

  ctx.fillStyle = "#6e4a2f";
  ctx.fillRect(x - trunkW / 2, baseY - trunkH, trunkW, trunkH);

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, baseY - size);
  ctx.lineTo(x - size * 0.35, baseY - trunkH * 0.9);
  ctx.lineTo(x + size * 0.35, baseY - trunkH * 0.9);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(x, baseY - size * 0.75);
  ctx.lineTo(x - size * 0.45, baseY - trunkH * 0.5);
  ctx.lineTo(x + size * 0.45, baseY - trunkH * 0.5);
  ctx.closePath();
  ctx.fill();
}

export function drawCloud(ctx, x, y, size, color = "rgba(255,255,255,0.9)") {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, size * 0.26, 0, Math.PI * 2);
  ctx.arc(x + size * 0.22, y - size * 0.1, size * 0.32, 0, Math.PI * 2);
  ctx.arc(x + size * 0.5, y, size * 0.26, 0, Math.PI * 2);
  ctx.fill();
}

export function drawBush(ctx, x, groundY, size, color = "#2f8b3d") {
  const y = groundY - size * 0.2;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, size * 0.3, 0, Math.PI * 2);
  ctx.arc(x + size * 0.28, y - 5, size * 0.35, 0, Math.PI * 2);
  ctx.arc(x + size * 0.56, y, size * 0.3, 0, Math.PI * 2);
  ctx.fill();
}

export function drawRock(ctx, x, groundY, width, height) {
  const topY = groundY - height;
  ctx.fillStyle = "#7d8794";
  ctx.beginPath();
  ctx.moveTo(x + width * 0.05, groundY);
  ctx.lineTo(x + width * 0.2, topY + height * 0.2);
  ctx.lineTo(x + width * 0.5, topY);
  ctx.lineTo(x + width * 0.86, topY + height * 0.2);
  ctx.lineTo(x + width * 0.95, groundY);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.fillRect(x + width * 0.26, topY + height * 0.24, width * 0.25, height * 0.14);
}

export function drawLog(ctx, x, groundY, width, height) {
  const y = groundY - height;
  const r = height / 2;

  ctx.fillStyle = "#7b4e2f";
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.arc(x + width - r, y + r, r, -Math.PI / 2, Math.PI / 2);
  ctx.lineTo(x + r, y + height);
  ctx.arc(x + r, y + r, r, Math.PI / 2, -Math.PI / 2);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "rgba(48, 25, 10, 0.45)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + width * 0.25, y + 3);
  ctx.lineTo(x + width * 0.25, y + height - 3);
  ctx.moveTo(x + width * 0.5, y + 3);
  ctx.lineTo(x + width * 0.5, y + height - 3);
  ctx.moveTo(x + width * 0.75, y + 3);
  ctx.lineTo(x + width * 0.75, y + height - 3);
  ctx.stroke();
}

export function drawCollectible(ctx, x, y, radius, pulse) {
  ctx.fillStyle = `rgba(183, 255, 88, ${0.5 + 0.5 * pulse})`;
  ctx.beginPath();
  ctx.arc(x, y, radius + pulse * 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#f7ffbe";
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.6, 0, Math.PI * 2);
  ctx.fill();
}

export function drawGround(ctx, segment, canvasHeight, elapsedTime) {
  const x = segment.x;
  const y = segment.y;
  const width = segment.width;

  // Dirt fill.
  ctx.fillStyle = "#875838";
  ctx.beginPath();
  ctx.moveTo(x, y);

  const step = 18;
  const steps = Math.ceil(width / step);
  for (let i = 0; i <= steps; i++) {
    const px = x + i * step;
    const wobble = Math.sin((segment.seed + i * 0.55) * 2.1) * 1.8;
    ctx.lineTo(px, y + wobble);
  }

  ctx.lineTo(x + width, canvasHeight + 40);
  ctx.lineTo(x, canvasHeight + 40);
  ctx.closePath();
  ctx.fill();

  // Grass top.
  ctx.fillStyle = "#4caf50";
  ctx.beginPath();
  ctx.moveTo(x, y - 10);
  for (let i = 0; i <= steps; i++) {
    const px = x + i * step;
    const wobble = Math.sin((segment.seed + i * 0.42 + elapsedTime * 2.2) * 1.5) * 2.2;
    ctx.lineTo(px, y - 10 + wobble);
  }
  ctx.lineTo(x + width, y + 2);
  ctx.lineTo(x, y + 2);
  ctx.closePath();
  ctx.fill();

  // Tiny animated grass strokes.
  ctx.strokeStyle = "rgba(50, 140, 55, 0.7)";
  ctx.lineWidth = 1;
  for (let i = 0; i < width; i += 14) {
    const gx = x + i;
    const wave = Math.sin(elapsedTime * 5 + gx * 0.05) * 2;
    ctx.beginPath();
    ctx.moveTo(gx, y - 2);
    ctx.lineTo(gx + wave, y - 8 - Math.abs(wave) * 0.2);
    ctx.stroke();
  }
}

export function drawPlayer(ctx, player, elapsedTime) {
  const x = player.screenX;
  const footY = player.y;
  const topY = footY - player.height;

  // Body.
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(x - 12, topY + 16, 24, 24);

  // Head.
  ctx.fillStyle = "#ffd2a6";
  ctx.beginPath();
  ctx.arc(x, topY + 8, 8, 0, Math.PI * 2);
  ctx.fill();

  // Eye.
  ctx.fillStyle = "#1b1b1b";
  ctx.fillRect(x + 2, topY + 6, 2, 2);

  // Limbs.
  ctx.strokeStyle = "#0f172a";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";

  const swing = player.onGround ? Math.sin(elapsedTime * 16) * 7 : 0;

  // Arms.
  ctx.beginPath();
  ctx.moveTo(x - 8, topY + 22);
  ctx.lineTo(x - 13, topY + 30 + swing * 0.2);
  ctx.moveTo(x + 8, topY + 22);
  ctx.lineTo(x + 13, topY + 30 - swing * 0.2);
  ctx.stroke();

  // Legs with jump pose fallback.
  if (player.onGround) {
    ctx.beginPath();
    ctx.moveTo(x - 5, topY + 40);
    ctx.lineTo(x - 7 - swing * 0.4, footY);
    ctx.moveTo(x + 5, topY + 40);
    ctx.lineTo(x + 7 + swing * 0.4, footY);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(x - 5, topY + 40);
    ctx.lineTo(x - 12, footY - 5);
    ctx.moveTo(x + 5, topY + 40);
    ctx.lineTo(x + 12, footY - 8);
    ctx.stroke();
  }
}
