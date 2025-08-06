export class ArmaduraData extends foundry.abstract.DataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      description: new fields.HTMLField({ initial: "" }),
      equipped: new fields.BooleanField({ initial: false, label: "Equipado" }),
      armorBonus: new fields.NumberField({ initial: 1, integer: true, min: 0, label: "Bónus de Defesa" }),
      // --- NOVOS CAMPOS ---
      protecao: new fields.StringField({ initial: "Reduz Dano...", label: "Proteção" }),
      custo: new fields.NumberField({ initial: 50, integer: true, min: 0, label: "Custo" })
    };
  }
}