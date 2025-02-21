import React, {useState} from 'react';
import axios from 'axios';
import './App.css';

function App() {
  
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');

  const [isLoginForm, setIsLoginForm] = useState(true);

  const toggleFormMode = () => {
    setIsLoginForm(!isLoginForm);
  }


  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents page refresh
    console.log('Username:', username);
    console.log('Password:', password);
  
    // Encode the username and password in Base64 for Basic Auth
    const authHeader = `Basic ${btoa(`${username}:${password}`)}`;
  
    // Determine the API endpoint based on the form mode
    const endpoint = isLoginForm ? '/api/login' : `/api/register?username=${username}&password=${password}`;

    const requestData = isLoginForm ? null : {username, password};
    const headers = isLoginForm ? {'Authorization': authHeader} : {'Content-Type': 'application/json'};
  
    // Call the API
    axios.post(`http://localhost:8080${endpoint}`, requestData, {headers})
        .then((response) => {
        const apiResponse = response.data;
        if (apiResponse.success) {
          console.log(`${isLoginForm ? 'Login' : 'Registration'} successful!`, apiResponse);
          alert(apiResponse.message);
        } else {
          console.error(`${isLoginForm ? 'Login' : 'Registration'} failed:`, apiResponse.message);
          alert(apiResponse.message);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        console.error(`${isLoginForm ? 'Login' : 'Registration'} failed:`, error.response ? error.response.data : error.message);
        alert(`${isLoginForm ? 'Login' : 'Registration'} failed. Please try again.`);
      });
  };

  return (
    <div className="App">
      <h1>{isLoginForm ? 'Login' : 'Register'}</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">{isLoginForm ? 'Login' : 'Register'}</button>
        </form>
    <p>
    {isLoginForm ? "Don't have an account? " : "Already have an account? "}
    <button type="button" onClick={toggleFormMode}>
      {isLoginForm ? 'Register' : 'Login'}
    </button>
  </p>
</div>
  );
}

export default App;
