import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from "axios";
import './CardWidget.css'
import Card from'./Card'

const CardWidget = (props) => {
  const cardRef = useRef(null);
  const [users, setUsers] = useState(null)
  const [waiting, setWaiting] = useState(false)
  const { Partner } = props
  const { PartnerID, PartnerName, PersonID, GroupID, SMEOnly, showlob, showskills } = Partner;

  const SendIt = (type, payload) => {
    window.dispatchEvent(new CustomEvent('mjg',{detail:{type:type,payload:payload}}));
  }
  
  async function doData2(filters) {
    try {
      var blankString = ''
      var url = 'https://skillnetusersapi.azurewebsites.net/api/CardReportUsersNew?' +
      'personid=' + PersonID + '&' +
      'groupid=' + GroupID + '&' +
      'jobids=' + blankString  + '&' +
      'percentages=' + blankString + '&' +
      'skillids=' + blankString
      var axiosParams = {
        method: 'post',
        url: url,
        headers: {auth: {username: 'skillnet',password: 'demo'}}
      }
      if (filters.length !== 0) {
        axiosParams.data = filters
      }
      const response = await axios(axiosParams)
      console.log('filtered users', response)
      setUsers(response.data)
      SendIt('fromcardwidget', {number: response.data.length})
      setWaiting(false)
    } catch (err) {
      console.error(err);
    }
  }

  const onMessage = useCallback((e) => {
    if (!e.detail) {return}
    var type = e.detail.type
    var payload = e.detail.payload
    switch (type) {
      case 'fromcardfilters':
        setWaiting(true)
        setUsers([])
        console.log('fromcardfilters')
        console.log(payload.filters)
        doData2(payload.filters)
        setTimeout(() => {setWaiting(false)}, 500);
        break;
      default:
        break;
    }
  }, [])

  useEffect(() => {
    window.addEventListener('mjg', onMessage);
    return function cleanup() {
      window.removeEventListener('mjg', onMessage);
    };
  }, [onMessage]);

  return (
    <div ref={cardRef} style={{display:'flex',flex:props.flex,flexWrap:'wrap',flexDirection:'row',overflow:'auto',alignContent:'flex-start'}} xstyle={{flex:'auto',flexWrap:'wrap',flexDirection:'row',justifyContent:'space-between',display:'flex',overflow:'auto'}}>
      {waiting === true && <div style={{padding:'30px',fontSize:'48px'}}>Loading...</div>}
      {users !== null &&
        users.map((user, index) => {
          return (
            <Card key={index} user={user} Partner={props.Partner} SMEOnly={props.SMEOnly}/>
          )
        })
      }
    </div>
  )

}

export default CardWidget
