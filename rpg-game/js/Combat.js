import { ItemCatalog, rollLoot } from "./Items.js";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function computeDamage(attackerPower, defenderPower, variance = 0.2) {
  const base = attackerPower - defenderPower * 0.45;
  const randomScale = 1 + (Math.random() * 2 - 1) * variance;
  return Math.max(1, Math.floor(base * randomScale));
}

export class Combat {
  constructor(player, inventory, callbacks) {
    this.player = player;
    this.inventory = inventory;
    this.onLog = callbacks.onLog;
    this.onState = callbacks.onState;
    this.onFinish = callbacks.onFinish;

    this.enemy = null;
    this.turn = "player";
    this.playerDefending = false;
  }

  start(enemy) {
    this.enemy = enemy;
    this.enemy.hp = this.enemy.maxHp;
    this.enemy.statusEffects = [];
    this.turn = "player";
    this.playerDefending = false;

    this.onLog("A " + enemy.name + " appeared.");
    this.emitState();
  }

  emitState() {
    this.onState({
      turn: this.turn,
      enemy: this.enemy,
      player: this.player,
      inventory: this.inventory,
      actions: ["attack", "defend", "magic", "item"]
    });
  }

  playerAction(action, payload) {
    if (this.turn !== "player" || !this.enemy) return;

    const equip = this.inventory.getEquipmentBonuses();
    const playerStats = this.player.getDerivedStats(equip);

    if (action === "attack") {
      const damage = computeDamage(playerStats.strength * 2.2, this.enemy.defense + this.enemy.level);
      this.enemy.hp = clamp(this.enemy.hp - damage, 0, this.enemy.maxHp);
      this.onLog("You strike for " + damage + " damage.");
    }

    if (action === "defend") {
      this.playerDefending = true;
      this.onLog("You brace for impact.");
    }

    if (action === "magic") {
      this.castMagic(playerStats, payload?.spell || "Spark");
    }

    if (action === "item") {
      this.useCombatItem(payload?.slotIndex);
    }

    this.tickStatus(this.enemy, "enemy");

    if (this.enemy.hp <= 0) {
      this.resolveVictory();
      return;
    }

    this.turn = "enemy";
    this.emitState();
    this.enemyTurn();
  }

  castMagic(playerStats, spellName) {
    if (spellName === "Spark") {
      if (this.player.mana < 8) {
        this.onLog("Not enough mana.");
        return;
      }
      this.player.mana -= 8;
      const damage = computeDamage(playerStats.intelligence * 2.6, this.enemy.defense * 0.7, 0.15);
      this.enemy.hp = clamp(this.enemy.hp - damage, 0, this.enemy.maxHp);
      this.onLog("Spark hits for " + damage + " damage.");
      return;
    }

    if (spellName === "Fireball" && this.player.unlockedAbilities.includes("Fireball")) {
      if (this.player.mana < 14) {
        this.onLog("Not enough mana.");
        return;
      }
      this.player.mana -= 14;
      const damage = computeDamage(playerStats.intelligence * 3.3, this.enemy.defense * 0.65);
      this.enemy.hp = clamp(this.enemy.hp - damage, 0, this.enemy.maxHp);
      this.enemy.statusEffects.push({ type: "burn", turns: 3, power: 4 + Math.floor(playerStats.intelligence * 0.12) });
      this.onLog("Fireball scorches the enemy for " + damage + " damage.");
      return;
    }

    if (spellName === "Thunder Stun" && this.player.unlockedAbilities.includes("Thunder Stun")) {
      if (this.player.mana < 18) {
        this.onLog("Not enough mana.");
        return;
      }
      this.player.mana -= 18;
      const damage = computeDamage(playerStats.intelligence * 2.4, this.enemy.defense * 0.8);
      this.enemy.hp = clamp(this.enemy.hp - damage, 0, this.enemy.maxHp);
      this.enemy.statusEffects.push({ type: "stun", turns: 1, power: 0 });
      this.onLog("Thunder Stun deals " + damage + " damage and stuns!");
      return;
    }

    this.onLog("That spell is not available.");
  }

  useCombatItem(slotIndex) {
    if (slotIndex === undefined || slotIndex === null) {
      this.onLog("Pick an inventory slot to use an item.");
      return;
    }

    const slot = this.inventory.slots[slotIndex];
    if (!slot) {
      this.onLog("No item in that slot.");
      return;
    }

    const item = ItemCatalog[slot.id];
    if (!item || item.type !== "consumable") {
      this.onLog("Only consumables can be used in combat.");
      return;
    }

    if (item.effects?.heal) {
      this.player.hp = clamp(this.player.hp + item.effects.heal, 0, this.player.maxHp);
      this.onLog("You recover HP with " + item.name + ".");
    }
    if (item.effects?.mana) {
      this.player.mana = clamp(this.player.mana + item.effects.mana, 0, this.player.maxMana);
      this.onLog("You recover mana with " + item.name + ".");
    }

    this.inventory.removeFromSlot(slotIndex, 1);
  }

  enemyTurn() {
    if (!this.enemy) return;

    if (this.enemy.statusEffects.some((effect) => effect.type === "stun" && effect.turns > 0)) {
      this.onLog(this.enemy.name + " is stunned and skips a turn.");
      this.decrementStatuses(this.enemy);
      this.turn = "player";
      this.playerDefending = false;
      this.emitState();
      return;
    }

    const enemyPower = this.enemy.attack * 2 + this.enemy.level;
    const defendFactor = this.playerDefending ? 0.55 : 1;
    const damage = Math.floor(computeDamage(enemyPower, this.player.baseDefense + this.player.level) * defendFactor);

    this.player.hp = clamp(this.player.hp - damage, 0, this.player.maxHp);
    this.onLog(this.enemy.name + " attacks for " + damage + " damage.");

    if (Math.random() < 0.2 && this.enemy.kind === "wolf") {
      this.playerStatus = this.playerStatus || [];
      this.playerStatus.push({ type: "poison", turns: 3, power: 3 });
      this.onLog("You are poisoned.");
    }

    this.tickPlayerStatus();
    this.tickStatus(this.enemy, "enemy");

    if (this.player.hp <= 0) {
      this.onFinish({ victory: false, xpGained: 0, goldGained: 0, loot: [] });
      return;
    }

    if (this.enemy.hp <= 0) {
      this.resolveVictory();
      return;
    }

    this.turn = "player";
    this.playerDefending = false;
    this.decrementStatuses(this.enemy);
    this.emitState();
  }

  tickStatus(target, label) {
    for (const effect of target.statusEffects) {
      if (effect.turns <= 0) continue;
      if (effect.type === "burn") {
        target.hp = clamp(target.hp - effect.power, 0, target.maxHp);
        this.onLog((label === "enemy" ? target.name : "You") + " suffer burn damage.");
      }
    }
  }

  tickPlayerStatus() {
    if (!this.playerStatus) return;

    for (const effect of this.playerStatus) {
      if (effect.turns <= 0) continue;
      if (effect.type === "poison") {
        this.player.hp = clamp(this.player.hp - effect.power, 0, this.player.maxHp);
        this.onLog("Poison deals " + effect.power + " damage.");
      }
      effect.turns -= 1;
    }

    this.playerStatus = this.playerStatus.filter((effect) => effect.turns > 0);
  }

  decrementStatuses(target) {
    target.statusEffects = target.statusEffects
      .map((effect) => ({ ...effect, turns: effect.turns - 1 }))
      .filter((effect) => effect.turns > 0);
  }

  resolveVictory() {
    const xp = 18 + this.enemy.level * 9;
    const gold = 6 + this.enemy.level * 3;
    const loot = rollLoot(this.enemy.kind);

    this.onLog("Victory! +" + xp + " XP, +" + gold + " Gold.");
    this.onFinish({ victory: true, xpGained: xp, goldGained: gold, loot });
  }
}
