<template>
  <div>
    <form>
      <v-text-field
        id="code"
        v-model="value.code"
        label="Identifikátor"
      />
      <v-layout
        row
        wrap
      >
        <v-flex
          xs12
          md6
          class="trailing-space"
        >
          <v-text-field
            id="email"
            v-model="value.email"
            label="Email"
          />
        </v-flex>
        <v-flex
          xs12
          md6
        >
          <v-text-field
            id="emailInformal"
            v-model="value.emailInformal"
            label="Neformální email"
          />
        </v-flex>
      </v-layout>
      <v-layout
        row
        wrap
      >
        <v-flex
          xs12
          md6
          class="trailing-space"
        >
          <date-picker
            id="startDate"
            v-model="value.applicationStart"
            label="Datum podávání přihlášek do"
          />
        </v-flex>
        <v-flex
          xs12
          md6
          class="trailing-space"
        >
          <date-picker
            id="endDate"
            v-model="value.applicationEnd"
            label="do"
          />
        </v-flex>
      </v-layout>
      <v-layout
        row
        wrap
      >
        <v-flex
          xs12
          md6
          class="trailing-space"
        >
          <date-picker
            id="startDate"
            v-model="value.start"
            label="Datum nástupu"
          />
        </v-flex>
        <v-flex
          xs12
          md6
        >
          <v-switch
            v-model="value.fluidStart"
            label="Nástup dle dohody"
          />
        </v-flex>
      </v-layout>
      <v-autocomplete
        id="workingPlace"
        v-model="value.workingPlace"
        :items="organizationCodelist"
        label="Pracoviště"
        item-value="@id"
        :item-text="selectLabel"
      />
      <v-autocomplete
        id="role"
        v-model="value.role"
        :items="roleCodelist"
        label="Role"
        item-value="@id"
        :item-text="selectLabel"
      />
      <v-autocomplete
        id="wageClass"
        v-model="value.wageClass"
        :items="wageClassCodelist"
        label="Platová třída"
        item-value="@id"
        :item-text="selectLabel"
      />
      <v-autocomplete
        id="workingHours"
        v-model="value.workingHours"
        :items="timeCodelist"
        label="Úvazek"
        item-value="@id"
        :item-text="selectLabel"
      />
      <v-autocomplete
        id="department"
        v-model="value.department"
        :items="departmentCodelist"
        label="Obor"
        item-value="@id"
        :item-text="selectLabel"
      />
      <multiline-chips
        id="researchField"
        v-model="value.researchField"
        label="Obor výzkumu"
        user-value="researchField"
        :label-selector="labelSelector"
        @create="onCreateValue"
        @edit="onEditValue"
        @delete="onDeleteValue"
      />
      <multiline-chips
        id="expertise"
        v-model="value.expertise"
        label="Expertíza"
        user-value="expertise"
        :label-selector="labelSelector"
        @create="onCreateValue"
        @edit="onEditValue"
        @delete="onDeleteValue"
      />
      <multiline-chips
        id="qualification"
        v-model="value.qualification"
        label="Kvalifikace"
        user-value="qualification"
        :label-selector="labelSelector"
        @create="onCreateValue"
        @edit="onEditValue"
        @delete="onDeleteValue"
      />
      <multiline-chips
        id="documents"
        v-model="value.documents"
        label="Dokumenty"
        user-value="documents"
        :label-selector="labelSelector"
        @create="onCreateValue"
        @edit="onEditValue"
        @delete="onDeleteValue"
      />
      <multilang-text-field
        id="description"
        v-model="value.description"
        label="Volný text"
        :label-selector="labelSelector"
        @edit="onEditDescription"
        @clear="onClearDescription"
      />
    </form>
    <edit-multilang-dialog
      :visible="editDialog.active"
      :value="editDialog.value"
      :multiline="editDialog.multiline"
      @close="editDialog.active = false"
      @save="onEditMultilangDialogSave"
    />
  </div>
</template>

<script>
  import DatePicker from "./ui/date-picker";
  import MultilineChips from "./ui/multiline-chips";
  import MultilangTextField from "./ui/multilang-text-field";
  import EditDialog from "./ui/edit-multilang-dialog";
  import {
    ADD_VALUE, EDIT_VALUE, DELETE_VALUE, UPDATE_DESCRIPTION,
  } from "./../job-position-store";
  import {
    createValue,
    multiLangValueToArray,
    arrayToMultiLangValue,
    createEmptyMultilanguage,
  } from "./../job-position-api";
  import {
    GET_CODELIST,
    CODELIST_STORE_NAME,
  } from "../../codelist";
  import {
    WAGE_CLASS,
    ORGANIZATION_STRUCTURE,
    ROLE,
    DEPARTMENT,
    TIME,
  } from "../codelist-names"

  export default {
    "name": "job-position-form",
    "components": {
      "date-picker": DatePicker,
      "multiline-chips": MultilineChips,
      "multilang-text-field": MultilangTextField,
      "edit-multilang-dialog": EditDialog
    },
    "data": () => ({
      "editDialog": {
        "active": false,
        "value": [],
        "prop": null,
        "index": null,
        "multiline": false,
        "callback": null
      },
    }),
    "computed": {
      "wageClassCodelist": function () {
        const name = CODELIST_STORE_NAME + "/" + GET_CODELIST;
        return this.$store.getters[name](WAGE_CLASS);
      },
      "organizationCodelist": function () {
        const name = CODELIST_STORE_NAME + "/" + GET_CODELIST;
        return this.$store.getters[name](ORGANIZATION_STRUCTURE);
      },
      "roleCodelist": function () {
        const name = CODELIST_STORE_NAME + "/" + GET_CODELIST;
        return this.$store.getters[name](ROLE);
      },
      "departmentCodelist": function () {
        const name = CODELIST_STORE_NAME + "/" + GET_CODELIST;
        return this.$store.getters[name](DEPARTMENT);
      },
      "timeCodelist": function () {
        const name = CODELIST_STORE_NAME + "/" + GET_CODELIST;
        return this.$store.getters[name](TIME);
      }
    },
    "props": {
      "value": {
        "required": true
      },
      "language": {
        "type": String,
        "required": true
      }
    },
    "methods": {
      "labelSelector": function (item) {
        return item[this.language]["value"];
      },
      "onCreateValue": function (event) {
        const {"userValue": prop} = event;
        this.editDialog.active = true;
        this.editDialog.value =
          multiLangValueToArray(this.value, createValue(this.value));
        this.editDialog.prop = prop;
        this.editDialog.multiline = false;
        this.editDialog.callback = this.callbackCreateValue;
      },
      "callbackCreateValue": function (value) {
        this.$store.dispatch(ADD_VALUE, {
          "prop": this.editDialog.prop,
          "index": this.editDialog.index,
          "value": arrayToMultiLangValue(value)
        });
      },
      "onDeleteValue": function (event) {
        const {index, "userValue": prop} = event;
        this.$store.dispatch(DELETE_VALUE, {"prop": prop, "index": index});
      },
      "onEditValue": function (event) {
        const {value, index, "userValue": prop} = event;
        this.editDialog.active = true;
        this.editDialog.value = multiLangValueToArray(this.value, value);
        this.editDialog.prop = prop;
        this.editDialog.index = index;
        this.editDialog.multiline = false;
        this.editDialog.callback = this.callbackEditValue;
      },
      "callbackEditValue": function (value) {
        this.$store.dispatch(EDIT_VALUE, {
          "prop": this.editDialog.prop,
          "index": this.editDialog.index,
          "value": arrayToMultiLangValue(value)
        });
      },
      "onEditMultilangDialogSave": function (value) {
        this.editDialog.active = false;
        this.editDialog.callback(value);
      },
      "onEditDescription": function () {
        this.editDialog.active = true;
        this.editDialog.value =
          multiLangValueToArray(this.value, this.value.description);
        this.editDialog.multiline = true;
        this.editDialog.callback = this.callbackEditDescription;
      },
      "callbackEditDescription": function (value) {
        this.$store.dispatch(
          UPDATE_DESCRIPTION,
          arrayToMultiLangValue(value));
      },
      "onClearDescription": function () {
        this.$store.dispatch(
          UPDATE_DESCRIPTION,
          createEmptyMultilanguage(this.value.languages));
      },
      "selectLabel": function(value) {
        if (value[this.language]) {
          return value[this.language];
        } else {
          return value["cs"];
        }
      }
    }
  }

</script>

<style scoped>
  .trailing-space {
    padding-right: 1rem;
  }
</style>