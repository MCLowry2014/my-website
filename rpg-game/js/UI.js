import { ItemCatalog } from "./Items.js";

const EQUIPMENT_ORDER = ["weapon", "armor", "helmet", "boots", "accessory"];

export class UI {
  constructor(elements) {
    this.elements = elements;
    this.logLines = [];
  }

  renderHud(player) {
    const hpRatio = Math.max(0, Math.min(1, player.hp / player.maxHp));
    const mpRatio = Math.max(0, Math.min(1, player.mana / player.maxMana));
    const xpRatio = Math.max(0, Math.min(1, player.experience / player.getXpToNextLevel()));

    this.elements.hpBar.style.width = hpRatio * 100 + "%";
    this.elements.hpText.textContent = Math.floor(player.hp) + " / " + player.maxHp;

    this.elements.mpBar.style.width = mpRatio * 100 + "%";
    this.elements.mpText.textContent = Math.floor(player.mana) + " / " + player.maxMana;

    this.elements.xpBar.style.width = xpRatio * 100 + "%";
    this.elements.xpText.textContent = "Lv. " + player.level + " | XP " + player.experience + "/" + player.getXpToNextLevel() + " | Gold " + player.gold;
  }

  renderStats(player, derivedStats, zoneName) {
    const list = [
      "Zone: " + zoneName,
      "Health: " + Math.floor(player.hp) + " / " + player.maxHp,
      "Mana: " + Math.floor(player.mana) + " / " + player.maxMana,
      "Strength: " + derivedStats.strength,
      "Defense: " + derivedStats.defense,
      "Agility: " + derivedStats.agility,
      "Intelligence: " + derivedStats.intelligence,
      "Level: " + player.level,
      "XP To Next: " + (player.getXpToNextLevel() - player.experience),
      "Abilities: " + player.unlockedAbilities.join(", ")
    ];

    this.elements.statsList.innerHTML = list.map((line) => "<li>" + line + "</li>").join("");
  }

  renderMinimap(worldMap, player) {
    const canvas = this.elements.minimapCanvas;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const scaleX = width / worldMap.width;
    const scaleY = height / worldMap.height;

    ctx.clearRect(0, 0, width, height);

    for (let y = 0; y < worldMap.height; y += 1) {
      for (let x = 0; x < worldMap.width; x += 1) {
        const tile = worldMap.tiles[y][x];
        if (tile === "water") ctx.fillStyle = "#5d8fb8";
        else if (tile === "path") ctx.fillStyle = "#baa37a";
        else ctx.fillStyle = "#7cab6e";
        ctx.fillRect(x * scaleX, y * scaleY, Math.ceil(scaleX), Math.ceil(scaleY));
      }
    }

    for (const portal of worldMap.portals) {
      ctx.fillStyle = "#d2a94a";
      ctx.fillRect(portal.x * scaleX, portal.y * scaleY, Math.max(2, scaleX), Math.max(2, scaleY));
    }

    for (const npc of worldMap.npcs) {
      ctx.fillStyle = "#4b6faf";
      ctx.fillRect(npc.x * scaleX, npc.y * scaleY, Math.max(2, scaleX), Math.max(2, scaleY));
    }

    for (const enemy of worldMap.enemies) {
      ctx.fillStyle = "#c94b4b";
      ctx.fillRect(enemy.x * scaleX, enemy.y * scaleY, Math.max(2, scaleX), Math.max(2, scaleY));
    }

    const px = Math.floor(player.x / worldMap.tileSize);
    const py = Math.floor(player.y / worldMap.tileSize);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(px * scaleX, py * scaleY, Math.max(3, scaleX), Math.max(3, scaleY));

    ctx.strokeStyle = "#6f674f";
    ctx.strokeRect(0.5, 0.5, width - 1, height - 1);
  }

  renderQuestTracker(quests) {
    const html = quests
      .map((quest) => {
        const status = quest.done ? "Done" : (quest.started ? "In Progress" : "Not Started");
        const objective = quest.progress + " / " + quest.goal;
        return (
          "<div class=\"quest-entry\">" +
          "<div class=\"quest-title\">" + quest.title + "</div>" +
          "<div class=\"quest-meta\">Status: " + status + "</div>" +
          "<div class=\"quest-meta\">Objective: " + objective + "</div>" +
          "<div class=\"quest-meta\">Reward: " + quest.rewardXp + " XP, " + quest.rewardGold + "g</div>" +
          "</div>"
        );
      })
      .join("");

    this.elements.questList.innerHTML = html;
  }

  renderInventory(inventory, handlers) {
    this.elements.inventoryGrid.innerHTML = "";

    for (let i = 0; i < inventory.slots.length; i += 1) {
      const slot = inventory.slots[i];
      const button = document.createElement("button");
      button.className = "inventory-slot";
      button.type = "button";
      button.setAttribute("draggable", "true");
      button.dataset.slotType = "inventory";
      button.dataset.slotIndex = String(i);

      if (slot) {
        const item = ItemCatalog[slot.id];
        const rarity = item?.rarity ? " [" + item.rarity + "]" : "";
        button.textContent = (item?.name || slot.id) + " x" + slot.count + rarity;
      } else {
        button.textContent = "-";
      }

      button.addEventListener("click", () => handlers.onSlotClick(i));
      button.addEventListener("dragstart", (event) => handlers.onDragStart(event, { type: "inventory", index: i }));
      button.addEventListener("dragover", (event) => handlers.onDragOver(event, button));
      button.addEventListener("dragleave", () => handlers.onDragLeave(button));
      button.addEventListener("drop", (event) => handlers.onDrop(event, { type: "inventory", index: i }, button));
      button.addEventListener("dragend", () => handlers.onDragEnd(button));

      this.elements.inventoryGrid.appendChild(button);
    }
  }

  renderEquipment(inventory, handlers) {
    this.elements.equipmentGrid.innerHTML = "";

    for (const slotName of EQUIPMENT_ORDER) {
      const slot = inventory.equipment[slotName];
      const button = document.createElement("button");
      button.className = "equipment-slot";
      button.type = "button";
      button.setAttribute("draggable", "true");
      button.dataset.slotType = "equipment";
      button.dataset.slotName = slotName;

      if (slot) {
        const item = ItemCatalog[slot.id];
        button.textContent = slotName + ": " + (item?.name || slot.id);
      } else {
        button.textContent = slotName + ": empty";
      }

      button.addEventListener("click", () => handlers.onEquipmentClick(slotName));
      button.addEventListener("dragstart", (event) => handlers.onDragStart(event, { type: "equipment", slotName }));
      button.addEventListener("dragover", (event) => handlers.onDragOver(event, button));
      button.addEventListener("dragleave", () => handlers.onDragLeave(button));
      button.addEventListener("drop", (event) => handlers.onDrop(event, { type: "equipment", slotName }, button));
      button.addEventListener("dragend", () => handlers.onDragEnd(button));

      this.elements.equipmentGrid.appendChild(button);
    }
  }

  renderDialogue(dialogueState, onOptionPick) {
    if (!dialogueState) {
      this.hideDialogue();
      return;
    }

    this.elements.dialogueBox.classList.remove("hidden");
    const optionsHtml = dialogueState.options
      .map((option, index) => "<button type=\"button\" data-option=\"" + index + "\">" + option.label + "</button>")
      .join("");

    this.elements.dialogueBox.innerHTML =
      "<strong>" + dialogueState.speaker + ":</strong> " +
      "<div>" + dialogueState.visibleText + "</div>" +
      "<div class=\"dialogue-options\">" + optionsHtml + "</div>";

    this.elements.dialogueBox.querySelectorAll("button[data-option]").forEach((button) => {
      button.addEventListener("click", () => {
        const index = Number(button.getAttribute("data-option"));
        onOptionPick(index);
      });
    });
  }

  hideDialogue() {
    this.elements.dialogueBox.classList.add("hidden");
    this.elements.dialogueBox.innerHTML = "";
  }

  renderCombat(combatState, onAction) {
    this.elements.combatBox.classList.remove("hidden");

    const actionButtons = [
      "<button type=\"button\" data-action=\"attack\">Attack</button>",
      "<button type=\"button\" data-action=\"defend\">Defend</button>",
      "<button type=\"button\" data-action=\"magic\" data-spell=\"Spark\">Spark</button>"
    ];

    if (combatState.player.unlockedAbilities.includes("Fireball")) {
      actionButtons.push("<button type=\"button\" data-action=\"magic\" data-spell=\"Fireball\">Fireball</button>");
    }
    if (combatState.player.unlockedAbilities.includes("Thunder Stun")) {
      actionButtons.push("<button type=\"button\" data-action=\"magic\" data-spell=\"Thunder Stun\">Thunder Stun</button>");
    }

    actionButtons.push("<button type=\"button\" data-action=\"item\">Use First Consumable</button>");

    this.elements.combatBox.innerHTML =
      "<div><strong>Turn:</strong> " + combatState.turn + "</div>" +
      "<div><strong>Enemy:</strong> " + combatState.enemy.name + " (Lv " + combatState.enemy.level + ")</div>" +
      "<div>Enemy HP: " + combatState.enemy.hp + " / " + combatState.enemy.maxHp + "</div>" +
      "<div class=\"combat-actions\">" + actionButtons.join("") + "</div>";

    this.elements.combatBox.querySelectorAll("button[data-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.getAttribute("data-action");
        const spell = button.getAttribute("data-spell");

        if (action === "item") {
          const slotIndex = combatState.inventory.slots.findIndex((slot) => {
            if (!slot) return false;
            const item = ItemCatalog[slot.id];
            return item?.type === "consumable";
          });
          onAction("item", { slotIndex });
          return;
        }

        onAction(action, { spell });
      });
    });
  }

  hideCombat() {
    this.elements.combatBox.classList.add("hidden");
    this.elements.combatBox.innerHTML = "";
  }

  renderShop({ npcName, stock, onBuy, onSell, onClose, inventory }) {
    this.elements.shopBox.classList.remove("hidden");

    const buyHtml = stock
      .map((id, index) => {
        const item = ItemCatalog[id];
        if (!item) return "";
        return "<button type=\"button\" data-buy=\"" + index + "\">Buy " + item.name + " (" + item.value + "g)</button>";
      })
      .join("");

    const sellHtml = inventory.slots
      .map((slot, index) => {
        if (!slot) return "";
        const item = ItemCatalog[slot.id];
        const value = Math.floor((item?.value || 1) * 0.5);
        return "<button type=\"button\" data-sell=\"" + index + "\">Sell " + (item?.name || slot.id) + " (" + value + "g)</button>";
      })
      .join("");

    this.elements.shopBox.innerHTML =
      "<strong>" + npcName + "'s Shop</strong>" +
      "<div class=\"shop-actions\">" + buyHtml + "</div>" +
      "<hr />" +
      "<div class=\"shop-actions\">" + sellHtml + "</div>" +
      "<div class=\"shop-actions\"><button type=\"button\" id=\"close-shop\">Leave Shop</button></div>";

    this.elements.shopBox.querySelectorAll("button[data-buy]").forEach((button) => {
      button.addEventListener("click", () => {
        const index = Number(button.getAttribute("data-buy"));
        const id = stock[index];
        onBuy(id);
      });
    });

    this.elements.shopBox.querySelectorAll("button[data-sell]").forEach((button) => {
      button.addEventListener("click", () => {
        const index = Number(button.getAttribute("data-sell"));
        onSell(index);
      });
    });

    const close = this.elements.shopBox.querySelector("#close-shop");
    if (close) close.addEventListener("click", onClose);
  }

  hideShop() {
    this.elements.shopBox.classList.add("hidden");
    this.elements.shopBox.innerHTML = "";
  }

  pushLog(line) {
    this.logLines.unshift(line);
    this.logLines = this.logLines.slice(0, 50);
    this.elements.eventLog.innerHTML = this.logLines
      .map((entry) => "<div class=\"log-line\">" + entry + "</div>")
      .join("");
  }
}
