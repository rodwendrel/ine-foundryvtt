// modules/ine.js
import { initializeSystem } from "./hooks/init.js";

// A única responsabilidade deste arquivo é chamar a nossa função de inicialização.
Hooks.once("init", initializeSystem);