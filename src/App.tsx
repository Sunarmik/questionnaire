import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import InvalidPage from "./pages/InvalidPage";

function App() {
  return (
    <div className="app">
      <Router>
        <Switch>
          <Route path="/">
            <Home />
          </Route>
          <Route path="*">
            <InvalidPage />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
