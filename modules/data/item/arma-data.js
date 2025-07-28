// modules/data/item/arma-data.js
export class ArmaData extends foundry.abstract.DataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      description: new fields.HTMLField({ initial: "" }),
      equipped: new fields.BooleanField({ initial: false, label: "Equipado" }),
      damage: new fields.StringField({ initial: "1d6", label: "Dano" })
    };
  }
}