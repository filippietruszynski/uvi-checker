import React from 'react';

const UVI = props => {
  return (
    <div className='app-uvi'>
      <div className='uvi-circle'>
        <p className='uvi-title'>UV Index</p>
        <p className='uvi-value'>{props.uvi}</p>
        <p className='uvi-level'>{props.uviLevel}</p>
      </div>
    </div>
  );
}

export default UVI;