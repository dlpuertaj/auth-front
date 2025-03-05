import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import "./App.css";

function LoginOrRegisterForm({ setUser }) {
  
  const BASE_URL = "http://localhost:8080";
  const LOGIN_ENDPOINT = "/api/login";
  const REGISTER_ENDPOINT = "/api/register";
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const navigate = useNavigate();

  const toggleFormMode = () => {
    setIsLoginForm(!isLoginForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents page refresh

    const endpoint = isLoginForm  ? LOGIN_ENDPOINT : REGISTER_ENDPOINT;

    try{
      const response = await axios.post(BASE_URL + endpoint,
        {
          username: username,
          password: password,
        },
        {withCredentials: true,});
        if(response.status === 200){
          setUser(username);
          navigate("/dashboard");
          console.log((isLoginForm ? "Login" : "Registration") + "Successful", response.data);
        }else{
          console.error((isLoginForm ? "Login" : "Registration") + "Failed",response.data);
        }
        
    }catch(error){
      console.error((isLoginForm ? "Login" : "Registration") + "Failed", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="App">
      <h1>{isLoginForm ? "Login" : "Register"}</h1>
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
        <button type="submit">{isLoginForm ? "Login" : "Register"}</button>
      </form>
      <p>
        {isLoginForm ? "Don't have an account? " : "Already have an account? "}
        <button type="button" onClick={toggleFormMode}>
          {isLoginForm ? "Register" : "Login"}
        </button>
      </p>
    </div>
  );
}
function Dashboard({ user, handleLogout }) {
  return user ? (
    <div>
      <h1>Welcome to the Dashboard, {user}!</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  ) : (
    <Navigate to="/" />
  );
}
function App() {
  const [user, setUser] = useState(null);

  useEffect(() =>{
    axios.get("http://localhost:8080/api/me",{withCredentials: true})
      .then((response) => {
        console.log("User Data:", response.data);
        setUser(response.data.username);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const handleLogout = async () => {
    await axios.post("http://localhost:8080/api/logout", {}, { withCredentials: true })
    .then(() => {
      setUser(null);
    }).catch((error) => {
      console.error("Logout failed:", error);
    });
  };

return (
  <Router>
    <Routes>
      <Route path="/" element={<LoginOrRegisterForm setUser={setUser} />} />
      <Route
        path="/dashboard"
        element={<Dashboard user={user} handleLogout={handleLogout} />}
      />
    </Routes>
  </Router>
)

}

export default App;
