<template>
  <v-autocomplete
    :id="id"
    v-model="local"
    :items="items"
    :label="label"
    chips
    clearable
    multiple
    item-value="@id"
    item-text="text"
    @change="onChange"
  >
    <template v-slot:selection="{ attrs, select, item}">
      <v-chip
        v-bind="attrs"
        close
        @click="select"
        @click:close="onDelete(item)"
      >
        {{ item.text }}
      </v-chip>
    </template>
  </v-autocomplete>
</template>

<script>
  export default {
    "name": "multivalue-chips-selector",
    "props": {
      "id": {
        "type": String,
        "required": true,
      },
      "value": {
        "type": Array,
        "required": true,
      },
      "label": {
        "type": String,
        "required": true,
      },
      "items": {
        "type": Array,
        "required": true,
      },
    },
    "data": () => ({
      "local" : [],
    }),
    "watch": {
      "value": function(value) {
        this.local = [...value];
      },
    },
    "methods": {
      "onChange": function(value) {
        this.$emit("input", value);
      },
      "onDelete": function (item) {
        this.local.splice(this.local.indexOf(item["@id"]), 1);
        this.$emit("input", this.local);
      }
    }
  }
</script>