import React, { useState, useEffect } from 'react';
import CardReportCardWidget from './CardReportCardWidget';
import CardReportMapWidget from './CardReportMapWidget';
import CardReportProperties from'./CardReportProperties';
import { Partner395Customizations } from './CardReport395';

import Horizontal from '../layout/Horizontal';
import Vertical from '../layout/Vertical';
import Splitter from '../layout/Splitter';

import Tv from '@mui/icons-material/Tv';
import Map from '@mui/icons-material/Map';
import AllInclusive from '@mui/icons-material/AllInclusive';
import Menu from '@mui/icons-material/Menu';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import axios from "axios";

const CardReport = () => {
  //const { PartnerID, ReportID } = props;
  var PartnerID = null
  var ReportID = null
  var PersonID = null
  const [filterdisplay, setFilterDisplay] = useState('block')
  const [cardflex, setCardflex] = useState(1)
  const [mapflex, setMapflex] = useState(0)
  const [alignment, setAlignment] = React.useState('Card');
  const [error, setError] = useState(null)
  const [partner, setPartner] = useState(null)

  async function getPartner(PartnerID) {
    //setWaiting(true)
    try {
      var url = 'https://skillnetusersapi.azurewebsites.net/api/partners?partnerid='+ PartnerID
      var axiosParams = {
        method: 'get',
        url: url,
        auth: {username: 'skillnet',password: 'demo'}
      }
      //console.log(url)
      const response = await axios(axiosParams)
      if (typeof response.data !== 'object') {
        setError('Error: data returned is not an object')
      }
      else {
        var data = Partner395Customizations(ReportID, response.data)
        data.PersonID = PersonID
        setPartner(data)
      }
    } catch (err) {
      setError(err.toString())
    }
  }

  useEffect(() => {
    PartnerID = sessionStorage.getItem('PartnerID')
    ReportID = sessionStorage.getItem('ReportID')
    PersonID = sessionStorage.getItem('PersonID')
    getPartner(PartnerID)
  }, []);

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
    switch(newAlignment) {
      case 'Card':
        setCardflex(1)
        setMapflex(0)
        break;
      case 'Map':
        setCardflex(0)
        setMapflex(1)
        break;
      case 'Both':
        setCardflex(1)
        setMapflex(1)
        break;
      default:
        // code block
    }
  };

  const onToggleFilters = () => {
    console.log('onToggleFilters')
    if (filterdisplay === 'block') {
      setFilterDisplay('none')
    }
    else {
      setFilterDisplay('block')
    }
  };

  return (
    <>
    {error !== null && <div style={{margin:'20px 0 0 20px',fontSize:'24px'}}>{error}</div>}
    {partner !== null &&
    <Horizontal>

      {/* column 1 */}
      <Vertical style={{display:'flex',flexDirection:'column',flex:'1',overflow:'hidden'}}>

        <div style={{overflow:'hidden',height:'50px',display:'flex',justifyContent:'space-between',flexDirection:'row',background:'lightgray',color:'black',textAlign:'center',fontSize:'24px'}}>

          <div style={{padding:'5px 0 0 10px',fontSize:'12px'}}>
              {/* <img src={'../images/logo.png'} alt="SKILLNET" style={{width:'90px'}} /> */}
              <div 
                style={{margin:'10px 0 0 0',fontSize:'18px'}}>
                {partner.reportName} 
                {/* <span style={{margin:'0 0 0 10px',fontSize:'10px'}}>v</span> */}
              </div>
          </div>

          <div style={{padding:'5px 0 0 0',fontSize:'12px'}}>
            {/* <img src={partner.image} style={{height:'40px',color:'black'}} alt={partner.PartnerName} /> */}
          </div>

          <div>
            <ToggleButtonGroup
              style={{padding:'1px 0 0 0',border:'none',marginRight:'20px'}}
              size="small"
              exclusive
              onChange={handleAlignment}
            >
              <ToggleButton value="Card" style={{width:'100px'}}><Tv />&nbsp;Card</ToggleButton>
              <ToggleButton value="Map" style={{width:'100px'}}><Map />&nbsp;Map</ToggleButton>
              <ToggleButton value="Both" style={{width:'100px'}}><AllInclusive />&nbsp;Both</ToggleButton>
            </ToggleButtonGroup>

            <ToggleButtonGroup
              style={{padding:'5px',marginRight:'20px'}}
              size="small"
              value={alignment}
              exclusive
              onChange={handleAlignment}
            >
              <ToggleButton value="Close" cxolor="primary" style={{width:'100px'}} onClick={onToggleFilters}><Menu />&nbsp;Filters</ToggleButton>
            </ToggleButtonGroup>
          </div>

        </div>

        <CardReportCardWidget flex={cardflex} Partner={partner}/>
        <Splitter/>
        <CardReportMapWidget flex={mapflex} Partner={partner}/>

        <div style={{overflow:'hidden',height:'20px',display:'flex',xjustifyContent:'space-between',flexDirection:'row-reverse',background:'lightgray',color:'black',textAlign:'center',fontSize:'24px'}}>
          <div style={{margin:'5px 5px 0 0',fontSize:'10px'}}>
            v2022-03-08-b
          </div>
        </div>

      </Vertical>

      {/* column 2 */}
      <Splitter/>

      {/* column 3 */}
      <Vertical style={{display:filterdisplay}}>
        <CardReportProperties Partner={partner}/>
      </Vertical>

    </Horizontal>
    }
    </>
  )
}

export default CardReport
