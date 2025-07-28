// modules/data/character-data.js
export class InECharacterData extends foundry.abstract.DataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      attributes: new fields.SchemaField({
        for: new fields.SchemaField({ value: new fields.NumberField({ initial: 10, integer: true, min: 3, max: 18 }), label: new fields.StringField({ initial: "Força" }), mod: new fields.NumberField({ integer: true, initial: 0 }) }),
        agi: new fields.SchemaField({ value: new fields.NumberField({ initial: 10, integer: true, min: 3, max: 18 }), label: new fields.StringField({ initial: "Agilidade" }), mod: new fields.NumberField({ integer: true, initial: 0 }) }),
        sau: new fields.SchemaField({ value: new fields.NumberField({ initial: 10, integer: true, min: 3, max: 18 }), label: new fields.StringField({ initial: "Saúde" }), mod: new fields.NumberField({ integer: true, initial: 0 }) }),
        int: new fields.SchemaField({ value: new fields.NumberField({ initial: 10, integer: true, min: 3, max: 18 }), label: new fields.StringField({ initial: "Inteligência" }), mod: new fields.NumberField({ integer: true, initial: 0 }) }),
        sab: new fields.SchemaField({ value: new fields.NumberField({ initial: 10, integer: true, min: 3, max: 18 }), label: new fields.StringField({ initial: "Sabedoria" }), mod: new fields.NumberField({ integer: true, initial: 0 }) }),
        per: new fields.SchemaField({ value: new fields.NumberField({ initial: 10, integer: true, min: 3, max: 18 }), label: new fields.StringField({ initial: "Personalidade" }), mod: new fields.NumberField({ integer: true, initial: 0 }) })
      }),
      details: new fields.SchemaField({
        ocupacao: new fields.StringField({ initial: "", label: "Ocupação" }),
        origem: new fields.StringField({ initial: "", label: "Origem" })
      }),
      pv: new fields.SchemaField({ value: new fields.NumberField({ initial: 10, integer: true }), max: new fields.NumberField({ initial: 10, integer: true }) }),
      san: new fields.SchemaField({ value: new fields.NumberField({ initial: 30, integer: true }), max: new fields.NumberField({ initial: 30, integer: true }) }),
      defesa: new fields.SchemaField({ value: new fields.NumberField({ initial: 10, integer: true }), total: new fields.NumberField({ integer: true, initial: 10 }) }),
      sintonia: new fields.SchemaField({ value: new fields.NumberField({ initial: 0, integer: true, min: 0 }) }),
      habilidades: new fields.HTMLField(),
      notes: new fields.HTMLField()
    };
  } // <-- Fim do defineSchema()

  prepareBaseData() {
    for (const attribute of Object.values(this.attributes)) {
      const value = attribute.value;
      if (value >= 16) attribute.mod = 2;
      else if (value >= 13) attribute.mod = 1;
      else attribute.mod = 0;
    }
    this.defesa.total = 10 + (this.attributes.agi.mod ?? 0);
    this.san.totalMax = this.attributes.int.value + this.attributes.sab.value + this.attributes.per.value;
  }

  /**
   * Calcula os valores que dependem de itens.
   * @param {Collection<Item>} items - Os itens que o ator possui.
   */
  prepareDerivedData(items) {
    let totalArmorBonus = 0;
    for (let item of items) {
      if ((item.type === "armadura") && (item.system.equipped)) {
        totalArmorBonus += item.system.armorBonus;
      }
    }
    this.defesa.total += totalArmorBonus;
  }
}