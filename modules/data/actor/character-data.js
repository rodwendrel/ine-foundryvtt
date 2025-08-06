import { BaseActorData } from "./base-actor-data.js";

export class InECharacterData extends BaseActorData {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      attributes: new fields.SchemaField({
        for: new fields.SchemaField({ value: new fields.NumberField({ initial: 10, integer: true, min: 3, max: 18 }), label: new fields.StringField({ initial: "Força" }), mod: new fields.NumberField({ integer: true, initial: 0 }), modBonus: new fields.NumberField({ initial: 0, integer: true, label: "Bónus de Modificador" }) }),
        agi: new fields.SchemaField({ value: new fields.NumberField({ initial: 10, integer: true, min: 3, max: 18 }), label: new fields.StringField({ initial: "Agilidade" }), mod: new fields.NumberField({ integer: true, initial: 0 }), modBonus: new fields.NumberField({ initial: 0, integer: true, label: "Bónus de Modificador" }) }),
        sau: new fields.SchemaField({ value: new fields.NumberField({ initial: 10, integer: true, min: 3, max: 18 }), label: new fields.StringField({ initial: "Saúde" }), mod: new fields.NumberField({ integer: true, initial: 0 }), modBonus: new fields.NumberField({ initial: 0, integer: true, label: "Bónus de Modificador" }) }),
        int: new fields.SchemaField({ value: new fields.NumberField({ initial: 10, integer: true, min: 3, max: 18 }), label: new fields.StringField({ initial: "Inteligência" }), mod: new fields.NumberField({ integer: true, initial: 0 }), modBonus: new fields.NumberField({ initial: 0, integer: true, label: "Bónus de Modificador" }) }),
        sab: new fields.SchemaField({ value: new fields.NumberField({ initial: 10, integer: true, min: 3, max: 18 }), label: new fields.StringField({ initial: "Sabedoria" }), mod: new fields.NumberField({ integer: true, initial: 0 }), modBonus: new fields.NumberField({ initial: 0, integer: true, label: "Bónus de Modificador" }) }),
        per: new fields.SchemaField({ value: new fields.NumberField({ initial: 10, integer: true, min: 3, max: 18 }), label: new fields.StringField({ initial: "Personalidade" }), mod: new fields.NumberField({ integer: true, initial: 0 }), modBonus: new fields.NumberField({ initial: 0, integer: true, label: "Bónus de Modificador" }) })
      }),
      details: new fields.SchemaField({
        ocupacao: new fields.StringField({ initial: "", label: "Ocupação" }),
        origem: new fields.StringField({ initial: "", label: "Origem" })
      }),
      pv: new fields.SchemaField({
        value: new fields.NumberField({ initial: 10, integer: true }),
        max: new fields.NumberField({ initial: 10, integer: true })
      }),
      san: new fields.SchemaField({
        value: new fields.NumberField({ initial: 10, integer: true }),
        max: new fields.NumberField({ initial: 10, integer: true })
      }),
      defesa: new fields.SchemaField({ 
        value: new fields.NumberField({ initial: 10, integer: true }),
        total: new fields.NumberField({ initial: 10, integer: true }) 
      }),
      sintonia: new fields.SchemaField({ value: new fields.NumberField({ initial: 0, integer: true, min: 0 }) }),
      xp: new fields.SchemaField({
        value: new fields.NumberField({ integer: true, min: 0, initial: 0 }),
        spent: new fields.NumberField({ integer: true, min: 0, initial: 0 })
      })
    };
  }

  prepareBaseData() {
    // Cálculo dos modificadores
    for (const attribute of Object.values(this.attributes)) {
      const value = attribute.value;
      const bonus = attribute.modBonus || 0;
      let modCalculado = 0;
      if (value >= 16) modCalculado = 2;
      else if (value >= 13) modCalculado = 1;
      attribute.mod = modCalculado + bonus;
    }

    // A FÓRMULA CORRETA PARA SANIDADE MÁXIMA
    this.san.totalMax = this.attributes.int.value + this.attributes.sab.value + this.attributes.per.value;
    
    // Defesa base
    this.defesa.total = 10 + this.attributes.agi.mod;
  }
}