import React, { useState, useEffect, useCallback } from 'react';
import axios from "axios";
//import './CardWidget.css'
import Card from'./Card'

const CardWidget = (props) => {
  const { Partner } = props
  const { PersonID, GroupID } = Partner;
  const [waiting, setWaiting] = useState(false)
  const [users, setUsers] = useState(null)

  //const cardRef = useRef(null);

  const SendIt = (type, payload) => {
    window.dispatchEvent(new CustomEvent('mjg',{detail:{type:type,payload:payload}}));
  }
  
  async function doData2(filters) {
    setWaiting(true)
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
        auth: {username: 'skillnet',password: 'demo'}
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
        setUsers([])
        //console.log('fromcardfilters')
        //console.log(payload.filters)
        doData2(payload.filters)
        break;
      case 'fromcardfilteredusers': //old one
        setWaiting(true)
        var toShow = []
        if (props.SMEOnly === true) {
          payload.users.map(user => {
            if (user.Leader === '' && user.SME === '') {
            }
            else {
              toShow.push(user)
            }
            return null
          })
          setUsers(toShow)
        }
        else {
          setUsers(payload.users)
        }
        //setWaiting(false)
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

  //    <div ref={cardRef} style={{display:'flex',flex:props.flex,flexWrap:'wrap',flexDirection:'row',overflow:'auto',alignContent:'flex-start'}} xstyle={{flex:'auto',flexWrap:'wrap',flexDirection:'row',justifyContent:'space-between',display:'flex',overflow:'auto'}}>

  return (
    <div style={{display:'flex',flex:props.flex,flexWrap:'wrap',flexDirection:'row',overflow:'auto',alignContent:'flex-start'}}>
      {waiting === true && <div style={{padding:'30px',fontSize:'48px'}}>Loading...</div>}
      {users !== null && 
        users.map((user, index) => {
          return <Card key={index} user={user} Partner={props.Partner} SMEOnly={props.SMEOnly}/>
        }) 
      }
    </div>
  )

}

export default CardWidget
