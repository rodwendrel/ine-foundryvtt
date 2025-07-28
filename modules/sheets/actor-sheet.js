export class InEActorSheet extends ActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["ine", "sheet", "actor"],
      template: "systems/ine/templates/sheets/actor-sheet.hbs",
      width: 700,
      height: 700,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "main" }]
    });
  }

  async getData(options) {
    const context = await super.getData(options);
    context.system = this.actor.system;

    // Seus filtros existentes
    context.habilidades = this.actor.items.filter(item => item.type === "habilidade");
    context.equipment = this.actor.items.filter(item => item.type === 'arma' || item.type === 'armadura');
    context.inventory = this.actor.items.filter(item => item.type === 'item');
    
    // ADICIONE ESTA LINHA:
    // Cria uma nova lista apenas com itens do tipo 'arma' E que estejam 'equipped'.
    context.equippedWeapons = this.actor.items.filter(i => i.type === 'arma' && i.system.equipped);

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
    html.find('.item-toggle-equipped').click(ev => {
      const li = ev.currentTarget.closest(".item");
      const item = this.actor.items.get(li.dataset.itemId);
      item.update({ "system.equipped": !item.system.equipped });
    });
    html.find('.item-roll-attack').click(ev => {
      const li = ev.currentTarget.closest(".item");
      const item = this.actor.items.get(li.dataset.itemId);
      this._onItemRoll(item);
    });
  }

  _onItemCreate(event) {
    event.preventDefault();
    const itemData = {
      name: "Novo Item",
      type: event.currentTarget.dataset.type ?? "item",
      system: {}
    };
    return this.actor.createEmbeddedDocuments("Item", [itemData]);
  }

  async _onRoll(event) {
    // ... (código existente para preparar a rolagem)
    const roll = new Roll(`3d6 + ${attribute.mod}`);
    await roll.evaluate();
    const templateData = {
      flavor: `Teste de ${attribute.label}`,
      rolls: [roll]
    };
    // CORRIGIDO: Usando o caminho completo para renderTemplate
    const content = await foundry.applications.handlebars.renderTemplate("systems/ine/templates/chat/attribute-roll.hbs", templateData);
    ChatMessage.create({ /* ... */ });
  }

  async _onItemRoll(item) {
    if (item.type !== "arma") return;
    const attackRoll = new Roll(`3d6 + @attributes.for.mod`, this.actor.getRollData(), { label: "Ataque" });
    const damageRoll = new Roll(item.system.damage, this.actor.getRollData(), { label: "Dano" });
    await attackRoll.evaluate();
    await damageRoll.evaluate();
    const templateData = {
      flavor: `Ataque com ${item.name}`,
      rolls: [attackRoll, damageRoll]
    };
    // CORRIGIDO: Usando o caminho completo para renderTemplate
    const content = await foundry.applications.handlebars.renderTemplate("systems/ine/templates/chat/attack-roll.hbs", templateData);
    ChatMessage.create({
      user: game.user._id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: content,
      rolls: [attackRoll, damageRoll]
    });
  }

  /**
   * Lida com a rolagem de um item (ex: ataque de uma arma).
   * VERSÃO FINAL que usa o template customizado E a chamada correta ao evaluate().
   * @param {Item} item O item a ser rolado.
   */
  async _onItemRoll(item) {
    if (item.type !== "arma") return;

    // 1. Cria as rolagens individuais com os seus rótulos
    const attackRoll = new Roll(`3d6 + @attributes.for.mod`, this.actor.getRollData(), { label: "Ataque" });
    const damageRoll = new Roll(item.system.damage, this.actor.getRollData(), { label: "Dano" });

    // 2. Avalia ambas as rolagens (da forma correta, sem {async: true})
    await attackRoll.evaluate();
    await damageRoll.evaluate();

    // 3. Prepara os dados para o nosso template customizado
    const templateData = {
      flavor: `Ataque com ${item.name}`,
      rolls: [attackRoll, damageRoll]
    };

    // 4. Renderiza o nosso template para uma string de HTML
    const content = await renderTemplate("systems/ine/templates/chat/attack-roll.hbs", templateData);

    // 5. Cria a mensagem, passando o nosso HTML customizado E o array de rolagens (para o som)
    ChatMessage.create({
      user: game.user._id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: content,
      rolls: [attackRoll, damageRoll]
    });
  }
}