import { Player } from "./Player.js";
import { Inventory } from "./Inventory.js";
import { WorldMap } from "./Map.js";
import { UI } from "./UI.js";
import { Dialogue } from "./Dialogue.js";
import { Combat } from "./Combat.js";
import { ItemCatalog, createItem, generateShopStock } from "./Items.js";
import { createProceduralEnemy } from "./Enemy.js";
import { drawPlayer, drawEnemy, drawWorldTile, drawTree, drawRock, drawPortal } from "./Art.js";

const SAVE_KEY = "rpgStarterSaveV2";

function createQuestChain() {
  return [
    {
      id: "q-slime-meadow",
      title: "Meadow Sweep",
      objective: "Defeat slimes in Sun Meadow",
      kind: "kill",
      targetEnemy: "slime",
      targetBiome: "meadow",
      goal: 3,
      progress: 0,
      rewardXp: 35,
      rewardGold: 22,
      started: false,
      done: false
    },
    {
      id: "q-fang-marsh",
      title: "Marsh Reagents",
      objective: "Collect wolf fangs in Murk Marsh",
      kind: "loot",
      targetItem: "fang",
      targetBiome: "marsh",
      goal: 4,
      progress: 0,
      rewardXp: 50,
      rewardGold: 30,
      started: false,
      done: false
    },
    {
      id: "q-skeleton-ruins",
      title: "Ruins Purge",
      objective: "Defeat skeletons in Stone Ruins",
      kind: "kill",
      targetEnemy: "skeleton",
      targetBiome: "ruins",
      goal: 2,
      progress: 0,
      rewardXp: 70,
      rewardGold: 44,
      started: false,
      done: false
    }
  ];
}

export class Game {
  constructor(elements) {
    this.elements = elements;
    this.canvas = elements.canvas;
    this.ctx = this.canvas.getContext("2d");

    this.player = new Player();
    this.inventory = new Inventory();
    this.worldMap = new WorldMap(64, 64, 32);
    this.dialogue = new Dialogue();
    this.ui = new UI(elements, ItemCatalog);
    this.combat = new Combat(this.player, this.inventory, {
      onLog: (line) => this.ui.pushLog(line),
      onState: (state) => this.ui.renderCombat(state, this.handleCombatAction.bind(this)),
      onFinish: this.finishCombat.bind(this)
    });

    this.mode = "world";
    this.camera = { x: 0, y: 0 };
    this.keys = new Set();
    this.lastTime = 0;
    this.enemySpawnTimer = 0;
    this.shopStock = generateShopStock(this.player.level);
    this.quests = createQuestChain();
    this.activeEnemy = null;

    this.dragPayload = null;

    this.seedStarterInventory();
    this.bindEvents();
  }

  seedStarterInventory() {
    this.inventory.addItem(createItem("minor_potion", 3));
    this.inventory.addItem(createItem("mana_drop", 2));
    this.inventory.addItem(createItem("bronze_sword", 1));
    this.inventory.addItem(createItem("cloth_armor", 1));
    this.inventory.addItem(createItem("leather_boots", 1));
  }

  bindEvents() {
    window.addEventListener("keydown", (event) => {
      const key = event.key.toLowerCase();

      if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(key) || event.code === "Space") {
        event.preventDefault();
      }

      this.keys.add(key);

      if (key === "e") {
        this.tryInteract();
      }

      if (this.mode === "dialogue" && event.key === "Enter") {
        this.advanceDialogue();
      }
    });

    window.addEventListener("keyup", (event) => {
      this.keys.delete(event.key.toLowerCase());
    });

    this.elements.saveButton.addEventListener("click", () => this.saveGame());
    this.elements.loadButton.addEventListener("click", () => this.loadGame());
  }

  start() {
    this.ui.pushLog("Welcome to the RPG starter project.");
    this.ui.pushLog("Use portals to travel between zones and progress the quest chain.");
    this.updateUI();
    requestAnimationFrame(this.loop.bind(this));
  }

  loop(timestamp) {
    const dt = Math.min(0.05, (timestamp - this.lastTime) / 1000 || 0.016);
    this.lastTime = timestamp;

    this.update(dt);
    this.render();
    requestAnimationFrame(this.loop.bind(this));
  }

  update(dt) {
    if (this.mode === "world") {
      this.updateMovement(dt);
      this.updateEnemySpawns(dt);
      this.checkPortalCollision();
      this.checkEnemyCollision();
    }

    if (this.mode === "dialogue") {
      this.dialogue.update(dt);
      this.ui.renderDialogue(this.dialogue.getViewModel(), this.pickDialogueOption.bind(this));
    }

    this.updateCamera();
    this.updateUI();
  }

  updateMovement(dt) {
    const speed = 4 + this.player.getDerivedStats(this.inventory.getEquipmentBonuses()).agility * 0.05;
    let dx = 0;
    let dy = 0;

    if (this.keys.has("w") || this.keys.has("arrowup")) dy -= speed * dt;
    if (this.keys.has("s") || this.keys.has("arrowdown")) dy += speed * dt;
    if (this.keys.has("a") || this.keys.has("arrowleft")) dx -= speed * dt;
    if (this.keys.has("d") || this.keys.has("arrowright")) dx += speed * dt;

    this.player.tryMove(dx, dy, this.worldMap);
  }

  updateEnemySpawns(dt) {
    this.enemySpawnTimer += dt;
    if (this.enemySpawnTimer < 2.5) return;
    this.enemySpawnTimer = 0;

    this.worldMap.ensureEnemyPopulation(18, (biome) => {
      return createProceduralEnemy(this.player.level, biome);
    });
  }

  updateCamera() {
    const halfW = this.canvas.width / 2;
    const halfH = this.canvas.height / 2;
    this.camera.x = this.player.x - halfW;
    this.camera.y = this.player.y - halfH;
  }

  render() {
    const tileSize = this.worldMap.tileSize;
    const startX = Math.floor(this.camera.x / tileSize) - 1;
    const endX = startX + Math.ceil(this.canvas.width / tileSize) + 3;
    const startY = Math.floor(this.camera.y / tileSize) - 1;
    const endY = startY + Math.ceil(this.canvas.height / tileSize) + 3;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const biome = this.worldMap.zones[this.worldMap.currentZone].biome;

    for (let y = startY; y < endY; y += 1) {
      for (let x = startX; x < endX; x += 1) {
        const tile = this.worldMap.getTile(x, y);
        const sx = x * tileSize - this.camera.x;
        const sy = y * tileSize - this.camera.y;
        drawWorldTile(this.ctx, tile, sx, sy, tileSize, biome);
      }
    }

    for (const portal of this.worldMap.portals) {
      const sx = portal.x * tileSize - this.camera.x;
      const sy = portal.y * tileSize - this.camera.y;
      drawPortal(this.ctx, sx, sy, tileSize, portal.toZone);
    }

    for (const deco of this.worldMap.decorations) {
      const sx = deco.x * tileSize - this.camera.x;
      const sy = deco.y * tileSize - this.camera.y;
      if (deco.type === "tree") {
        drawTree(this.ctx, sx, sy, tileSize);
      } else if (deco.type === "rock") {
        drawRock(this.ctx, sx, sy, tileSize);
      }
    }

    for (const npc of this.worldMap.npcs) {
      const sx = npc.x * tileSize - this.camera.x;
      const sy = npc.y * tileSize - this.camera.y;
      drawPlayer(this.ctx, sx + 3, sy + 2, 0.8, "#b58f53");
    }

    for (const enemy of this.worldMap.enemies) {
      const sx = enemy.x * tileSize - this.camera.x;
      const sy = enemy.y * tileSize - this.camera.y;
      drawEnemy(this.ctx, enemy.kind, sx + 3, sy + 3, 0.8);
    }

    drawPlayer(this.ctx, this.player.x - this.camera.x - 12, this.player.y - this.camera.y - 12, 1, "#4e7fd4");
  }

  checkPortalCollision() {
    const tileSize = this.worldMap.tileSize;
    const px = Math.floor(this.player.x / tileSize);
    const py = Math.floor(this.player.y / tileSize);
    const portal = this.worldMap.getPortalAt(px, py);
    if (!portal) return;

    this.worldMap.loadZone(portal.toZone);
    this.player.x = portal.toX * tileSize + tileSize / 2;
    this.player.y = portal.toY * tileSize + tileSize / 2;
    this.ui.pushLog("Traveled to " + this.worldMap.zones[portal.toZone].name + ".");
  }

  checkEnemyCollision() {
    const tileSize = this.worldMap.tileSize;
    const px = Math.floor(this.player.x / tileSize);
    const py = Math.floor(this.player.y / tileSize);
    const enemy = this.worldMap.enemies.find((entry) => entry.x === px && entry.y === py);
    if (!enemy) return;

    this.activeEnemy = enemy;
    this.mode = "combat";
    this.combat.start(enemy);
  }

  tryInteract() {
    if (this.mode === "combat") return;

    const tileSize = this.worldMap.tileSize;
    const px = Math.floor(this.player.x / tileSize);
    const py = Math.floor(this.player.y / tileSize);

    const nearbyNpc = this.worldMap.npcs.find((npc) => {
      const dist = Math.abs(npc.x - px) + Math.abs(npc.y - py);
      return dist <= 1;
    });

    if (!nearbyNpc) return;

    if (nearbyNpc.kind === "shop") {
      this.openShop(nearbyNpc);
      return;
    }

    this.mode = "dialogue";
    this.dialogue.begin(nearbyNpc.dialogueTree, "start", () => {
      this.mode = "world";
      this.ui.hideDialogue();
    });
    this.ui.pushLog("Talking to " + nearbyNpc.name + ".");
  }

  advanceDialogue() {
    if (!this.dialogue.canAdvance()) return;
    this.dialogue.advance();
    this.ui.renderDialogue(this.dialogue.getViewModel(), this.pickDialogueOption.bind(this));
  }

  pickDialogueOption(index) {
    const option = this.dialogue.pickOption(index);
    if (!option) return;

    if (option.reward && option.reward.xp) {
      this.player.gainXP(option.reward.xp);
      this.ui.pushLog("Dialogue reward: " + option.reward.xp + " XP.");
    }

    if (option.questAction === "start_chain") {
      this.startQuestChain();
    }

    if (option.action === "openShop") {
      this.openShop({ name: "Merchant" });
      return;
    }

    this.ui.renderDialogue(this.dialogue.getViewModel(), this.pickDialogueOption.bind(this));
  }

  startQuestChain() {
    for (const quest of this.quests) {
      quest.started = true;
    }
    this.ui.pushLog("Quest chain started.");
  }

  openShop(npc) {
    this.mode = "shop";
    this.ui.renderShop({
      npcName: npc.name,
      stock: this.shopStock,
      onBuy: (itemId) => {
        const template = ItemCatalog[itemId];
        if (!template) return;
        if (this.player.gold < template.value) {
          this.ui.pushLog("Not enough gold.");
          return;
        }
        this.player.gold -= template.value;
        this.inventory.addItem(createItem(itemId, 1));
        this.ui.pushLog("Bought " + template.name + ".");
        this.updateUI();
      },
      onSell: (slotIndex) => {
        const slot = this.inventory.slots[slotIndex];
        if (!slot) return;
        const template = ItemCatalog[slot.id];
        this.player.gold += Math.floor((template?.value || 1) * 0.5);
        this.inventory.removeFromSlot(slotIndex, 1);
        this.ui.pushLog("Sold " + (template?.name || "item") + ".");
        this.updateUI();
      },
      onClose: () => {
        this.mode = "world";
        this.ui.hideShop();
      },
      inventory: this.inventory
    });
  }

  handleCombatAction(action, payload) {
    if (this.mode !== "combat") return;
    this.combat.playerAction(action, payload);
  }

  finishCombat(result) {
    if (!this.activeEnemy) return;

    if (result.victory) {
      const enemyKind = this.activeEnemy.kind;
      const enemyBiome = this.activeEnemy.biome || this.worldMap.currentZone;

      this.worldMap.removeEnemy(this.activeEnemy.id);
      this.player.gainXP(result.xpGained);
      this.player.gold += result.goldGained;

      for (const loot of result.loot) {
        this.inventory.addItem(createItem(loot.id, loot.count));
        this.progressLootQuest(loot.id, enemyBiome, loot.count);
      }

      this.progressKillQuest(enemyKind, enemyBiome);
      this.completeReadyQuests();
    }

    if (!result.victory) {
      this.player.hp = this.player.maxHp;
      this.player.mana = this.player.maxMana;
      this.player.x = this.worldMap.spawn.x * this.worldMap.tileSize + this.worldMap.tileSize / 2;
      this.player.y = this.worldMap.spawn.y * this.worldMap.tileSize + this.worldMap.tileSize / 2;
      this.ui.pushLog("You were defeated and returned to zone spawn.");
    }

    this.activeEnemy = null;
    this.mode = "world";
    this.ui.hideCombat();
    this.updateUI();
  }

  progressKillQuest(enemyKind, biome) {
    for (const quest of this.quests) {
      if (!quest.started || quest.done) continue;
      if (quest.kind !== "kill") continue;
      if (quest.targetEnemy !== enemyKind || quest.targetBiome !== biome) continue;
      quest.progress = Math.min(quest.goal, quest.progress + 1);
      this.ui.pushLog("Quest progress: " + quest.title + " " + quest.progress + "/" + quest.goal);
    }
  }

  progressLootQuest(itemId, biome, count) {
    for (const quest of this.quests) {
      if (!quest.started || quest.done) continue;
      if (quest.kind !== "loot") continue;
      if (quest.targetItem !== itemId || quest.targetBiome !== biome) continue;
      quest.progress = Math.min(quest.goal, quest.progress + count);
      this.ui.pushLog("Quest progress: " + quest.title + " " + quest.progress + "/" + quest.goal);
    }
  }

  completeReadyQuests() {
    for (const quest of this.quests) {
      if (!quest.started || quest.done) continue;
      if (quest.progress < quest.goal) continue;

      quest.done = true;
      this.player.gainXP(quest.rewardXp);
      this.player.gold += quest.rewardGold;
      this.ui.pushLog("Quest complete: " + quest.title + " (+" + quest.rewardXp + " XP, +" + quest.rewardGold + "g)");
    }
  }

  updateUI() {
    const derived = this.player.getDerivedStats(this.inventory.getEquipmentBonuses());
    const zoneName = this.worldMap.zones[this.worldMap.currentZone].name;

    this.ui.renderHud(this.player);
    this.ui.renderStats(this.player, derived, zoneName);
    this.ui.renderMinimap(this.worldMap, this.player);
    this.ui.renderQuestTracker(this.quests);

    this.ui.renderInventory(this.inventory, {
      onSlotClick: (slotIndex) => {
        const slot = this.inventory.slots[slotIndex];
        if (!slot) return;
        const template = ItemCatalog[slot.id];
        if (!template) return;

        if (template.type === "consumable") {
          this.consumeItem(slotIndex, template);
        } else {
          const response = this.inventory.equipFromSlot(slotIndex);
          if (response) this.ui.pushLog(response);
        }
        this.updateUI();
      },
      onDragStart: (event, payload) => this.onDragStart(event, payload),
      onDragOver: (event, element) => this.onDragOver(event, element),
      onDragLeave: (element) => this.onDragLeave(element),
      onDrop: (event, target, element) => this.onDrop(event, target, element),
      onDragEnd: (element) => this.onDragEnd(element)
    });

    this.ui.renderEquipment(this.inventory, {
      onEquipmentClick: (slotName) => {
        const response = this.inventory.unequip(slotName);
        if (response) this.ui.pushLog(response);
        this.updateUI();
      },
      onDragStart: (event, payload) => this.onDragStart(event, payload),
      onDragOver: (event, element) => this.onDragOver(event, element),
      onDragLeave: (element) => this.onDragLeave(element),
      onDrop: (event, target, element) => this.onDrop(event, target, element),
      onDragEnd: (element) => this.onDragEnd(element)
    });
  }

  onDragStart(event, payload) {
    this.dragPayload = payload;
    event.dataTransfer.effectAllowed = "move";
    event.currentTarget.classList.add("slot-dragging");
  }

  onDragOver(event, element) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    element.classList.add("slot-drop-target");
  }

  onDragLeave(element) {
    element.classList.remove("slot-drop-target");
  }

  onDragEnd(element) {
    element.classList.remove("slot-dragging");
    this.clearDropTargets();
  }

  onDrop(event, target, element) {
    event.preventDefault();
    element.classList.remove("slot-drop-target");

    if (!this.dragPayload) return;

    const from = this.dragPayload;
    const to = target;
    let response = "";

    if (from.type === "inventory" && to.type === "inventory") {
      response = this.inventory.moveSlotToSlot(from.index, to.index);
    } else if (from.type === "inventory" && to.type === "equipment") {
      response = this.inventory.moveSlotToEquipment(from.index, to.slotName);
    } else if (from.type === "equipment" && to.type === "inventory") {
      response = this.inventory.moveEquipmentToSlot(from.slotName, to.index);
    }

    if (response) this.ui.pushLog(response);
    this.dragPayload = null;
    this.clearDropTargets();
    this.updateUI();
  }

  clearDropTargets() {
    document.querySelectorAll(".slot-drop-target").forEach((el) => el.classList.remove("slot-drop-target"));
    document.querySelectorAll(".slot-dragging").forEach((el) => el.classList.remove("slot-dragging"));
  }

  consumeItem(slotIndex, template) {
    if (template.effects?.heal) {
      this.player.hp = Math.min(this.player.maxHp, this.player.hp + template.effects.heal);
      this.ui.pushLog(template.name + " restored HP.");
    }
    if (template.effects?.mana) {
      this.player.mana = Math.min(this.player.maxMana, this.player.mana + template.effects.mana);
      this.ui.pushLog(template.name + " restored Mana.");
    }
    this.inventory.removeFromSlot(slotIndex, 1);
  }

  saveGame() {
    const payload = {
      player: this.player.toJSON(),
      inventory: this.inventory.toJSON(),
      map: this.worldMap.toJSON(),
      quests: this.quests,
      shopStock: this.shopStock
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
    this.ui.pushLog("Game saved.");
  }

  loadGame() {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) {
      this.ui.pushLog("No save file found.");
      return;
    }

    try {
      const save = JSON.parse(raw);
      this.player = Player.fromJSON(save.player);
      this.inventory = Inventory.fromJSON(save.inventory);
      this.worldMap = WorldMap.fromJSON(save.map);
      this.quests = save.quests || this.quests;
      this.shopStock = save.shopStock || this.shopStock;

      this.combat = new Combat(this.player, this.inventory, {
        onLog: (line) => this.ui.pushLog(line),
        onState: (state) => this.ui.renderCombat(state, this.handleCombatAction.bind(this)),
        onFinish: this.finishCombat.bind(this)
      });

      this.ui.pushLog("Save loaded.");
      this.updateUI();
    } catch (error) {
      this.ui.pushLog("Save file is invalid.");
      console.error(error);
    }
  }
}
