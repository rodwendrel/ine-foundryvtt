// ATENÇÃO AOS CAMINHOS ATUALIZADOS
import { InEActor } from "../documents/actor.js";
import { InEItem } from "../documents/item.js"; // <-- 1. IMPORTE A NOVA CLASSE DE ITEM

import { InEActorSheet } from "../actor/actor-sheet.js";
import { InECharacterData } from "../data/character-data.js";
import { handleSintoniaUpdate, preCreateItemHook } from "../hooks/actor-hooks.js";
import { preloadHandlebarsTemplates} from "../utils/templates.js";
import { HabilidadeData } from "../data/item/habilidade-data.js";

export const initializeSystem = async function() {
  console.log("Infames & Enfermos | Inicializando o sistema...");

  // --- CONFIGURAÇÃO DE DOCUMENTOS ---
  CONFIG.Actor.documentClass = InEActor;
  CONFIG.Item.documentClass = InEItem; // <-- 2. REGISTE A NOVA CLASSE DE ITEM

  // --- CONFIGURAÇÃO DE MODELOS DE DADOS ---
  CONFIG.Actor.dataModels.character = InECharacterData;
  CONFIG.Item.dataModels.habilidade = HabilidadeData;
  CONFIG.Item.typeLabels = { habilidade: "Habilidade" };

  // --- CONFIGURAÇÃO DAS FICHAS ---
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("ine", InEActorSheet, {
    types: ["character"],
    makeDefault: true,
    label: "Ficha de Personagem InE"
  });
  
  // --- HOOKS ---
  Hooks.on("preUpdateActor", handleSintoniaUpdate);
  Hooks.on("preCreateItem", preCreateItemHook);

  await preloadHandlebarsTemplates();
  console.log("Infames & Enfermos | Templates pré-carregados.");
};