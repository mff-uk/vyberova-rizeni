<template>
  <v-container fluid>
    <v-row
      v-if="position"
      class="wrap"
    >
      <v-col
        md="5"
        class="box"
      >
        <language-bar
          v-model="formLanguage"
          :languages="position.languages"
          @delete="onDeleteLanguage"
          @add="onAddLanguage"
        />
        <div class="ma-1">
          <buttons
            @save="onSaveChanges"
            @discard="onDiscardChanges"
          />
          <job-form
            v-model="position"
            :language="formLanguage"
          />
          <buttons
            @save="onSaveChanges"
            @discard="onDiscardChanges"
          />
        </div>
      </v-col>
      <v-col
        md="7"
        class="box"
      >
        <language-bar
          v-model="htmlLanguage"
          :languages="position.languages"
          @delete="onDeleteLanguage"
          @add="onAddLanguage"
        />
        <div class="ma-1">
          <job-preview
            v-model="position"
            :language="htmlLanguage"
          />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import {
    POSITION_STORE_NAME,
    GET_JOB_POSITION,
    CHANGE_POSITION, SET_CHANGE_ON_EDIT,
  } from "../job-position-store";
  import JobPositionHtml from "../job-position-html";
  import JobPositionForm from "./form";
  import LanguageBar from "../ui/language-bar";
  import JobList from "../list/index";
  import {
    DEPARTMENT,
    TIME,
    ORGANIZATION_STRUCTURE,
    ROLE,
    WAGE_CLASS,
    ISVAV,
    FORD,
  } from "../codelist-names";
  import {
    LOAD_CODELIST,
  } from "../../codelist";
  import FormButtons from "./form-buttons";
  import {addLanguage, deleteLanguage} from "../job-position-api";

  export default {
    "name": "job-position-detail-view",
    "components": {
      "job-preview": JobPositionHtml,
      "job-form": JobPositionForm,
      "language-bar": LanguageBar,
      "buttons": FormButtons,
    },
    "data": () => ({
      "formLanguage": "cs",
      "htmlLanguage": "cs",
      /**
       * Reference to the original position code, as the code
       * can be changed by the user.
       */
      "refCode": undefined,
      /**
       * Copy of a position object to edit.
       */
      "position": undefined,
    }),
    "mounted": function () {
      this.$store.dispatch(LOAD_CODELIST, WAGE_CLASS);
      this.$store.dispatch(LOAD_CODELIST, ORGANIZATION_STRUCTURE);
      this.$store.dispatch(LOAD_CODELIST, ROLE);
      this.$store.dispatch(LOAD_CODELIST, DEPARTMENT);
      this.$store.dispatch(LOAD_CODELIST, TIME);
      this.$store.dispatch(LOAD_CODELIST, ISVAV);
      this.$store.dispatch(LOAD_CODELIST, FORD);
      // Get a copy of the object to edit.
      const getter = this.$store.getters[
      POSITION_STORE_NAME + "/" + GET_JOB_POSITION];
      this.refCode = this.$route.params.code;
      this.position = {...getter(this.refCode)};
      // There is no change at this point.
      this.$store.dispatch(SET_CHANGE_ON_EDIT, false);
    },
    "methods": {
      "onAddLanguage": function (language) {
        addLanguage(this.position, language);
      },
      "onDeleteLanguage": function (language) {
        deleteLanguage(this.position, language);
      },
      "onSaveChanges": function () {
        this.$store.dispatch(CHANGE_POSITION, {
          "position": this.position,
          "refCode": this.refCode,
        }).then(() => redirectToJobList(this.$router));
      },
      "onDiscardChanges": function () {
        this.$store.dispatch(SET_CHANGE_ON_EDIT, false);
        redirectToJobList(this.$router);
      }
    },
  }

  function redirectToJobList(router) {
    router.push({
      "name": JobList["route-name"]
    });
  }

</script>

<style scoped>

  .bottom-button-line {
    display: flex;
    margin: 2rem 1rem 1rem 1rem;
  }

  .wrap {
    display: flex;
  }

  .box {
    height: calc(100vh - 6em);
    overflow-y: scroll;
  }

</style>