import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import './App.css';
import Login from './component/login/Login';
import Main from './component/Main';
import TitleBar from './component/titleBarArea/TitleBar';

function App() {

  const [isLogin, setLogin] = useState<boolean>(false)

  return (
    <div className="App">
      <TitleBar />
      {!isLogin ? <Login setLogin={setLogin}></Login> : <Main></Main>}
    </div>
  );
}

export default App;
