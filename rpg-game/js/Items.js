// Item templates define stat bonuses, consumable effects, rarity, and value.
export const ItemCatalog = {
  minor_potion: {
    id: "minor_potion",
    name: "Minor Potion",
    type: "consumable",
    rarity: "common",
    maxStack: 10,
    value: 12,
    effects: { heal: 35 },
    statBonuses: {}
  },
  mana_drop: {
    id: "mana_drop",
    name: "Mana Drop",
    type: "consumable",
    rarity: "common",
    maxStack: 10,
    value: 14,
    effects: { mana: 30 },
    statBonuses: {}
  },
  bronze_sword: {
    id: "bronze_sword",
    name: "Bronze Sword",
    type: "weapon",
    rarity: "common",
    maxStack: 1,
    value: 35,
    effects: {},
    statBonuses: { strength: 4 }
  },
  apprentice_staff: {
    id: "apprentice_staff",
    name: "Apprentice Staff",
    type: "weapon",
    rarity: "uncommon",
    maxStack: 1,
    value: 44,
    effects: {},
    statBonuses: { intelligence: 4 }
  },
  cloth_armor: {
    id: "cloth_armor",
    name: "Cloth Armor",
    type: "armor",
    rarity: "common",
    maxStack: 1,
    value: 30,
    effects: {},
    statBonuses: { defense: 3 }
  },
  leather_boots: {
    id: "leather_boots",
    name: "Leather Boots",
    type: "boots",
    rarity: "common",
    maxStack: 1,
    value: 28,
    effects: {},
    statBonuses: { agility: 3 }
  },
  iron_helm: {
    id: "iron_helm",
    name: "Iron Helmet",
    type: "helmet",
    rarity: "uncommon",
    maxStack: 1,
    value: 38,
    effects: {},
    statBonuses: { defense: 4 }
  },
  amber_ring: {
    id: "amber_ring",
    name: "Amber Ring",
    type: "accessory",
    rarity: "rare",
    maxStack: 1,
    value: 62,
    effects: {},
    statBonuses: { intelligence: 2, agility: 2 }
  },
  fang: {
    id: "fang",
    name: "Wolf Fang",
    type: "material",
    rarity: "common",
    maxStack: 20,
    value: 10,
    effects: {},
    statBonuses: {}
  },
  bone_shard: {
    id: "bone_shard",
    name: "Bone Shard",
    type: "material",
    rarity: "common",
    maxStack: 20,
    value: 9,
    effects: {},
    statBonuses: {}
  }
};

export function createItem(id, count = 1) {
  if (!ItemCatalog[id]) {
    throw new Error("Unknown item id: " + id);
  }
  return { id, count };
}

function weightedPick(entries) {
  const total = entries.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = Math.random() * total;
  for (const entry of entries) {
    roll -= entry.weight;
    if (roll <= 0) return entry.value;
  }
  return entries[entries.length - 1].value;
}

export function rollLoot(enemyKind) {
  const commonPool = ["minor_potion", "mana_drop", "fang", "bone_shard"];
  const elitePool = ["iron_helm", "amber_ring", "apprentice_staff"];
  const results = [];

  const drops = enemyKind === "skeleton" ? 2 : 1;
  for (let i = 0; i < drops; i += 1) {
    const rarity = weightedPick([
      { value: "common", weight: 72 },
      { value: "uncommon", weight: 22 },
      { value: "rare", weight: 6 }
    ]);

    if (rarity === "rare") {
      const id = elitePool[Math.floor(Math.random() * elitePool.length)];
      results.push({ id, count: 1 });
    } else {
      const id = commonPool[Math.floor(Math.random() * commonPool.length)];
      results.push({ id, count: 1 });
    }
  }

  return results;
}

export function generateShopStock(level) {
  const base = [
    "minor_potion",
    "mana_drop",
    "bronze_sword",
    "cloth_armor",
    "leather_boots"
  ];

  if (level >= 3) base.push("iron_helm", "apprentice_staff");
  if (level >= 5) base.push("amber_ring");

  return base;
}
