import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import "./App.css";

function LoginOrRegisterForm({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [isLoginForm, setIsLoginForm] = useState(true);

  const toggleFormMode = () => {
    setIsLoginForm(!isLoginForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents page refresh
    console.log("Username:", username);
    console.log("Password:", password);


    const endpoint = isLoginForm
      ? "/api/login"
      : `/api/register?username=${username}&password=${password}`;

    const requestData = isLoginForm ? null : { username, password };
    const headers = isLoginForm ? null : { username: `${username}`, password: `${password}` };

    if (isLoginForm) {

      try{
        const response = await axios.post(`http://localhost:8080/api/login`,
          {
            username: username,
            password: password,
          },
          {withCredentials: true,});
          if(response.status === 200){
            setUser(username);
            navigate("/dashboard");
            console.log("Login Successful", response.data);
          }else{
            console.error("Login Failed",response.data);
          }
         
      }catch(error){
        console.error("Login Failed",error.response ? error.response.data : error.message);
      }

    } else {
      await axios.post(`http://localhost:8080${endpoint}`, requestData, { headers })
        .then((response) => {
          const apiResponse = response.data;
          if (apiResponse.success) {
            console.log("Registration successful!", apiResponse);
          } else {
            console.error("Registration Failed", apiResponse.message);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          console.error("Registration filed:", error.response ? error.response.data : error.message
          );
        });
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
