export class InENpcSheet extends ActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["ine", "sheet", "npc"],
      template: "systems/ine/templates/sheets/npc-sheet.hbs",
      width: 580,
      height: 680,
      tabs: [{ navSelector: ".tabs", contentSelector: ".sheet-body", initial: "main" }]
    });
  }

  async getData(options) {
    const context = await super.getData(options);
    context.system = this.actor.system;

    // Prepara listas filtradas para o nosso template
    const items = this.actor.items;
    context.attacks = items.filter(i => i.type === "arma" || i.type === "manifestacao");
    context.armors = items.filter(i => i.type === "armadura");
    context.habilidades = items.filter(i => i.type === "habilidade");

    context.enrichedTaticas = await TextEditor.enrichHTML(this.actor.system.taticas, {
      async: true, secrets: this.actor.isOwner, relativeTo: this.actor
    });
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
    html.find('.item-roll').click(ev => {
      const li = ev.currentTarget.closest(".item");
      const item = this.actor.items.get(li.dataset.itemId);
      this._onItemRoll(item);
    });
  }

  _onItemCreate(event) {
    event.preventDefault();
    const itemData = {
      name: `Novo ${event.currentTarget.dataset.type.capitalize()}`,
      type: event.currentTarget.dataset.type,
      system: {}
    };
    return this.actor.createEmbeddedDocuments("Item", [itemData]);
  }

  async _onItemRoll(item) {
    if (item.type === "arma") {
      const roll = new Roll(item.system.damage);
      await roll.evaluate();
      await roll.toMessage({ speaker: ChatMessage.getSpeaker({ actor: this.actor }), flavor: `Dano com ${item.name}` });
    } else if (item.type === "manifestacao") {
      // LÓGICA SIMPLIFICADA PARA NPCS
      const roll = new Roll('3d6');
      await roll.evaluate();
      const dificuldade = item.system.dificuldade;
      const sucesso = roll.total >= dificuldade;
      const resultadoTexto = sucesso ? 'SUCESSO' : 'FALHA';
      const content = `<h2>${item.name}</h2><p><b>Rolagem:</b> ${roll.total} (Dif: ${dificuldade})</p><h3>${resultadoTexto}</h3>`;
      ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor: this.actor }), content: content, rolls: [roll] });
    }
  }
}