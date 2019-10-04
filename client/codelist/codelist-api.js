import {fetchJson} from "../app-service/http";

export function fetchCodelist(name) {
  const url = "./api/v1/data/" + encodeURI(name) + ".jsonld";
  return fetchJson(url);
}
