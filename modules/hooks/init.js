import { InEActor } from "../documents/actor.js";
import { InEItem } from "../documents/item.js";
import { InEActorSheet } from "../sheets/actor-sheet.js";
import { InEItemSheet } from "../sheets/item-sheet.js";
import { InECharacterData } from "../data/character-data.js";
import { preloadHandlebarsTemplates } from "../utils/templates.js";
import { HabilidadeData } from "../data/item/habilidade-data.js";
import { BaseItemData } from "../data/item/base-item-data.js";
import { ArmaData } from "../data/item/arma-data.js";
import { ArmaduraData } from "../data/item/armadura-data.js";
import { ManifestacaoData } from "../data/item/manifestacao-data.js";
import { registerHooks } from "./hooks.js";

export const initializeSystem = async function() {
  console.log("Infames & Enfermos | Inicializando o sistema...");

  // --- CONFIGURAÇÃO DE DOCUMENTOS ---
  CONFIG.Actor.documentClass = InEActor;
  CONFIG.Item.documentClass = InEItem;

  // --- CONFIGURAÇÃO DE MODELOS DE DADOS ---
  CONFIG.Actor.dataModels.character = InECharacterData;
  CONFIG.Item.dataModels.habilidade = HabilidadeData;
  CONFIG.Item.dataModels.item = BaseItemData;
  CONFIG.Item.dataModels.arma = ArmaData;
  CONFIG.Item.dataModels.armadura = ArmaduraData;
  CONFIG.Item.dataModels.manifestacao = ManifestacaoData;

  CONFIG.Item.typeLabels = {
    habilidade: "Habilidade",
    item: "Item Básico",
    arma: "Arma",
    armadura: "Armadura",
    manifestacao: "Manifestação"
  };

  // --- CONFIGURAÇÃO DAS FICHAS ---
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("ine", InEActorSheet, {
    types: ["character"],
    makeDefault: true,
    label: "Ficha de Personagem InE"
  });
  
  // ESTE BLOCO É O RESPONSÁVEL PELA FICHA DE ITEM
  // Ele diz ao Foundry para usar a nossa InEItemSheet para TODOS os nossos tipos de item.
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("ine", InEItemSheet, {
    types: ["habilidade", "item", "arma", "armadura", "manifestacao"], // A 'manifestacao' TEM de estar nesta lista.
    makeDefault: true,
    label: "Ficha de Item InE"
  });
  
  // --- REGISTO DE HOOKS ---
  registerHooks();

  await preloadHandlebarsTemplates();
  console.log("Infames & Enfermos | Fim da inicialização.");
};