import React, { useState } from 'react'
import jwt_decode from "jwt-decode";
import { useHistory } from 'react-router-dom';


export default function Login({ setUser, user, blah }) {
    const url = 'http://localhost:1000/users/login'
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState("")
    const history = useHistory();

    //might not need try and catch ask chamoy
    const handleSubmit = async e => {
        e.preventDefault();
        try {
            let res = await fetch(url, {
                method: 'POST',
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ username, password })
            })
            let data = await res.json()
            if (data.token) {
                const { username } = jwt_decode(data.token)
                setUser({ isLooggedIn: true, username })
                localStorage.token = data.token
                history.push("/homepage")
            } else {
                setErrorMsg(data.msg)
            }
        } catch (error) {
        }
    }
    return (
        <div className="form_container" >
            <h1>{user.username}</h1>
            <form onSubmit={handleSubmit} className="form">
                <label className={errorMsg ? 'error form_error' : ''}>
                    Username:
                <input type="text" name="Username" placeholder="Username" onChange={e => setUsername(e.target.value)} />
                </label>
                <label className={errorMsg ? 'error form_error' : ''}>
                    Password:
                <input type="password" name="Password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                </label>
                <div className={errorMsg ? 'error form_error' : ''}>{errorMsg}</div>
                <input disabled={username.length === 0 || password.length === 0} className="primary-btn btn" type="submit" value="Submit" />
            </form>
        </div>
    )
}
