function roundRect(ctx, x, y, width, height, radius, fillStyle, strokeStyle = null) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fillStyle = fillStyle;
  ctx.fill();
  if (strokeStyle) {
    ctx.strokeStyle = strokeStyle;
    ctx.stroke();
  }
}

function biomePalette(biome) {
  if (biome === "marsh") {
    return {
      grassA: "#567b49",
      grassB: "#486c3f",
      path: "#7e7353",
      water: "#3f728e"
    };
  }
  if (biome === "ruins") {
    return {
      grassA: "#7d8579",
      grassB: "#6d756a",
      path: "#8e8570",
      water: "#4f6776"
    };
  }
  return {
    grassA: "#5ea55d",
    grassB: "#4f914f",
    path: "#b59b6b",
    water: "#4b94d6"
  };
}

export function drawWorldTile(ctx, tileType, x, y, size, biome = "meadow") {
  const palette = biomePalette(biome);

  if (tileType === "water") {
    ctx.fillStyle = palette.water;
    ctx.fillRect(x, y, size, size);
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.fillRect(x + 3, y + 8, size - 6, 3);
    return;
  }

  if (tileType === "path") {
    ctx.fillStyle = palette.path;
    ctx.fillRect(x, y, size, size);
    ctx.fillStyle = "rgba(0,0,0,0.08)";
    ctx.fillRect(x + 2, y + 2, 4, 4);
    return;
  }

  ctx.fillStyle = palette.grassA;
  ctx.fillRect(x, y, size, size);
  ctx.fillStyle = palette.grassB;
  ctx.fillRect(x + 4, y + 5, 3, 3);
  ctx.fillRect(x + 16, y + 12, 2, 2);
  ctx.fillRect(x + 22, y + 22, 2, 2);
}

export function drawPortal(ctx, x, y, size, label) {
  roundRect(ctx, x + size * 0.18, y + size * 0.2, size * 0.64, size * 0.62, 6, "#2a2a5f", "#aeb0ff");
  ctx.fillStyle = "rgba(124, 198, 255, 0.5)";
  ctx.beginPath();
  ctx.arc(x + size * 0.5, y + size * 0.5, size * 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#eef";
  ctx.font = "10px Trebuchet MS";
  ctx.fillText(label, x, y - 2);
}

export function drawTree(ctx, x, y, size) {
  ctx.fillStyle = "#5f4021";
  ctx.fillRect(x + size * 0.4, y + size * 0.42, size * 0.2, size * 0.45);
  ctx.fillStyle = "#2f7f42";
  ctx.beginPath();
  ctx.arc(x + size * 0.5, y + size * 0.32, size * 0.27, 0, Math.PI * 2);
  ctx.fill();
}

export function drawRock(ctx, x, y, size) {
  roundRect(ctx, x + size * 0.2, y + size * 0.36, size * 0.58, size * 0.42, 5, "#7a7f85", "#62676f");
  ctx.fillStyle = "rgba(255,255,255,0.14)";
  ctx.fillRect(x + size * 0.34, y + size * 0.44, size * 0.22, size * 0.08);
}

export function drawPlayer(ctx, x, y, scale = 1, shirt = "#4e7fd4") {
  const s = 20 * scale;
  roundRect(ctx, x + 4 * scale, y + 10 * scale, s * 0.6, s * 0.8, 3 * scale, shirt, "#1e1e1e");
  ctx.fillStyle = "#f1d1a0";
  ctx.beginPath();
  ctx.arc(x + s * 0.5, y + s * 0.33, s * 0.22, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#2c2c2c";
  ctx.fillRect(x + s * 0.24, y + s * 0.73, s * 0.16, s * 0.2);
  ctx.fillRect(x + s * 0.6, y + s * 0.73, s * 0.16, s * 0.2);
}

export function drawEnemy(ctx, kind, x, y, scale = 1) {
  const s = 20 * scale;

  if (kind === "slime") {
    roundRect(ctx, x + 2, y + 7, s * 0.85, s * 0.65, 8, "#59cc66", "#2e7e3b");
    ctx.fillStyle = "#fff";
    ctx.fillRect(x + 7, y + 14, 3, 3);
    ctx.fillRect(x + 15, y + 14, 3, 3);
    return;
  }

  if (kind === "wolf") {
    roundRect(ctx, x + 3, y + 9, s * 0.8, s * 0.45, 4, "#9a8e7d", "#5f584d");
    ctx.fillStyle = "#5f584d";
    ctx.fillRect(x + 6, y + 6, 4, 6);
    ctx.fillRect(x + 16, y + 6, 4, 6);
    ctx.fillStyle = "#fff";
    ctx.fillRect(x + 19, y + 15, 3, 2);
    return;
  }

  roundRect(ctx, x + 6, y + 6, s * 0.55, s * 0.72, 3, "#ece7e0", "#666");
  ctx.fillStyle = "#2a2a2a";
  ctx.fillRect(x + 10, y + 12, 3, 3);
  ctx.fillRect(x + 17, y + 12, 3, 3);
  ctx.fillRect(x + 12, y + 19, 6, 2);
}

export function drawItemIcon(ctx, itemType, x, y, size) {
  if (itemType === "weapon") {
    ctx.fillStyle = "#b8b8b8";
    ctx.fillRect(x + size * 0.45, y + size * 0.1, size * 0.12, size * 0.65);
    ctx.fillStyle = "#805e28";
    ctx.fillRect(x + size * 0.38, y + size * 0.68, size * 0.25, size * 0.2);
    return;
  }

  if (itemType === "armor" || itemType === "helmet" || itemType === "boots") {
    roundRect(ctx, x + size * 0.2, y + size * 0.2, size * 0.6, size * 0.55, 4, "#8190aa", "#556179");
    return;
  }

  if (itemType === "consumable") {
    roundRect(ctx, x + size * 0.3, y + size * 0.2, size * 0.4, size * 0.6, 5, "#c44f4f", "#7f2c2c");
    ctx.fillStyle = "#fff";
    ctx.fillRect(x + size * 0.44, y + size * 0.38, size * 0.12, size * 0.24);
    return;
  }

  roundRect(ctx, x + size * 0.24, y + size * 0.24, size * 0.52, size * 0.52, 4, "#b1975f", "#6b5736");
}

export function drawUiFrame(ctx, x, y, width, height, title) {
  roundRect(ctx, x, y, width, height, 8, "rgba(255,251,240,0.94)", "#b89d6b");
  ctx.fillStyle = "#3d2c1f";
  ctx.font = "16px Trebuchet MS";
  ctx.fillText(title, x + 12, y + 24);
}

export function drawCombatEffect(ctx, kind, x, y) {
  if (kind === "hit") {
    ctx.strokeStyle = "rgba(255,80,80,0.8)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - 12, y - 12);
    ctx.lineTo(x + 12, y + 12);
    ctx.moveTo(x + 12, y - 12);
    ctx.lineTo(x - 12, y + 12);
    ctx.stroke();
    return;
  }

  if (kind === "magic") {
    ctx.fillStyle = "rgba(120, 181, 255, 0.35)";
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
  }
}
