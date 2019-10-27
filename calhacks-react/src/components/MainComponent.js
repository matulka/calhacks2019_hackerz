import React, { Component } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import Header from './HeaderComponent';
import Registration from './Registration';
import Accomodation from './Accomodation';
import Login from './LoginComponent';
import { actions } from 'react-redux-form';
import { connect } from 'react-redux';
import { fetchLogin } from '../redux/ActionCreators';

/********************************************************************************************
**
** CREATES "FRONT-END" AUTHENTICATION
**
********************************************************************************************/

export const fakeAuth = {
    isAuthenticated: false,
    authenticate(cb) {
      this.isAuthenticated = true
      setTimeout(cb, 100) // fake async
    },
    signout(cb) {
      this.isAuthenticated = false
      setTimeout(cb, 100) // fake async
    }
  }
  
  const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
      fakeAuth.isAuthenticated === true
        ? <Component {...props} />
        : <Redirect to='/login' />
    )} />
  )
  
const mapStateToProps = state => {
    return {
      location_id: state.location.id
    }    
  }

const mapDispatchToProps = (dispatch) => ({
    resetRegistration: () => {dispatch(actions.reset('registration'))},
    resetAccomodation: () => {dispatch(actions.reset('accomodation'))},
    resetLogin: () => {dispatch(actions.reset('login'))},
    fetchLogin: (username, keyword) => dispatch(fetchLogin(username, keyword))
});

/********************************************************************************************
**
** CREATING THE ROUTING SKELETON FOR THE APP
**
********************************************************************************************/

class Main extends Component {

  render(){

    const RegistrationPage = () => {
        return(
            <Registration resetRegistration = {this.props.resetRegistration}/>
        );
    }

    const AccomodationPage = () => {
        return(
            <Accomodation resetAccomodation = {this.props.resetAccomodation}
              location = {this.props.location_id}/>
        );
    }

    const LoginPage = () => {
        return(
            <Login resetLogin = {this.props.resetLogin}
              fetchLogin = {this.props.fetchLogin}
              location = {this.props.location_id}/>
        );
    }

    return (
      <div>
        <Header/>
        <Switch>
          <Route exact path="/register" component={RegistrationPage}/>
          <PrivateRoute exact path="/accomodation" component={AccomodationPage}/>
          <Route exact path="/login" component={LoginPage}/>
          <Redirect from='/' to='/login'/>
        </Switch>
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));