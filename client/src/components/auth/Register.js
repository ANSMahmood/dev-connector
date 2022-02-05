import React , {Fragment, useState} from 'react'
import { Link, Redirect } from 'react-router-dom';
// import axios from 'axios';
import { connect } from 'react-redux';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import PropTypes from 'prop-types';
// we can also destructure it instead of props we can write pull out setAlert directly
const Register = ( {setAlert, register, isAuthenticated} ) => {
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: ""
  });
  const { name, email, password, password2 } = formData;

  const onChange = (e) => 
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });
  const onSubmitHandler = (event) => {
   event.preventDefault();
   if(password !== password2) {
     // alert message and alert type we have danger css code so it is dynamic
     setAlert("passwords do not match", "danger");
   }
   else {
     // We are going to implement Register logic here
     register( {name, email, password} );
    //  const newUser = {
    //   name, // it is same as name: name
    //   email,
    //   password
     };
  //    // Now we need a config which will send the application type to the backend 
  //    try {
  //     const config = {
  //       headers: {
  //         'Content-Type': 'application/json'
  //       }
  //     };
  //     const body = JSON.stringify(newUser);
  //     const res = await axios.post('/api/users', body, config);
  //     console.log(res.data);
  //    } catch (error) {
  //      console.error(error.response.data)
  //    }
  //  }
  }
  // Check if user is authenticated then just redirect it to the dashboard
  if(isAuthenticated) {
     return <Redirect to='/Dashboard' />
  }
    return (
        <Fragment>
        <h1 className="large text-primary">Sign Up</h1>
 <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
 <form className="form" onSubmit={onSubmitHandler}>
   <div className="form-group">
     <input type="text" 
     placeholder="Name"
     value={name} 
     name="name" 
     onChange={onChange}
    //  required 
    />
   </div>
   <div className="form-group">
     <input type="email" placeholder="Email Address" name="email" value={email}
     onChange={onChange}
      // required
      />
     <small className="form-text"
       >This site uses Gravatar so if you want a profile image, use a
       Gravatar email</small
     >
   </div>
   <div className="form-group">
     <input
       type="password"
       placeholder="Password"
       name="password"
       value={password}
       onChange={onChange}
      //  minLength="6"
     />
   </div>
   <div className="form-group">
     <input
       type="password"
       placeholder="Confirm Password"
       name="password2"
       value={password2}
       onChange={onChange}
      //  minLength="6"
     />
   </div>
   <input type="submit" className="btn btn-primary" value="Register" />
 </form>
 <p className="my-1">
   Already have an account? <Link to="/login">Sign In</Link>
 </p>
   </Fragment>
    )
}
Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};
const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
})
export default connect(mapStateToProps, 
                      {setAlert, register},
                      )
                      (Register);