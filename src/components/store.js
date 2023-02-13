import { legacy_createStore as createStore } from "redux";
import updateReducer from "./reducers/updateReducer";

function configureStore(
  state = {
    fileData: {
        "documentId": "40410",
        "pageNumber": "1",
        "x0": "",
        "y0": "",
        "x1": "",
        "y1": ""
    },
    toShow : false,
    toActivatePeriod: "",
  }
) {
  return createStore(updateReducer, state);
}

export default configureStore;