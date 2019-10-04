import {fetchCodelist} from "./codelist-api";

const STATUS_FETCHING = "STATUS_FETCHING";

const STATUS_READY = "STATUS_READY";

const STATUS_FAILED = "STATUS_FAILED";

export const STORE_NAME = "codelist";

export const GET_CODELIST = "GET_CODELIST";

const LOAD_CODELIST_ACTION = "LOAD_CODELIST_ACTION";
export const LOAD_CODELIST = STORE_NAME + "/" + LOAD_CODELIST_ACTION;

export function createStore() {
  return {
    "namespaced": true,
    "state": {
      "data": {},
    },
    "mutations": {
      [startFetchingCodelist.name]: startFetchingCodelist,
      [addCodelist.name]: addCodelist,
      [failFetchingCodelist.name]: failFetchingCodelist,
    },
    "getters": {
      [GET_CODELIST]: (state) => (name) => {
        if (state.data[name]) {
          return state.data[name].data;
        } else {
          return [];
        }
      },
    },
    "actions": {
      [LOAD_CODELIST_ACTION]: loadCodelistAction,
    }
  }
}

function startFetchingCodelist(state, {name}) {
  state.data = {
    ...state.data,
    [name]: {
      "status": STATUS_FETCHING,
      "data": []
    }
  }
}

function addCodelist(state, {name, codelist}) {
  state.data = {
    ...state.data,
    [name]: {
      "status": STATUS_READY,
      "data": codelist
    }
  }
}

function failFetchingCodelist(state, {name}) {
  state.data = {
    ...state.data,
    [name]: {
      "status": STATUS_FAILED,
      "data": []
    }
  }
}

function loadCodelistAction(context, name) {
  if (isFetchingOrFetched(context, name)) {
    return;
  }
  context.commit(startFetchingCodelist.name, {"name": name});
  fetchCodelist(name)
    .then((response) => {
      context.commit(addCodelist.name, {
        "name": name,
        "codelist": loadCzechCodeList(response.json)
      });
    }).catch((error) => {
    console.error(error);
    context.commit(failFetchingCodelist.name, {"name": name});
  });
}

function isFetchingOrFetched(context, name) {
  return context.state.data[name] !== undefined &&
    context.state.data[name].status !== STATUS_FAILED;
}

function loadCzechCodeList(data) {
  return data["položky"].map((item) => ({
    "@id": item["id"],
    ...item["název"]
  }));
}
