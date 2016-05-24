'use babel'

import {React, update} from 'react-for-atom';

export default React.createClass({
  getInitialState: function() {
    return {
      packageName: "",
      packageSaveOption: "local"
    };
  },
  getDefaultProps: function() {
    return {
      onInstall: function() {

      }
    };
  },
  onPackageNameChange: function(event) {
    this.setState(update(this.state, {
      packageName: {$set: event.target.value}
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
        <input type="text" placeholder="Package name" ref={(elem) => this.packageNameInput = elem} onChange={this.onPackageNameChange} value={this.state.packageName}/>
        <div className="save-option-panel">
          <input type="radio" name="package-save-option" value="local" checked={this.state.packageSaveOption == "local"} onChange={this.onPackageSaveOptionChange}></input>
          <span>temporary</span>
          <input type="radio" name="package-save-option" value="save" checked={this.state.packageSaveOption == "save"} onChange={this.onPackageSaveOptionChange}></input>
          <span>save</span>
          <input type="radio" name="package-save-option" value="save-dev" checked={this.state.packageSaveOption == "save-dev"} onChange={this.onPackageSaveOptionChange}></input>
          <span>save-dev</span>
        </div>
        <button type="button" onClick={() => this.props.onInstall(this.state.packageName.split(' ').map(pName => {return {name: pName}}), {packageSaveOption: this.state.packageSaveOption})}>Install</button>
      </div>
    );
  }
});
