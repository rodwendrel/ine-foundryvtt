// modules/sheets/item-sheet.js (Com Depuração)

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
    context.system = foundry.utils.deepClone(this.item.system);

    // Prepara as opções para o nosso menu de seleção
    if (this.item.type === "manifestacao") {
      context.rollableAttributes = {
        "per": "Personalidade",
        "int": "Inteligência",
        "sab": "Sabedoria"
      };
    }

    context.enrichedDescription = await TextEditor.enrichHTML(context.system.description, {
      async: true, secrets: this.item.isOwner, relativeTo: this.item
    });

    return context;
  }
}