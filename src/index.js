import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from "react-router-dom";
import App from './App';
import CardReport from './CardReport';

var Partner = { //CNA
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
  image: './images/CNA.png',
  largerButton: false
}

// import reactToWebComponent from 'react-to-webcomponent';
// const Index = (props) =>{
//   var Partner = JSON.parse(sessionStorage.getItem('Partner')); 
//   return (
//     <React.StrictMode>
//       <HashRouter>
//       <CardReport Partner={Partner}/>
//       </HashRouter> 
//     </React.StrictMode>
//   )
// };
// customElements.define('card-report', reactToWebComponent(Index, React, ReactDOM));

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
       {/* <App /> */}
       <CardReport Partner={Partner}/>
    </HashRouter> 
  </React.StrictMode>,
  document.getElementById('root')
);
