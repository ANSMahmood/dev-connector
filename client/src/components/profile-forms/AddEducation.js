import React, { Fragment, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom'
import { addEducation } from '../../actions/profile'
const AddEducation = ( {addEducation, history} ) => {
    const [ formData, setFormData ] = useState({
    school: '',
    degree: '',
    fieldofstudy: '',
    from: '',
    to: '',
    current: false,
    description: ''
    });
    const [toDateDisabled, toggleDisabled] = useState(false);

    const {school, degree, fieldofstudy, from, to, current, description } = formData;

    const onChange = (event) => {
       setFormData({ ...formData,
        [event.target.name]: event.target.value
    }
    )}
    return (
       <Fragment>
 <h1 class="large text-primary">
       Add Your Education
      </h1>
      <p class="lead">
        <i class="fas fa-code-branch"></i> Add any school or bootcamp that you have
        attended
      </p>
      <small>* = required field</small>
      <form class="form" onSubmit={(event) => {
          event.preventDefault();
          addEducation(formData, history);
      }}>
        <div class="form-group">
          <input type="text" placeholder="* school or bootcamp" name="school" value={school} onChange={onChange} required />
        </div>
        <div class="form-group">
          <input type="text" placeholder="* degree or certificate" name="degree" value={degree} onChange={onChange} required />
        </div>
        <div class="form-group">
          <input type="text" placeholder="Field Of Study" name="fieldofstudy" value={fieldofstudy} onChange={onChange} />
        </div>
        <div class="form-group">
          <h4>From Date</h4>
          <input type="date" name="from" value={from} onChange={onChange} />
        </div>
         <div class="form-group">
          <p><input type="checkbox" name="current" checked={current} value={current}
          onChange={event => {
              setFormData({ ...formData, current: !current});
              toggleDisabled(!toggleDisabled);
          }}
          /> {' '}Current Job</p>
        </div>
        <div class="form-group">
          <h4>To Date</h4>
          <input type="date" name="to" value={to} onChange={onChange} disabled={
              toDateDisabled ? 'disabled': ''
          } />
        </div>
        <div class="form-group">
          <textarea
            name="description"
            cols="30"
            rows="5"
            placeholder="Program Description"
            value={description} onChange={onChange} 
          ></textarea>
        </div>
        <input type="submit" class="btn btn-primary my-1" />
        <Link class="btn btn-light my-1" to="/dashboard">Go Back</Link>
      </form>
       </Fragment>
    )
}

AddEducation.propTypes = {
    addEducation: PropTypes.func.isRequired,
}

export default connect(null, {addEducation})(withRouter(AddEducation));