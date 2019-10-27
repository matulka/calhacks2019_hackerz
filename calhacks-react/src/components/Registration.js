import React, { Component } from 'react';
import { Col, Row, Button } from 'reactstrap';
import { Form, Control, Errors } from 'react-redux-form';
import Center from 'react-center';

const required = (val) => val && val.length;

export default class Registration extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit= this.handleSubmit.bind(this);
  }

  handleSubmit(values){
    console.log("Login button clicked")
    this.props.resetRegistration();
  }

  render() {
    return (
      <div className = "container">
        <br/><br/><br/><br/>
        <Center>
            <h2> Registration Form </h2>
        </Center>
        <br/><br/>
        <Form model="registration" onSubmit={(values) => this.handleSubmit(values)}>
          <Row className="form-group">
              <Col md={{ size: 8, offset: 2 }}>
                  <Control.text model=".name" id="name" name="name"
                      placeholder="Location Name"
                      className="form-control"
                      validators={{
                          required
                      }} />
                  <Errors
                      className="text-danger"
                      model=".name"
                      show="touched"
                      messages={{
                          required: 'Required. '
                      }}
                  />
              </Col>
              <Col>
                <Button type="submit" color="dark">
                  Submit
                </Button>
            </Col>
          </Row>
          <Row className="form-group">
              <Col md={{ size: 4, offset: 2 }}>
                  <Control.text model=".username" id="username" name="username"
                      placeholder="Username"
                      className="form-control"
                      validators={{
                          required
                      }} />
                  <Errors
                      className="text-danger"
                      model=".name"
                      show="touched"
                      messages={{
                          required: 'Required. '
                      }}
                  />
              </Col>
              <Col md={{ size: 4 }}>
                  <Control.text model=".keyword" id="keyword" name="keyword"
                      placeholder="Keyword"
                      className="form-control"
                      validators={{
                          required
                      }} />
                  <Errors
                      className="text-danger"
                      model=".keyword"
                      show="touched"
                      messages={{
                          required: 'Required. '
                      }}
                  />
              </Col>
          </Row>
          <Row className="form-group">
            <Col md={{ size: 8, offset: 2 }}>
                <Control.text model=".address" id="address" name="address"
                    placeholder="Street Address"
                    className="form-control"
                    rows="12" 
                    validators={{
                        required
                    }} />
                <Errors
                    className="text-danger"
                    model=".address"
                    show="touched"
                    messages={{
                        required: 'Required. '
                    }}
                />
            </Col>
          </Row>
          <Row className="form-group">
              <Col md={{ size: 3, offset: 2 }}>
                  <Control.text model=".city" id="city" name="city"
                      placeholder="City"
                      className="form-control"
                      validators={{
                          required
                      }} />
                  <Errors
                      className="text-danger"
                      model=".city"
                      show="touched"
                      messages={{
                          required: 'Required. '
                      }}
                  />
              </Col>
              <Col md={{ size: 3 }}>
                  <Control.text model=".state" id="state" name="state"
                      placeholder="State"
                      className="form-control"
                      validators={{
                          required
                      }} />
                  <Errors
                      className="text-danger"
                      model=".state"
                      show="touched"
                      messages={{
                          required: 'Required. ',
                      }}
                  />
              </Col>
              <Col md={{ size: 2 }}>
                  <Control.text model=".zip" id="zip" name="zip"
                      placeholder="Zip Code"
                      className="form-control"
                      validators={{
                          required
                      }} />
                  <Errors
                      className="text-danger"
                      model=".zip"
                      show="touched"
                      messages={{
                          required: 'Required. ',
                      }}
                  />
              </Col>
              <Col>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
