import React, { useState } from 'react'
import Modal from './Modal'

export default function NavBar({ user, setUser }) {
    const [status, setStatus] = useState(false);

    const handleLogOut = async () => {
        setStatus(true)
        let res = await fetch('http://localhost:1000/users/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: user.username })
        })

        if (res.status === 200) {
            setTimeout(() => {
                setStatus(false)
                localStorage.removeItem('token')
                setUser({ isLoggedIn: false })

            }, 2000)
        }
    }
    return (
        <div className="navBar">
            <h3>{'Hello ' + user.username}</h3>
            <button onClick={handleLogOut} className='primary-btn btn'>Logout</button>
            { status && (<Modal closeModal={() => setStatus(false)}> <div style={{ color: 'black' }}>Logging Out...</div></Modal>)}
        </div>
    )
}
