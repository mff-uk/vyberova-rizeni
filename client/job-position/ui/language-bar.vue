<template>
  <div>
    <v-tabs>
      <v-tab
        v-for="(language, index) in languageList"
        :key="index"
        @click="onChange(language)"
      >
        {{ language }}
        <v-btn
          v-if="index > 1 && !readOnly"
          icon
          danger
          style="margin-left: 1rem;"
          color="red"
          @click.stop="onDelete(language)"
        >
          <v-icon>
            delete
          </v-icon>
        </v-btn>
      </v-tab>
      <v-tab
        v-if="!readOnly"
        @click="showDialog = true"
      >
        <v-icon green="green darken-1">
          add
        </v-icon>
      </v-tab>
    </v-tabs>
    <add-language-dialog
      :visible="showDialog"
      @close="showDialog = false"
      @add="onAdd"
    />
  </div>
</template>

<script>
  import AddLanguageDialog from "./add-language-dialog";

  export default {
    "name": "language-bar",
    "components": {
      "add-language-dialog": AddLanguageDialog,
    },
    "data": () => ({
      "showDialog": false,
    }),
    "props": {
      "value": {
        "type": String,
        "required": true
      },
      "languages": {
        "type": Array,
        "required": true
      },
      "readOnly": {
        "type": Boolean,
        "default": false
      },
    },
    "computed": {
      "languageList": function() {
        const result = ["cs", "en"];
        [...this.languages].sort().forEach((item) => {
          if (result.indexOf(item) === -1) {
            result.push(item);
          }
        });
        return result;
      }
    },
    "methods": {
      "onChange": function (language) {
        this.$emit("input", language);
      },
      "onDelete": function (language) {
        this.$emit("delete", language);
      },
      "onAdd": function (language) {
        this.showDialog = false;
        this.$emit("add", language);
        this.$emit("add", language);
      }
    }
  }
</script>
