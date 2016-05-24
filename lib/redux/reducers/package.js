'use babel'

import {fromJS} from 'immutable';

function package(state = {
  filePath: "",
  config: {
    dependencies: {

    },
    devDependencies: {

    }
  }
}, action) {
  switch (action.type) {
    case "PACKAGE_FILE_SELECTED":
      return fromJS(state).set('filePath', action.filePath).set('config', action.config).toJS();
      break;
    default:
      return state;
  }
}

export default package;
