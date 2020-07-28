import {register} from "../../app/register";
import JobPositionDetail from "./job-position-detail-view";
import {createStore, POSITION_STORE_NAME} from "../job-position-store";

const spec = {
  "route-name": "job-position-detail",
  "route": "/:code",
  "component": JobPositionDetail,
  "store-name": POSITION_STORE_NAME,
  "store-factory": createStore,
};

register(spec);

export default spec;
