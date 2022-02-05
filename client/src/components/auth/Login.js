import React , {Fragment, useState} from 'react'
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { login } from '../../actions/auth';
import PropTypes from 'prop-types';
const Login = ( {login, isAuthenticated} ) => {
  
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const {email, password } = formData;

  const onChange = e => 
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });
  const onSubmitHandler = (event) => {
   event.preventDefault();
   // putting login values here
   login( email, password );
  }
  // redirect the user if it is authenticated
  if(isAuthenticated) {
    return <Redirect to='/Dashboard' />
  }
  
    return (
        <Fragment>
        <h1 className="large text-primary">Sign In</h1>
 <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
 <form className="form" onSubmit={onSubmitHandler}>
   <div className="form-group">
     <input type="email" placeholder="Email Address" name="email" value={email}
     onChange={onChange} required/>
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
       minLength="6"
     />
   </div>
   <input type="submit" className="btn btn-primary" value="Login" />
 </form>
 <p className="my-1">
   Don't have an account? <Link to="/Register">Sign Up</Link>
 </p>
   </Fragment>
    )
};
Login.protoTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
}
const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
})
export default connect(mapStateToProps, {login})(Login);