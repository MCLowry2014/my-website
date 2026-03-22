import { ItemCatalog } from "./Items.js";

const EQUIPMENT_SLOTS = ["weapon", "armor", "helmet", "boots", "accessory"];

export class Inventory {
  constructor(size = 24) {
    this.size = size;
    this.slots = Array.from({ length: size }, () => null);
    this.equipment = {
      weapon: null,
      armor: null,
      helmet: null,
      boots: null,
      accessory: null
    };
  }

  addItem(item) {
    const template = ItemCatalog[item.id];
    if (!template) return false;

    // Stack existing slots first for consumables/materials.
    if (template.maxStack > 1) {
      for (const slot of this.slots) {
        if (slot && slot.id === item.id && slot.count < template.maxStack) {
          const available = template.maxStack - slot.count;
          const moved = Math.min(available, item.count);
          slot.count += moved;
          item.count -= moved;
          if (item.count <= 0) return true;
        }
      }
    }

    // Then use empty slots.
    while (item.count > 0) {
      const index = this.slots.findIndex((slot) => slot === null);
      if (index === -1) return false;

      const chunk = Math.min(item.count, template.maxStack);
      this.slots[index] = { id: item.id, count: chunk };
      item.count -= chunk;
    }

    return true;
  }

  removeFromSlot(slotIndex, count = 1) {
    const slot = this.slots[slotIndex];
    if (!slot) return false;
    slot.count -= count;
    if (slot.count <= 0) this.slots[slotIndex] = null;
    return true;
  }

  moveSlotToSlot(fromIndex, toIndex) {
    if (fromIndex === toIndex) return "";
    const source = this.slots[fromIndex];
    const target = this.slots[toIndex];
    if (!source) return "No item to move.";

    const sourceTemplate = ItemCatalog[source.id];
    if (!sourceTemplate) return "Unknown item.";

    if (!target) {
      this.slots[toIndex] = { ...source };
      this.slots[fromIndex] = null;
      return "Moved item.";
    }

    if (target.id === source.id && sourceTemplate.maxStack > 1) {
      const room = sourceTemplate.maxStack - target.count;
      if (room > 0) {
        const moved = Math.min(room, source.count);
        target.count += moved;
        source.count -= moved;
        if (source.count <= 0) this.slots[fromIndex] = null;
        return "Stacked items.";
      }
    }

    this.slots[toIndex] = { ...source };
    this.slots[fromIndex] = { ...target };
    return "Swapped slots.";
  }

  moveSlotToEquipment(fromIndex, slotName) {
    const source = this.slots[fromIndex];
    if (!source) return "No item to equip.";

    const item = ItemCatalog[source.id];
    if (!item || item.type !== slotName) {
      return "Item does not fit that equipment slot.";
    }

    const previous = this.equipment[slotName];
    this.equipment[slotName] = { id: source.id, count: 1 };
    this.removeFromSlot(fromIndex, 1);

    if (previous) {
      this.addItem(previous);
    }

    return "Equipped " + item.name + ".";
  }

  moveEquipmentToSlot(slotName, toIndex) {
    const equipped = this.equipment[slotName];
    if (!equipped) return "Nothing equipped there.";
    if (this.slots[toIndex] !== null) return "Target inventory slot is occupied.";
    this.slots[toIndex] = { ...equipped };
    this.equipment[slotName] = null;
    return "Moved equipment to inventory.";
  }

  equipFromSlot(slotIndex) {
    const slot = this.slots[slotIndex];
    if (!slot) return null;

    const item = ItemCatalog[slot.id];
    if (!item || !EQUIPMENT_SLOTS.includes(item.type)) {
      return "That item cannot be equipped.";
    }

    const previous = this.equipment[item.type];
    this.equipment[item.type] = { id: slot.id, count: 1 };
    this.removeFromSlot(slotIndex, 1);

    if (previous) {
      this.addItem(previous);
    }

    return "Equipped " + item.name + ".";
  }

  unequip(slotName) {
    const equipped = this.equipment[slotName];
    if (!equipped) return null;

    const ok = this.addItem({ id: equipped.id, count: 1 });
    if (!ok) return "Inventory full. Cannot unequip.";

    this.equipment[slotName] = null;
    return "Unequipped " + ItemCatalog[equipped.id].name + ".";
  }

  getEquipmentBonuses() {
    const bonus = {
      strength: 0,
      defense: 0,
      agility: 0,
      intelligence: 0,
      maxHp: 0,
      maxMana: 0
    };

    for (const slotName of EQUIPMENT_SLOTS) {
      const equipped = this.equipment[slotName];
      if (!equipped) continue;
      const stats = ItemCatalog[equipped.id]?.statBonuses || {};
      for (const [key, value] of Object.entries(stats)) {
        bonus[key] = (bonus[key] || 0) + value;
      }
    }

    return bonus;
  }

  toJSON() {
    return {
      size: this.size,
      slots: this.slots,
      equipment: this.equipment
    };
  }

  static fromJSON(data) {
    const inv = new Inventory(data?.size || 24);
    inv.slots = Array.isArray(data?.slots) ? data.slots : inv.slots;
    inv.equipment = data?.equipment || inv.equipment;
    return inv;
  }
}
