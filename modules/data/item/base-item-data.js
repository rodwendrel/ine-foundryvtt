// modules/data/item/base-item-data.js

/**
 * Define o modelo de dados para um item genérico.
 * Por agora, é idêntico ao de uma habilidade.
 */
export class BaseItemData extends foundry.abstract.DataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      description: new fields.HTMLField({ initial: "" })
    };
  }
}