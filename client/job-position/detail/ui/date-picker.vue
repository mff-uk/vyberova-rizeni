<template>
  <v-menu
    :id="id"
    ref="menu"
    v-model="menu"
    :return-value="value"
    :nudge-right="40"
    :close-on-content-click="false"
    :disabled="disabled"
    transition="scale-transition"
    min-width="15rem"
    lazy
    offset-y
    full-width
  >
    <template v-slot:activator="{on}">
      <v-text-field
        :value="value"
        :label="label"
        :disabled="disabled"
        prepend-icon="event"
        readonly
        clearable
        v-on="on"
        @input="onInput"
      />
    </template>
    <v-date-picker
      ref="picker"
      :locale="$vuetify.lang.current"
      :value="value"
      @change="save"
    />
  </v-menu>
</template>

<script>
  export default {
    "name": "app-date-picker",
    "props": {
      "id": {"required": true},
      "value": {"required": true},
      "label": {"type": String, "required": true},
      "disabled": {"type": Boolean, "required": false},
    },
    "data": () => ({
      "menu": false
    }),
    "methods": {
      "save": function (date) {
        this.$refs.menu.save(date);
        this.$emit("input", date);
      },
      "onInput": function (value) {
        this.$emit("input", value);
      }
    }
  };
</script>