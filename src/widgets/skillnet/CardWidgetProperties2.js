import React, { useState, useEffect } from 'react';
import axios from "axios";
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import CheckboxWidget from './CheckboxWidget'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

const DropDown = (props) => {
  const { attributeid, attributename, onChanged, options, name, multiple} = props;
  //console.log(options)
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
        //console.log(checked.length)
        for (let i = 0; i < checked.length; i++) {
          //console.log(name)
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

const CardWidgetProperties2 = (props) => {
  const { Partner } = props
  const { PartnerID } = Partner;
  const [dropdowns, setDropdowns] = useState(null);
  const [skills, setSkills] = useState(null);
  const [filters, setFilters] = useState([]);
  const [numberofusersdisplayed, setNumberofusersdisplayed] = useState(null)
  const [buttonlabel, setButtonLabel] = useState('Loading...')
  const [checkboxdisplay, setCheckboxdisplay] = useState('none')
  const [checkboxtext, setCheckboxText] = useState('Show Skills')
  const [arrowclass, setArrowclass] = useState('css-qzbt6i-MuiButtonBase-root-MuiIconButton-root-MuiAutocomplete-popupIndicator')

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
    async function doDataSkills() {
      //console.log('doDataSkills')
      try {
        const response = await axios.get('https://skillnetusersapi.azurewebsites.net/api/PortalSkills?partnerid=' + PartnerID);
        //console.log(response.data)
        var d = JSON.parse(response.data)
        var uniqueD = d.filter((value, index, self) =>
          index === self.findIndex((t) => (
            t.value === value.value
          ))
        )
        //console.log(uniqueD)
        setSkills(uniqueD)
        //onApplyClick()
      } catch (err) {
        console.error(err);
      }
    }
    doDataSkills()
  }, []);

  useEffect(() => {
    async function doData() {
      try {
        const resp = await axios.get('https://skillnetusersapi.azurewebsites.net/api/customattributes?partnerid=' + PartnerID);
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
  }, []);

  const filterSkillsChanged = (checked,name,a,b,c,d) => {

    // console.log(checked)
    // console.log(a)
    // console.log(b)
    // console.log(c)
    // console.log(d)

    try {
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
        if (checked.length == 0) {
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
          var v = {
            id: checked[i],
            value: 'value',
            attributeid: '444',
            attributename: 'skills',
          }
          skillAttribute.values.push(v)
        }
        filters.push(skillAttribute)     
      }
  }
  catch(e) {
    console.log(e)
  }
    




    // var skillAttribute = {
    //   attributeid: '444',
    //   attributename: 'skills',
    //   values: []
    //     // {
    //     //   id: checked,
    //     //   value: 'value',
    //     //   attributeid: '444',
    //     //   attributename: 'skills',
    //     // }
      
    // }

    // for (let i = 0; i < checked.length; i++) {
    //   var v = {
    //     id: checked[i],
    //     value: 'value',
    //     attributeid: '444',
    //     attributename: 'skills',
    //   }
    //   skillAttribute.values.push(v)
    //   //console.log(name)
    //   //var objIndex = options.findIndex((obj => obj[name] === checked[i]));
    //   //currentFilters.values.push(options[objIndex])
    // }


    //filters.push(skillAttribute)
    //console.log(filters)
  }


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

  const changeIt = () => {
    //console.log('changeIt')
    //console.log(checkboxdisplay)
    if (checkboxdisplay === 'none') {
      setCheckboxdisplay('block')
      setCheckboxText('Hide Skills')
      setArrowclass(' MuiAutocomplete-popupIndicatorOpen css-113ntv0-MuiButtonBase-root-MuiIconButton-root-MuiAutocomplete-popupIndicator ')
    }
    else {
      setCheckboxdisplay('none')
      setCheckboxText('Show Skills')
      setArrowclass(' css-qzbt6i-MuiButtonBase-root-MuiIconButton-root-MuiAutocomplete-popupIndicator ')
    }
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
        {skills !== null && 
          <>
          <div style={{borderBottom:'1px solid black',margin:'20px 0 0 0',padding:'0 0 6px 0',width:'100%',display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
              <div style={{fontWeight:'100'}}>Skills</div>
              {checkboxtext === 'Show Skills' &&
              <ArrowDropDownIcon onClick={changeIt}/>
              }
              {checkboxtext === 'Hide Skills' &&
              <ArrowDropUpIcon onClick={changeIt}/>
              }
          </div>
          <div style={{margin:'10px 0 0 0',display:checkboxdisplay}}>
            <CheckboxWidget nodes={skills} Partner={Partner} onCheck={(checked,a,b,c,d) => filterSkillsChanged(checked,'skills',a,b,c,d)}/>
          </div>
          </>      
        }
        {dropdowns && dropdowns}
      </div>

    </div>
  )
}

export default CardWidgetProperties2



{/* <div className="MuiAutocomplete-root MuiAutocomplete-hasPopupIcon css-16awh2u-MuiAutocomplete-root" role="combobox" aria-expanded="false" style={{width:"100%",marginTop:"20px"}}>
<div className="MuiFormControl-root MuiFormControl-fullWidth MuiTextField-root css-wb57ya-MuiFormControl-root-MuiTextField-root">
  <label className="MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-standard MuiFormLabel-root MuiFormLabel-colorPrimary css-aqpgxn-MuiFormLabel-root-MuiInputLabel-root" data-shrink="false" id="mui-54-label" htmlFor="mui-54">
    Skills
  </label>
  <div className="MuiInput-root MuiInput-underline MuiInputBase-root MuiInputBase-colorPrimary MuiInputBase-fullWidth MuiInputBase-formControl MuiInputBase-adornedEnd MuiAutocomplete-inputRoot css-ghsjzk-MuiInputBase-root-MuiInput-root">
    <input aria-invalid="false" autoComplete="off" placeholder="" type="text" className="MuiInput-input MuiInputBase-input MuiInputBase-inputAdornedEnd MuiAutocomplete-input MuiAutocomplete-inputFocused css-1x51dt5-MuiInputBase-input-MuiInput-input" aria-autocomplete="list" autoCapitalize="none" spellCheck="false" id="mui-54"/>
    <div className="MuiAutocomplete-endAdornment css-1q60rmi-MuiAutocomplete-endAdornment">
      <button onClick={changeIt} className={`MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeMedium MuiAutocomplete-popupIndicator ${arrowclass}`} tabIndex="-1" type="button" aria-label="Open" title="Open">
        <svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ArrowDropDownIcon">
          <path d="M7 10l5 5 5-5z"></path>
        </svg>
        <span className="MuiTouchRipple-root css-8je8zh-MuiTouchRipple-root"></span>
      </button>
    </div>
  </div>
</div>
</div> */}