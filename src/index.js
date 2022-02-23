import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from "react-router-dom";
import CardReport from './cardreport/CardReport';

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

const urlParams = new URLSearchParams(window.location.search);
//448 Toshiba
var PartnerID = 395; //CNA
//var PartnerID = 409; //CBET
//var PartnerID = 434; //GMI
//var PartnerID = 418; //pmdemo

//var ReportID = 1; //SME
//var ReportID = 2; //Skills

const last = window.location.href.charAt(window.location.href.length - 1);
var ReportID = parseInt(last)

for (const [key, value] of urlParams) {
    if (key === 'PartnerID') {
      PartnerID = value
    }
}
//sessionStorage.setItem('PartnerID',PartnerID);
ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
       <CardReport PartnerID={PartnerID} ReportID={ReportID}/>
    </HashRouter> 
  </React.StrictMode>,
  document.getElementById('root')
);
