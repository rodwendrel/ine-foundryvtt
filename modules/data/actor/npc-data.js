import { BaseActorData } from "./base-actor-data.js";

export class NpcData extends BaseActorData {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      pv: new fields.SchemaField({ value: new fields.NumberField({ required: true, integer: true, initial: 10 }), max: new fields.NumberField({ required: true, integer: true, initial: 10 }) }),
      san: new fields.NumberField({ required: true, integer: true, initial: 10, label: "Sanidade" }),
      defesa: new fields.SchemaField({ value: new fields.NumberField({ required: true, integer: true, initial: 10 }), total: new fields.NumberField({ required: true, integer: true, initial: 10 }) }),
      habilidades: new fields.StringField({ required: true, initial: "Combate, Luta, Resistência." }),
      taticas: new fields.HTMLField({ required: true, initial: "O NPC age de forma tática." })
    };
  }

  prepareBaseData() {
    this.defesa.total = this.defesa.value;
  }

  /**
   * A SOLUÇÃO: Sobrescrevemos o prepareDerivedData especificamente para os NPCs.
   * Agora, ele soma o bónus de TODAS as armaduras, sem verificar se estão equipadas.
   * @param {Collection<Item>} items - Os itens que o ator possui.
   */
  prepareDerivedData(items) {
    let totalArmorBonus = 0;
    for ( let item of items ) {
      // A condição "&& (item.system.equipped)" foi removida!
      if (item.type === "armadura") {
        totalArmorBonus += item.system.armorBonus;
      }
    }
    this.defesa.total += totalArmorBonus;
  }
}