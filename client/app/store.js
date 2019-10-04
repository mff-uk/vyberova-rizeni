import Vuex from "vuex";
import {getRegistered} from "./register";

export default function createStore() {
  const modules = {};
  getRegistered()
    .filter((item) => isStoreModule(item))
    .forEach((item) => {
      modules[item["store-name"]] = item["store-factory"]();
    });
  return new Vuex.Store({
    "modules": modules
  });
}

function isStoreModule(module) {
  return module["store-name"] && module["store-factory"];
}
