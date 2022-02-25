import React, { useState, useEffect } from 'react';
import axios from "axios";
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import CheckboxWidget from './CheckboxWidget'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { Partner395Attributes } from './CardReport395';

const DropDown = (props) => {
  const { attributeid, attributename, onChanged, options, name} = props;
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
      options={options.map((option) => option[name])}
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

const CardReportProperties = (props) => {
  const { Partner } = props
  const { PartnerID, ReportID, showskills } = Partner;
  const [dropdowns, setDropdowns] = useState(null);
  const [skills, setSkills] = useState(null);
  const [filters, setFilters] = useState([]);
  const [numberofusersdisplayed, setNumberofusersdisplayed] = useState(null)
  const [buttonlabel, setButtonLabel] = useState('Loading...')
  const [checkboxdisplay, setCheckboxdisplay] = useState('none')
  //const [checkboxtext, setCheckboxText] = useState('Show Skills')
  const [filterbuttontext, setFilterButtonText] = useState('Make Filter Panel Larger')
  const [propertywidth, setPropertyWidth] = useState('400px')
  const [skillschecked, setSkillsChecked] = useState(0)

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
    async function doDataSkills() {
      try {
        var url = 'https://skillnetusersapi.azurewebsites.net/api/PortalSkills?partnerid=' + PartnerID
        //console.log(url)
        const response = await axios.get(url);
        var d = JSON.parse(response.data)
        var uniqueD = d.filter((value, index, self) =>
          index === self.findIndex((t) => (
            t.value === value.value
          ))
        )
        setSkills(uniqueD)
        setButtonLabel('No Filters Selected')
      } catch (err) {
        console.error(err);
      }
    }

    if (showskills === true) {
      doDataSkills()
    }

  }, []);

  useEffect(() => {
    async function doData() {
      try {
        var url = 'https://skillnetusersapi.azurewebsites.net/api/customattributes?partnerid=' + PartnerID
        //console.log(url)
        const resp = await axios.get(url);
        var d = []
        var attributes = resp.data
        for (let i = 0; i < attributes.length; i++) {
          var attributename = attributes[i].CustomAttributeName
          attributes[i].active = Partner395Attributes(PartnerID, ReportID, attributename)
          if (attributes[i].active === true) {    
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
        }
        setDropdowns(d)
        onApplyClick()
        if (showskills !== true) {
          setButtonLabel('No Filters Selected')
        }
      } catch (err) {
        console.error(err);
      }
    }
    doData()
    //doData('orig')
  }, []);

  const filterSkillsChanged = (checked,name,a,b,c,d) => {
    try {
      console.log(checked.length)
      setSkillsChecked(checked.length)
      var skillsAttributeID = '444'
      var objIndex = filters.findIndex((obj => obj.attributeid === skillsAttributeID));
      if (objIndex !== -1) { //found it
        filters[objIndex].values = []
        for (let i = 0; i < checked.length; i++) {
          var v = {
            id: checked[i],
            value: 'value',
            attributeid: '444',
            attributename: 'skills',
          }
          filters[objIndex].values.push(v)
        }
        if (checked.length === 0) {
          filters.splice(objIndex, 1);
        }
      }
      else {
        var skillAttribute = {
          attributeid: '444',
          attributename: 'skills',
          values: []
        }
        for (let i = 0; i < checked.length; i++) {
          var v2 = {
            id: checked[i],
            value: 'value',
            attributeid: '444',
            attributename: 'skills',
          }
          skillAttribute.values.push(v2)
        }
        filters.push(skillAttribute)     
      }
    }
    catch(e) {
      console.log(e)
    }
  }

  const filterChanged = (currentFilters) => {
    console.log(JSON.stringify(currentFilters,null,2))
    console.log(JSON.stringify(filters,null,2))
    var objIndex = filters.findIndex((obj => obj.attributeid === currentFilters.attributeid));
    if (objIndex !== -1) { //found it
      if (currentFilters.values.length !== 0) {
        filters[objIndex] = currentFilters;  //replace
      }
      else {
        filters.splice(objIndex, 1); //remove
      }
    }
    else { //did not find it
      if (currentFilters.values.length !== 0) {
        filters.push(currentFilters); //add
      }
      else {
        //do nothing
      }
    }
    setFilters(filters)
    console.log(JSON.stringify(filters,null,2))
    if (filters.length === 0) {
      setButtonLabel('Click to apply No Filters')
    }
    else {
      setButtonLabel('Click to Apply All Filters')
    }
  };

  const onApplyClick = (event) => {
    if (buttonlabel === 'No Filters Selected') {return}
    //console.log('filters to send')
    //console.log(filters)
    SendIt('fromcardfilters', {filters: filters})
  };

  const onFilterButtonClick = (event) => {
    event.preventDefault()
    if (filterbuttontext === 'Make Filter Panel Larger') {
      setFilterButtonText('Make Filter Panel Smaller')
      setPropertyWidth('550px')
    }
    else {
      setFilterButtonText('Make Filter Panel Larger')
      setPropertyWidth('400px')
    }
  };

  const changeIt = () => {
    if (checkboxdisplay === 'none') {
      setCheckboxdisplay('block')
      //setCheckboxText('Hide Skills')
    }
    else {
      setCheckboxdisplay('none')
      //setCheckboxText('Show Skills')
    }
  };

  return (
    <div style={{width:propertywidth,padding:'10px'}}>
      <Button
        style={{width:'100%'}}
        variant="contained"
        onClick={onApplyClick}
      >
        {buttonlabel}
      </Button>
      {showskills === true && 
      <button onClick={onFilterButtonClick} style={{margin:'10px 0 0 0'}}>{filterbuttontext}</button>
      }
      <div style={{marginTop:'20px',height:'20px'}}>
        {numberofusersdisplayed !== null &&
        <div>Number of Users Displayed: {numberofusersdisplayed}</div>
        }  
      </div>
      <div style={{display:'flex',flexDirection:'column'}}>

        {dropdowns && dropdowns}

        {skills !== null && 
          <>
          <div style={{borderBottom:'1px solid black',margin:'40px 0 0 0',padding:'0 0 6px 0',width:'100%',display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
              <div style={{fontWeight:'100'}}>Skills ({skillschecked} selected)</div>
              {checkboxdisplay === 'none' &&
              <ArrowDropDownIcon onClick={changeIt}/>
              }
              {checkboxdisplay === 'block' &&
              <ArrowDropUpIcon onClick={changeIt}/>
              }
          </div>
          <div style={{margin:'10px 0 0 0',display:checkboxdisplay}}>
            <CheckboxWidget nodes={skills} Partner={Partner} onCheck={(checked,a,b,c,d) => filterSkillsChanged(checked,'skills',a,b,c,d)}/>
          </div>
          </>      
        }
      </div>
    </div>
  )
}

export default CardReportProperties
