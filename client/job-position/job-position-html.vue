<template>
  <div>
    <b>code:</b> {{ value.code }} <br>
    <b>email:</b> {{ value.email }} <br>
    <b>hiring:</b> {{ value.startDate }} - {{ value.endDate }} <br>
    <b>working place:</b> {{ workingPlaceLabel }} <br>
    <b>role:</b> {{ roleLabel }} <br>
    <b>wage class:</b> {{ wageClassLabel }} <br>
    <b>working hours:</b> {{ workingHoursLabel }} <br>
    <b>department:</b> {{ departmentLabel }} <br>
    <b>research field:</b>
    <ul>
      <li
        v-for="(item, index) in value.researchField"
        :key="index"
      >
        {{ labelSelector(item) }}
      </li>
    </ul>
    <b>expertise:</b>
    <ul>
      <li
        v-for="(item, index) in value.expertise"
        :key="index"
      >
        {{ labelSelector(item) }}
      </li>
    </ul>
    <b>qualification:</b>
    <ul>
      <li
        v-for="(item, index) in value.qualification"
        :key="index"
      >
        {{ labelSelector(item) }}
      </li>
    </ul>
    <b>informal email:</b> {{ value.emailInformal }} <br>
    <b>document:</b>
    <ul>
      <li
        v-for="(item, index) in value.documents"
        :key="index"
      >
        {{ labelSelector(item) }}
      </li>
    </ul>
    <b>description:</b> {{ labelSelector(value.description) }} <br>
  </div>
</template>

<script>
  import {
    GET_CODELIST,
    CODELIST_STORE_NAME,
  } from "../codelist";
  import {
    WAGE_CLASS,
    ORGANIZATION_STRUCTURE,
    ROLE,
    DEPARTMENT,
    TIME
  } from "./codelist-names"

  import {selectLabel} from "./job-position-api";

  export default {
    "name": "job-position-html",
    "props": {
      "value": {"required": true},
      "language": {"required": true}
    },
    "computed": {
      "wageClassLabel": function () {
        const name = CODELIST_STORE_NAME + "/" + GET_CODELIST;
        const codelist = this.$store.getters[name](WAGE_CLASS);
        return selectFromCodeList(
          codelist, this.language, this.value.wageClass);
      },
      "workingPlaceLabel": function () {
        const name = CODELIST_STORE_NAME + "/" + GET_CODELIST;
        const codelist = this.$store.getters[name](ORGANIZATION_STRUCTURE);
        return selectFromCodeList(
          codelist, this.language, this.value.workingPlace);
      },
      "roleLabel": function () {
        const name = CODELIST_STORE_NAME + "/" + GET_CODELIST;
        const codelist = this.$store.getters[name](ROLE);
        return selectFromCodeList(
          codelist, this.language, this.value.role);
      },
      "departmentLabel": function () {
        const name = CODELIST_STORE_NAME + "/" + GET_CODELIST;
        const codelist = this.$store.getters[name](DEPARTMENT);
        return selectFromCodeList(
          codelist, this.language, this.value.department);
      },
      "workingHoursLabel": function () {
        const name = CODELIST_STORE_NAME + "/" + GET_CODELIST;
        const codelist = this.$store.getters[name](TIME);
        return selectFromCodeList(
          codelist, this.language, this.value.workingHours);
      },
    },
    "methods": {
      "labelSelector": function (item) {
        return selectLabel(item, this.language);
      },
    }
  }

  function selectFromCodeList(codelist, language, value) {
    for(const key in codelist) {
      if (!codelist.hasOwnProperty(key)) {
        continue;
      }
      const item = codelist[key];
      if (item["@id"] !== value) {
        continue;
      }
      return item[language];
    }
    return value;
  }

</script>

<style scoped>

</style>
