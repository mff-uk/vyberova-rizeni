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
    STORE_NAME,
    GET_JOB_POSITIONS,
  } from "../job-position-store";
  import JobPositionList from "./list";
  import JobPositionListHtml from "./html-list";
  import LanguageBar from "../ui/language-bar";
  import {
    DEPARTMENT,
    TIME,
    ORGANIZATION_STRUCTURE,
    ROLE,
    WAGE_CLASS
  } from "../codelist-names";
  import {
    LOAD_CODELIST
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
      "languages": ["cs", "en"]
    }),
    "computed": {
      ...mapGetters(STORE_NAME, {
        "positions": GET_JOB_POSITIONS
      }),
    },
    "mounted": function () {
      this.$store.dispatch(LOAD_CODELIST, WAGE_CLASS);
      this.$store.dispatch(LOAD_CODELIST, ORGANIZATION_STRUCTURE);
      this.$store.dispatch(LOAD_CODELIST, ROLE);
      this.$store.dispatch(LOAD_CODELIST, DEPARTMENT);
      this.$store.dispatch(LOAD_CODELIST, TIME);
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