
 async function getMessage(password) {
    const requestParams = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'password': password })
    };

    return fetch(`http://localhost:5000/view`, requestParams)
    .then(response => {return response});
};

 async function sendMessage(password, message) {
    const requestParams = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'password': password, 'message': message })
    };

    return fetch(`http://localhost:5000/send`, requestParams)
    .then(response => {return response });
};

export {getMessage, sendMessage}