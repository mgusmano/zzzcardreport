import React, { useState } from 'react';
import { AuthContext } from "./context/auth";
import PrivateRoute from './PrivateRoute';
//import { useLocation, Route, Switch, useHistory, Redirect } from 'react-router-dom';
import { Link , Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import CardReport from './CardReport';

var PartnerCNA = {
  PartnerID: 395,
  PartnerShort: 'CNA',
  PartnerName: 'CNA',
  PersonID: 275399,
  GroupID: 33582,
  showratings: false,
  ratingsources: '4', //ManagerRating
  SMEOnly: true,
  showlob: false,
  reportName: 'Risk Control Skills Report',
  image: './images/CNA.png'
}

var PartnerGMIsb = {
  PartnerID: 434,
  PartnerShort: 'GMIsb',
  PartnerName: 'General Mills',
  PersonID: 281326,
  GroupID: 33931,
  showratings: true,
  ratingsources: '1000', //SelfRating
  SMEOnly: false,
  showlob: false,
  reportName: 'Card Report',
  image: './images/GMI.png'
}
var PartnerCBET = {
  PartnerID: 409,
  PartnerShort: 'CBET',
  PartnerName: 'College of Biomedical Equipment Technology',
  PersonID: 284348,
  GroupID: 33660,
  showratings: true,
  ratingsources: '1000', //SelfRating
  SMEOnly: false,
  showlob: false,
  reportName: 'Card Report',
  image: './images/BIO.png'
}


function App() {
  const [authTokens, setAuthTokens] = useState('');

  //const history = useHistory();

  const setTokens = (data) => {
    localStorage.setItem("tokens", JSON.stringify(data));
    setAuthTokens(data);
  }

  return (
    <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
      <div
        style={{flex:'1',
        border:'0px solid green',
        background:'whitesmoke',
        overflow:'hidden',
        width: '100%',
        height: '100%',
      }}>
        <Routes>
          <Route path="/" element={<Login replace to="/login" />} />
          <Route path="/login" element={<Login />} />
          {/* <Route exact path="/"><Redirect to="/login" /></Route> */}
          <Route path="/login" default component={Login} />
          <Route path="/cardcna" element={<CardReport Partner={PartnerCNA}/>} />
          <Route path="/cardgmi" element={<CardReport Partner={PartnerGMIsb}/>} />
          <Route path="/cardcbet" element={<CardReport Partner={PartnerCBET}/>} />
        </Routes>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
