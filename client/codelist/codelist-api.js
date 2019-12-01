import {fetchJson} from "../app-service/http";

export const cache = {};

export function fetchCodelist(name) {
  // Allow us to bundle selected codelists.
  if (cache[name]) {
    return Promise.resolve({
      "json": cache[name],
    });
  }
  console.log("cache:", JSON.stringify(cache));
  console.log("request:", name, cache[name]);
  const url = "./api/v1/data/" + encodeURI(name) + ".json";
  return fetchJson(url);
}
