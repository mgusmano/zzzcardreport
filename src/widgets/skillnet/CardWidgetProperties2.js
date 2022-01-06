import React, { useState, useEffect } from 'react';
import axios from "axios";
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';

const DropDown = (props) => {
  const { attributeid, attributename, onChanged, options, name, multiple} = props;
  return (
    <Autocomplete
      style={{width:'100%',marginTop:'20px'}}
      multiple
      onChange={(event,checked,reason)=>{
        var currentFilters = {
          attributeid,
          attributename,
          values: []
        }
        for (let i = 0; i < checked.length; i++) {
          var objIndex = options.findIndex((obj => obj[name] === checked[i]));
          currentFilters.values.push(options[objIndex])
        }
        onChanged(event,checked,reason,currentFilters)
      }}

      id="tags-filled"
      options={options.map((option) => option.value)}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip variant="outlined" label={option} {...getTagProps({ index })} />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          label={attributename}
          placeholder=""
        />
      )}
    />
  )
}

const CardWidgetProperties2 = (props) => {
  const { Partner } = props
  const { PartnerID } = Partner;
  const [dropdowns, setDropdowns] = useState(null);
  const [filters, setFilters] = useState([]);
  const [numberofusersdisplayed, setNumberofusersdisplayed] = useState(null)
  const [buttonlabel, setButtonLabel] = useState('Loading...')

  const SendIt = (type, payload) => {
    window.dispatchEvent(new CustomEvent('mjg',{detail:{type:type,payload:payload}}));
  }

  const onMessage = (e) => {
    if (!e.detail) {return}
    var type = e.detail.type
    var payload = e.detail.payload
    switch (type) {
      case 'fromcardwidget':
        setNumberofusersdisplayed(payload.number)
        setButtonLabel('Apply All Filters')
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    window.addEventListener('mjg', onMessage);
    return function cleanup() {
      window.removeEventListener('mjg', onMessage);
    };
  }, [])

  useEffect(() => {
    async function doData() {
      try {
        const resp = await axios.get('https://skillnetusersapi.azurewebsites.net//api/customattributes?partnerid=' + PartnerID);
        var d = []
        var attributes = resp.data
        for (let i = 0; i < attributes.length; i++) {
          var attributename = attributes[i].CustomAttributeName
          var attributeid = attributes[i].CustomAttributeID
          var CustomAttributeValues = attributes[i].clsCustomAttributeValues
          var values = []
          for (let j = 0; j < CustomAttributeValues.length; j++) {
            var id = CustomAttributeValues[j].CustomAttributeValueID
            var value = CustomAttributeValues[j].CustomAttributeValue
            values.push({id:id,value:value,attributeid:attributeid,attributename:attributename})
          }
          d.push(<DropDown multiple={true} key={i} name='value' attributeid={attributeid} attributename={attributename} who={attributename} options={values} onChanged={(event,checked,reason,currentFilters) => {
            filterChanged(currentFilters)
          }}/>)
        }
        setDropdowns(d)
        onApplyClick()
      } catch (err) {
        console.error(err);
      }
    }
    doData()
  }, [PartnerID]);

  const filterChanged = (currentFilters) => {
    var objIndex = filters.findIndex((obj => obj.attributeid === currentFilters.attributeid));
    if (objIndex !== -1) { //found it
      console.log(currentFilters.values.length)
      if (currentFilters.values.length !== 0) {
        filters[objIndex] = currentFilters;  //replace
      }
      else {
        filters.splice(objIndex, 1); //remove
      }
    }
    else { //did not find it
      //console.log(currentFilters.values.length)
      if (currentFilters.values.length !== 0) {
        filters.push(currentFilters); //add
      }
      else {
        //do nothing
      }
    }
    setFilters(filters)
    console.log(JSON.stringify(filters,null,2))
    setButtonLabel('Click to Apply All Filters')
  };

  const onApplyClick = (event) => {
    if (buttonlabel === 'No Filters Selected') {return}
    //console.log('filters to send')
    //console.log(filters)
    SendIt('fromcardfilters', {filters: filters})
  };

  return (
    <div style={{width:'100%',padding:'10px'}}>
      <Button
        // ref={refApplyButton}
        style={{width:'100%'}}
        variant="contained"
        onClick={onApplyClick}
      >
        {buttonlabel}
      </Button>

      <div style={{marginTop:'40px',height:'20px'}}>
        {numberofusersdisplayed !== null &&
          <div>Number of Users Displayed: {numberofusersdisplayed}</div>
        }  
      </div>

      <div style={{display:'flex',flexDirection:'column'}}>
        {dropdowns && dropdowns}
      </div>

    </div>
  )
}

export default CardWidgetProperties2
