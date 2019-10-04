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
          <job-form
            v-model="position"
            :language="formLanguage"
          />
          <div class="bottom-button-line">
            <div class="flex-grow-1" />
            <v-btn
              text
              @click="onDiscardChanges"
            >
              Zahoď změny a zavři
            </v-btn>
            <v-btn
              color="green darken-1"
              text
              @click="onSaveChanges"
            >
              Ulož a zavři
            </v-btn>
          </div>
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
  import {mapGetters} from "vuex";
  import {
    STORE_NAME,
    GET_JOB_POSITION,
    SELECT_JOB_POSITIONS,
    DELETE_LANGUAGE,
    ADD_LANGUAGE,
    SAVE_SELECTED,
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
  } from "../codelist-names";
  import {
    LOAD_CODELIST,
  } from "../../codelist";

  export default {
    "name": "job-position-detail-view",
    "components": {
      "job-preview": JobPositionHtml,
      "job-form": JobPositionForm,
      "language-bar": LanguageBar
    },
    "data": () => ({
      "formLanguage": "cs",
      "htmlLanguage": "cs",
    }),
    "computed": {
      ...mapGetters(STORE_NAME, {
        "position": GET_JOB_POSITION
      }),
    },
    "mounted": function () {
      this.$store.dispatch(SELECT_JOB_POSITIONS, this.$route.params.code);
      this.$store.dispatch(LOAD_CODELIST, WAGE_CLASS);
      this.$store.dispatch(LOAD_CODELIST, ORGANIZATION_STRUCTURE);
      this.$store.dispatch(LOAD_CODELIST, ROLE);
      this.$store.dispatch(LOAD_CODELIST, DEPARTMENT);
      this.$store.dispatch(LOAD_CODELIST, TIME);
    },
    "methods": {
      "onAddLanguage": function (language) {
        this.$store.dispatch(ADD_LANGUAGE, language);
      },
      "onDeleteLanguage": function (language) {
        this.$store.dispatch(DELETE_LANGUAGE, language);
      },
      "onSaveChanges": function () {
        this.$store.dispatch(SAVE_SELECTED).then(
          () => redirectToJobList(this.$router)
        );
      },
      "onDiscardChanges": function () {
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