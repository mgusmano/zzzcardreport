import React, { useState, useEffect } from 'react';
import axios from "axios";
import Marker from './Marker';
import GoogleMap from './GoogleMap';

const MapWidget = (props) => {
  //console.log(props)
  // const { Partner } = props
  // const { PartnerID } = Partner;
  const { Partner } = props
  const { PartnerID, PersonID, GroupID } = Partner;
  //console.log(PartnerID)
  //console.log(Partner)
  const [waiting, setWaiting] = useState(false)
  const [filteredlocations, setFilteredlocations] = useState(null)
  const [currid, setCurrId] = useState(null)

  async function doData2(filters) {
    setWaiting(true)
    try {
      //var url = 'https://skillnetpartnerlocationsapi.azurewebsites.net/api/PartnerLocations?' + 
      //'partnerid=' + PartnerID;
      // var url = 'https://skillnetusersapi.azurewebsites.net/api/PartnerLocationsFiltered?' + 
      // 'partnerid=' + PartnerID;

      var blankString = ''
      var url = 'https://skillnetusersapi.azurewebsites.net/api/PartnerLocationsFiltered?' +
      'partnerid=' + PartnerID + '&' +
      'personid=' + PersonID + '&' +
      'groupid=' + GroupID + '&' +
      'jobids=' + blankString  + '&' +
      'percentages=' + blankString + '&' +
      'skillids=' + blankString
      console.log(url)
      var axiosParams = {
        method: 'post',
        url: url,
        auth: {username: 'skillnet',password: 'demo'},
        data: filters
      }
      // if (filters.length !== 0) {
      //   axiosParams.data = filters
      // }
      //console.log(axiosParams)
      const response = await axios(axiosParams)
      //console.log(response.data)
      var arrayLocations = response.data.map(item => {
        return {
          num: item.Users.length,
          PartnerLocationID: item.PartnerLocationID,
          LocationName: item.LocationName,
          Latitude: item.Latitude,
          Longitude: item.Longitude,
          Users: item.Users
        }
      })
      //console.log('locations',arrayLocations)
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
        setFilteredlocations([])
        //console.log('fromcardfilters')
        //console.log(payload.filters)
        doData2(payload.filters)
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    doData2([])   
  }, []);

  useEffect(() => {
    window.addEventListener('mjg', onMessage);
    return function cleanup() {
      window.removeEventListener('mjg', onMessage);
    };
  }, [onMessage])

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
    //console.log('_onChildMouseEnter')
    //console.log(childProps)
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
                users={location.Users}
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
