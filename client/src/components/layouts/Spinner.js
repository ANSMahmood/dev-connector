import React, { Fragment } from 'react';
import spinner from './Gear.gif';
export const Spinner = () => {
    return (
       <Fragment>
           <img 
           src={spinner}
           style={{ width: '100px', margin: 'auto', display: 'block', color: '#5b5657'}}
           alt='Loading...'
           />
       </Fragment>
    )
}
