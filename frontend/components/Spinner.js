import React from 'react';
import PT from 'prop-types';

function Spinner({ on }) {
  if (!on) return null; // Render nothing if 'on' is false

  return (
    <div className="spinner">
      <div className="lds-dual-ring"></div>
    </div>
  );
}

Spinner.propTypes = {
  on: PT.bool.isRequired,
};

export default Spinner;
