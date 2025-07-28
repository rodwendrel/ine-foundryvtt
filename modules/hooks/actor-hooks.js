/**
 * Esta função será o nosso "espião" para as atualizações dos atores.
 * Ela é chamada sempre que um ator está prestes a ser atualizado.
 * @param {Actor} actor         - O ator que está a ser atualizado.
 * @param {object} changes      - O objeto com os dados que estão a mudar (ex: { "system.san.value": 20 }).
 * @param {object} options      - Opções adicionais da atualização.
 * @param {string} userId       - O ID do utilizador que iniciou a atualização.
 */
export const handleSintoniaUpdate = (actor, changes, options, userId) => {
  // Verifica se a propriedade 'system.san.value' está presente nas mudanças.
  // Usamos 'hasProperty' para aceder a propriedades aninhadas de forma segura.
  if (!foundry.utils.hasProperty(changes, "system.san.value")) {
    return; // Se a sanidade não mudou, não fazemos nada.
  }

  // Pega o valor antigo e o novo da sanidade.
  const oldSanity = actor.system.san.value;
  const newSanity = foundry.utils.getProperty(changes, "system.san.value");

  // Se o novo valor não for um número, não fazemos nada para evitar erros.
  if ( isNaN(oldSanity) || isNaN(newSanity) ) return;

  const sanChange = newSanity - oldSanity;

  // Se a sanidade diminuiu 6 ou mais pontos de uma vez.
  if (sanChange <= -6) {
    console.log(`InE | Perda de Sanidade detectada: ${sanChange}. Aumentando Sintonia.`);
    const currentSintonia = actor.system.sintonia.value;
    const newSintonia = currentSintonia + 1;
    // Adiciona a mudança de Sintonia ao nosso objeto de 'changes'.
    // Assim, a Sanidade e a Sintonia são atualizadas na mesma operação.
    changes["system.sintonia.value"] = newSintonia;
  }
  // Se a sanidade aumentou 6 ou mais pontos de uma vez.
  else if (sanChange >= 6) {
    console.log(`InE | Ganho de Sanidade detectado: ${sanChange}. Diminuindo Sintonia.`);
    const currentSintonia = actor.system.sintonia.value;
    const newSintonia = Math.max(0, currentSintonia - 1); // Garante que a Sintonia não fica negativa.
    changes["system.sintonia.value"] = newSintonia;
  }
};

/**
 * Hook que é chamado antes de um Item ser criado.
 * Usamo-lo para definir um tipo padrão se nenhum for fornecido.
 * @param {Item} document   - O documento do item prestes a ser criado.
 * @param {object} data     - Os dados de criação.
 * @param {object} options  - Opções adicionais.
 * @param {string} userId   - O ID do utilizador.
 */
export const preCreateItemHook = (document, data, options, userId) => {
  // Se um tipo já foi especificado (ex: ao arrastar um item para a ficha), não fazemos nada.
  if ( document.type ) return;

  // Se o tipo estiver em falta (ex: ao clicar em "Criar Item" na barra lateral),
  // definimos o tipo como "habilidade" por defeito.
  console.log("InE | Tipo de item em falta, a definir como 'habilidade' por defeito.");
  document.updateSource({ type: "habilidade" });
};