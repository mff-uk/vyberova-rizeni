import VueRouter from "vue-router";
import {getRegistered} from "./register";

export default function createRouter() {

  const routes = getRegistered()
    .filter((module) => isRouterModule(module))
    .map((module) => ({
      "path": module["route"],
      "name": module["route-name"],
      "component": module["component"]
    }));

  return  new VueRouter({
    "routes": [
      ...routes
    ]
  });

}

function isRouterModule(module) {
  return module["route"] && module["component"] && module["route-name"];
}
