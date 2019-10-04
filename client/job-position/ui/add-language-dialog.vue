<template>
  <v-dialog
    :value="visible"
    :persistent="true"
  >
    <v-card>
      <v-card-title class="headline">
        Přidej jazyk
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="language"
          label="Jazyk"
          required
        />
      </v-card-text>
      <v-card-actions>
        <div class="flex-grow-1" />
        <v-btn
          color="green darken-1"
          text
          @click="onDiscard"
        >
          Discard changes
        </v-btn>
        <v-btn
          color="green darken-1"
          text
          :disabled="!isValid"
          @click="onSave"
        >
          Save changes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import {isBlank} from "../../app-service/validators";

  export default {
    "name": "add-language-dialog",
    "props": {
      "visible": {
        "type": Boolean,
        "required": true,
      },
    },
    "data": () => ({
      "language": null,
    }),
    "computed": {
      "isValid": function () {
        return !isBlank(this.language);
      },
    },
    "methods": {
      "onDiscard": function () {
        this.$emit("close");
      },
      "onSave": function () {
        if (this.isValid) {
          this.$emit("add", this.language);
        }
      },
    }
  }
</script>