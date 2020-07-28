<template>
  <div>
    <div>
      <span>
        {{ label }}
      </span>
      <v-btn
        color="success"
        class="add-button"
        fab
        dark
        @click="onCreate"
      >
        <v-icon class="icon">
          add
        </v-icon>
      </v-btn>
    </div>
    <div
      v-for="(item, index) in value"
      :key="index"
    >
      <v-chip
        class="spacing"
        close
        @click:close="onDelete(item, index)"
        @click="onEdit(item, index)"
      >
        {{ labelSelector(item) }}
      </v-chip>
    </div>
    <br>
  </div>
</template>

<script>
  export default {
    "name": "multiline-chip",
    "props": {
      "id": {
        "type": String,
        "required": true,
      },
      "value": {
        "required": true,
      },
      "label": {
        "type": String,
        "required": true,
      },
      "labelSelector": {
        "type": Function,
        "required": true,
      },
      "userValue": {
        "type": String,
        "required": false,
      }
    },
    "methods": {
      "onCreate": function () {
        this.$emit("create", {
          "userValue": this.userValue,
        });
      },
      "onEdit": function (item, index) {
        this.$emit("edit", {
          "value": item,
          "index": index,
          "userValue": this.userValue,
        });
      },
      "onDelete": function (item, index) {
        this.$emit("delete", {
          "index": index,
          "userValue": this.userValue,
        });
      }
    }
  }
</script>

<style scoped>
  .add-button {
    height: 1.5rem !important;
    width: 1.5rem !important;
  }

  .add-button .icon {
    height: 100% !important;
    width: 100% !important;
    font-size: 1.2rem !important;
  }

  .spacing {
    margin-top: 0.25rem;
  }
</style>
