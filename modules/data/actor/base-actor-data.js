// modules/data/actor/base-actor-data.js

/**
 * Modelo de dados base partilhado por todos os tipos de Atores.
 */
export class BaseActorData extends foundry.abstract.DataModel {
  /**
   * Calcula os valores que dependem de itens (ex: bónus de armadura).
   * Esta lógica é agora partilhada por todos os tipos de ator.
   * @param {Collection<Item>} items - Os itens que o ator possui.
   */
  prepareDerivedData(items) {
    let totalArmorBonus = 0;
    for ( let item of items ) {
      if ( (item.type === "armadura") && (item.system.equipped) ) {
        totalArmorBonus += item.system.armorBonus;
      }
    }
    this.defesa.total += totalArmorBonus;
  }
}