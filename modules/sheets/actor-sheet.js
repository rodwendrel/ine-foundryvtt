export class InEActorSheet extends ActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["ine", "sheet", "actor"],
      template: "systems/ine/templates/sheets/actor-sheet.hbs",
      width: 720, // Aumentei um pouco para acomodar o layout
      height: 700,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "main" }]
    });
  }

  async getData(options) {
    const context = await super.getData(options);
    context.system = this.actor.system;
    
    // Filtros para as listas de itens
    const items = this.actor.items;
    context.habilidades = items.filter(item => item.type === "habilidade");
    context.equipment = items.filter(item => item.type === 'arma' || item.type === 'armadura');
    context.inventory = items.filter(item => item.type === 'item');
    context.equippedWeapons = items.filter(i => i.type === 'arma' && i.system.equipped);
    context.equippedManifestations = items.filter(i => i.type === 'manifestacao' && i.system.equipped);
    
    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);
    // Listeners para os itens
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
    html.find('.item-toggle-equipped').click(ev => {
        const li = ev.currentTarget.closest(".item");
        const item = this.actor.items.get(li.dataset.itemId);
        this._onToggleEquipped(item);
    });
    
    // Listeners para as rolagens
    html.find('.rollable').click(this._onRoll.bind(this));
    html.find('.item-roll-attack').click(ev => {
      const li = ev.currentTarget.closest(".item");
      const item = this.actor.items.get(li.dataset.itemId);
      this._onItemRoll(item);
    });
    html.find('.item-roll-manifestation').click(ev => {
        const li = ev.currentTarget.closest(".item");
        const item = this.actor.items.get(li.dataset.itemId);
        this._onItemManifest(item);
    });

    // Listener para a Progressão de Personagem
    html.find('.progression-button').click(this._onProgression.bind(this));
  }
  
  _onItemCreate(event) {
    event.preventDefault();
    const itemData = {
      name: `Novo ${event.currentTarget.dataset.type.capitalize()}`,
      type: event.currentTarget.dataset.type ?? "item",
      system: {}
    };
    return this.actor.createEmbeddedDocuments("Item", [itemData]);
  }

  async _onToggleEquipped(item) {
    const isEquipped = item.system.equipped;
    if ( !isEquipped ) {
      if ( item.type === "armadura" ) {
        const outraArmadura = this.actor.items.find(i => i.type === "armadura" && i.system.equipped);
        if ( outraArmadura ) {
          return ui.notifications.warn("Você só pode equipar uma armadura de cada vez.");
        }
      }
    }
    return item.update({ "system.equipped": !isEquipped });
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
      const templateData = {
        flavor: `Teste de ${attribute.label}`,
        rolls: [roll]
      };
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
    const system = item.system;
    const actorData = this.actor.getRollData();
    let attackMod, damageFormula, attackAttrLabel;
    if (system.tipoAtaque === 'ranged') {
      attackMod = actorData.attributes.agi.mod;
      attackAttrLabel = "Agilidade";
      damageFormula = system.damage;
    } else {
      attackMod = actorData.attributes.for.mod;
      attackAttrLabel = "Força";
      damageFormula = `${system.damage} + ${attackMod}`;
    }
    const attackRoll = new Roll(`3d6 + ${attackMod}`, actorData, {label: `Ataque (${attackAttrLabel})`});
    const damageRoll = new Roll(damageFormula, actorData, {label: "Dano"});
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
    const hasRessonancia = this.actor.items.some(i => i.type === "habilidade" && i.name.toLowerCase() === "ressonância");
    if (!hasRessonancia) {
      return ui.notifications.warn("Você não possui a habilidade 'Ressonância' para usar esta manifestação.");
    }
    const custo = item.system.custo;
    const sanidadeAtual = this.actor.system.san.value;
    if (sanidadeAtual < custo) {
      return ui.notifications.warn("Sanidade insuficiente para usar esta manifestação.");
    }
    await this.actor.update({"system.san.value": sanidadeAtual - custo});
    const atributo = item.system.atributo;
    const roll = new Roll(`3d6 + @attributes.${atributo}.mod`, this.actor.getRollData());
    await roll.evaluate();
    const dificuldade = item.system.dificuldade;
    const sucesso = roll.total >= dificuldade;
    const templateData = {
      item: item, roll: roll, dificuldade: dificuldade, sucesso: sucesso
    };
    const content = await foundry.applications.handlebars.renderTemplate("systems/ine/templates/chat/manifestation-roll.hbs", templateData);
    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: content,
      rolls: [roll]
    });
  }

  async _onProgression(event) {
    event.preventDefault();
    const content = `
      <p>Você tem <strong>${this.actor.system.xp.value} XP</strong> para gastar.</p>
      <div class="xp-options dialog">
        <button type="button" class="xp-spend" data-cost="1" data-action="hp">+1 Ponto de Vida Máximo <span class="cost">(1 XP)</span></button>
        <button type="button" class="xp-spend" data-cost="2" data-action="habilidade">+1 Habilidade <span class="cost">(2 XP)</span></button>
        <button type="button" class="xp-spend" data-cost="3" data-action="defesa">+1 em Defesa <span class="cost">(3 XP)</span></button>
        <button type="button" class="xp-spend" data-cost="4" data-action="atributo">+1 em Atributo <span class="cost">(4 XP)</span></button>
        <button type="button" class="xp-spend" data-cost="5" data-action="modificador">+1 em Modificador <span class="cost">(5 XP)</span></button>
      </div>
    `;
    const dialog = new Dialog({
      title: "Progressão de Personagem",
      content: content,
      buttons: { close: { icon: '<i class="fas fa-times"></i>', label: "Fechar" } },
      render: (html) => {
        html.find('.xp-spend').click(this._onSpendXp.bind(this));
      }
    });
    dialog.render(true);
  }

  async _onSpendXp(event) {
    event.preventDefault();
    const button = event.currentTarget;
    const cost = parseInt(button.dataset.cost);
    const action = button.dataset.action;
    const actorData = this.actor.system;

    if (actorData.xp.value < cost) {
      return ui.notifications.warn("Pontos de Experiência insuficientes!");
    }

    $(button).closest(".dialog").find(".dialog-button.close").trigger("click");

    const newXp = actorData.xp.value - cost;
    await this.actor.update({ "system.xp.value": newXp });

    switch (action) {
      case "hp":
        const newHp = actorData.pv.max + 1;
        await this.actor.update({ "system.pv.max": newHp });
        ui.notifications.info("O seu Ponto de Vida Máximo aumentou!");
        break;
      case "habilidade":
        await this.actor.createEmbeddedDocuments("Item", [{ name: "Nova Habilidade (XP)", type: "habilidade" }]);
        ui.notifications.info("Uma nova Habilidade foi adicionada.");
        break;
      case "defesa":
        const newDefesa = actorData.defesa.value + 1;
        await this.actor.update({ "system.defesa.value": newDefesa });
        ui.notifications.info("A sua Defesa base aumentou!");
        break;
      case "atributo":
        this._chooseAttributeToImprove("value");
        break;
      case "modificador":
        this._chooseAttributeToImprove("modBonus");
        break;
    }
  }

  async _chooseAttributeToImprove(field) {
    const attributes = this.actor.system.attributes;
    const options = Object.entries(attributes).map(([key, attr]) => {
      return `<option value="${key}">${attr.label}</option>`;
    }).join("");
    const template = `
      <p>Escolha o Atributo que deseja aumentar em +1:</p>
      <select id="attribute-choice">${options}</select>
    `;
    new Dialog({
      title: "Melhorar Atributo",
      content: template,
      buttons: {
        confirm: {
          icon: '<i class="fas fa-check"></i>',
          label: "Confirmar",
          callback: async (html) => {
            const choice = html.find('#attribute-choice').val();
            const currentVal = attributes[choice][field] || 0;
            await this.actor.update({ [`system.attributes.${choice}.${field}`]: currentVal + 1 });
            ui.notifications.info(`${attributes[choice].label} foi aumentado!`);
          }
        }
      },
      default: "confirm"
    }).render(true);
  }
}