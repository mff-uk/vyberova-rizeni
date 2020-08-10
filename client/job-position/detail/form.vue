<template>
  <div>
    <form>
      <v-text-field
        id="code"
        v-model="value.code"
        label="Identifikátor"
        @input="onChange"
      />
      <v-layout
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
            @input="onChange"
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
            @input="onChange"
          />
        </v-flex>
      </v-layout>
      <date-picker
        id="startDate"
        v-model="value.applicationEnd"
        label="Datum podávání přihlášek do"
        @input="onChange"
      />
      <v-layout
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
            @input="onChange"
          />
        </v-flex>
        <v-flex
          xs12
          md6
        >
          <v-switch
            v-model="value.fluidStart"
            label="Nástup dle dohody"
            @input="onChange"
          />
        </v-flex>
      </v-layout>
      <v-autocomplete
        id="workingPlace"
        v-model="value.workingPlace"
        :items="organizationCodelist"
        label="Pracoviště"
        item-value="@id"
        item-text="text"
        @input="onChange"
      />
      <v-autocomplete
        id="role"
        v-model="value.role"
        :items="roleCodelist"
        label="Role"
        item-value="@id"
        item-text="text"
        @input="onChange"
      />
      <v-autocomplete
        id="wageClass"
        v-model="value.wageClass"
        :items="wageClassCodelist"
        label="Platová třída"
        item-value="@id"
        item-text="text"
        @input="onChange"
      />
      <v-autocomplete
        id="workingHours"
        v-model="value.workingHours"
        :items="timeCodelist"
        label="Úvazek"
        item-value="@id"
        item-text="text"
        @input="onChange"
      />
      <v-autocomplete
        id="department"
        v-model="value.department"
        :items="departmentCodelist"
        label="Sekce"
        item-value="@id"
        item-text="text"
        @input="onChange"
      />
      <multivalue-chips-selector
        id=" researchFieldIsvav"
        v-model="value.researchFieldIsvav"
        label="Obor výzkumu (ISVav)"
        :items="researchFieldIsvavCodelist"
        @input="onChange"
      />
      <multivalue-chips-selector
        id=" researchFieldFord"
        v-model="value.researchFieldFord"
        label="Obor výzkumu (Ford)"
        :items="researchFieldFordCodelist"
        @input="onChange"
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
        @input="onChange"
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
        @input="onChange"
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
        @input="onChange"
      />
      <multilang-text-field
        id="description"
        v-model="value.description"
        label="Volný text"
        :label-selector="labelSelector"
        @edit="onEditDescription"
        @clear="onClearDescription"
        @input="onChange"
      />
    </form>
    <edit-multilang-dialog
      :visible="editDialog.active"
      :value="editDialog.value"
      :multiline="editDialog.multiline"
      @close="editDialog.active = false"
      @save="onEditMultilangDialogSave"
      @input="onChange"
    />
  </div>
</template>

<script>
  import DatePicker from "./ui/date-picker";
  import MultilineChips from "./ui/multiline-chips";
  import MultilangTextField from "./ui/multilang-text-field";
  import EditDialog from "./ui/edit-multilang-dialog";
  import MultiValueSelector from "./ui/multivalue-chips-selector";
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
    POZICE,
    DEPARTMENT,
    TIME,
    ISVAV,
    FORD
  } from "../codelist-names"
  import {
    SET_CHANGE_ON_EDIT
  } from "../job-position-store";

  export default {
    "name": "job-position-form",
    "components": {
      "date-picker": DatePicker,
      "multiline-chips": MultilineChips,
      "multilang-text-field": MultilangTextField,
      "edit-multilang-dialog": EditDialog,
      "multivalue-chips-selector": MultiValueSelector,
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
    "data": () => ({
      // Initial value is replaced by the one provided by parent component.
      "changes": {},
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
        return this.prepareCodeList(WAGE_CLASS);
      },
      "organizationCodelist": function () {
        return this.prepareCodeList(ORGANIZATION_STRUCTURE);
      },
      "roleCodelist": function () {
        return this.prepareCodeList(POZICE);
      },
      "departmentCodelist": function () {
        return this.prepareCodeList(DEPARTMENT);
      },
      "timeCodelist": function () {
        return this.prepareCodeList(TIME);
      },
      "researchFieldIsvavCodelist": function () {
        return this.prepareCodeList(ISVAV);
      },
      "researchFieldFordCodelist": function () {
        return this.prepareCodeList(FORD);
      },
    },
    "methods": {
      "onChange": function () {
        if (!this.value.hasChanged) {
          this.$store.dispatch(SET_CHANGE_ON_EDIT, true);
        }
        this.value.hasChanged = true;
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
        this.value[this.editDialog.prop] =[
          ...this.value[this.editDialog.prop],
          arrayToMultiLangValue(value)
        ];
      },
      "onDeleteValue": function (event) {
        this.value[event.userValue].splice(event.index, 1);
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
        this.value[this.editDialog.prop]
          .splice(this.editDialog.index, 1, arrayToMultiLangValue(value));
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
        this.value.description = arrayToMultiLangValue(value);
      },
      "onClearDescription": function () {
        this.value.description = createEmptyMultilanguage(this.value.languages);
      },
      "prepareCodeList": function (name) {
        /*
        The v-autocomplete can use function parameter in text-item,
        to pick the text that is visible and used for search.
        However, the component fail to react on language change,
        if the :text-item="selectLabel".
        This can not be fixed by using custom template as then
        the search does not work. As a workaround
        we construct a new values list as a language is changed.
        As the codelists are small this should not have a big performance
        impact.
         */
        const store = CODELIST_STORE_NAME + "/" + GET_CODELIST;
        const codelist = this.$store.getters[store](name);
        return codelist.map((item) => ({
          "@id": item["@id"],
          "text": this.selectLabel(item)
        }));
      },
      "labelSelector": function (item) {
        return item[this.language]["value"];
      },
      "selectLabel": function (value) {
        const currentValue = value[this.language];
        if (currentValue) {
          return currentValue;
        } else if (value["cs"]) {
          return value["cs"];
        } else {
          return value["en"];
        }
      },
    }
  }

</script>

<style scoped>
  .trailing-space {
    padding-right: 1rem;
  }
</style>