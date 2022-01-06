import React, { useState } from 'react';
//import logoImg from './images/logo.png';

import CardWidget from './widgets/skillnet/CardWidget'
import MapWidget from './widgets/skillnet/MapWidget'
import Horizontal from './layout/Horizontal'
import Vertical from './layout/Vertical'
import Splitter from './layout/Splitter'
import CardWidgetProperties from'./widgets/skillnet/CardWidgetProperties'
import CardWidgetProperties2 from'./widgets/skillnet/CardWidgetProperties2'
import Tv from '@mui/icons-material/Tv';
import Map from '@mui/icons-material/Map';
import AllInclusive from '@mui/icons-material/AllInclusive';
import Menu from '@mui/icons-material/Menu';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const CardReport = (props) => {
  const { PartnerID, PartnerName, PersonID, SMEOnly, showlob, reportName, image } = props.Partner;
  //const [addWidgetOpen, setAddWidgetOpen] = useState(false);
  const [filterdisplay, setFilterDisplay] = useState('block')
  const [propertywidth] = useState('375px')
  const [cardflex, setCardflex] = useState(1)
  const [mapflex, setMapflex] = useState(0)
  const [alignment, setAlignment] = React.useState('Card');

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
    <Horizontal >
      {/* column 1 */}
      <Vertical style={{flex:'1',overflow:'hidden'}}>

        <div style={{overflow:'hidden',height:'75px',display:'flex',justifyContent:'space-between',flexDirection:'row',background:'lightgray',color:'black',textAlign:'center',fontSize:'24px'}}>

          <div style={{padding:'5px 0 0 20px',fontSize:'12px'}}>
              <img src={'../images/logo.png'} alt="SKILLNET" style={{width:'90px'}} />
              <span><i>{reportName}</i></span>
              <div style={{margin:'0 0 0 100px',width:'90px',fontSize:'10px'}}>v2022-01-06-d</div>
          </div>

          <div style={{padding:'5px 0 0 0',fontSize:'12px'}}>
            <img src={image} style={{marginTop:'10px',height:'50px',color:'black'}} alt={PartnerName} />
          </div>

          <div>
            <ToggleButtonGroup
              style={{padding:'15px 0 0 0',border:'none',marginRight:'20px'}}
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

        <CardWidget flex={cardflex} Partner={props.Partner} PartnerID={PartnerID} PartnerName={PartnerName} PersonID={PersonID} SMEOnly={SMEOnly}/>
        <Splitter/>
        <MapWidget flex={mapflex} Partner={props.Partner} PartnerID={PartnerID} PartnerName={PartnerName} PersonID={PersonID}/>

      </Vertical>
      <Splitter/>

      {/* column 2 */}
      {PartnerID !== 409 &&
      <Vertical style={{display:filterdisplay,width:propertywidth}}>
        <CardWidgetProperties propertywidth={propertywidth} Partner={props.Partner} PartnerID={PartnerID} PartnerName={PartnerName} PersonID={PersonID} SMEOnly={SMEOnly} showlob={showlob}/>
      </Vertical>
      }

      {/* column 2 */}
      {PartnerID === 409 &&
      <Vertical style={{display:filterdisplay,width:propertywidth}}>
        <CardWidgetProperties2 propertywidth={propertywidth} Partner={props.Partner} PartnerID={PartnerID} PartnerName={PartnerName} PersonID={PersonID} SMEOnly={SMEOnly} showlob={showlob}/>
      </Vertical>
      }

    </Horizontal>
  )
}

export default CardReport
