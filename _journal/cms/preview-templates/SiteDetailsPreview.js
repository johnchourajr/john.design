import React from 'react'
import PropTypes from 'prop-types'

const SiteDetailsPreview = ({ entry, widgetFor }) => (
  <div style={{padding: '2rem'}}>
    <h3>{entry.getIn(['data', 'title'])}</h3>
    <br/>
    <h3>{entry.getIn(['data', 'description'])}</h3>
    <br/>
    <p><u>Company Name:</u> {entry.getIn(['data', 'companyName'])}</p>
    <p><u>Phone:</u> {entry.getIn(['data', 'phone'])}</p>
    <p><u>Address Line 1:</u> {entry.getIn(['data', 'address1'])}</p>
    <p><u>Address Line 2:</u> {entry.getIn(['data', 'address2'])}</p>
    <p><u>URL:</u> {entry.getIn(['data', 'url'])}</p>
    <p><u>Email:</u> {entry.getIn(['data', 'email'])}</p>
    <br/>
    <p><u>Google Analytics:</u> {entry.getIn(['data', 'ga'])}</p>
  </div>
)

SiteDetailsPreview.propTypes = {
  entry: PropTypes.shape({
    getIn: PropTypes.func,
  }),
  widgetFor: PropTypes.func,
}

export default SiteDetailsPreview
