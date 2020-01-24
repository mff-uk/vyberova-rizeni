<template>
  <div>
    <h1>
      Děkan Matematicko-fyzikální fakulty Univerzity Karlovy vypisuje
      výběrové řízení na obsazení následující akademické pozice na
      {{ sectionLabel }} s&nbsp;termínem podání přihlášek
      {{ formatDate(value.applicationEnd) }}
    </h1>
    <p>
      <strong> {{ roleLabel }} </strong> <br>
      <strong>
        kód pracovního místa
        <a :href="'mailto:' + value.email + '?subject=' + value.code">
          {{ value.code }}
        </a>
      </strong>
    </p>
    <p>Pracoviště: {{ workingPlaceLabel }}</p>
    <p>Platová třída: {{ wageClassLabel }}</p>
    <p>Výše úvazku: {{ workingHoursLabel }}</p>
    <p v-show="value.researchField.length > 0">
      Uchazeč bude pracovat v oboru/oborech:
    </p>
    <ul v-show="value.researchField.length > 0">
      <li
        v-for="(item, index) in value.researchField"
        :key="index"
      >
        {{ labelSelector(item) }}
      </li>
    </ul>
    <p v-show="value.expertise.length > 0">
      U uchazečů se požaduje odbornost/expertíza v&nbsp;nejméně jedné
      z&nbsp;následujících oblastí:
    </p>
    <ul v-show="value.expertise.length > 0">
      <li
        v-for="(item, index) in value.expertise"
        :key="index"
      >
        {{ labelSelector(item) }}
      </li>
    </ul>
    <p v-show="value.qualification.length > 0">
      Uchazeči musí splnit následující kvalifikační předpoklady:
    </p>
    <ul v-show="value.qualification.length > 0">
      <li
        v-for="(item, index) in value.qualification"
        :key="index"
      >
        {{ labelSelector(item) }}
      </li>
    </ul>
    <p>{{ labelSelector(value.description) }}</p>
    <p>
      Neformální dotazy adresujte na
      <a :href="'mailto:' + value.emailInformal">{{ value.emailInformal }}</a>.
    </p>
    <p v-show="value.documents.length > 0">
      Doklady požadované k&nbsp;přihlášce jsou:
    </p>
    <ul v-show="value.documents.length > 0">
      <li
        v-for="(item, index) in value.documents"
        :key="index"
      >
        {{ labelSelector(item) }}
      </li>
    </ul>
    <p>
      Kromě zaslání přihlášky a&nbsp;požadovaných dokladů na e-mail
      <a :href="'mailto:' + value.email + '?subject=' + value.code">
        {{ value.email }}
      </a>
      uchazeči zajistí, aby byly na tutéž e-mailovou adresu zaslány dva
      doporučující dopisy. I v&nbsp;tomto případě musí být v&nbsp;předmětu
      e-mailové zprávy uveden kód pracovního místa.
    </p>
    <p>
      <strong>
        Termín pro podávání přihlášek: {{ formatDate(value.applicationEnd) }}
      </strong>
    </p>
    <p>
      Termín nástupu: {{ formatDate(value.start) }}
      <span v-if="value.fluidStart">nebo dle dohody</span>
    </p>
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

  const OBOR_TO_SEKCE = {
    "https://data.mff.cuni.cz/zdroj/číselník/obor/matematika":
      "matematické sekci",
    "https://data.mff.cuni.cz/zdroj/číselník/obor/fyzika":
      "fyzikální sekci",
    "https://data.mff.cuni.cz/zdroj/číselník/obor/informatika":
      "informatické sekci"
  };

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
      "sectionLabel": function () {
        return OBOR_TO_SEKCE[this.value.department];
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
      "formatDate": function (value) {
        if (!value) {
          return "";
        }
        const date = new Date(value);
        let day = date.getDate();
        if (day < 10) {
          day = "0" + day;
        }
        let month = date.getMonth() + 1; // It starts from zero.
        if (month < 10) {
          month = "0" + month;
        }
        const year = date.getFullYear();
        return day + "." + month + "." + year;
      },
    }
  }

  function selectFromCodeList(codelist, language, value) {
    for (const key in codelist) {
      if (!codelist.hasOwnProperty(key)) {
        continue;
      }
      const item = codelist[key];
      if (item["@id"] !== value) {
        continue;
      }
      if (item[language]) {
        return item[language];
      } else {
        return item["cs"];
      }
    }
    return value;
  }
</script>

<style scoped>
  ul {
    margin-bottom: 16px;
    margin-top: -16px;
  }
</style>
