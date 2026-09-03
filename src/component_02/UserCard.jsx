import React from 'react'

export default function UserCard({name , age}) {
  return (
    <div>
        <h2>Name : {name}</h2>
       <p>Age : {age}</p>
    </div> 
  )
}

export  function Person({firstName="Raju", lastname="K"}) {
  return (
    <div><h3>Name : {firstName} {lastname}</h3></div>
  )
}



