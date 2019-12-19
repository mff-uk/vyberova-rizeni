<template>
  <div>
    <div>
      {{ label }}
      <v-btn
        v-if="isEmpty"
        color="success"
        class="button"
        fab
        dark
        @click="onEdit"
      >
        <v-icon class="icon">
          add
        </v-icon>
      </v-btn>
    </div>
    <v-chip
      v-if="!isEmpty"
      class="text-area"
      close
      @click:close="onClear"
      @click="onEdit"
    >
      {{ labelSelector(value) }}
      <br>
    </v-chip>
  </div>
</template>

<script>
  import {isBlank} from "../../../app-service/validators";

  export default {
    "name": "multilang-text-field",
    "props": {
      "id": {
        "required": true,
      },
      "value": {
        "required": true,
      },
      "label": {
        "required": true,
      },
      "labelSelector": {
        "type": Function,
        "required": true,
      },
    },
    "computed": {
      "isEmpty": function () {
        for (let prop in this.value) {
          if (Object.prototype.hasOwnProperty.call(this.value, prop)) {
            if (!isBlank(this.value[prop].value)) {
              return false;
            }
          }
        }
        return true;
      }
    },
    "methods": {
      "onEdit": function () {
        this.$emit("edit", this.value);
      },
      "onClear": function () {
        this.$emit("clear");
      }
    }
  }
</script>

<style scoped>
  .text-area {
    height: 100% !important;
    white-space: pre-line !important;
  }

  .button {
    height: 1.5rem !important;
    width: 1.5rem !important;
  }

  .button .icon {
    height: 100% !important;
    width: 100% !important;
    font-size: 1.2rem !important;
  }
</style>