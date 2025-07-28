// modules/utils/templates.js

/**
 * Define o conjunto de templates parciais do sistema que precisam de ser pré-carregados.
 * @returns {Promise}
 */
export const preloadHandlebarsTemplates = async function() {
  const templatePaths = [
    // Adicione aqui os caminhos para todos os seus arquivos parciais
    "systems/ine/templates/partials/_actor-header.hbs",
    "systems/ine/templates/partials/_actor-main-tab.hbs",
    "systems/ine/templates/partials/_actor-description-tab.hbs"
  ];

  return loadTemplates(templatePaths);
}