import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import TextSubjectIcon from 'mdi-react/TextSubjectIcon'
import summary from 'images/summary.png'

const AccessibilityResults = ({ mobile_app }) => {
  const { score, points, entries, pros, cons } = mobile_app.accessibility;
  return (
    <div className="App">
      <h3><TextSubjectIcon class="IconMargin"/>Accessiibility results</h3>
      <div>
        <div className="ImageContainer">
          <img className="SummaryImage" src={summary}/>
        </div>
        <div className="ResultsContainer">
          <span><b>Score: </b>{Math.round(score * 10000) / 100}%</span>
          <br/>
          <span><b>Good practices: </b>{points}</span>
          <br/>
          <span><b>Bad practices: </b>{entries - points}</span>
          <br/>
          {
            pros && Object.keys(pros).length > 0 && (
              <Fragment>
                <span><b>Good practices details: </b></span>
                <br />
                {
                  Object.keys(pros).map((key,index) => {
                    return (
                      <div className="Line">
                        <span><b>File: </b>{key}</span>
                      </div>
                    )
                  })
                }
              </Fragment>
            )
          }
          {
            pros && Object.keys(cons).length > 0 && (
              <Fragment>
                <span><b>Bad practices details: </b></span>
                <br />
                {
                  Object.keys(pros).map((key,index) => {
                    return (
                      <div className="Line">
                        <span><b>File: </b>{key}</span>
                        <br/>
                      </div>
                    )
                  })
                }
              </Fragment>
            )
          }
          <br/>
        </div>
      </div>
    </div>
  )
};

AccessibilityResults.propTypes = {
  mobile_app: PropTypes.object.isRequired
};

export default AccessibilityResults;