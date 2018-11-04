import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import './index.css'
import { Search, Grid, Menu, Button, Icon } from 'semantic-ui-react'

var $ = require('jquery');

class Navbar extends React.Component {
  state = {}

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state;

    return (
      <Menu stackable inverted color='blue'>
        <Menu.Item>
          <img src='logo.png' width="250%" height="100%"/>
        </Menu.Item>
        <Menu.Item>
          <h2>BearSafe</h2>
        </Menu.Item>

        <Menu.Item
          name='instructions'
          active={activeItem === 'instructions'}
          onClick={this.handleItemClick}
        >
          How it Works
        </Menu.Item>

        <Menu.Item
          name='about'
          active={activeItem === 'about'}
          onClick={this.handleItemClick}
        >
          About the Team
        </Menu.Item>

        <Menu.Item
          name='contact'
          active={activeItem === 'contact'}
          onClick={this.handleItemClick}
        >
          Contact Us
        </Menu.Item>

        <Menu.Item position='right'>
          <Button icon negative>
            <Icon name='alarm' />
            &nbsp;
            Call Police
          </Button>
        </Menu.Item>

      </Menu>
    )
  }
}

class Start extends React.Component {
  componentWillMount() {
    this.resetComponent()
  }

  resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })

  handleResultSelect = (e, { result }) => this.setState({ value: result.title })

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value })

    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetComponent()

      const input = this.state.value.replace(/ /g, "%20")
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&inputtype=textquery&key=AIzaSyD1nvWZ1NuQQRN1HyBId-mnylE_XC5E_7w`
      console.log(url);

      var temp = this;

      $.ajax({
        type: "GET",
        url: url,
        dataType: 'jsonp',
      }).always(function(o) {
        const response = o.predictions;
        console.log(response);

        var locations = [];
        var i;
          if (response) {
        for (i = 0; i < response.length; i++) {
          locations.push({title: response[i].description})
        }
          }

        temp.setState({
          isLoading: false,
          results: locations
        })
      });
    }, 300)
  }

  render() {
    const { isLoading, value, results } = this.state

    return (
      <Grid>
        <Grid.Column width={6}>
          <Search
            input={{ fluid: true, icon: 'street view', iconPosition: 'left' }}
            style={{ width: "300%" }}
            placeholder={"Choose starting point..."}
            loading={isLoading}
            onResultSelect={this.handleResultSelect}
            onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
            results={results}
            value={value}
            fluid
            {...this.props}
          />
        </Grid.Column>
      </Grid>
    )
  }
}

class Destination extends React.Component {
  componentWillMount() {
    this.resetComponent()
  }

  resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })

  handleResultSelect = (e, { result }) => this.setState({ value: result.title })

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value })

    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetComponent()

      const input = this.state.value.replace(/ /g, "%20")
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&inputtype=textquery&key=AIzaSyD1nvWZ1NuQQRN1HyBId-mnylE_XC5E_7w`
      console.log(url);

      var temp = this;

      $.ajax({
        type: "GET",
        dataType: 'jsonp',
        url: url
      }).always(function(o) {
        const response = o.predictions;
        console.log(response);

        var locations = [];
        var i;
          if (response) {
        for (i = 0; i < response.length; i++) {
          locations.push({title: response[i].description})
        }
          }

        temp.setState({
          isLoading: false,
          results: locations
        })
      });
    }, 300)
  }

  render() {
    const { isLoading, value, results } = this.state

    return (
      <Grid>
        <Grid.Column width={6}>
          <Search
            input={{ fluid: true, icon: 'map marker alternate', iconPosition: 'left' }}
            style={{ width: "300%" }}
            placeholder={"Choose destination..."}
            loading={isLoading}
            onResultSelect={this.handleResultSelect}
            onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
            results={results}
            value={value}
            fluid
            {...this.props}
          />
        </Grid.Column>
      </Grid>
    )
  }
}

class App extends React.Component {
  render() {
    return (
      <div>
        <Navbar />
        <Grid centered columns={3} padded>
          <Grid.Column width={5}>
            <Start id={'addr1'}/>
          </Grid.Column>
          <Grid.Column width={5}>
            <Destination id={'addr2'}/>
          </Grid.Column>
          <Grid.Column width={2}>
            <Button primary color='blue' style={{ width: "100%" }} id='searchLocation'>
              <Icon name='location arrow' />
              &nbsp;
              Start
            </Button>
          </Grid.Column>
        </Grid>
        <br />
      </div>
      );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
