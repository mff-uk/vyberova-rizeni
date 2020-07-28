import {
  createJobPosition,
  isPositionEqual,
} from "./job-position-api";

export const POSITION_STORE_NAME = "job-position";

export const GET_JOB_POSITION = "GET_JOB_POSITION";

export const GET_ALL_JOB_POSITIONS = "GET_ALL_JOB_POSITIONS";

export const GET_ALL_LANGUAGES = "GET_ALL_LANGUAGES";

export const GET_HAS_CHANGED = "GET_HAS_CHANGED";

const CREATE_ACTION = "CREATE_JOB_POSITION";
export const CREATE_JOB_POSITION = POSITION_STORE_NAME + "/" + CREATE_ACTION;

const LOAD_ACTION = "LOAD_JOB_POSITIONS";
export const LOAD_JOB_POSITIONS = POSITION_STORE_NAME + "/" + LOAD_ACTION;

const DELETE_ACTION = "DELETE_ACTION";
export const DELETE_JOB_POSITION = POSITION_STORE_NAME + "/" + DELETE_ACTION;

const CHANGE_POSITION_ACTION = "SAVE_SELECTED_ACTION";
export const CHANGE_POSITION =
  POSITION_STORE_NAME + "/" + CHANGE_POSITION_ACTION;

const ON_SAVE_POSITIONS_ACTION = "SAVE_POSITIONS_ACTION";
export const ON_SAVE_POSITIONS =
  POSITION_STORE_NAME + "/" + ON_SAVE_POSITIONS_ACTION;

const SET_CHANGE_ON_EDIT_ACTION = "SET_CHANGE_ON_EDIT_ACTION";
export const SET_CHANGE_ON_EDIT =
  POSITION_STORE_NAME + "/" + SET_CHANGE_ON_EDIT_ACTION;

export function createStore() {
  return {
    "namespaced": true,
    "state": {
      "jobPositions": [],
      "jobPositionsChanged": false,
      "changeInEdit": false,
    },
    "mutations": {
      [addNewJobPosition.name]: addNewJobPosition,
      [deleteJobPosition.name]: deleteJobPosition,
      [updateJobPosition.name]: updateJobPosition,
      [setPositionsSaved.name]: setPositionsSaved,
      [setChangeInEdit.name]: setChangeInEdit,
    },
    "getters": {
      [GET_ALL_JOB_POSITIONS]: (state) => {
        return state.jobPositions;
      },
      [GET_JOB_POSITION]: (state) => (code) => {
        for (const position of state.jobPositions) {
          if (position.code === code) {
            return position;
          }
        }
        return undefined;
      },
      [GET_ALL_LANGUAGES]: (state) => {
        const languages = new Set();
        state.jobPositions.forEach((position) => {
          position.languages.forEach((language) => {
            languages.add(language);
          })
        });
        return [...languages];
      },
      [GET_HAS_CHANGED]: (state) => {
        if (state.jobPositionsChanged || state.changeInEdit) {
          return true;
        }
        for (const position of state.jobPositions) {
          if (position.hasChanged) {
            return true;
          }
        }
        return false;
      }
    },
    "actions": {
      [CREATE_ACTION]: createJobPositionAction,
      [LOAD_ACTION]: loadJobPositionsAction,
      [DELETE_ACTION]: deleteJobPositionAction,
      [CHANGE_POSITION_ACTION]: changePositionAction,
      [ON_SAVE_POSITIONS_ACTION]: saveAction,
      [SET_CHANGE_ON_EDIT_ACTION]: setChangeOnEditAction,
    }
  }
}

function addNewJobPosition(state, jobPosition) {
  state.jobPositions = [
    ...state.jobPositions,
    jobPosition,
  ];
  state.jobPositionsChanged = true;
}

function deleteJobPosition(state, code) {
  state.jobPositions = state.jobPositions.filter(item => item.code !== code);
  state.jobPositionsChanged = true;
}

function updateJobPosition(state, {position, refCode}) {
  const newJobPositions = [];
  state.jobPositions.forEach((item) => {
    if (item.code === refCode) {
      newJobPositions.push(position);
    } else {
      newJobPositions.push(item);
    }
  });
  state.jobPositions = newJobPositions;
}

function setPositionsSaved(state) {
  state.jobPositionsChanged = false;
  for(const position of state.jobPositions) {
    position.hasChanged = false;
  }
}

function setChangeInEdit(state, value) {
  state.changeInEdit = value;
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

function changePositionAction(context, event) {
  context.commit(updateJobPosition.name, event);
}

function saveAction(context) {
  context.commit(setPositionsSaved.name);
}

function setChangeOnEditAction(context, event) {
  context.commit(setChangeInEdit.name, event);
}
