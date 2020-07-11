import React from 'react'
import PropTypes from 'prop-types'

const BasicPagePreview = ({ entry, widgetFor }) => (
  <div style={{padding: '2rem'}}>
    <h6>{entry.getIn(['data', 'title'])}</h6>
    <br/>
    <h2>{entry.getIn(['data', 'heading'])}</h2>
  </div>
)

BasicPagePreview.propTypes = {
  entry: PropTypes.shape({
    getIn: PropTypes.func,
  }),
  widgetFor: PropTypes.func,
}

export default BasicPagePreview
