import React, { Component } from 'react';
import Select from 'react-select';

class CustomSelect extends Component {
  handleChange = value => {
    // this is going to call setFieldValue and manually update values.topcis
    this.props.onChange(this.props.fieldName, value);
  };

  handleBlur = () => {
    // this is going to call setFieldTouched and manually update touched.topcis
    this.props.onBlur(this.props.fieldName, true);
  };

  render() {
    return (
      <div style={{ margin: '1rem 0', color: 'black'}}>
        <label htmlFor={this.props.fieldName}>{this.props.label}</label>
        <Select
          id={this.props.fieldName}
          options={this.props.options}
          multi={this.props.multi}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          value={this.props.value}
        />
        {!!this.props.error &&
          this.props.touched && (
            <div style={{ color: 'red', marginTop: '.5rem' }}>{this.props.error}</div>
          )}
      </div>
    );
  }
}

export default CustomSelect;