import './App.css';
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom'
import { useState } from 'react';
import Login from './components/Login';
import HomePage from './components/HomePage';
import NavBar from './components/NavBar';


function App() {
  const [user, setUser] = useState({ isLooggedIn: false });

  return (
    <Router>
      <div className="App">
        {user.isLooggedIn ? <NavBar user={user} setUser={setUser} /> : null}
        
        <Route path="/login" component={() => <Login user={user} setUser={setUser} />} />
        <Route path="/homepage" component={() => <HomePage user={user} />} />

        <Route exact path='/'>
          {!user.isLooggedIn ? <Redirect to="login" /> : null}
        </Route>
        <Route exact path='/homepage'>
          {!user.isLooggedIn ? <Redirect to="login" /> : null}
        </Route>
      </div>
    </Router>
  );
}

export default App;
