import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import './App.css';
import Login from './component/Login';
import Main from './component/Main';

function App() {

  const [isLogin,setLogin] = useState<boolean>(false)

  return (
    <div className="App">
        {!isLogin ? <Login setLogin={setLogin}></Login> : <Main></Main>}
    </div>
  );
}

export default App;
