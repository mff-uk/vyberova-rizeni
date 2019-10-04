import {register} from "../app/register";
import {STORE_NAME, createStore} from "./codelist-store";

export {
  GET_CODELIST,
  LOAD_CODELIST,
  STORE_NAME as CODELIST_STORE_NAME,
}from "./codelist-store";

const spec = {
  "store-name": STORE_NAME,
  "store-factory": createStore,
};

register(spec);
