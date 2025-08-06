export class InEItemSheet extends ItemSheet {

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["ine", "sheet", "item"],
      width: 520,
      height: 480,
      template: "systems/ine/templates/sheets/item-sheet.hbs"
    });
  }

  async getData(options) {
    const context = await super.getData(options);
    
    // Passamos uma referência direta para os dados do sistema.
    context.system = this.item.system;

    // Prepara as opções para o menu de seleção da Manifestação.
    context.rollableAttributes = {
      "per": "Personalidade",
      "int": "Inteligência",
      "sab": "Sabedoria"
    };

    // Prepara as opções para o menu de seleção da Arma.
    context.attackTypes = {
      "melee": "Corpo a Corpo",
      "ranged": "À Distância"
    };

    // A SOLUÇÃO: Prepara a descrição para o editor de texto rico.
    context.enriched = {};
    context.enriched.description = await TextEditor.enrichHTML(context.system.description, {
      async: true,
      secrets: this.item.isOwner,
      relativeTo: this.item
    });

    return context;
  }
}