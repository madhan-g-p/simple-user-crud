// import logo from './logo.svg';
import './App.css';
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './pages/Login';
import SignUp from './pages/Signup';
import Dashboard from './pages/Dashboard';
import { AuthContext } from './AuthStore/store';
import { Fragment, useContext } from 'react';
import VerifyAuth from './pages/VerifyAuth';

function App() {

  const {  token } = useContext(AuthContext);

  return (
    <div className="App">
      <HashRouter>
        <Routes>
          {/*These routes shall be shown only when user is not logged in*/}
          {!token &&
            <Fragment>
              <Route index path='/login' element={<Login />} />
              <Route path='/signup' element={<SignUp />} />
            </Fragment>
          }

          {/* protected routes */}
          <Route element={<VerifyAuth />}>
            <Route path='dashboard' element={<Dashboard />} />
          </Route>
          
          <Route path='*' element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
