<template>
  <div class="bottom-button-line">
    <div class="flex-grow-1" />
    <v-btn
      text
      style="margin-right: 2rem"
      @click="onDiscard"
    >
      <v-icon>close</v-icon>
    </v-btn>
    <v-btn
      color="green darken-1"
      text
      @click="onSave"
    >
      <v-icon>save</v-icon>
    </v-btn>
  </div>
</template>

<script>
  export default {
    "name": "job-position-form-buttons",
    "props": {},
    "methods": {
      "onSave": function () {
        this.$emit("save");
      },
      "onDiscard": function () {
        this.$emit("discard");
      }
    }
  };
</script>