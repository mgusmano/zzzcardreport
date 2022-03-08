import React, { useState, useEffect } from 'react';
import axios from "axios";
import Button from '@mui/material/Button';
import CheckboxWidget from './CheckboxWidget'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { Partner395Attributes } from './CardReport395';
import { DropDown } from './DropDown'

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

        // //for testing
        // var nodes = [
        //   {
        //     "value": 43533,
        //     "label": "Core EB",
        //     "children": [
        //       {
        //         "value": 43534,
        //         "label": "Boiler"
        //       },
        //       {
        //         "value": 43535,
        //         "label": "Emergency Generator"
        //       },
        //       {
        //         "value": 43536,
        //         "label": "Electrical Distribution Systems"
        //       }
        //     ]
        //   }
        // ]
        // setSkills(nodes)
        // return

        var url = 'https://skillnetusersapi.azurewebsites.net/api/PortalSkills?partnerid=' + PartnerID
        //console.log(url)
        const response = await axios.get(url);
        //console.log(response.data)
        //setSkills(response.data)
        var d = JSON.parse(response.data)
        var uniqueD = d.filter((value, index, self) =>
          index === self.findIndex((t) => (
            t.value === value.value
          ))
        )
        //console.log(uniqueD)
        setSkills(uniqueD)
        setButtonLabel('No Filters Selected')
      } catch (err) {
        console.error(err);
      }
    }

    if (showskills === true) {
      doDataSkills()
      setPropertyWidth('550px')
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
              //values.push({id:id,value:value,attributeid:attributeid,attributename:attributename})
              values.push({id:id,value:value})
            }
            // console.log(attributeid)
            // console.log(attributename)
            // console.log(JSON.stringify(values,null,2))
            d.push(<DropDown key={i} id={attributeid} name={attributename} options={values}
              onChanged={(event,checked,reason,currentFilters) => {filterChanged(currentFilters)}}
            />)
            // d.push(<DropDown multiple={true} key={i} name='value' attributeid={attributeid} attributename={attributename} who={attributename} options={values} onChanged={(event,checked,reason,currentFilters) => {
            //   filterChanged(currentFilters)
            // }}/>)
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

  const filterSkillsChanged = ({checked,item}) => {
    // console.log('filterSkillsChanged')
    // console.log(item)
    // console.log(checked)
    // console.log(JSON.stringify(filters,null,2))
    try {
      //console.log(checked.length)
      setSkillsChecked(checked.length)
      var skillsAttributeID = '444'
      var skillsAttributeName = 'Skills'
      var objIndex = filters.findIndex((obj => obj.attributeid === skillsAttributeID));   
      if (objIndex !== -1) { //found it
        //console.log(JSON.stringify(filters[objIndex].values,null,2))
        if (filters[objIndex].values.length > checked.length) {
          //console.log('deleted',filters[objIndex].values.length-checked.length)
          //console.log(filters[objIndex].values)
          //console.log(checked)
          for (let f = 0; f < filters[objIndex].values.length; f++) {
            if (!checked.includes(filters[objIndex].values[f].id)) {
              filters[objIndex].values.splice(f, 1)
            }
          }
          if (filters[objIndex].values.length === 0) {
            filters.splice(objIndex, 1);
          }
        }
        else {
          for (let i = 0; i < checked.length; i++) {
            var valuesIndex = filters[objIndex].values.findIndex((obj => obj.id === checked[i]));
            if (valuesIndex === -1) {
              var v = {
                id: checked[i],
                value: item.label,
              }
              filters[objIndex].values.push(v)
            }
          }
          if (checked.length === 0) {
            filters.splice(objIndex, 1);
          }
        }
      }
      else {
        var skillAttribute = {
          attributeid: skillsAttributeID,
          attributename: skillsAttributeName,
          values: []
        }
        for (let i = 0; i < checked.length; i++) {
          var v2 = {
            id: checked[i],
            value: item.label,
          }
          skillAttribute.values.push(v2)
        }
        filters.push(skillAttribute)     
      }
      setFilters(filters)
      console.log(JSON.stringify(filters,null,2))
      if (filters.length === 0) {
        setButtonLabel('Click to apply No Filters')
      }
      else {
        setButtonLabel('Click to Apply All Filters')
      }
    }
    catch(e) {
      console.log(e)
    }
  }

  const filterChanged = (currentFilters) => {
    console.log(JSON.stringify(currentFilters,null,2))
    //console.log(JSON.stringify(filters,null,2))
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
    console.log('onApplyClick')
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
      {/* {showskills === true && 
      <button onClick={onFilterButtonClick} style={{margin:'10px 0 0 0'}}>{filterbuttontext}</button>
      } */}
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
            <CheckboxWidget nodes={skills} Partner={Partner} onCheck={(o) => filterSkillsChanged(o)}/>
          </div>
          </>      
        }
      </div>
    </div>
  )
}

export default CardReportProperties
