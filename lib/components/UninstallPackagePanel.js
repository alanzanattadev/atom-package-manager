'use babel'

import {React, update} from 'react-for-atom';
import UninstallPackageForm from './UninstallPackageForm';
import PackageContainer from './PackageContainer';

export default React.createClass({
  getDefaultProps: function() {
    return {
      onUninstall: function() {

      }
    }
  },
  render: function() {
    return (
      <div tabIndex="1" className="native-key-bindings" ref={elem => this.root = elem}>
        <PackageContainer>
          <UninstallPackageForm onUninstall={this.props.onUninstall}/>
        </PackageContainer>
      </div>
    );
  }
});
