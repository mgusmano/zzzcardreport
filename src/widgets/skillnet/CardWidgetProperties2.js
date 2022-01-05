import React, { useState, useEffect } from 'react';
import axios from "axios";
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Chip from '@mui/material/Chip';

const DropDown = (props) => {
  const { attributeid, attributename, onChanged, options, name, multiple} = props;

  return (
    <Autocomplete
      style={{width:'100%',marginTop:'20px'}}
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
      multiple
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

// const DropDown2 = (props) => {
//   const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
//   const checkedIcon = <CheckBoxIcon fontSize="small" />;
//   const { who, onChanged, options, name, multiple} = props;
//   console.log(props)
//   console.log(options)
//   var c = -1

//   return (
//     <Autocomplete
//       //ref={refSegments}
//       id="tags-outlined"
//       //name={who}
//       //onChange={onChanged}
//       //style={{width:'100%',marginTop:'20px'}}
//       multiple
//       //disableCloseOnSelect={true}
//       //options={options}
//       options={options.map((option) => option.value)}
//       //defaultValue={[]}
//       defaultValue={[options[0].value]}
//       //autoSelect={true}
//       //getOptionLabel={options => typeof options === 'string' ? options : options[name]}
//       //getOptionLabel={options => typeof options === 'string' ? options : options[name]}

//       //getOptionLabel={(option) => option.value}

//       renderTags={(value, getTagProps) => {

//        // console.log(getTagProps)
//         console.log(value)
//         value.map((option, index) => {
//           console.log(option)
//           return (<div>hi</div>)

//           //return (<Chip variant="outlined" label={'option.value'} {...getTagProps({ index })} />)
//         })
//       }}


//       // renderOption={multiple === true ?
//       //   (options, { selected }) => (
//       //     <div key={options[name]}>
//       //     {console.log(options)}
//       //     {console.log(options.key)}
//       //       <Checkbox
            
//       //         icon={icon}
//       //         name={who}
//       //         checkedIcon={checkedIcon}
//       //         style={{ marginRight: 8 }}
//       //         checked={selected}
//       //       />
//       //       {options.key}
//       //     </div>
//       //   ) : undefined}

//         // options.map((option,i)=>{
//         //   console.log(option.value)

//         //   return (
//         //       <Checkbox
//         //         icon={icon}
//         //         name={who}
 
//         //       />
//         //   )

//         // })




//         // (options, { selected }) => {
//         //   console.log(options)
//         //   console.log(selected)
//         //   //console.log(options[name])
//         //   //console.log(who)
//         //   c++
//         //   console.log(options)
//         //   //console.log(options[c])
//         //   //console.log(options.key)
//         //   return (
//         //     <div key={options.key}>
//         //       <Checkbox
//         //         icon={icon}
//         //         name={who}
//         //         checkedIcon={checkedIcon}
//         //         style={{ marginRight: 8 }}
//         //         checked={selected}
                
//         //       />
//         //       {options.key}
//         //     </div>
//         //   )
//         // } 
//         // : undefined}
//       renderInput={(params) => { 
//         var t = 'Select from the ' + who + ' list'
//         console.log(params)
//         return (
//         <TextField
//           {...params}
//           //variant="filled"
//           label={who}
//           //placeholder={t}
//         />
//       )}}
//     />
//   )
// }

const CardWidgetProperties2 = (props) => {
  const { Partner } = props
  const { PartnerID, PartnerName, PersonID, GroupID } = Partner;
  const [dropdowns, setDropdowns] = useState(null);
  const [filters, setFilters] = useState([]);
  const [numberofusersdisplayed, setNumberofusersdisplayed] = useState(null)
  const [buttonlabel, setButtonLabel] = useState('Loading...')


  useEffect(() => {
    async function doData() {
      try {
        const resp = await axios.get('https://skillnetusersapi.azurewebsites.net//api/customattributes?partnerid=' + PartnerID);
        var d = []
        var attributes = resp.data
        //console.log(attributes)
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

  const SendIt = (type, payload) => {
    window.dispatchEvent(new CustomEvent('mjg',{detail:{type:type,payload:payload}}));
  }

  const onApplyClick = (event) => {
    if (buttonlabel === 'No Filters Selected') {return}

    SendIt('fromcardwaiting', {})

    console.log('filters to send')
    console.log(filters)
    setButtonLabel('Apply All Filters')
    //return


    //var url = 'https://skillnetusersapi.azurewebsites.net/api/cardreportusers?' +
    // 'personid=' + PersonID + '&' +
    // 'groupid=' + GroupID + '&' +
    // 'lobids=' + lobidsstring + '&' +
    // 'leaderids=' + leaderidsstring + '&' +
    // 'smeids=' + smeidsstring  + '&' +
    // 'ratingsources=' + ratingsourcesstring + '&' +
    // 'segmentids=' + segmentidsstring  + '&' +
    // 'functionids=' + functionidsstring  + '&' +
    // 'subfunctionids=' + subfunctionidsstring  + '&' +
    // 'jobids=' + jobidsstring  + '&' +
    // 'partnerlocationids=' + locationidsstring + '&' +
    // 'managerids=' + manageridsstring + '&' +
    // 'percentages=' + percentidsstring + '&' +
    // 'skillids=' + skillidsstring

    // axios
    // .get(url, {
    //   auth: {username: 'skillnet',password: 'demo'}
    // })
    // .then((response) => {
    //   //console.log('filtered users', response)
    //   setNumberofusersdisplayed(response.data.length)
    //   //console.log('dummy data here')
    //   //console.log(response.data)
    //   SendIt('fromcardfilteredusers', {users: response.data})
    //   setButtonLabel('Apply All Filters')
    // })
    // .catch((error) => {
    //   console.log(error)
    // })

    var blankString = ''
    var blankString = ''
    var url = 'https://skillnetusersapi.azurewebsites.net/api/CardReportUsersNew?' +
    'personid=' + PersonID + '&' +
    'groupid=' + GroupID + '&' +
    'jobids=' + blankString  + '&' +
    'percentages=' + blankString + '&' +
    'skillids=' + blankString

    console.log('url',url)

    axios({
      method: 'post',
      url: url,
      data: filters,
      headers: {auth: {username: 'skillnet',password: 'demo'}}
      })
    .then((response) => {
      console.log('filtered users', response)
      setNumberofusersdisplayed(response.data.length)
      //console.log('dummy data here')
      //console.log(response.data)
      SendIt('fromcardfilteredusers', {users: response.data})
      setButtonLabel('Apply All Filters')
    })
    .catch((error) => {
      console.log(error)
    })
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

      {numberofusersdisplayed !== null &&
        <div style={{marginTop:'40px'}}>Number of Users Displayed: {numberofusersdisplayed}</div>
      }

      <div style={{display:'flex',flexDirection:'column'}}>
        {dropdowns && dropdowns}
      </div>

    </div>
  )
}

export default CardWidgetProperties2
