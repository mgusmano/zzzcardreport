import React, { useState, useEffect } from 'react';
import Marker from './Marker';
import GoogleMap from './GoogleMap';
import axios from "axios";

const MapWidget = (props) => {
  const { Partner } = props
  const { PartnerID } = Partner;
  const [filteredlocations, setFilteredlocations] = useState(null)
  const [currid, setCurrId] = useState(null)
  const [waiting, setWaiting] = useState(false)

//   const onChange2 = (filteredusers) => {


//     //console.log(filteredusers)
//     var thelocations = []
//     filteredusers.map(user => {
//       var userlocation = user.Location
//       //console.log(userlocation)
//       if (userlocation !== undefined)
//         if (userlocation !== '') {
//           thelocations.push(userlocation)
//       }
//       return null
//     })

//     function findObjectByKey(array, key, value) {
//       if (array == null) return null;
//       for (var i = 0; i < array.length; i++) {
//         if (array[i][key] === value) {
//           return array[i];
//         }
//       }
//       return null;
//     }

//     var hist = {};
//     thelocations.map( function (a) {
//       //console.log(a)
//       if (a in hist) hist[a] ++; else hist[a] = 1;
//       return null
//     } );
//     //console.log(hist);
//     //console.log(thelocations)

//     var finallocations = []
//     for (const [key, value] of Object.entries(hist)) {
//       //console.log(`${key}: ${value}`);
//       var result = findObjectByKey(originallocations, 'LocationName', key);
//       if (result !== null) {
//         result.num = value
//         //console.log(result)
//         finallocations.push(result)
//       }
//       else {
//         //finallocations.push([])  mjg
//       }
//     }

// //mjgmjg
// //console.log(finallocations)
// //console.log(finallocations.length)
//     for (var i = 0; i < finallocations.length; i++) {
//       const users = filteredusers.filter((user,i) => user.Location === finallocations[i].LocationName);
//       finallocations[i].users = users
//     }

//     //console.log('finallocations',finallocations)
//     setFilteredlocations(finallocations)
//   }

  async function doData2(filters) {
    try {
      var url = 'https://skillnetpartnerlocationsapi.azurewebsites.net/api/PartnerLocations?partnerid=' + PartnerID;
      const response = await axios.get(url, {auth: {username: 'skillnet',password: 'demo'}});
      var arrayLocations = response.data.map(item => {
        return {
          PartnerLocationID: item.PartnerLocationID,
          LocationName: item.LocationName,
          Latitude: item.Latitude,
          Longitude: item.Longitude
        }
      })
      console.log('locations',arrayLocations)
      setFilteredlocations(arrayLocations)
      setWaiting(false)

    } catch (err) {
      console.error(err);
    }
  }

  const onMessage = (e) => {
    if (!e.detail) {return}
    var type = e.detail.type
    var payload = e.detail.payload
    switch (type) {    
      case 'fromcardfilters':
        setWaiting(true)
        setFilteredlocations([])
        console.log('fromcardfilters')
        console.log(payload.filters)
        doData2(payload.filters)
        ////onChange2(payload.users)
        //setUsers(payload.users)
        setTimeout(() => {setWaiting(false)}, 500);
        //setWaiting(false)
        break;

      // case 'filteredusers':
      //   console.log('filteredusers - do something')
      //   //console.log(payload)
      //   onChange2(payload)
      //   break;


      // case 'fromcardfilteredusers':
      //   setUsers(payload.users)
      //   setWaiting(false)
      //   break;
      // default:
      //   break;

      // case 'fromcard':
      //   onChange(payload.filters)
      //   break;


      // case 'fromcardfilteredusers':
      //   //console.log('in map')
      //   //console.log(payload.users)
      //   ////onChange2(payload.users)
      //   //setUsers(payload.users)
      //   //setWaiting(false)
      //   break;



      default:
        break;
    }
  }

  useEffect(() => {
    setWaiting(true)
    doData2([])   
  }, [PartnerID]);

  useEffect(() => {
    window.addEventListener('mjg', onMessage);
    return function cleanup() {
      window.removeEventListener('mjg', onMessage);
    };
  }, [])


  // useEffect(() => {
  //   var url = 'https://skillnetpartnerlocationsapi.azurewebsites.net/api/PartnerLocations?partnerid=' + props.PartnerID;
  //   //console.log(url)
  //   axios
  //   .get(url, {auth: {username: 'skillnet',password: 'demo'}})
  //   .then((response) => {
  //     //console.log('useEffect')
  //     //console.log(response.data)
  //     var arrayLocations = response.data.map(item => {
  //       return {
  //         PartnerLocationID: item.PartnerLocationID,
  //         LocationName: item.LocationName,
  //         Latitude: item.Latitude,
  //         Longitude: item.Longitude
  //       }
  //     })
  //     //console.log('locations',arrayLocations)
  //     setFilteredlocations(arrayLocations)
  //   })

  //   window.addEventListener('mjg', onMessage);
  //   return function cleanup() {
  //     window.removeEventListener('mjg', onMessage);
  //   };

  // }, [props.PartnerID])

  const defaultProps = {
    center: {lat: 39.099728,lng: -94.578568},
    zoom: 4
  };

  const handleApiLoaded = (map, maps) => {
    //new maps.Marker({position: {lat: 30.267153,lng:-97.743057}, map, title: "Austin, TX",});
  };

  const _onBoundsChange = (center, zoom, bounds, marginBounds) => {
    //console.log('_onBoundsChange')

    // if (this.props.onBoundsChange) {
    //   this.props.onBoundsChange({center, zoom, bounds, marginBounds});
    // } else {
    //   this.props.onCenterChange(center);
    //   this.props.onZoomChange(zoom);
    // }
  }

  const _onChildClick = (key, childProps) => {
    console.log('_onChildClick')
    // const markerId = childProps.marker.get('id');
    // const index = this.props.markers.findIndex(m => m.get('id') === markerId);
    // if (this.props.onChildClick) {
    //   this.props.onChildClick(index);
    // }
  }

  const _onChildMouseEnter = (key, childProps) => {
    console.log('_onChildMouseEnter')
    console.log(childProps)
    setCurrId(childProps.id)
    // const markerId = childProps.marker.get('id');
    // console.log(markerId)
    // const index = this.props.markers.findIndex(m => m.get('id') === markerId);
    // if (this.props.onMarkerHover) {
    //   this.props.onMarkerHover(index);
    // }
  }

  const _onChildMouseLeave = (/* key, childProps */) => {
    //console.log('_onChildMouseLeave')
    setCurrId(0)
    // if (this.props.onMarkerHover) {
    //   this.props.onMarkerHover(-1);
    // }
  }

  // const _onBalloonCloseClick = () => {
  //   console.log('_onBalloonCloseClick')
  // }

  // const _distanceToMouse = () => {
  //   console.log('f')

  // }

  const K_MARGIN_TOP = 30;
  const K_MARGIN_RIGHT = 30;
  const K_MARGIN_BOTTOM = 30;
  const K_MARGIN_LEFT = 30;
  const K_HOVER_DISTANCE = 30;

  return (
    <div style={{display:'flex',flex:props.flex,flexWrap:'wrap',flexDirection:'row',overflow:'auto',alignContent:'flex-start'}}
    xstyle={{flex:'auto',flexWrap:'wrap',flexDirection:'row',justifyContent:'space-between',display:'flex',overflow:'auto'}}>
{waiting === true && <div style={{padding:'30px',fontSize:'48px'}}>Loading...</div>}

{waiting === false &&
      <GoogleMap
        onChange={_onBoundsChange}
        onChildClick={_onChildClick}
        onChildMouseEnter={_onChildMouseEnter}
        onChildMouseLeave={_onChildMouseLeave}
        margin={[K_MARGIN_TOP, K_MARGIN_RIGHT, K_MARGIN_BOTTOM, K_MARGIN_LEFT]}
        hoverDistance={K_HOVER_DISTANCE}
        // distanceToMouse={_distanceToMouse}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
      >
        {filteredlocations !== null &&
          filteredlocations.map((location, index) => {
            //console.log(index)
            return (
              <Marker
                num={location.num}
                key={index}
                show={location.PartnerLocationID === currid}
                id={location.PartnerLocationID}
                text={location.LocationName}
                lat={location.Latitude}
                lng={location.Longitude}
                users={location.users}
              />
            )
          })
        }
      </GoogleMap>
}
    </div>
  )
}

export default MapWidget



  // const onChange = (filterdata) => {
  //   setFilteredlocations(filterdata.filteredusers)
  //     //setFilteredlocations([])
  //   return


  //   console.log('MapWidget.onChange',payload)
  //   if (filterdata.filteredpositions.length === 0 &&
  //       filterdata.filteredskills.length === 0 &&
  //       filterdata.filteredlocations.length === 0 &&
  //       filterdata.filteredmanagers.length === 0 &&
  //       filterdata.filteredsubjectmatterexperts.length === 0) {
  //     setFilteredlocations(originallocations)
  //     //setFilteredlocations([])
  //   }
  //   else {

  //     console.log('filteredsers',filteredsers)



  //     var thelocations = []
  //     payload.filteredusers.map(user => {
  //       var userlocation = user.Location
  //       //console.log(userlocation)
  //       if (userlocation !== undefined)
  //         if (userlocation !== '') {
  //           thelocations.push(userlocation)
  //       }
  //       //return
  //     })
  //     //console.log(m)
  //     //console.log(thelocations)




  //     function findObjectByKey(array, key, value) {
  //       for (var i = 0; i < array.length; i++) {
  //         if (array[i][key] === value) {
  //           return array[i];
  //         }
  //       }
  //       return null;
  //     }

  //     var hist = {};
  //     thelocations.map( function (a) {
  //       //console.log(a)
  //       if (a in hist) hist[a] ++; else hist[a] = 1;
  //     } );
  //     //console.log(hist);
  //     //console.log(originallocations)

  //     var finallocations = []
  //     for (const [key, value] of Object.entries(hist)) {
  //       //console.log(`${key}: ${value}`);
  //       var result = findObjectByKey(originallocations, 'LocationName', key);
  //       if (result !== null) {
  //         result.num = value
  //         //console.log(result)
  //         finallocations.push(result)
  //       }
  //       else {
  //         finallocations.push([])
  //       }
  //     }

  //     //console.log('finallocations',finallocations)
  //     setFilteredlocations(finallocations)
  //   }

  // };