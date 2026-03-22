export class Enemy {
  constructor(data) {
    this.id = data.id;
    this.kind = data.kind;
    this.level = data.level;
    this.name = data.name;
    this.maxHp = data.maxHp;
    this.hp = data.hp;
    this.attack = data.attack;
    this.defense = data.defense;
    this.agility = data.agility;
    this.intelligence = data.intelligence;
    this.statusEffects = data.statusEffects || [];
    this.x = data.x || 0;
    this.y = data.y || 0;
  }
}

const TYPES = [
  {
    kind: "slime",
    name: "Green Slime",
    hp: 42,
    attack: 8,
    defense: 4,
    agility: 3,
    intelligence: 1
  },
  {
    kind: "wolf",
    name: "Wild Wolf",
    hp: 58,
    attack: 11,
    defense: 5,
    agility: 8,
    intelligence: 2
  },
  {
    kind: "skeleton",
    name: "Bone Soldier",
    hp: 66,
    attack: 10,
    defense: 8,
    agility: 5,
    intelligence: 6
  }
];

const BIOME_TABLES = {
  meadow: ["slime", "wolf"],
  ruins: ["skeleton", "wolf"],
  marsh: ["slime", "skeleton"]
};

function getTemplate(kind) {
  return TYPES.find((entry) => entry.kind === kind) || TYPES[0];
}

export function createProceduralEnemy(playerLevel, biome = "meadow") {
  const table = BIOME_TABLES[biome] || BIOME_TABLES.meadow;
  const kind = table[Math.floor(Math.random() * table.length)];
  const template = getTemplate(kind);
  const level = Math.max(1, playerLevel + Math.floor(Math.random() * 3) - 1);
  const scale = 1 + (level - 1) * 0.18;

  return new Enemy({
    id: "enemy-" + Math.random().toString(36).slice(2, 10),
    kind: template.kind,
    name: template.name,
    level,
    maxHp: Math.floor(template.hp * scale),
    hp: Math.floor(template.hp * scale),
    attack: Math.floor(template.attack * scale),
    defense: Math.floor(template.defense * scale),
    agility: Math.floor(template.agility * scale),
    intelligence: Math.floor(template.intelligence * scale),
    statusEffects: [],
    biome
  });
}
