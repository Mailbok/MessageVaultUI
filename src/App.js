import React from 'react';
import {Button, TextField, Typography, FormControl} from '@material-ui/core'
import './App.css';
import {getMessage, sendMessage} from './service.js';


class MessageForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      password: ''
    };

    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.handleSend = this.handleSend.bind(this);
    this.handleView = this.handleView.bind(this);
  }

  handlePasswordChange(event) {
    /*Look into hashing password if you have time*/
    this.setState({password: event.target.value});
  }

  handleMessageChange(event) {
    this.setState({message: event.target.value});
  }

  handleSend() {
    if ((this.state.password === "") || (this.state.message === "")) {
      alert('Please enter a password and a message')
    }
    else {
      sendMessage(this.state.password, this.state.message)
      .then(async response => {
        if (!response.ok) {
          return Promise.reject(response.status);
        }
        const data = await response.json();
        alert('Message posted successfully')
      })
      .catch(error => {
        let messages = {
          409 : 'Password is already in use',
          500 : 'Unexpected error occured, try again later',
          404 : 'Unexpected error occured, try again later'
        }
        this.setState({message: ''})
        this.setState({password: ''})
        console.log(error)
        alert(messages[error])
      })
    }
  }

  handleView() {
    if (this.state.password === "") {
      alert('Please enter a password')
    }
    else {
      this.setState({message: ''})
      getMessage(this.state.password)
      .then(async response => {
  
        if (!response.ok) {
          return Promise.reject(response.statusText);
        }
        else if (response.status == '204') {
          alert('No message exists for this password')
          this.setState({message: ''})
          this.setState({password: ''})
        }
        else {
          const data = await response.json();
          this.setState({message: data['data']})
        }
  
      })
      .catch(error => {
        console.log(error)
        this.setState({message: ''})
        alert(error)
      })
    }
  }

  render() {
    return (
      <div>
        <Typography variant='h4'>
          Message Vault
        </Typography>
        <FormControl>
          <TextField label='Password' type='password' value={this.state.password} onChange={this.handlePasswordChange}/>
          <TextField label='Message' value={this.state.message} onChange={this.handleMessageChange}/>
          <Button onClick={this.handleView}>View</Button>
          <Button onClick={this.handleSend}>Send</Button>
        </FormControl>

      </div>
    );
  }
}

function App() {
  return (
    <div className="App">
      <header>
        <MessageForm/>
      </header>
    </div>
  );
}

export default App;
