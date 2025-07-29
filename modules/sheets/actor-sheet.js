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
    context.habilidades = this.actor.items.filter(item => item.type === "habilidade");
    context.equipment = this.actor.items.filter(item => item.type === 'arma' || item.type === 'armadura');
    context.manifestations = this.actor.items.filter(item => item.type === 'manifestacao');
    context.inventory = this.actor.items.filter(item => item.type === 'item');
    context.equippedWeapons = this.actor.items.filter(i => i.type === 'arma' && i.system.equipped);
    context.equippedManifestations = this.actor.items.filter(i => i.type === 'manifestacao' && i.system.equipped);
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

  /**
   * Lida com a rolagem de um atributo.
   * VERSÃO COMPLETA E CORRIGIDA
   */
  async _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    if (dataset.rollType === "attribute") {
      const attributeKey = dataset.rollKey;
      // A linha que faltava está aqui:
      const attribute = this.actor.system.attributes[attributeKey];

      const roll = new Roll(`3d6 + ${attribute.mod}`);
      await roll.evaluate();

      const templateData = {
        flavor: `Teste de ${attribute.label}`,
        rolls: [roll]
      };

      // A correção do renderTemplate está aqui:
      const content = await foundry.applications.handlebars.renderTemplate("systems/ine/templates/chat/attribute-roll.hbs", templateData);

      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        content: content,
        rolls: [roll]
      });
    }
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
    const content = await foundry.applications.handlebars.renderTemplate("systems/ine/templates/chat/attack-roll.hbs", templateData);
    ChatMessage.create({
      user: game.user._id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: content,
      rolls: [attackRoll, damageRoll]
    });
  }

  async _onItemManifest(item) {
    // 1. Verifica se o personagem tem a habilidade "Ressonância"
    const hasRessonancia = this.actor.items.some(i => i.type === "habilidade" && i.name.toLowerCase() === "ressonância");
    if (!hasRessonancia) {
      ui.notifications.warn("Você não possui a habilidade 'Ressonância' para usar esta manifestação.");
      return;
    }

    // 2. Paga o custo em Sanidade
    const custo = item.system.custo;
    const sanidadeAtual = this.actor.system.san.value;
    if (sanidadeAtual < custo) {
      ui.notifications.warn("Sanidade insuficiente para usar esta manifestação.");
      return;
    }
    await this.actor.update({ "system.san.value": sanidadeAtual - custo });

    // 3. Prepara e executa a rolagem
    const atributo = item.system.atributo; // 'per', 'int', ou 'sab'
    const roll = new Roll(`3d6 + @attributes.${atributo}.mod`, this.actor.getRollData());
    await roll.evaluate();

    // 4. Compara com a dificuldade e prepara a mensagem
    const dificuldade = item.system.dificuldade;
    const sucesso = roll.total >= dificuldade;
    const resultadoTexto = sucesso ? `<span style="color: green;">SUCESSO</span>` : `<span style="color: red;">FALHA</span>`;

    const content = `
      <h2>${item.name}</h2>
      <p><b>Rolagem de Ressonância:</b> ${roll.total} (Dificuldade: ${dificuldade})</p>
      <h3>Resultado: ${resultadoTexto}</h3>
    `;

    // 5. Envia para o chat
    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: content,
      rolls: [roll]
    });
  }
}