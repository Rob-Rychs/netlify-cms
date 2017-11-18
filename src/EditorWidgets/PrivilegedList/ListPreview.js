import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { resolveWidget } from '../../EditorWidgets';
import ObjectPreview from '../Object/ObjectPreview';

const ListPreview = ObjectPreview;

ListPreview.propTypes = {
  field: PropTypes.node,
};

export default ListPreview;
