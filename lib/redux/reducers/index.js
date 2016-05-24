'use babel'

import { combineReducers } from 'redux'
import package from './package';

const reducers = combineReducers({
  package: package
});

export default reducers
