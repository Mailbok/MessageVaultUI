import React from 'react';
import {Button, TextField, Typography, Container, Snackbar, Slide, RadioGroup, Radio, FormControlLabel, makeStyles} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert';
import './App.css';
import {getMessage, sendMessage} from './api.js';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    height: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    paddingTop: '20px',
  },
  formContainer: {
    height: '75vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldsContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  formFields: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: '20px',
  },
  textFields: {
    display: 'flex',
    height: '20vh',
    paddingBottom: '15px',
    flexDirection: 'column',
    alignItems:'left'
  },
  radioButtonGroup: {
    borderRightWidth: 'thin',
    borderRightStyle: 'dotted',
  },
  submitButton: {
    background: 'green',
    color:'white'
  }
})

const transition = (props) => {
  return <Slide {...props} direction="up" />;
};

function MessageForm() {
  const classes = useStyles();

  const [message, setMessage] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [textFieldDisabled, setTextFieldDisabled] = React.useState(true);
  const [radioValue, setRadioValue] = React.useState('view');
  const [snackOpen, setSnackOpen] = React.useState(false);
  const [snackSeverity, setSnackSeverity] = React.useState('');
  const [snackMessage, setSnackMessage] = React.useState('');

  const showSnack = (severity, message) => {
    setSnackMessage(message);
    setSnackSeverity(severity);
    setSnackOpen(true);
  }

  const handlePasswordChange = (event) => {
    /*Look into hashing password if you have time*/
    setPassword(event.target.value);
  }

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  }

  const handleSnackClose = (event, reason) => {
    setSnackOpen(false);
  };

  const handleRadioChange = (event) => {
    setPassword('')
    setMessage('')
    setRadioValue(event.target.value);

    if (event.target.value === 'view') {
      setTextFieldDisabled(true)
    }
    else {
      setTextFieldDisabled(false)
    }
  };

  const handleSubmit = () => {
    if (radioValue === 'send') {
      send()
    }
    else if (radioValue === 'view') {
      view()
    }
  }

  const send = () => {
    if ((password == "") || (message == "")) {
      showSnack('warning', 'You must enter a password and a message')
    }
    else {
      sendMessage(password, message)
      .then(async response => {
        if (!response.ok) {
          return Promise.reject(response.status);
        }
        const data = await response.json();
        showSnack('success', 'Message posted successfully');
      })
      .catch(error => {
        let messages = {
          409 : 'Password is already in use',
          500 : 'Unexpected error occured, try again later',
          404 : 'Unexpected error occured, try again later'
        }
        setMessage('')
        setPassword('')
        console.log(error)
        showSnack('error', messages[error])
      })
    }
  }

  const view = () => {
    if (password === "") {
      showSnack('warning', 'You must enter a password')
    }
    else {
      setMessage('')
      getMessage(password)
      .then(async response => {
  
        if (!response.ok) {
          return Promise.reject(response.statusText);
        }
        else if (response.status == '204') {
          showSnack('warning', 'No message exists for this password');
          setMessage('')
          setPassword('')
        }
        else {
          const data = await response.json();
          setMessage(data['data'])
        }
  
      })
      .catch(error => {
        console.log(error)
        setMessage('')
      })
    }
  }

  return (
    <Container >
      <Typography variant='h4' className={classes.title}>
        Message Vault
      </Typography>

      <Container className={classes.formContainer}>
        <Container className={classes.formFields}>
          <RadioGroup className={classes.radioButtonGroup} aria-label="function" name="Function" value={radioValue} onChange={handleRadioChange}>
            <FormControlLabel value="view" control={<Radio />} label="View" />
            <FormControlLabel value="send" control={<Radio />} label="Send" />
            <FormControlLabel value="change" control={<Radio />} label="Change" />
          </RadioGroup>
          <Container className={classes.textFields}>
            <TextField required size='small' label='Password' type='password' value={password} onChange={handlePasswordChange}/>
            <TextField required={!textFieldDisabled} disabled={textFieldDisabled} multiline rows={4} size='small' label='Message' value={message} onChange={handleMessageChange}/>
          </Container>
        </Container>
        
        <Button onClick={handleSubmit} variant='outlined' color='secondary'>Submit</Button>
      </Container>

      <Snackbar open={snackOpen} autoHideDuration={6000} onClose={handleSnackClose} TransitionComponent={transition}>
        <Alert onClose={handleSnackClose} severity={snackSeverity}>
          {snackMessage}
        </Alert>
      </Snackbar>

    </Container>
  );
}

export default function App() {
  const classes = useStyles();

  return (
    <div>
        <MessageForm/>
    </div>
  );
}
