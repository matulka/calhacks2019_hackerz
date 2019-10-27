import React, { Component } from 'react';
import { Col, Row, Button } from 'reactstrap';
import { Form, Control, Errors } from 'react-redux-form';
import Center from 'react-center';

const required = (val) => val && val.length;
const month = (val) => !val || (1 <= parseInt(val, 10) && parseInt(val, 10) <= 12)
const date = (val) => !val || (1 <= parseInt(val, 10) && parseInt(val, 10) <= 31)
const year = (val) => !val || (2019 <= parseInt(val, 10))
const hour = (val) => !val || (0 <= parseInt(val, 10) && parseInt(val, 10) <= 23)
const minute = (val) => !val || (0 <= parseInt(val, 10) && parseInt(val, 10) <= 59)


export default class Accomodation extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit= this.handleSubmit.bind(this);
  }

  handleSubmit(values){
    console.log("Accomodation submission button clicked")
    console.log(values);
    
    var startDate = values.startyear+'-'+values.startmonth+'-'+values.startday+'T'+values.starthour+':'+values.startminute+':00';
    var endDate = values.endyear+'-'+values.endmonth+'-'+values.endday+'T'+values.endhour+':'+values.endminute+':00';
    var current_date = new Date()

    const newAcc = {
        peopleQuantity: values.people,
    }

    if (Date(startDate) > current_date && Date(endDate) > Date(startDate)){
        newAcc['startTime'] = startDate;
        newAcc['endTime'] = endDate;
    }
    if (values.description !== ''){
        newAcc['description'] = values.description;
    }

    fetch('http://localhost:3001/'+this.props.location, {
        method: 'POST',
        body: JSON.stringify(newAcc),
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin'
      })
      .then(function(response) {
          return response.json()
      })

    this.props.resetAccomodation();
  }

  render() {
    return (
      <div className = "container">
        <br/><br/><br/><br/>
        <Center>
            <h2> Add Accomodation </h2>
        </Center>
        <br/><br/>
        <Form model="accomodate" onSubmit={(values) => this.handleSubmit(values)}>
          <Row className="form-group">
              <Col md={{ size: 7, offset: 2 }}>
                  <Control.text model=".people" id="people" name="people"
                      placeholder="Number of People"
                      className="form-control"
                      validators={{
                          required
                      }} />
                  <Errors
                      className="text-danger"
                      model=".people"
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
              <Col md={{ offset: 2 }}>
                  StartDate
              </Col>
              <Col md={{ size: 1 }}> 
                  <Control.text model=".startmonth" id="startmonth" name="startmonth"
                      placeholder="MM"
                      className="form-control"
                      validators={{
                          month
                      }} />
                  <Errors
                      className="text-danger"
                      model=".startmonth"
                      show="touched"
                      messages={{
                          month: 'Not a valid month.'
                      }}
                  />
              </Col> /
              <Col md={{ size: 1 }}>
                  <Control.text model=".startdate" id="startdate" name="startdate"
                      placeholder="DD"
                      className="form-control"
                      validators={{
                          date
                      }} />
                  <Errors
                      className="text-danger"
                      model=".startdate"
                      show="touched"
                      messages={{
                          date: 'Not a valid date.'
                      }}
                  />
              </Col> /
              <Col md={{ size: 1 }}>
                  <Control.text model=".startyear" id="startyear" name="startyear"
                      placeholder="YYYY"
                      className="form-control"
                      validators={{
                          year
                      }} />
                  <Errors
                      className="text-danger"
                      model=".startyear"
                      show="touched"
                      messages={{
                          year: 'Not a valid year.'
                      }}
                  />
              </Col>
              <Col md={{ offset: 1 }}>
                  Time
              </Col>
              <Col md={{ size: 1 }}> 
                  <Control.text model=".starthour" id="starthour" name="starthour"
                      placeholder="HH"
                      className="form-control"
                      validators={{
                          hour
                      }} />
                  <Errors
                      className="text-danger"
                      model=".starthour"
                      show="touched"
                      messages={{
                          hour: 'Not a valid hour. '
                      }}
                  />
              </Col> :
              <Col md={{ size: 1 }}> 
                  <Control.text model=".startminute" id="startminute" name="startminute"
                      placeholder="MM"
                      className="form-control"
                      validators={{
                          minute
                      }} />
                  <Errors
                      className="text-danger"
                      model=".startminute"
                      show="touched"
                      messages={{
                          minute: 'Not a valid minute. '
                      }}
                  />
              </Col>
          </Row>
          <Row className="form-group">
              <Col md={{ offset: 2 }}>
              End Date
              </Col>
              <Col md={{ size: 1 }}> 
                  <Control.text model=".endmonth" id="endmonth" name="endmonth"
                      placeholder="MM"
                      className="form-control"
                      validators={{
                          month
                      }} />
                  <Errors
                      className="text-danger"
                      model=".endmonth"
                      show="touched"
                      messages={{
                          month: 'Not a valid month.'
                      }}
                  />
              </Col> /
              <Col md={{ size: 1 }}>
                  <Control.text model=".enddate" id="enddate" name="enddate"
                      placeholder="DD"
                      className="form-control"
                      validators={{
                          date
                      }} />
                  <Errors
                      className="text-danger"
                      model=".enddate"
                      show="touched"
                      messages={{
                          date: 'Not a valid date.'
                      }}
                  />
              </Col> /
              <Col md={{ size: 1 }}>
                  <Control.text model=".endyear" id="endyear" name="endyear"
                      placeholder="YYYY"
                      className="form-control"
                      validators={{
                          year
                      }} />
                  <Errors
                      className="text-danger"
                      model=".endyear"
                      show="touched"
                      messages={{
                          year: 'Not a valid year. '
                      }}
                  />
              </Col>
              <Col md={{ offset: 1 }}>
                  Time
              </Col>
              <Col md={{ size: 1 }}> 
                  <Control.text model=".endhour" id="endhour" name="endhour"
                      placeholder="HH"
                      className="form-control"
                      validators={{
                          hour
                      }} />
                  <Errors
                      className="text-danger"
                      model=".starthour"
                      show="touched"
                      messages={{
                          hour: 'Not a valid hour. '
                      }}
                  />
              </Col> :
              <Col md={{ size: 1 }}> 
                  <Control.text model=".endminute" id="endminute" name="endminute"
                      placeholder="MM"
                      className="form-control"
                      validators={{
                          minute
                      }} />
                  <Errors
                      className="text-danger"
                      model=".endminute"
                      show="touched"
                      messages={{
                          minute: 'Not a valid minute. '
                      }}
                  />
              </Col>
          </Row>
          <Row className="form-group">
            <Col md={{ size: 8, offset: 2 }}>
                <Control.textarea model=".description" id="description" name="description"
                    placeholder="Description"
                    className="form-control"
                    rows="12" 
                />
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
