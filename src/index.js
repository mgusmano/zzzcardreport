import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from "react-router-dom";
import App from './App';

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
       <App />
    </HashRouter> 
  </React.StrictMode>,
  document.getElementById('root')
);
