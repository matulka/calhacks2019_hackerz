import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Col, Row, Button } from 'reactstrap';
import { Form, Control, Errors } from 'react-redux-form';
import { fakeAuth } from './MainComponent.js';

const required = (val) => val && val.length;

export default class Login extends Component {

  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.state = {
      redirect: false
    }
  }

  handleLogin(values){
    console.log("Login button clicked")
    this.props.fetchLogin(values.username, values.password);
    this.props.resetLogin();
  }

  handleAuth(){
    if (this.props.location !==  '') {
      fakeAuth.isAuthenticated = true;
      this.setState({redirect: true});
      console.log("Login authentication successful")
    } else {
      console.log("Login authentication failed")
      alert("Your username or password is incorrect. Please try logging in again!")
    }
  }

  render() {
    if (this.props.location !== '') {
        this.handleAuth();
        return (<Redirect to='/accomodation'/>)
    }
    return (
      <div className = "container">
        <br/><br/>
        <Form model="login" onSubmit={(values) => this.handleLogin(values)}>
          <Row className="form-group">
              <Col md={{ size: 6, offset: 3 }}>
                  <Control.text model=".username" id="username" name="username"
                      placeholder="Username"
                      className="form-control"
                      validators={{
                          required
                      }} />
                  <Errors
                      className="text-danger"
                      model=".username"
                      show="touched"
                      messages={{
                          required: 'Required'
                      }}
                  />
              </Col>
          </Row>
          <Row className="form-group">
              <Col md={{ size: 6, offset: 3 }}>
                  <Control.text model=".password" type="password" id="password" name="password"
                      placeholder="Keyword"
                      className="form-control"
                      validators={{
                          required
                      }} />
                  <Errors
                      className="text-danger"
                      model=".password"
                      show="touched"
                      messages={{
                          required: 'Required'
                      }}
                  />
              </Col>
          </Row>
          <Row className="form-group">
            <Col md={{ size: 6, offset: 3}}>
                <Button type="submit" color="dark">
                  Login
                </Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
