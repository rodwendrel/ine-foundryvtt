/**
 * Define a classe base para os Itens do sistema InE.
 */
export class InEItem extends Item {
  /**
   * Diz explicitamente ao Foundry quais são os tipos de item permitidos.
   * @override
   */
  static get validTypes() {
    // Confirme que 'manifestacao' está nesta lista.
    return ["habilidade", "item", "arma", "armadura", "manifestacao"];
  }
}