// modules/documents/item.js
export class InEItem extends Item {
  static get validTypes() {
    // Adicionamos os nossos novos tipos à lista de permissões.
    return ["habilidade", "item", "arma", "armadura"];
  }
}