// modules/sheets/item-sheet.js

/**
 * Define a classe base para as Fichas de Item do sistema InE.
 */
export class InEItemSheet extends ItemSheet {

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["ine", "sheet", "item"],
      width: 520,
      height: 480,
      // Aponta para o nosso novo arquivo de template
      template: "systems/ine/templates/sheets/item-sheet.hbs"
    });
  }

  async getData(options) {
    const context = await super.getData(options);
    // Passa os dados do sistema para o template para um acesso mais fácil
    context.system = this.item.system;
    return context;
  }
}