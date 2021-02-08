import React from 'react'

export default function NavBar({ username }) {
    return (
        <div className="navBar">
           <h3>{'Hello ' +username}</h3>
            <button className='primary-btn btn'>Logout</button>
        </div>
    )
}
