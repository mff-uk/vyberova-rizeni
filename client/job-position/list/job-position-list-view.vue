<template>
  <v-container fluid>
    <v-row class="wrap">
      <v-col
        md="5"
        class="box"
      >
        <job-position-list
          :job-positions="positions"
        />
      </v-col>
      <v-col
        md="7"
        class="box"
      >
        <language-bar
          v-model="language"
          :languages="languages"
          :read-only="true"
        />
        <div class="ma-1">
          <job-position-list-html
            :job-positions="positions"
            :language="language"
          />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import {mapGetters} from "vuex";
  import {
    POSITION_STORE_NAME,
    GET_ALL_JOB_POSITIONS,
    GET_ALL_LANGUAGES,
  } from "../job-position-store";
  import JobPositionList from "./list";
  import JobPositionListHtml from "./html-list";
  import LanguageBar from "../ui/language-bar";
  import {
    DEPARTMENT,
    TIME,
    ORGANIZATION_STRUCTURE,
    POZICE,
    WAGE_CLASS,
    ISVAV,
    FORD,
  } from "../codelist-names";
  import {
    LOAD_CODELIST,
  } from "../../codelist";

  // https://codepen.io/retrofuturistic/pen/tlbHE

  export default {
    "name": "job-position-list-view",
    "components": {
      [JobPositionList.name]: JobPositionList,
      [JobPositionListHtml.name]: JobPositionListHtml,
      [LanguageBar.name]: LanguageBar,
    },
    "data": () => ({
      "language": "cs",
    }),
    "computed": {
      ...mapGetters(POSITION_STORE_NAME, {
        "positions": GET_ALL_JOB_POSITIONS,
        "languages": GET_ALL_LANGUAGES,
      }),
    },
    "mounted": function () {
      this.$store.dispatch(LOAD_CODELIST, WAGE_CLASS);
      this.$store.dispatch(LOAD_CODELIST, ORGANIZATION_STRUCTURE);
      this.$store.dispatch(LOAD_CODELIST, POZICE);
      this.$store.dispatch(LOAD_CODELIST, DEPARTMENT);
      this.$store.dispatch(LOAD_CODELIST, TIME);
      this.$store.dispatch(LOAD_CODELIST, ISVAV);
      this.$store.dispatch(LOAD_CODELIST, FORD);
    }
  };

</script>

<style scoped>

  .wrap {
    display: flex;
  }

  .box {
    height: calc(100vh - 6em);
    overflow-y: scroll;
  }

</style>