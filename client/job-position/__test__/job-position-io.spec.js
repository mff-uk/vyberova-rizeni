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
    expect(actual["@graph"][0]["volnýText"].length).toBe(0);
  });

});