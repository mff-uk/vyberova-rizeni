import {isBlank, MISSING_VALUE} from "../app-service/validators";

const FORMAL_EMAIL_LABEL = "Oficiální e-mail";
const FORMAL_EMAIL_LABEL_EN = "Official e-mail";
const INFORMAL_EMAIL_LABEL = "Neformální e-mail";
const INFORMAL_EMAIL_LABEL_EN = "Informal e-mail";
const EMAIL_PREFIX = "mailto:";

const IRI_PREFIX = "https://data.mff.cuni.cz/zdroj/výběrová-řízení/";

/**
 * Load only values provided inside the data.
 */
export function JobPositionReader() {

  this["read"] = function read(json) {
    return json.map((position) => readPosition(position));
  };

  function readPosition(position) {
    const result = {
      "code": position["id"],
    };
    setIfNotEmpty(result, "fluidStart", position["nástup_dle_dohody"]);
    setDateTime(result, "start", position["nástup"]);
    setDateTime(result, "applicationEnd", position["termín_podání"]);
    setIfNotEmpty(result, "workingPlace", position["pracoviště"],
      value => value["iri"]);
    setIfNotEmpty(result, "role", position["akademická_pozice"]);
    setIfNotEmpty(result, "wageClass", position["mzdová_třída"]);
    setIfNotEmpty(
      result, "workingHours", position["typ_pracovního_vztahu"],
      value => value[0]);
    setIfNotEmpty(result, "department", position["sekce"]);
    loadContacts(result, position);
    setIfNotEmpty(result, "researchFieldIsvav", position["obor_isvav"]);
    setIfNotEmpty(result, "researchFieldFord", position["obor_frascati"]);

    const description = jsonToMultilanguage(position["popis"]);
    if (description !== null) {
      result["description"] = description;
    }

    setMultilanguage(result, "expertise", position["expertíza"]);
    setMultilanguage(result, "qualification", position["kvalifikace"]);
    setMultilanguage(result, "documents", position["požadované_dokumenty"]);
    result["languages"] = collectLanguages(result);

    generateEmptyStrings(result["qualification"], result["languages"]);
    generateEmptyStrings(result["qualification"], result["languages"]);
    generateEmptyStrings(result["documents"], result["languages"]);

    return result;
  }

  function setDateTime(data, key, value) {
    if (value === undefined || value === null) {
      return;
    }
    if (value["datum"]) {
      data[key] = value["datum"];
    }
  }

  function loadContacts(result, position) {
    const contacts = position["kontakt"];
    if (contacts === undefined || contacts === null) {
      return;
    }
    contacts.forEach((item) => {
      const email = item["email"];
      asArray(item["název"]).forEach((item) => {
        const type = item["cs"];
        if (type === FORMAL_EMAIL_LABEL) {
          result["email"] = email.substr(EMAIL_PREFIX.length);
        }
        if (type === INFORMAL_EMAIL_LABEL) {
          result["emailInformal"] = email.substr(EMAIL_PREFIX.length);
        }
      });
    });
  }

  function jsonToMultilanguage(values) {
    if (values === undefined || values === null || values.length === 0) {
      return null;
    }
    const result = {};
    Object.keys(values).forEach((language) => {
      result[language] = {
        "value": values[language],
        "errors": []
      }
    });
    return result;
  }

  function setMultilanguage(data, key, value) {
    const values = asArray(value)
      .map((item) => jsonToMultilanguage(item["název"]))
      .filter((item) => item != null);
    if (values.length > 0) {
      data[key] = values;
    }
  }

  function asArray(value) {
    if (value === undefined || value === null) {
      return [];
    }
    if (Array.isArray(value)) {
      return value;
    } else {
      return [value];
    }
  }

  function collectLanguages(json) {

    const collectLanguagesFromMultilanguage = (value) => {
      if (value === undefined || value === null) {
        return [];
      }
      return Object.keys(value);
    };

    let languages = [
      ...collectLanguagesFromMultilanguage(json["description"]),
    ];
    if (json["expertise"]) {
      json["expertise"].forEach((item) => {
        languages = [...languages, ...collectLanguagesFromMultilanguage(item)];
      });
    }
    if (json["qualification"]) {
      json["qualification"].forEach((item) => {
        languages = [...languages, ...collectLanguagesFromMultilanguage(item)];
      });
    }
    if (json["documents"]) {
      json["documents"].forEach((item) => {
        languages = [...languages, ...collectLanguagesFromMultilanguage(item)];
      });
    }
    return [...new Set(languages)];
  }

  function generateEmptyStrings(values, languages) {
    asArray(values).forEach((entry) => {
      languages.forEach((language) => {
        if (entry[language]) {
          return;
        }
        entry[language] = {
          "value": "",
          "errors": [MISSING_VALUE]
        }
      });
    });
  }

}

function setIfNotEmpty(data, key, value, transform = (x) => x) {
  if (value) {
    data[key] = transform(value);
  }
}

export function JobPositionWriter() {

  this["write"] = function write(positions) {
    const result = positions.map((position) => writePosition(position));
    return JSON.stringify(result, null, 2);
  };

  function writePosition(position) {
    const result = {
      "@context": createContext(),
      "typ": [
        "Pracovní místo",
        "Pracovní místo ve vědě a výzkumu",
        "Pracovní místo na MFF UK"
      ],
      "iri": IRI_PREFIX + position["code"],
      "id": position["code"],
      "nástup_dle_dohody": position["fluidStart"],
      "kontakt": []
    };

    setIfNotEmpty(result, "sekce", position["department"]);
    setIfNotEmpty(result, "akademická_pozice", position["role"]);
    setIfNotEmpty(result, "mzdová_třída", position["wageClass"]);
    setIfNotEmpty(
      result, "typ_pracovního_vztahu", position["workingHours"],
      value => [value]);
    setIfNotEmpty(result, "pracoviště", position["workingPlace"],
      value => ({
        "typ": "Pracoviště",
        "iri": value
      }));

    if (position["email"]) {
      result["kontakt"].push({
        "typ": "Kontakt",
        "název": {
          "cs": FORMAL_EMAIL_LABEL,
          "en": FORMAL_EMAIL_LABEL_EN,
        },
        "email": EMAIL_PREFIX + position["email"],
      });
    }
    if (position["emailInformal"]) {
      result["kontakt"].push({
        "typ": "Kontakt",
        "název": {
          "cs": INFORMAL_EMAIL_LABEL,
          "en": INFORMAL_EMAIL_LABEL_EN,
        },
        "email": EMAIL_PREFIX + position["emailInformal"],
      });
    }

    // We convert it first as it make it easier to check if it is empty.
    const description = multilanguageToJson(position["description"]);
    if (Object.keys(description).length > 0) {
      result["popis"] = description;
    }

    setIfNotEmpty(result, "obor_isvav", position["researchFieldIsvav"]);
    setIfNotEmpty(result, "obor_frascati", position["researchFieldFord"]);

    setDateTimeIfNotEmpty(result, "nástup", position["start"]);
    setDateTimeIfNotEmpty(result, "termín_podání", position["applicationEnd"]);

    result["expertíza"] = position["expertise"]
      .map((item) => multilanguageToJson(item))
      .map((values) => ({"typ": "Expertíza", "název": values}));
    result["kvalifikace"] = position["qualification"]
      .map((item) => multilanguageToJson(item))
      .map((values) => ({"typ": "Kvalifikace", "název": values}));
    result["požadované_dokumenty"] = position["documents"]
      .map((item) => multilanguageToJson(item))
      .map((values) => ({"typ": "Požadovaný dokument", "název": values}));
    return result;
  }

  function multilanguageToJson(item) {
    const result = {};
    Object.keys(item).forEach((lang) => {
      if (isBlank(item[lang].value)) {
        return;
      }
      result[lang] = item[lang].value;
    });
    return result;
  }

  function setDateTimeIfNotEmpty(data, key, value) {
    if (value === undefined || value === null) {
      return;
    }
    data[key] = {
      "typ": "Časový okamžik",
      "datum": value,
    }
  }

}

function createContext() {
  return "https://data.mff.cuni.cz/" +
    "dokumentace/pracovní-místa-mff-uk/kontexty/pracovní-místa-mff-uk.jsonld";
}
