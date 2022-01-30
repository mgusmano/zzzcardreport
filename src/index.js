import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from "react-router-dom";
//import App from './App';
import CardReport from './CardReport';

// import reactToWebComponent from 'react-to-webcomponent';
// const Index = (props) =>{
//   var PartnerID= JSON.parse(sessionStorage.getItem('PartnerID')); 
//   return (
//     <React.StrictMode>
//       <HashRouter>
//       <CardReport PartnerID={PartnerID}/>
//       </HashRouter> 
//     </React.StrictMode>
//   )
// };
// customElements.define('card-report', reactToWebComponent(Index, React, ReactDOM));

var PartnerID = 395; //CNA
//var PartnerID = 409; //CBET
//var PartnerID = 434; //GMI
ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
       <CardReport PartnerID={PartnerID}/>
    </HashRouter> 
  </React.StrictMode>,
  document.getElementById('root')
);
