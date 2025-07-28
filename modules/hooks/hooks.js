/**
 * Hook que é chamado antes de um Item ser criado.
 */
const preCreateItemHook = (document, data, options, userId) => {
  // Se o tipo estiver em falta (ex: ao clicar em "Criar Item"), define como "habilidade".
  if ( !document.type ) {
    document.updateSource({ type: "habilidade" });
  }
};

/**
 * Hook que é chamado antes de um Ator ser atualizado para a mecânica da Sintonia.
 */
const preUpdateActorHook = (actor, changes, options, userId) => {
  if (!foundry.utils.hasProperty(changes, "system.san.value")) return;
  const oldSanity = actor.system.san.value;
  const newSanity = foundry.utils.getProperty(changes, "system.san.value");
  if ( isNaN(oldSanity) || isNaN(newSanity) ) return;
  const sanChange = newSanity - oldSanity;
  if (sanChange <= -6) {
    const currentSintonia = actor.system.sintonia.value;
    changes["system.sintonia.value"] = currentSintonia + 1;
  }
  else if (sanChange >= 6) {
    const currentSintonia = actor.system.sintonia.value;
    changes["system.sintonia.value"] = Math.max(0, currentSintonia - 1);
  }
};

// Exportamos uma única função para registar todos os nossos hooks.
export const registerHooks = () => {
  Hooks.on("preCreateItem", preCreateItemHook);
  Hooks.on("preUpdateActor", preUpdateActorHook);
  console.log("Infames & Enfermos | Hooks registados.");
}