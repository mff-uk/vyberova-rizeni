import {register} from "../../app/register";
import JobPositionList from "./job-position-list-view";
import {createStore, POSITION_STORE_NAME} from "../job-position-store";

const spec = {
  "route-name": "job-position-list",
  "route": "/",
  "component": JobPositionList,
  "store-name": POSITION_STORE_NAME,
  "store-factory": createStore,
};

register(spec);

export default spec;
