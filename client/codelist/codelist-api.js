import {fetchJson} from "../app-service/http";

export const cache = {};

export function fetchCodelist(name) {
  // Allow us to bundle selected codelists.
  if (cache[name]) {
    return Promise.resolve({
      "json": cache[name],
    });
  }
  const url = "./api/v1/data/" + encodeURI(name) + ".json";
  return fetchJson(url);
}
