export class InEActorSheet extends ActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["ine", "sheet", "actor"],
      template: "systems/ine/templates/actor-sheet.hbs",
      width: 700,
      height: 700,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "main" }]
    });
  }

  async getData(options) {
    const context = await super.getData(options);
    context.system = this.actor.system;
    context.habilidades = this.actor.items.filter(item => item.type === "habilidade");
    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);
    html.find('.item-edit').click(ev => {
      const li = ev.currentTarget.closest(".item");
      const item = this.actor.items.get(li.dataset.itemId);
      item.sheet.render(true);
    });
    html.find('.item-delete').click(ev => {
      const li = ev.currentTarget.closest(".item");
      this.actor.deleteEmbeddedDocuments("Item", [li.dataset.itemId]);
    });
    html.find('.item-create').click(this._onItemCreate.bind(this));
    html.find('.rollable').click(this._onRoll.bind(this));
  }

  /**
   * Lida com a criação de um novo item de habilidade diretamente a partir da ficha.
   */
  _onItemCreate(event) {
    event.preventDefault();
    const type = "habilidade";
    
    // A CORREÇÃO: Substituímos 'type.capitalize()' por código JavaScript padrão.
    const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
    const name = `Nova ${capitalizedType}`;

    const itemData = {
      name: name,
      type: type,
      system: {}
    };

    console.log("InE | Verificando CONFIG.Item.TYPES imediatamente antes de criar:", CONFIG.Item.TYPES);

    return this.actor.createEmbeddedDocuments("Item", [itemData]);
  }

  async _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    if (dataset.rollType === "attribute") {
      const attributeKey = dataset.rollKey;
      const attribute = this.actor.system.attributes[attributeKey];
      const roll = new Roll(`3d6 + ${attribute.mod}`);

      await roll.evaluate();

      let messageContent = `<h2>Teste de ${attribute.label}</h2>`;
      await roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: messageContent
      });
    }
  }
}