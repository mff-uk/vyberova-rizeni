import {register} from "../../app/register";
import JobPositionDetail from "./job-position-detail-view";
import {createStore, STORE_NAME} from "../job-position-store";

const spec = {
  "route-name": "job-position-detail",
  "route": "/job-positions/:code",
  "component": JobPositionDetail,
  "store-name": STORE_NAME,
  "store-factory": createStore
};

register(spec);

export default spec;
