<template>
  <v-app-bar
    style="height: 4em"
    :color="color"
    dark
    app
  >
    <v-toolbar-title class="title">
      Výběrová řízení
    </v-toolbar-title>
    {{ hasChanged ? "Existují nestažené změny." : "" }}
    <v-btn
      v-for="item in navigation"
      :key="item['route-name']"
      :to="{'name':item['route-name']}"
      text
    >
      {{ item["nav-label"] }}
    </v-btn>
  </v-app-bar>
</template>

<script>
  import {getRegistered} from "./register";
  import {
    POSITION_STORE_NAME,
    GET_HAS_CHANGED,
  } from "../job-position/job-position-store";

  export default {
    "name": "app-header",
    "computed": {
      "hasChanged": function () {
        const name = POSITION_STORE_NAME + "/" + GET_HAS_CHANGED;
        return this.$store.getters[name];
      },
      "navigation": function () {
        return getRegistered().filter((module) => isNavModule(module));
      },
      "color": function()  {
        if (this.hasChanged) {
          return "#E67E22";
        } else {
          return "#2874A6";
        }
      }
    }
  }

  function isNavModule(module) {
    return module["nav"] && module["nav-label"]
  }

</script>

<style scoped>
  .title {
    margin-right: 1rem;
  }
</style>
