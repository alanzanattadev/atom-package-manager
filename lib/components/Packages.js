'use babel'

import {React, update} from 'react-for-atom';
import Package from './Package';
import {fromJS} from 'immutable';

export default React.createClass({
  getInitialState: function() {
    return {
      selectedPackages: []
    };
  },
  getDefaultProps: function() {
    return {
      packages: [],
      onPackagesChange: function() {

      }
    };
  },
  onPackageCheckboxChange: function(package) {
    return (checked) => {
      this.setState(update(this.state, {
        selectedPackages: {
          $set: checked ?
                  fromJS(this.state.selectedPackages)
                    .push(package)
                    .toJS()
                  :
                  fromJS(this.state.selectedPackages)
                    .remove(this.state.selectedPackages.findIndex(p => p == package))
                    .toJS()
        }
      }), () => this.props.onPackagesChange(this.state.selectedPackages));
    };
  },
  render: function() {
    return (
      <div className="packages">
        {this.props.packages.map((package, i) => <Package key={`package${i}`} {...package} onCheckboxChange={this.onPackageCheckboxChange(package)}/>)}
      </div>
    );
  }
});
