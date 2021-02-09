import React, { useState } from 'react'
import jwt_decode from "jwt-decode";
import { useHistory } from 'react-router-dom';
import { performLogin } from '../commhelpers/SessionHelpers'


export default function Login({ setUser, user }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState("")
    const history = useHistory();

    const handleSubmit = (e) => {
        const onLoginSuccess = (token) => {
            const { username } = jwt_decode(token)
            setUser({ isLooggedIn: true, username })
            localStorage.token = token
            history.push("/homepage")
        }
        const onLoginFail = (data) => {
            setErrorMsg(data.msg)
        }
        performLogin(e, onLoginSuccess, onLoginFail, {username, password})
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
