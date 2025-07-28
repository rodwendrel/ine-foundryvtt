// modules/documents/actor.js
export class InEActor extends Actor {

  /**
   * Prepara os dados base que não dependem de itens.
   * @override
   */
  prepareBaseData() {
    super.prepareBaseData();
    this.system.prepareBaseData(); 
  }

  /**
   * Prepara os dados derivados, que dependem dos itens.
   * @override
   */
  prepareDerivedData() {
    super.prepareDerivedData();
    // Passa a lista de itens do ator para a função de cálculo.
    this.system.prepareDerivedData(this.items);
  }
}