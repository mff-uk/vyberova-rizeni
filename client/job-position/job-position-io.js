import {isBlank, MISSING_VALUE} from "../app-service/validators";

const FORMAL_EMAIL_LABEL = "Oficiální e-mail";

const INFORMAL_EMAIL_LABEL = "Neformální e-mail";

/**
 * Load only values provided inside the data.
 */
export function JobPositionReader() {

  this["read"] = function read(json) {
    return json["@graph"].map((position) => readPosition(position));
  };

  function readPosition(position) {
    const result = {
      "code": position["identifikátor"],
    };
    setIfNotEmpty(result, "fluidStart", position["nástupDleDohody"]);
    setDateTime(result, "start", position["nástup"]);
    setDateTime(result, "applicationEnd", position["termínPodání"]);
    setIfNotEmpty(result, "workingPlace", position["pracoviště"]);
    setIfNotEmpty(result, "role", position["role"]);
    setIfNotEmpty(result, "wageClass", position["platováTřída"]);
    setIfNotEmpty(result, "workingHours", position["typVztahu"]);
    setIfNotEmpty(result, "department", position["obor"]);
    loadContacts(result, position);

    const description = jsonToMultilanguage(position["volnýText"]);
    if (description !== null) {
      result["description"] = description;
    }

    setMultilanguage(result, "researchField", position["oborVýzkumu"]);
    setMultilanguage(result, "expertise", position["expertíza"]);
    setMultilanguage(result, "qualification", position["kvalifikace"]);
    setMultilanguage(result, "documents", position["dokumenty"]);
    result["languages"] = collectLanguages(result);

    generateEmptyStrings(result["researchField"], result["languages"]);
    generateEmptyStrings(result["qualification"], result["languages"]);
    generateEmptyStrings(result["qualification"], result["languages"]);
    generateEmptyStrings(result["documents"], result["languages"]);

    return result;
  }

  function setDateTime(data, key, value) {
    if (value === undefined || value === null) {
      return;
    }
    if (value["inXSDDateTime"]) {
      data[key] = value["inXSDDateTime"];
    }
  }

  function loadContacts(result, position) {
    const contacts = position["kontakt"];
    if (contacts === undefined || contacts === null) {
      return;
    }
    contacts.forEach((item) => {
      const email = item["email"];
      const type = item["druh"]["@value"];
      if (type === FORMAL_EMAIL_LABEL) {
        result["email"] = email;
      }
      if (type === INFORMAL_EMAIL_LABEL) {
        result["emailInformal"] = email;
      }
    });
  }

  function jsonToMultilanguage(values) {
    if (values === undefined || values === null || values.length === 0) {
      return null;
    }
    const result = {};
    values.forEach((item) => {
      result[item["@language"]] = {
        "value": item["@value"],
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
    return value;
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
    if (json["researchField"]) {
      json["researchField"].forEach((item) => {
        languages = [...languages, ...collectLanguagesFromMultilanguage(item)];
      });
    }
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
    values.forEach((entry) => {
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

function setIfNotEmpty(data, key, value) {
  if (value) {
    data[key] = value;
  }
}

export function JobPositionWriter() {

  this["write"] = function write(positions) {
    const result = {
      "@context": createContext(),
      "@graph": positions.map((position) => writePosition(position)),
    };
    return JSON.stringify(result, null, 2);
  };

  function writePosition(position) {
    const result = {
      "identifikátor": position["code"],
      "nástupDleDohody": position["fluidStart"],
      "kontakt": []
    };
    setIfNotEmpty(result, "obor", position["department"]);
    setIfNotEmpty(result, "role", position["role"]);
    setIfNotEmpty(result, "platováTřída", position["wageClass"]);
    setIfNotEmpty(result, "typVztahu", position["workingHours"]);
    setIfNotEmpty(result, "pracoviště", position["workingPlace"]);
    if (position["email"]) {
      result["kontakt"].push({
        "@type": ["Kontakt"],
        "druh": {
          "@language": "cs",
          "@value": FORMAL_EMAIL_LABEL,
        },
        "email": position["email"]
      });
    }
    if (position["emailInformal"]) {
      result["kontakt"].push({
        "@type": ["Kontakt"],
        "druh": {
          "@language": "cs",
          "@value": INFORMAL_EMAIL_LABEL,
        },
        "email": position["emailInformal"]
      });
    }
    if (position["start"]) {
      result["nástup"] = {
        "@type": ["Instant"],
        "inXSDDateTime": position["start"],
      };
    }
    if (position["applicationEnd"]) {
      result["termínPodání"] = {
        "@type": ["Instant"],
        "inXSDDateTime": position["applicationEnd"],
      };
    }
    if (!isBlank(position["description"])) {
      result["volnýText"] = multilanguageToJson(position["description"]);
    }
    result["oborVýzkumu"] = position["researchField"]
      .map((item) => multilanguageToJson(item))
      .map((values) => ({"@type": ["OborVýzkumu"], "název": values,}));
    result["expertíza"] = position["expertise"]
      .map((item) => multilanguageToJson(item))
      .map((values) => ({"@type": ["Expertíza"], "název": values,}));
    result["kvalifikace"] = position["qualification"]
      .map((item) => multilanguageToJson(item))
      .map((values) => ({"@type": ["Kvalifikace"], "název": values,}));
    result["dokumenty"] = position["documents"]
      .map((item) => multilanguageToJson(item))
      .map((values) => ({"@type": ["OborVýzkumu"], "název": values,}));
    return result;
  }

  function multilanguageToJson(item) {
    const result = [];
    Object.keys(item).forEach((lang) => {
      if (isBlank(item[lang].value)) {
        return;
      }
      result.push({
        "@value": item[lang].value,
        "@language": lang,
      });
    });
    return result;
  }

}

function createContext() {
  return {
    "ofn-z": "https://ofn.gov.cz/slovník/základní-datové-typy/",
    "ofn-k": "https://ofn.gov.cz/slovník/kontakty/",
    "ofn-v": "https://ofn.gov.cz/slovník/výběrová-řízení/",
    "mff-v": "https://data.mff.cuni.cz/slovník/výběrová-řízení/",
    "time": "http://www.w3.org/2006/time#",
    "xsd": "http://www.w3.org/2001/XMLSchema#",
    "identifikátor": "ofn-v:identifikátor",
    "nástupDleDohody": "ofn-v:nástupDleDohody",
    "kontakt": "ofn-v:kontakt",
    "Kontakt": "ofn-k:Kontakt",
    "druh": "ofn-k:druh",
    "email": "ofn-k:email",
    "platováTřída": {
      "@id": "mff-v:platováTřída",
      "@type": "@id",
    },
    "pracoviště": {
      "@id": "mff-v:pracoviště",
      "@type": "@id",
    },
    "nástup": "ofn-v:nástup",
    "Instant": "time:Instant",
    "inXSDDateTime": {
      "@id": "time:inXSDDateTime",
      "@type": "xsd:dateTime"
    },
    "termínPodání": "ofn-v:termínPodání",
    "obor": {
      "@id": "ofn-v:obor",
      "@type": "@id",
    },
    "role": {
      "@id": "ofn-v:role",
      "@type": "@id",
    },
    "typVztahu": {
      "@id": "ofn-v:typVztahu",
      "@type": "@id",
    },
    "název": "ofn-z:název",
    "oborVýzkumu": "mff-v:oborVýzkumu",
    "OborVýzkumu": "mff-v:OborVýzkumu",
    "expertíza": "mff-v:expertíza",
    "Expertíza": "mff-v:Expertíza",
    "kvalifikace": "mff-v:kvalifikace",
    "Kvalifikace": "mff-v:Kvalifikace",
    "volnýText": "mff-v:volnýText",
    "VolnýText": "mff-v:VolnýText",
  };
}
