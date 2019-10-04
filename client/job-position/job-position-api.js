import {MISSING_VALUE} from "./../app-service/validators";

const DEFAULT_EMAIL = "konkurzy@dekanat.mff.cuni.cz";

const DEFAULT_TIME = "https://data.mff.cuni.cz/zdroj/číselník/úvazek/plný";

const DEFAULT_LANGUAGE = "cs";

export function createJobPosition(code) {
  return {
    "code": code,
    "email": DEFAULT_EMAIL,
    "startDate": null,
    "endDate": null,
    "startFluid": true,
    "workingPlace": null,
    "role": null,
    "wageClass": null,
    "workingHours": DEFAULT_TIME,
    "department": null,
    "emailInformal": null,
    // Following properties are multilingual.
    "researchField": [],
    "expertise": [],
    "qualification": [],
    "documents": [],
    "description": {
      "cs": {
        "value": "",
        "errors": [MISSING_VALUE]
      },
      "en": {
        "value": null,
        "errors": [MISSING_VALUE]
      },
    },
    // List of all languages.
    "languages": ["cs", "en"]
  };
}

/**
 * Add language to given job position.
 */
export function addLanguage(jobPosition, language) {
  if (jobPosition.languages.indexOf(language) !== -1) {
    return jobPosition;
  }
  return {
    ...jobPosition,
    "researchField":
      jobPosition.researchField.map(
        (item) => addLanguageToMultilanguage(item, language)),
    "expertise":
      jobPosition.expertise.map(
        (item) => addLanguageToMultilanguage(item, language)),
    "qualification":
      jobPosition.qualification.map(
        (item) => addLanguageToMultilanguage(item, language)),
    "documents":
      jobPosition.documents.map(
        (item) => addLanguageToMultilanguage(item, language)),
    "description":
      addLanguageToMultilanguage(jobPosition.description, language),
    "languages": [...jobPosition.languages, language]
  };
}

function addLanguageToMultilanguage(value, language) {
  if (value[language] !== undefined) {
    return value;
  }
  return {
    ...value,
    [language]: {
      "value": null,
      "errors": [MISSING_VALUE]
    }
  }
}

/**
 * Delete language from given job position.
 */
export function deleteLanguage(jobPosition, language) {
  const index = jobPosition.languages.indexOf(language);
  if (index === -1) {
    return jobPosition;
  }
  return {
    ...jobPosition,
    "researchField":
      jobPosition.researchField.map(
        (item) => deleteLanguageToMultilanguage(item, language)),
    "expertise":
      jobPosition.expertise.map(
        (item) => deleteLanguageToMultilanguage(item, language)),
    "qualification":
      jobPosition.qualification.map(
        (item) => deleteLanguageToMultilanguage(item, language)),
    "documents":
      jobPosition.documents.map(
        (item) => deleteLanguageToMultilanguage(item, language)),
    "description":
      deleteLanguageToMultilanguage(jobPosition.description, language),
    "languages": [
      ...jobPosition.languages.slice(0, index),
      ...jobPosition.languages.slice(index + 1)
    ]
  };
}

function deleteLanguageToMultilanguage(value, language) {
  if (value[language] === undefined) {
    return value;
  }
  const result = {
    ...value,
  };
  delete result[language];
  return result;
}

/**
 * Return multi-language value with props of all languages
 * used in given job position.
 */
export function createValue(jobPosition) {
  const result = {};
  jobPosition.languages.forEach((language) => {
    result[language] = {
      "value": "",
      "errors": [MISSING_VALUE]
    };
  });
  return result;
}

/**
 * Convert multi-language value into an array, with predefined
 * ordering.
 */
export function multiLangValueToArray(jobPosition, value) {
  const result = [];
  Object.keys(value).forEach((lang) => {
    result.push({
      "lang": lang,
      "value": value[lang]["value"],
      "errors": value[lang]["errors"]
    })
  });
  return result;
}

/**
 * Inverse function to multiLangValueToArray.
 */
export function arrayToMultiLangValue(value) {
  const result = {};
  for (let index in value) {
    if (!value.hasOwnProperty(index)) {
      continue;
    }
    const item = value[index];
    result[item["lang"]] = {
      "value": item["value"],
      "errors": item["errors"]
    }
  }
  return result;
}

export function selectLabel(value, language) {
  if (value[language] && value[language].value !== null) {
    return value[language].value;
  }
  return value[DEFAULT_LANGUAGE].value;
}

export function loadPositionsFromString(json) {
  const jobPositions = [];
  json["@graph"].forEach((item) => {
    jobPositions.push({
      "code": item["code"],
      "email": item["email"],
      "startDate": item["startDate"],
      "endDate": item["endDate"],
      "startFluid": item["startFluid"],
      "workingPlace": item["workingPlace"],
      "role": item["role"],
      "wageClass": item["wageClass"],
      "workingHours": item["workingHours"],
      "department": item["department"],
      "emailInformal": item["emailInformal"],
      "researchField": item["researchField"]
        .map((item) => jsonToMultilanguage(item)),
      "expertise": item["expertise"]
        .map((item) => jsonToMultilanguage(item)),
      "qualification": item["qualification"]
        .map((item) => jsonToMultilanguage(item)),
      "documents": item["documents"]
        .map((item) => jsonToMultilanguage(item)),
      "description": jsonToMultilanguage(item["description"]),
      "languages": collectLanguages(item),
    })
  });
  return jobPositions;
}

function collectLanguages(json) {
  let languages = [
    ...collectLanguagesFromMultilanguage(json["description"]),
  ];
  json["researchField"].forEach((item) => {
    languages = [...languages, ...collectLanguagesFromMultilanguage(item)];
  });
  json["expertise"].forEach((item) => {
    languages = [...languages, ...collectLanguagesFromMultilanguage(item)];
  });
  json["qualification"].forEach((item) => {
    languages = [...languages, ...collectLanguagesFromMultilanguage(item)];
  });
  json["documents"].forEach((item) => {
    languages = [...languages, ...collectLanguagesFromMultilanguage(item)];
  });
  return [...new Set(languages)];
}

function collectLanguagesFromMultilanguage(value) {
  return Object.keys(value);
}

function jsonToMultilanguage(json) {
  const result = {};
  Object.keys(json).forEach((lang) => {
    result[lang] = {
      "value": json[lang],
      "errors": []
    }
  });
  return result;
}

export function savePositionsToString(positions) {
  const result = {
    "@context": {},
    "@graph": positions.map((position) => {
      return {
        "code": position["code"],
        "email": position["email"],
        "startDate": position["startDate"],
        "endDate": position["endDate"],
        "startFluid": position["startFluid"],
        "workingPlace": position["workingPlace"],
        "role": position["role"],
        "wageClass": position["wageClass"],
        "workingHours": position["workingHours"],
        "department": position["department"],
        "emailInformal": position["emailInformal"],
        "researchField": position["researchField"]
          .map((item) => multilanguageToJson(item)),
        "expertise": position["expertise"]
          .map((item) => multilanguageToJson(item)),
        "qualification": position["qualification"]
          .map((item) => multilanguageToJson(item)),
        "documents": position["documents"]
          .map((item) => multilanguageToJson(item)),
        "description": multilanguageToJson(position["description"]),
      }
    }),
  };
  return JSON.stringify(result, null, 2);
}

function multilanguageToJson(item) {
  const result = {};
  Object.keys(item).forEach((lang) => {
    if (item[lang].value === undefined || item[lang].value === null) {
      return;
    }
    result[lang] = item[lang].value;
  });
  return result;
}
