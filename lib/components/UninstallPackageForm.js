'use babel'

import {React, update} from 'react-for-atom';
import Packages from './Packages';

export default React.createClass({
  getInitialState: function() {
    return {
      packages: [],
      packageSaveOption: "local"
    };
  },
  getDefaultProps: function() {
    return {
      packages: [],
      onUninstall: function() {

      }
    };
  },
  onPackagesChange: function(value) {
    this.setState(update(this.state, {
      packages: {$set: value}
    }));
  },
  onPackageSaveOptionChange: function(event) {
    this.setState(update(this.state, {
      packageSaveOption: {$set: event.target.value}
    }))
  },
  render: function() {
    return (
      <div className="install-package-form native-key-bindings">
        <Packages packages={this.props.packages} onPackagesChange={(packages) => this.onPackagesChange(packages)}/>
        <div className="save-option-panel">
          <input type="radio" name="package-save-option" value="local" checked={this.state.packageSaveOption == "local"} onChange={this.onPackageSaveOptionChange}></input>
          <span>temporary</span>
          <input type="radio" name="package-save-option" value="save" checked={this.state.packageSaveOption == "save"} onChange={this.onPackageSaveOptionChange}></input>
          <span>save</span>
        </div>
        <button type="button" onClick={() => this.props.onUninstall(this.state.packages, {packageSaveOption: this.state.packageSaveOption})}>Uninstall</button>
      </div>
    );
  }
});
