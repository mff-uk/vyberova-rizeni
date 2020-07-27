import {MISSING_VALUE, isBlank} from "./../app-service/validators";
import {JobPositionReader, JobPositionWriter} from "./job-position-io";

const DEFAULT_EMAIL = "konkurzy@dekanat.mff.cuni.cz";

const DEFAULT_TIME = "https://data.mff.cuni.cz/zdroj/číselník/úvazek/plný";

const DEFAULT_LANGUAGE = "cs";

export function createJobPosition(code) {
  return {
    "code": code,
    "email": DEFAULT_EMAIL,
    "applicationEnd": null,
    "start": null,
    "fluidStart": true,
    "emailInformal": null,
    // Codelist based values.
    "workingPlace": null,
    "role": null,
    "wageClass": null,
    "workingHours": DEFAULT_TIME,
    "department": null,
    "researchFieldFord": [],
    "researchFieldIsvav": [],
    // Following properties are multilingual.
    "expertise": [],
    "qualification": [],
    "documents": [
      {
        "cs": {
          "value": "strukturovaný životopis",
          "errors": [],
        },
        "en": {
          "value": "a curriculum vitae",
          "errors": [],
        },
      },
      {
        "cs": {
          "value": "doklady o vzdělání",
          "errors": [],
        },
        "en": {
          "value": "proofs of education and awarding of academic titles",
          "errors": [],
        },
      },
      {
        "cs": {
          "value": "seznam publikační aktivity",
          "errors": [],
        },
        "en": {
          "value": "a list of publications",
          "errors": [],
        },
      },
      {
        "cs": {
          "value": "přehled citační odezvy (nejlépe podle Web of Science, MathSci či jiných uznávaných databází)",
          "errors": [],
        },
        "en": {
          "value": "a list of citations (preferably by WoS, MathSciNet or other relevant databases)",
          "errors": [],
        },
      },
      {
        "cs": {
          "value": "popis dosavadní pedagogické praxe",
          "errors": [],
        },
        "en": {
          "value": "a description of teaching experience",
          "errors": [],
        },
      }
    ],
    "description": createEmptyMultilanguage(["cs", "en"]),
    // List of all languages.
    "languages": ["cs", "en"]
  };
}

/**
 * Add language to given job position.
 */
export function addLanguage(jobPosition, language) {
  language = language.toLowerCase();
  if (jobPosition.languages.indexOf(language) !== -1) {
    return jobPosition;
  }
  return {
    ...jobPosition,
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
      "value": "",
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
  if (value[language] && !isBlank(value[language].value)) {
    return value[language].value;
  }
  return value[DEFAULT_LANGUAGE].value;
}

export function loadPositionsFromJson(json) {
  const reader = new JobPositionReader();
  const positions = reader.read(json);
  // Merge with default to add missing values.
  return positions.map((position) => ({
    ...createJobPosition(position["code"]),
    ...position
  }));
}

export function savePositionsToString(positions) {
  const writer = new JobPositionWriter();
  return writer.write(positions);
}

export function createEmptyMultilanguage(languages) {
  const result = {};
  languages.forEach((language) => {
    result[language] = {
      "value": "",
      "errors": [MISSING_VALUE],
    }
  });
  return result;
}
