'use babel'

import {React, update} from 'react-for-atom';

export default React.createClass({
  getDefaultProps: function() {
    return {
      onCheckboxChange: function() {

      }
    };
  },
  render: function() {
    return (
      <div className="package">
        <span>{this.props.name}</span>
        <input type="checkbox" onChange={(e) => this.props.onCheckboxChange(e.target.checked)}/>
      </div>
    );
  }
});
