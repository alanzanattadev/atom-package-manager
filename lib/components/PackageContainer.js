'use babel'

import {React, update} from 'react-for-atom';
import store from '../redux/store';

export default React.createClass({
  getInitialState: function() {
    return {
      filePath: store.getState().package.filePath,
      config: store.getState().package.config
    };
  },
  componentDidMount: function() {
    this.unsubscribe = store.subscribe(this.handleStateChange)
  },
  componentWillUnmount: function() {
    this.unsubscribe();
  },
  handleStateChange: function() {
    this.setState(update(this.state, {
      filePath: {$set: store.getState().package.filePath},
      config: {$set: store.getState().package.config}
    }))
  },
  render: function() {
    return (
      React.cloneElement(this.props.children, {
        packages: Object.keys(this.state.config.devDependencies || {}).map(dep => {return {name: dep, devDependency: true}}).concat(Object.keys(this.state.config.dependencies || {}).map(dep => {return {name: dep, dependency: true}}))
      })
    );
  }
});
