import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from "react-router-dom";
import App from './App';
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
  showskills: true,
  reportName: 'Risk Control Skills Report',
  image: './images/CNA.png'
}

// import reactToWebComponent from 'react-to-webcomponent';
// const Index = () => (
//   <React.StrictMode>
//     <HashRouter>
//        <App />
//     </HashRouter> 
//   </React.StrictMode>
// );
// customElements.define('card-report', reactToWebComponent(Index, React, ReactDOM));

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
       {/* <App /> */}
       <CardReport Partner={PartnerCNA}/>
    </HashRouter> 
  </React.StrictMode>,
  document.getElementById('root')
);
