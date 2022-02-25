import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from "react-router-dom";
import CardReport from './cardreport/CardReport';
import reactToWebComponent from 'react-to-webcomponent';


// const Index = () => (<CardReport/>);
// customElements.define('card-report', reactToWebComponent(Index, React, ReactDOM));



//var PartnerID = 448; //Toshiba
var PartnerID = 395;   //CNA
//var PartnerID = 409; //CBET
//var PartnerID = 434; //GMI
//var PartnerID = 418; //pmdemo

var ReportID = 1; //Skills
//var ReportID = 2; //SME

const urlParams = new URLSearchParams(window.location.search);
for (const [key, value] of urlParams) {
    if (key === 'PartnerID') {
      PartnerID = value
    }
    if (key === 'ReportID') {
      ReportID = value
    }
}
sessionStorage.setItem('PartnerID',PartnerID);
sessionStorage.setItem('ReportID',ReportID);
ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
       <CardReport/>
    </HashRouter> 
  </React.StrictMode>,
  document.getElementById('root')
);
