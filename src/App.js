import React, { Component } from 'react';
import './App.css';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Navbar from 'react-bootstrap/Navbar'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Card from 'react-bootstrap/Card'
import CardDeck from 'react-bootstrap/CardDeck'


class App extends Component {
    constructor(props) {
      super(props);
      this.state = {
        data: null,
        token: '',
        account: '',
        option: 'Average',
        hideaccount: true,
        average: null,
        median: null,
        richest: null,
        active: null
      };

      this.handleInputChange = this.handleInputChange.bind(this);

    }



    handleInputChange(event) {
      const target = event.target;
      const value = target.value;
      const name = target.name;

      this.setState({
        [name]: value
      });

      // We have to wait for the option to be set with the new value
      setTimeout(() => {
        if(this.state.option === "Account Balance" ){
          this.setState({
            hideaccount: false
          });
        }else{
          this.setState({
            hideaccount: true
          });
        }
      }, 500);

    }

    singleSearch(e){
      e.preventDefault();
      if(this.state.token === ''){
        alert("Please input a token")
      }else{
        if(this.state.option === "Account Balance"){
          if(this.state.account === ''){
            alert("Please input an account for this route")
          }else{
            this.callCalculateBalance(this.state.token, this.state.account)
                .then(res => this.setState({ data: res}))
                .catch(err => console.log(err));
          }
        }else if(this.state.option === "Most Active"){
          this.callTokenOnlyRoutes('/' + this.state.token +'/stats/mostActive')
              .then(res => this.setState({ data: res}))
              .catch(err => console.log(err));
        }else if(this.state.option === "Average"){
          this.callTokenOnlyRoutes('/' + this.state.token +'/stats/average')
              .then(res => this.setState({ data: res}))
              .catch(err => console.log(err));
        }else if(this.state.option === "Median"){
          this.callTokenOnlyRoutes('/' + this.state.token +'/stats/median')
              .then(res => this.setState({ data: res}))
              .catch(err => console.log(err));
        }else if(this.state.option === "Richest"){
          this.callTokenOnlyRoutes('/' + this.state.token +'/stats/richest')
              .then(res => this.setState({ data: res}))
              .catch(err => console.log(err));
        }
      }

    }

    bulkSearch(e){
      e.preventDefault();
      if(this.state.token === ''){
        alert("Please input a token")
      }else{
          this.callTokenOnlyRoutes('/' + this.state.token +'/stats/mostActive')
              .then(res => this.setState({ active: res}))
              .catch(err => console.log(err));
          this.callTokenOnlyRoutes('/' + this.state.token +'/stats/average')
              .then(res => this.setState({ average: res}))
              .catch(err => console.log(err));
          this.callTokenOnlyRoutes('/' + this.state.token +'/stats/median')
              .then(res => this.setState({ median: res}))
              .catch(err => console.log(err));
          this.callTokenOnlyRoutes('/' + this.state.token +'/stats/richest')
              .then(res => this.setState({ richest: res}))
              .catch(err => console.log(err));
      }
    }

    callCalculateBalance = async (token, account) => {
      const response = await fetch('/' +token + '/account/' + account + '/balance')
      const body = await response.text();
      console.log(body)
      if (response.status !== 200) {
        throw Error(body.message)
      }
      return body;
    };

    callTokenOnlyRoutes = async (route) => {
      const response = await fetch(route)
      const body = await response.text();
      console.log(body)
      if (response.status !== 200) {
        throw Error(body.message)
      }
      return body;
    };

    // <p className="App-intro">{this.state.data}</p>


    render() {

      const style = this.state.hideaccount ? {display:'none'}: {}

       return (
        <Container className="App">
         <Navbar bg="dark" variant="dark">
           <Navbar.Brand >Token Search for Augur</Navbar.Brand>
        </Navbar>
        <Tabs defaultActiveKey="single" id="uncontrolled-tab-example">
            <Tab eventKey="single" title="Single Search">
            <Form>
              <Row>
                <Col>
                <Form.Control value={this.state.option} name="option" onChange={this.handleInputChange} as="select">
                  <option>Average</option>
                  <option>Median</option>
                  <option>Richest</option>
                  <option>Most Active</option>
                  <option>Account Balance</option>
                </Form.Control>
                </Col>
                <Col>
                <FormControl type="text" name="token" placeholder="Token" value={this.state.token} onChange={this.handleInputChange} className=" mr-sm-2" />
                </Col>
                <Col style={style}>
                  <FormControl type="text" name="account" placeholder="Account" value={this.state.account} onChange={this.handleInputChange} className=" mr-sm-2" />
                </Col>
                <Col>
                <Button type="submit" onClick={(e) => this.singleSearch(e)}>Single Search</Button>
                </Col>
              </Row>
            </Form>
            <Row>
              <Col style={{padding: '25px 25px 25px 25px' }}>
              <Card style={{ width: '30rem'}}>
                <Card.Body>
                  <Card.Title>Result</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{this.state.data}</Card.Subtitle>
                </Card.Body>
              </Card>
              </Col>
            </Row>
            </Tab>
            <Tab eventKey="profile" title="Bulk Search">
            <Form>
              <Row>
                <Col>
                  <FormControl type="text" placeholder="Token" name="token" value={this.state.token} onChange={this.handleInputChange} className=" mr-sm-2" />
                </Col>
                <Col>
                  <Button type="submit" onClick={(e) => this.bulkSearch(e)}> Bulk Search</Button>
                </Col>
              </Row>
            </Form>
            <Row>
              <Col style={{padding: '25px 25px 25px 25px' }}>
              <CardDeck>
              <Card style={{ width: '18rem'}}>
                <Card.Body>
                  <Card.Title>Result for Average</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{this.state.average}</Card.Subtitle>
                </Card.Body>
              </Card>
              <Card style={{ width: '18rem'}}>
                <Card.Body>
                  <Card.Title>Result for Most Active</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{this.state.active}</Card.Subtitle>
                </Card.Body>
              </Card>
              <Card style={{ width: '18rem'}}>
                <Card.Body>
                  <Card.Title>Result for Median</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{this.state.median}</Card.Subtitle>
                </Card.Body>
              </Card>
              <Card style={{ width: '18rem'}}>
                <Card.Body>
                  <Card.Title>Result for Richest </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{this.state.richest}</Card.Subtitle>
                </Card.Body>
              </Card>
              </CardDeck>
              </Col>
            </Row>
            </Tab>
          </Tabs>

          </Container>
       );
     }
}

export default App;
