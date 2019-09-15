import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import MobilePhoneAndroidIcon from 'mdi-react/MobilePhoneAndroidIcon'
import AndroidIcon from 'mdi-react/AndroidIcon'
import ScreenRotationIcon from 'mdi-react/ScreenRotationIcon'
import VerifiedUserIcon from 'mdi-react/VerifiedUserIcon'

const MobileApps = ({ mobile_apps }) => {
  useEffect(() => {
    const interval = setInterval(() => {
      window.location.reload();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const checkAccessibilityResults = (id) => {
    window.location.href = `/mobile_apps/${id}`;
  };

  return (
    <div className="App">
      <h3><MobilePhoneAndroidIcon class="IconMargin"/>Mobile apps</h3>
      <div className="ListContainer">
        <ul className="List">
          { mobile_apps && mobile_apps.length > 0 && mobile_apps.map(ma => (
            <li key={ma.id}>
              <div className="AppIcon">
                <AndroidIcon className="AndroidIcon"/>
              </div>
              <div className="AppTitle">
                <span>{ma.name}</span>
              </div>
              <div className="AppStatus">
                {ma.status === "pending" && (
                  <span><ScreenRotationIcon className="IconMargin"/>Verifying...</span>
                )}
                {ma.status === "verified" && (
                  <Fragment>
                    <span><VerifiedUserIcon className="IconMargin"/>Verified</span>
                    <button onClick={() => checkAccessibilityResults(ma.id)}>Check Report</button>
                  </Fragment>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

MobileApps.propTypes = {
  mobile_apps: PropTypes.array.isRequired
};

export default MobileApps;
