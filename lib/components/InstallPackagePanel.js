'use babel'

import {React} from 'react-for-atom';
import InstallPackageForm from './InstallPackageForm';

export default React.createClass({
  getDefaultProps: function() {
    return {
      onInstall: function() {

      }
    };
  },
  render: function() {
    return (
      <div className="install-package-panel">
        <InstallPackageForm ref={elem => this.form = elem} onInstall={this.props.onInstall}/>
      </div>
    );
  }
});
