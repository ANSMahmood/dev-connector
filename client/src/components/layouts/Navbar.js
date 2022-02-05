import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../../actions/auth";
import PropTypes from "prop-types";
const Navbar = ({ auth: {isAuthenticated, loading}, logout}) => {
  const authLinks = (
<ul>
<li>
          <Link to='/profiles'>
            Developers
            </Link>
        </li>
        <li>
         <Link to='/posts'>
            Posts
            </Link>
        </li>
        <li>
          <Link to='/dashboard'>
            <i className="fas fa-user"></i>{''}
            <span className="hide-sm"> Dashboard</span>
            </Link>
        </li>
        <li>
          <Link onClick={logout} to="#">
            <i className="fas fa-sign-out-alt"></i>{''}
            <span className="hide-sm"> Logout</span>
            </Link>
        </li>
      </ul>
  );
  const guestLInks = (
<ul>
       <li>
         <Link to='/profiles'>
            Developers
            </Link>
        </li>
        <li>
          <Link to="/register">Register</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
      </ul>
  );
  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/">
          <i className="fas fa-code"></i> DevConnector
        </Link>
      </h1>      
      { !loading && (<Fragment>{ isAuthenticated ? authLinks : guestLInks }</Fragment>) }
    </nav>
  )
};
Navbar.prototypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object,
}
const mapStateToProps = state => ({
  auth: state.auth
})
export default connect(
mapStateToProps, { logout }
)(Navbar);