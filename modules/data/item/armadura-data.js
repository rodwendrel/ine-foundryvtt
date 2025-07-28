// modules/data/item/armadura-data.js
export class ArmaduraData extends foundry.abstract.DataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      description: new fields.HTMLField({ initial: "" }),
      equipped: new fields.BooleanField({ initial: false, label: "Equipado" }),
      armorBonus: new fields.NumberField({ initial: 1, integer: true, min: 0, label: "Bónus de Armadura" })
    };
  }
}