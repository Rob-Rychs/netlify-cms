import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Map, fromJS } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import c from 'classnames';
import registry from '../../lib/registry';
import ControlHOC from './ControlHOC';

function isHidden(field) {
  return field.get('widget') === 'hidden';
}

export default class ControlPane extends Component {
  componentValidate = {};
  processControlRef(fieldName, wrappedControl) {
    if (!wrappedControl) return;
    this.componentValidate[fieldName] = wrappedControl.validate;
  }

  validate = () => {
    this.props.fields.forEach((field) => {
      if (isHidden(field)) return;
      this.componentValidate[field.get("name")]();
    });
  };

  controlFor(field) {
    const {
      entry,
      fieldsMetaData,
      fieldsErrors,
      mediaPaths,
      getAsset,
      onChange,
      onOpenMediaLibrary,
      onAddAsset,
      onRemoveInsertedMedia,
    } = this.props;
    const widgetName = field.get('widget');
    const widget = resolveWidget(widgetName);
    const fieldName = field.get('name');
    const value = entry.getIn(['data', fieldName]);
    const metadata = fieldsMetaData.get(fieldName);
    const errors = fieldsErrors.get(fieldName);
    const labelClass = errors ? 'nc-controlPane-label nc-controlPane-labelWithError' : 'nc-controlPane-label';
    if (entry.size === 0 || entry.get('partial') === true) return null;
    return (
      <div className={c('nc-controlPane-control', { [`nc-controlPane-control-${widgetName}`]: widgetName })}>
        <ul className="nc-controlPane-errors">
          {
            errors && errors.map(error =>
              error.message &&
              typeof error.message === 'string' &&
              <li key={error.message.trim().replace(/[^a-z0-9]+/gi, '-')}>{error.message}</li>
            )
          }
        </ul>
        <label className={labelClass} htmlFor={fieldName}>{field.get('label')}</label>
        <ControlHOC 
          controlComponent={widget.control}
          field={field}
          value={value}
          mediaPaths={mediaPaths}
          metadata={metadata}
          onChange={(newValue, newMetadata) => onChange(fieldName, newValue, newMetadata)}
          onValidate={this.props.onValidate.bind(this, fieldName)}
          onOpenMediaLibrary={onOpenMediaLibrary}
          onRemoveInsertedMedia={onRemoveInsertedMedia}
          onAddAsset={onAddAsset}
          getAsset={getAsset}
          ref={this.processControlRef.bind(this, fieldName)}
        />
      </div>
    );
  }

  render() {
    const { collection, fields } = this.props;
    if (!collection || !fields) {
      return null;
    }

    return (
      <div className="nc-controlPane-root">
        {
          fields.map((field, i) => {
            if (isHidden(field)) {
              return null;
            }
            return <div key={i} className="nc-controlPane-widget">{this.controlFor(field)}</div>;
          })
        }
      </div>
    );
  }
}

ControlPane.propTypes = {
  collection: ImmutablePropTypes.map.isRequired,
  entry: ImmutablePropTypes.map.isRequired,
  fields: ImmutablePropTypes.list.isRequired,
  fieldsMetaData: ImmutablePropTypes.map.isRequired,
  fieldsErrors: ImmutablePropTypes.map.isRequired,
  mediaPaths: ImmutablePropTypes.map.isRequired,
  getAsset: PropTypes.func.isRequired,
  onOpenMediaLibrary: PropTypes.func.isRequired,
  onAddAsset: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onValidate: PropTypes.func.isRequired,
  onRemoveInsertedMedia: PropTypes.func.isRequired,
};
