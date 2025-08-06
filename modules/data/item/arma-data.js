export class ArmaData extends foundry.abstract.DataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      description: new fields.HTMLField({ initial: "" }),
      equipped: new fields.BooleanField({ initial: false, label: "Equipado" }),
      damage: new fields.StringField({ initial: "1d6", label: "Dano" }),
      habilidade: new fields.StringField({ initial: "Luta", label: "Habilidade" }),
      tipo: new fields.StringField({ initial: "Contundente", label: "Tipo de Dano" }),
      custo: new fields.NumberField({ initial: 10, integer: true, min: 0, label: "Custo" }),
      
      // A NOSSA GRANDE MUDANÇA:
      // Um campo para definir se a arma é corpo a corpo ou à distância.
      tipoAtaque: new fields.StringField({ initial: "melee", label: "Tipo de Ataque" })
    };
  }
}