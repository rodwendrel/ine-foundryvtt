// modules/data/item/manifestacao-data.js
export class ManifestacaoData extends foundry.abstract.DataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      description: new fields.HTMLField({ initial: "" }),
      equipped: new fields.BooleanField({ initial: false, label: "Equipado" }),
      dificuldade: new fields.NumberField({ initial: 13, integer: true, label: "Dificuldade" }),
      custo: new fields.NumberField({ initial: 1, integer: true, min: 0, label: "Custo de Sanidade" }),
      // Campo para guardar qual atributo será usado na rolagem
      atributo: new fields.StringField({ initial: "per", label: "Atributo de Rolagem" })
    };
  }
}