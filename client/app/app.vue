<template>
  <v-app>
    <app-header />
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
  import Header from "./header";
  export default {
    "name": "app",
    "components": {
      "app-header": Header
    }
  }
</script>
