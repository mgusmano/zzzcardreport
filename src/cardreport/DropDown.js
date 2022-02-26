import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';

export const DropDown = (props) => {
    const { id, name, onChanged, options} = props;
    return (
      <Autocomplete
        style={{width:'100%',marginTop:'20px'}}
        multiple
        onChange={(event,checked,reason)=>{
          var currentFilters = {
            attributeid: id,
            attributename: name,
            values: []
          }
          for (let i = 0; i < checked.length; i++) {
            var objIndex = options.findIndex((obj => obj['value'] === checked[i]));
            currentFilters.values.push(options[objIndex])
          }
          onChanged(event,checked,reason,currentFilters)
        }}
        id="tags-filled"
        options={options.map((option) => option['value'])}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip variant="outlined" label={option} {...getTagProps({ index })} />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label={name}
            placeholder=""
          />
        )}
      />
    )
}


// import React, { useState, useEffect } from 'react';
// import Autocomplete from '@mui/material/Autocomplete';
// import TextField from '@mui/material/TextField';
// import Chip from '@mui/material/Chip';

// export const DropDown = (props) => {
//     const { attributeid, attributename, onChanged, options, name} = props;
//     return (
//       <Autocomplete
//         style={{width:'100%',marginTop:'20px'}}
//         multiple
//         onChange={(event,checked,reason)=>{
//           var currentFilters = {
//             attributeid,
//             attributename,
//             values: []
//           }
//           for (let i = 0; i < checked.length; i++) {
//             var objIndex = options.findIndex((obj => obj[name] === checked[i]));
//             currentFilters.values.push(options[objIndex])
//           }
//           onChanged(event,checked,reason,currentFilters)
//         }}
//         id="tags-filled"
//         options={options.map((option) => option[name])}
//         renderTags={(value, getTagProps) =>
//           value.map((option, index) => (
//             <Chip variant="outlined" label={option} {...getTagProps({ index })} />
//           ))
//         }
//         renderInput={(params) => (
//           <TextField
//             {...params}
//             variant="standard"
//             label={attributename}
//             placeholder=""
//           />
//         )}
//       />
//     )
// }