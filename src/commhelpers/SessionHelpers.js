export const preformLogout = async (username,cbSuccess) => {
    const url = 'http://localhost:1000/users/logout'
    let res = await fetch('http://localhost:1000/users/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username })
    })
    if (res.status === 200) {
        cbSuccess()
    }
}

export const performLogin = async (e, cbSuccess, cbErr, payload) => {
    const url = 'http://localhost:1000/users/login'
    e.preventDefault();
    try {
        let res = await fetch(url, {
            method: 'POST',
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ ...payload })
        })
        let data = await res.json()
        if (data.token) {
            cbSuccess(data.token)
        } else {
            cbErr(data)
        }
    } catch (error) {
        cbErr(error)
    }
}