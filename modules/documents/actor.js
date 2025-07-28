/**
 * Define a classe base para os Atores do sistema InE.
 */
export class InEActor extends Actor {

  /**
   * Substituímos o método prepareBaseData do Ator.
   * @override
   */
  prepareBaseData() {
    // Primeiro, executamos a preparação de dados original do Foundry, por segurança.
    super.prepareBaseData();

    // A LIGAÇÃO MANUAL E DEFINITIVA:
    // Como a chamada 'super' não está a acionar a preparação de dados
    // do nosso sistema, nós chamamo-la aqui explicitamente.
    // 'this.system' é a instância do nosso InECharacterData, que contém o método
    // que queremos executar.
    this.system.prepareBaseData(); 
  }

}