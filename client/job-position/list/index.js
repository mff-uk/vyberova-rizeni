import {register} from "../../app/register";
import JobPositionList from "./job-position-list-view";
import {createStore, STORE_NAME} from "../job-position-store";

const spec = {
  "route-name": "job-position-list",
  "route": "/job-positions",
  "component": JobPositionList,
  "store-name": STORE_NAME,
  "store-factory": createStore,
  "nav": true,
  "nav-label": "Seznam inzerátů"
};

register(spec);

export default spec;
