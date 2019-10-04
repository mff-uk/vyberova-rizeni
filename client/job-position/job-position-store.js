import {
  createJobPosition,
  addLanguage,
  deleteLanguage
} from "./job-position-api";

export const STORE_NAME = "job-position";

export const GET_JOB_POSITION = "GET_JOB_POSITION";

export const GET_JOB_POSITIONS = "GET_JOB_POSITIONS";

const CREATE_ACTION = "CREATE_JOB_POSITION";
export const CREATE_JOB_POSITION = STORE_NAME + "/" + CREATE_ACTION;

const LOAD_ACTION = "LOAD_JOB_POSITIONS";
export const LOAD_JOB_POSITIONS = STORE_NAME + "/" + LOAD_ACTION;

const DELETE_ACTION = "DELETE_ACTION";
export const DELETE_JOB_POSITION = STORE_NAME + "/" + DELETE_ACTION;

const SELECT_ACTION = "SELECT_JOB_POSITIONS";
export const SELECT_JOB_POSITIONS = STORE_NAME + "/" + SELECT_ACTION;

const SAVE_SELECTED_ACTION = "SAVE_SELECTED_ACTION";
export const SAVE_SELECTED = STORE_NAME + "/" + SAVE_SELECTED_ACTION;

const ADD_VALUE_ACTION = "ADD_VALUE_ACTION";
export const ADD_VALUE =
  STORE_NAME + "/" + ADD_VALUE_ACTION;

const EDIT_VALUE_ACTION = "EDIT_VALUE_ACTION";
export const EDIT_VALUE =
  STORE_NAME + "/" + EDIT_VALUE_ACTION;

const DELETE_VALUE_ACTION = "DELETE_VALUE_ACTION";
export const DELETE_VALUE =
  STORE_NAME + "/" + DELETE_VALUE_ACTION;

const UPDATE_DESCRIPTION_ACTION = "UPDATE_DESCRIPTION_ACTION";
export const UPDATE_DESCRIPTION =
  STORE_NAME + "/" + UPDATE_DESCRIPTION_ACTION;

const DELETE_LANGUAGE_ACTION = "DELETE_LANGUAGE_ACTION";
export const DELETE_LANGUAGE =
  STORE_NAME + "/" + DELETE_LANGUAGE_ACTION;

const ADD_LANGUAGE_ACTION = "ADD_LANGUAGE_ACTION";
export const ADD_LANGUAGE =
  STORE_NAME + "/" + ADD_LANGUAGE_ACTION;

export function createStore() {
  return {
    "namespaced": true,
    "state": {
      "selected": null,
      "jobPositions": [
      ]
    },
    "mutations": {
      [addNewJobPosition.name]: addNewJobPosition,
      [deleteJobPosition.name]: deleteJobPosition,
      [setSelected.name]: setSelected,
      [saveSelected.name]: saveSelected,
      [addValueToSelected.name]: addValueToSelected,
      [deleteValueFromSelected.name]: deleteValueFromSelected,
      [updateValueOnSelected.name]: updateValueOnSelected,
      [updateDescriptionOnSelected.name]: updateDescriptionOnSelected,
      [deleteLanguageOnSelected.name]: deleteLanguageOnSelected,
      [addLanguageToSelected.name]: addLanguageToSelected,
    },
    "getters": {
      [GET_JOB_POSITIONS]: (state) => {
        return state.jobPositions;
      },
      [GET_JOB_POSITION]: (state) => {
        return state.selected;
      },
    },
    "actions": {
      [CREATE_ACTION]: createJobPositionAction,
      [LOAD_ACTION]: loadJobPositionsAction,
      [DELETE_ACTION]: deleteJobPositionAction,
      [SELECT_ACTION]: selectJobPosition,
      [SAVE_SELECTED_ACTION]: saveSelectedAction,
      // Used to modify multi-language array properties.
      [ADD_VALUE_ACTION]: addValueAction,
      [EDIT_VALUE_ACTION]: editValueAction,
      [DELETE_VALUE_ACTION]: deleteValueAction,
      [UPDATE_DESCRIPTION_ACTION]: updateDescriptionAction,
      [DELETE_LANGUAGE_ACTION]: deleteLanguageAction,
      [ADD_LANGUAGE_ACTION]: addLanguageAction,
    }
  }
}

function addNewJobPosition(state, jobPosition) {
  state.jobPositions = [
    ...state.jobPositions,
    jobPosition,
  ]
}

function deleteJobPosition(state, code) {
  state.jobPositions = state.jobPositions.filter(item => item.code !== code);
}

function setSelected(state, value) {
  // Create copy so we safely edit, we add ref. code
  // so we can identify the item later in the list even if the code
  // is changed.
  state.selected = {
    "refCode": value.code,
    ...value,
  };
}

function saveSelected(state) {
  const selected = state.selected;
  const newJobPositions = [];
  state.jobPositions.forEach((item) => {
    if (item.code === selected.refCode) {
      delete selected.refCode;
      newJobPositions.push(selected);
    } else {
      newJobPositions.push(item);
    }
  });
  state.jobPositions = newJobPositions;
}

function addValueToSelected(state, event) {
  const {prop, value} = event;
  state.selected = {
    ...state.selected,
    [prop]: [
      ...state.selected[prop],
      value,
    ]
  };
}

function deleteValueFromSelected(state, event) {
  const {prop, index} = event;
  state.selected[prop].splice(index, 1);
}

function updateValueOnSelected(state, event) {
  const {prop, index, value} = event;
  state.selected[prop].splice(index, 1, value);
}

function updateDescriptionOnSelected(state, event) {
  state.selected.description = event.value;
}

function deleteLanguageOnSelected(state, event) {
  const {language} = event;
  state.selected = deleteLanguage(state.selected, language);
}

function addLanguageToSelected(state, event) {
  const {language} = event;
  state.selected = addLanguage(state.selected, language);
}

function createJobPositionAction(context, code) {
  if (code === null || code === undefined) {
    code = generateUUID();
  }
  context.commit(addNewJobPosition.name, createJobPosition(code));
  return {"code": code};
}

// https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function generateUUID() {
  let d = new Date().getTime();
  let d2 = (performance && performance.now && (performance.now() * 1000)) || 0;
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    let r = Math.random() * 16;//random number between 0 and 16
    if (d > 0) {//Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {//Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

function loadJobPositionsAction(context, {payload}) {
  const codes = context.state.jobPositions.map((item) => item.code);
  payload.forEach((jobPosition) => {
    if (codes.indexOf(jobPosition.code) !== -1) {
      return;
    }
    codes.push(jobPosition.code);
    context.commit(addNewJobPosition.name, jobPosition);
  });
}

function deleteJobPositionAction(context, code) {
  context.commit(deleteJobPosition.name, code);
}

function addValueAction(context, event) {
  context.commit(addValueToSelected.name, {
    "prop": event["prop"],
    "value": event["value"]
  });
}

function editValueAction(context, event) {
  context.commit(updateValueOnSelected.name, {
    "prop": event["prop"],
    "index": event["index"],
    "value": event["value"],
  });
}

function deleteValueAction(context, event) {
  context.commit(deleteValueFromSelected.name, {
    "prop": event["prop"],
    "index": event["index"],
  });
}

function selectJobPosition(context, code) {
  let selected = null;
  context.state.jobPositions.forEach((position) => {
    if (position.code === code) {
      selected = position;
    }
  });
  context.commit(setSelected.name, selected);
}

function saveSelectedAction(context) {
  context.commit(saveSelected.name);
}

function updateDescriptionAction(context, value) {
  context.commit(updateDescriptionOnSelected.name, {"value": value});
}

function deleteLanguageAction(context, language) {
  context.commit(deleteLanguageOnSelected.name, {"language": language});
}

function addLanguageAction(context, language) {
  context.commit(addLanguageToSelected.name, {"language": language});
}
