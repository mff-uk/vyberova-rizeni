<template>
  <v-dialog
    :value="visible"
    :persistent="true"
  >
    <v-card>
      <v-card-title class="headline">
        Editace hodnoty
      </v-card-title>
      <v-card-text>
        <v-container>
          <div
            v-for="(item, index) in value"
            :key="index"
          >
            <v-text-field
              v-if="!multiline"
              v-model="item.value"
              :label="item.lang"
              :error-messages="item.errors"
              required
              @input="onChange(item)"
            />
            <v-textarea
              v-if="multiline"
              v-model="item.value"
              :label="item.lang"
              :error-messages="item.errors"
              required
              @input="onChange(item)"
            />
          </div>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <div class="flex-grow-1" />
        <v-btn
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
  import {isBlank, MISSING_VALUE} from "../../../app-service/validators";

  export default {
    "name": "edit-multilang-dialog",
    "props": {
      "visible": {
        "type": Boolean,
        "required": true,
      },
      "value": {
        "type": Array,
        "required": false,
      },
      "multiline": {
        "type": Boolean,
        "required": false,
      }
    },
    "computed": {
      "isValid": function () {
        return isDialogValid(this.value);
      }
    },
    "methods": {
      "onChange": function (item) {
        validateItem(item);
      },
      "onDiscard": function () {
        this.$emit("close");
      },
      "onSave": function () {
        if (this.isValid) {
          this.$emit("save", this.value);
        }
      },
    }
  }

  function validateItem(item) {
    if (isBlank(item.value)) {
      item.errors = [MISSING_VALUE];
    } else {
      item.errors = [];
    }
  }

  function isDialogValid(value) {
    for (let index in value) {
      if (!value.hasOwnProperty(index)) {
        continue;
      }
      let item = value[index];
      if (item.errors.length > 0) {
        return false;
      }
    }
    return true;
  }

</script>
