export class Player {
  constructor(data = {}) {
    this.name = data.name || "Hero";

    this.level = data.level || 1;
    this.experience = data.experience || 0;

    this.baseStrength = data.baseStrength || 6;
    this.baseDefense = data.baseDefense || 5;
    this.baseAgility = data.baseAgility || 5;
    this.baseIntelligence = data.baseIntelligence || 5;

    this.maxHp = data.maxHp || 110;
    this.maxMana = data.maxMana || 50;
    this.hp = data.hp || this.maxHp;
    this.mana = data.mana || this.maxMana;

    this.gold = data.gold || 30;
    this.unlockedAbilities = data.unlockedAbilities || ["Strike", "Guard", "Spark"];

    this.x = data.x || 12 * 32 + 16;
    this.y = data.y || 10 * 32 + 16;
  }

  getDerivedStats(equipmentBonus) {
    return {
      strength: this.baseStrength + (equipmentBonus.strength || 0),
      defense: this.baseDefense + (equipmentBonus.defense || 0),
      agility: this.baseAgility + (equipmentBonus.agility || 0),
      intelligence: this.baseIntelligence + (equipmentBonus.intelligence || 0)
    };
  }

  getXpToNextLevel() {
    return Math.floor(45 + Math.pow(this.level, 1.4) * 28);
  }

  gainXP(amount) {
    this.experience += amount;

    while (this.experience >= this.getXpToNextLevel()) {
      this.experience -= this.getXpToNextLevel();
      this.levelUp();
    }
  }

  levelUp() {
    this.level += 1;
    this.baseStrength += 2;
    this.baseDefense += 2;
    this.baseAgility += 1;
    this.baseIntelligence += 1;
    this.maxHp += 14;
    this.maxMana += 7;
    this.hp = this.maxHp;
    this.mana = this.maxMana;

    if (this.level === 3 && !this.unlockedAbilities.includes("Fireball")) {
      this.unlockedAbilities.push("Fireball");
    }
    if (this.level === 5 && !this.unlockedAbilities.includes("Thunder Stun")) {
      this.unlockedAbilities.push("Thunder Stun");
    }
  }

  tryMove(dx, dy, map) {
    const nextX = this.x + dx * 32;
    const nextY = this.y + dy * 32;

    const tileX = Math.floor(nextX / map.tileSize);
    const tileY = Math.floor(nextY / map.tileSize);

    if (!map.isWalkable(tileX, tileY)) {
      return false;
    }

    this.x = nextX;
    this.y = nextY;
    return true;
  }

  toJSON() {
    return {
      name: this.name,
      level: this.level,
      experience: this.experience,
      baseStrength: this.baseStrength,
      baseDefense: this.baseDefense,
      baseAgility: this.baseAgility,
      baseIntelligence: this.baseIntelligence,
      maxHp: this.maxHp,
      maxMana: this.maxMana,
      hp: this.hp,
      mana: this.mana,
      gold: this.gold,
      unlockedAbilities: this.unlockedAbilities,
      x: this.x,
      y: this.y
    };
  }

  static fromJSON(data) {
    return new Player(data || {});
  }
}
