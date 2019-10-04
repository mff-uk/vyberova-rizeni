<template>
  <v-app-bar
    style="height: 4em"
    color="blue"
    dark
    app
  >
    <v-toolbar-title class="title">
      Otevřená Data MFF
    </v-toolbar-title>
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

  export default {
    "name": "app-header",
    "data": () => ({
    }),
    "computed": {
      "navigation": function() {
        return getRegistered().filter((module) => isNavModule(module));
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
