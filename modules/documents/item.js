// modules/documents/item.js

/**
 * Define a classe base para os Itens do sistema InE.
 */
export class InEItem extends Item {
  /**
   * A SOLUÇÃO DEFINITIVA:
   * Substituímos o getter `validTypes` da classe Item.
   * Isto diz ao Foundry que qualquer item da classe InEItem SÓ pode ser
   * de um dos tipos listados neste array.
   * Isto resolve o problema de validação de forma direta e robusta.
   * @override
   */
  static get validTypes() {
    // No futuro, quando tiver armas, armaduras, etc., adicione-os a esta lista.
    // Ex: return ["habilidade", "arma", "armadura"];
    return ["habilidade"];
  }
}