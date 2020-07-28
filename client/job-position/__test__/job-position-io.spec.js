import {JobPositionReader, JobPositionWriter} from "./../job-position-io";

describe("JobPositionIO", () => {

  test("We should be able to write and read data.", () => {
    const expected = [{
      "code": "code-II",
      "email": "email",
      "applicationEnd": "2020-01-01",
      "start": "2020-01-10",
      "fluidStart": true,
      "workingPlace": "working-place",
      "role": "role-class",
      "wageClass": "wage-class",
      "workingHours": "working-1/2",
      "department": "my-department",
      "emailInformal": "informail email",
      "researchFieldIsvav": [
        "https://data.mvcr.gov.cz/zdroj/číselníky/klasifikace-výzkumných-oborů/položky/A",
        "https://data.mvcr.gov.cz/zdroj/číselníky/klasifikace-výzkumných-oborů/položky/B"
      ],
      "researchFieldFord": [
        "https://data.mvcr.gov.cz/zdroj/číselníky/ford/položky/10000"
      ],
      // Following properties are multilingual.
      "expertise": [
        {
          "cs": {
            "value": "expertise-cs",
            "errors": [],
          },
          "en": {
            "value": "expertise-en",
            "errors": [],
          },
          "es": {
            "value": "expertise-es",
            "errors": [],
          },
        },
      ],
      "qualification": [
        {
          "cs": {
            "value": "qualification-cs",
            "errors": [],
          },
          "en": {
            "value": "qualification-en",
            "errors": [],
          },
          "es": {
            "value": "qualification-es",
            "errors": [],
          },
        },
      ],
      "documents": [
        {
          "cs": {
            "value": "documents-cs",
            "errors": [],
          },
          "en": {
            "value": "documents-en",
            "errors": [],
          },
          "es": {
            "value": "documents-es",
            "errors": [],
          },
        },
      ],
      "description": {
        "cs": {
          "value": "cs-desc",
          "errors": [],
        },
        "en": {
          "value": "cs-desc",
          "errors": [],
        },
        "es": {
          "value": "cs-desc",
          "errors": [],
        },
      },
      "languages": ["cs", "en", "es"],
    }];
    const reader = new JobPositionReader();
    const writer = new JobPositionWriter();
    const jsonldString = writer.write(expected);
    const jsonld = JSON.parse(jsonldString);
    const actual = reader.read(jsonld);
    expect(actual).toEqual(expected);
  });

  test("Writer should export no description if empty.", () => {
    const expected = [{
      "code": "code-II",
      "email": "email",
      "applicationEnd": "2020-01-01",
      "start": "2020-01-10",
      "fluidStart": true,
      "workingPlace": "working-place",
      "role": "role-class",
      "wageClass": "wage-class",
      "workingHours": "working-1/2",
      "department": "my-department",
      "emailInformal": "informail email",
      "researchField": [],
      // Following properties are multilingual.
      "expertise": [],
      "qualification": [],
      "documents": [],
      "description": {
        "cs": {
          "value": "",
          "errors": [],
        },
        "en": {
          "value": "",
          "errors": [],
        },
      },
      "languages": ["cs", "en"],
    }];
    const writer = new JobPositionWriter();
    const actual = JSON.parse(writer.write(expected));
    expect(Object.keys(actual[0]["popis"]).length).toBe(0);
  });

  test("We should be able to read and write according to specification.", () => {
    const expected = [{
      "@context": "https://pod-test.mvcr.gov.cz/otevřené-formální-normy/pracovní-místa-ve-vědě-a-výzkumu/draft/kontexty/pracovní-místo-ve-vědě-a-výzkumu.jsonld",
      "typ": "Pracovní místo ve vědě a výzkumu",
      "iri": "https://data.mff.cuni.cz/zdroj/výběrová-řízení/8d3d37f9-f808-4957-8075-eff87d2ed75a",
      "id": "8d3d37f9-f808-4957-8075-eff87d2ed75a",
      "nástup_dle_dohody": true,
      "kontakt": [{
        "typ": "Kontakt",
        "název": {
          "cs": "Oficiální e-mail",
          "en": "Official e-mail"
        },
        "email": "mailto:konkurzy@dekanat.mff.cuni.cz"
      }, {
        "typ": "Kontakt",
        "název": {
          "cs": "Neformální e-mail",
          "en": "Informal e-mail"
        },
        "email": "mailto:neformalni@kkk.cz"
      }],
      "termín_podání": {
        "typ": "Časový okamžik",
        "datum": "2020-07-25"
      },
      "nástup": {
        "typ": "Časový okamžik",
        "datum": "2020-07-31"
      },
      "kvalifikace": [{
        "typ": "Kvalifikace",
        "název": {
          "cs": "ph.d. 7 let",
          "en": "7 years ph.d."
        }
      }],
      "požadované_dokumenty": [{
        "název": {
          "cs": "strukturovaný životopis",
          "en": "a curriculum vitae"
        }
      }, {
        "název": {
          "cs": "doklady o vzdělání",
          "en": "proofs of education and awarding of academic titles"
        }
      }, {
        "název": {
          "cs": "seznam publikační aktivity",
          "en": "a list of publications"
        }
      }, {
        "název": {
          "cs": "přehled citační odezvy (nejlépe podle Web of Science, MathSci či jiných uznávaných databází)",
          "en": "a list of citations (preferably by WoS, MathSciNet or other relevant databases)"
        }
      }, {
        "název": {
          "cs": "popis dosavadní pedagogické praxe",
          "en": "a description of teaching experience"
        }
      }],
      "popis": {
        "cs": "volnýýý",
        "en": "freee"
      },
      "obor_isvav": ["https://data.mvcr.gov.cz/zdroj/číselníky/klasifikace-výzkumných-oborů/položky/B"],
      "pracoviště": {
        "typ": "Pracoviště",
        "iri": "https://data.mff.cuni.cz/zdroj/číselník/organizační-struktura/oddělení/102"
      },
      "typ_pracovního_vztahu": [
        "https://data.mvcr.gov.cz/zdroj/číselníky/typy-pracovních-vztahů/položky/plný-úvazek"
      ],
      "akademická_pozice": "https://data.mvcr.gov.cz/zdroj/číselníky/akademické-pozice/položky/docent",
      // Lines bellow are not part of the OFN (format specification).
      "sekce": "https://data.mff.cuni.cz/zdroj/číselníky/sekce/položky/informatika",
      "mzdová_třída": "https://data.mff.cuni.cz/zdroj/číselníky/mzdové-třídy/položky/AP3",
      "expertíza": [{
        "název": {
          "cs": "administrátor",
          "en": "admin"
        }
      }]
    }];
    const reader = new JobPositionReader();
    const writer = new JobPositionWriter();
    const actual = JSON.parse(writer.write(reader.read(expected)));
    expect(actual).toEqual(expected);
  })

});