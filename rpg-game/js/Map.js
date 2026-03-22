const ELDER_DIALOGUE = {
  start: {
    speaker: "Elder Rowan",
    text: "Bandits and beasts roam beyond town. Prove yourself, recruit.",
    options: [
      { label: "I am ready.", next: "questIntro", questAction: "start_chain" },
      { label: "Any guidance?", next: "tips" }
    ]
  },
  tips: {
    speaker: "Elder Rowan",
    text: "Travel through portals to train in each biome and report back.",
    next: "end"
  },
  questIntro: {
    speaker: "Elder Rowan",
    text: "Three tasks await: clear meadow slimes, gather marsh fangs, and defeat ruins skeletons.",
    next: "end"
  },
  end: {
    speaker: "Elder Rowan",
    text: "Keep your blade sharp."
  }
};

const SCHOLAR_DIALOGUE = {
  start: {
    speaker: "Scholar Iri",
    text: "I am studying portal resonance. Need details?",
    options: [
      { label: "Tell me about zones.", next: "zones" },
      { label: "I will keep exploring.", next: "end" }
    ]
  },
  zones: {
    speaker: "Scholar Iri",
    text: "Meadow breeds slimes and wolves. Marsh has toxic growths. Ruins awaken skeletons.",
    next: "end"
  },
  end: {
    speaker: "Scholar Iri",
    text: "Return with new field notes."
  }
};

function idFrom(x, y, zoneName) {
  return zoneName + "-" + x + "-" + y;
}

export class WorldMap {
  constructor(width, height, tileSize) {
    this.width = width;
    this.height = height;
    this.tileSize = tileSize;

    this.zones = this.createZones();
    this.currentZone = "meadow";
    this.spawn = { x: 12, y: 10 };

    this.tiles = this.createTiles(this.currentZone);
    this.decorations = this.createDecorations(this.currentZone);
    this.npcs = this.createNpcs(this.currentZone);
    this.portals = this.createPortals(this.currentZone);
    this.enemies = [];
  }

  createZones() {
    return {
      meadow: {
        name: "Sun Meadow",
        biome: "meadow",
        spawn: { x: 12, y: 10 },
        waterCount: 4,
        treeRate: 0.08,
        rockRate: 0.03
      },
      marsh: {
        name: "Murk Marsh",
        biome: "marsh",
        spawn: { x: 8, y: 8 },
        waterCount: 8,
        treeRate: 0.05,
        rockRate: 0.07
      },
      ruins: {
        name: "Stone Ruins",
        biome: "ruins",
        spawn: { x: 9, y: 9 },
        waterCount: 2,
        treeRate: 0.03,
        rockRate: 0.12
      }
    };
  }

  loadZone(zoneName) {
    const zone = this.zones[zoneName] || this.zones.meadow;
    this.currentZone = zoneName;
    this.spawn = { ...zone.spawn };
    this.tiles = this.createTiles(zoneName);
    this.decorations = this.createDecorations(zoneName);
    this.npcs = this.createNpcs(zoneName);
    this.portals = this.createPortals(zoneName);
    this.enemies = [];
  }

  createTiles(zoneName) {
    const zone = this.zones[zoneName];
    const map = Array.from({ length: this.height }, () => Array.from({ length: this.width }, () => "grass"));

    for (let x = 4; x < this.width - 6; x += 1) {
      const y = Math.max(3, Math.min(this.height - 3, zone.spawn.y + Math.floor(Math.sin(x * 0.25) * 2)));
      map[y][x] = "path";
      map[y + 1][x] = "path";
    }

    for (let i = 0; i < zone.waterCount; i += 1) {
      const cx = 8 + Math.floor(Math.random() * (this.width - 16));
      const cy = 8 + Math.floor(Math.random() * (this.height - 16));
      const radius = 2 + Math.floor(Math.random() * 3);
      for (let y = cy - radius; y <= cy + radius; y += 1) {
        for (let x = cx - radius; x <= cx + radius; x += 1) {
          if (!this.inBounds(x, y)) continue;
          const dx = x - cx;
          const dy = y - cy;
          if (dx * dx + dy * dy <= radius * radius) {
            map[y][x] = "water";
          }
        }
      }
    }

    for (let y = zone.spawn.y - 2; y <= zone.spawn.y + 2; y += 1) {
      for (let x = zone.spawn.x - 3; x <= zone.spawn.x + 3; x += 1) {
        if (!this.inBounds(x, y)) continue;
        map[y][x] = "path";
      }
    }

    return map;
  }

  createDecorations(zoneName) {
    const zone = this.zones[zoneName];
    const deco = [];
    for (let y = 0; y < this.height; y += 1) {
      for (let x = 0; x < this.width; x += 1) {
        if (this.tiles[y][x] !== "grass") continue;
        const roll = Math.random();
        if (roll < zone.treeRate) {
          deco.push({ type: "tree", x, y, blocks: true });
        } else if (roll < zone.treeRate + zone.rockRate) {
          deco.push({ type: "rock", x, y, blocks: true });
        }
      }
    }
    return deco;
  }

  createPortals(zoneName) {
    const links = {
      meadow: [
        { x: 18, y: 10, toZone: "marsh", toX: 7, toY: 8, name: "Marsh Gate" },
        { x: 19, y: 10, toZone: "ruins", toX: 9, toY: 8, name: "Ruins Gate" }
      ],
      marsh: [{ x: 5, y: 7, toZone: "meadow", toX: 18, toY: 10, name: "Town Return" }],
      ruins: [{ x: 7, y: 7, toZone: "meadow", toX: 19, toY: 10, name: "Town Return" }]
    };

    return (links[zoneName] || []).map((entry) => ({
      id: idFrom(entry.x, entry.y, zoneName),
      ...entry
    }));
  }

  createNpcs(zoneName) {
    if (zoneName === "marsh") {
      return [
        {
          id: "marsh-hermit",
          name: "Fen Hermit",
          kind: "story",
          x: 11,
          y: 9,
          dialogueTree: {
            start: {
              speaker: "Fen Hermit",
              text: "Collect wolf fangs from marsh predators.",
              next: "end"
            },
            end: {
              speaker: "Fen Hermit",
              text: "I can craft charms once you return with enough materials."
            }
          }
        }
      ];
    }

    if (zoneName === "ruins") {
      return [
        {
          id: "ruin-ghost",
          name: "Ruins Warden",
          kind: "story",
          x: 10,
          y: 8,
          dialogueTree: {
            start: {
              speaker: "Ruins Warden",
              text: "Defeat skeletons and reclaim this place.",
              next: "end"
            },
            end: {
              speaker: "Ruins Warden",
              text: "Your courage echoes through stone halls."
            }
          }
        }
      ];
    }

    return [
      {
        id: "elder",
        name: "Elder Rowan",
        kind: "story",
        x: 11,
        y: 9,
        dialogueTree: ELDER_DIALOGUE
      },
      {
        id: "scholar",
        name: "Scholar Iri",
        kind: "story",
        x: 13,
        y: 10,
        dialogueTree: SCHOLAR_DIALOGUE
      },
      {
        id: "merchant",
        name: "Mira the Merchant",
        kind: "shop",
        x: 14,
        y: 11,
        dialogueTree: {
          start: {
            speaker: "Mira",
            text: "Take a look at my wares.",
            options: [{ label: "Open Shop", action: "openShop" }]
          }
        }
      }
    ];
  }

  inBounds(x, y) {
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
  }

  getTile(x, y) {
    if (!this.inBounds(x, y)) return "water";
    return this.tiles[y][x];
  }

  isWalkable(x, y) {
    if (!this.inBounds(x, y)) return false;
    if (this.tiles[y][x] === "water") return false;

    if (this.portals.some((portal) => portal.x === x && portal.y === y)) {
      return true;
    }

    const blockedByDecoration = this.decorations.some((deco) => deco.blocks && deco.x === x && deco.y === y);
    if (blockedByDecoration) return false;

    return true;
  }

  getPortalAt(x, y) {
    return this.portals.find((portal) => portal.x === x && portal.y === y) || null;
  }

  ensureEnemyPopulation(targetCount, factory) {
    if (this.enemies.length >= targetCount) return;

    const needed = targetCount - this.enemies.length;
    for (let i = 0; i < needed; i += 1) {
      const enemy = factory(this.zones[this.currentZone].biome);
      let placed = false;
      for (let tries = 0; tries < 50 && !placed; tries += 1) {
        const x = Math.floor(Math.random() * this.width);
        const y = Math.floor(Math.random() * this.height);

        const distToSpawn = Math.abs(x - this.spawn.x) + Math.abs(y - this.spawn.y);
        if (distToSpawn < 7) continue;
        if (!this.isWalkable(x, y)) continue;
        if (this.enemies.some((entry) => entry.x === x && entry.y === y)) continue;
        if (this.npcs.some((entry) => entry.x === x && entry.y === y)) continue;

        enemy.x = x;
        enemy.y = y;
        this.enemies.push(enemy);
        placed = true;
      }
    }
  }

  removeEnemy(enemyId) {
    this.enemies = this.enemies.filter((entry) => entry.id !== enemyId);
  }

  toJSON() {
    return {
      width: this.width,
      height: this.height,
      tileSize: this.tileSize,
      currentZone: this.currentZone,
      spawn: this.spawn,
      tiles: this.tiles,
      decorations: this.decorations,
      npcs: this.npcs,
      enemies: this.enemies,
      portals: this.portals
    };
  }

  static fromJSON(data) {
    const map = new WorldMap(data.width, data.height, data.tileSize);
    map.currentZone = data.currentZone || "meadow";
    map.spawn = data.spawn || map.spawn;
    map.tiles = data.tiles || map.tiles;
    map.decorations = data.decorations || map.decorations;
    map.npcs = data.npcs || map.npcs;
    map.enemies = data.enemies || [];
    map.portals = data.portals || map.portals;
    return map;
  }
}
