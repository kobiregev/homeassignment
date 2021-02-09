const url = 'http://localhost:1000/tenants/'
export const getTenants = async (currentPage = 1, sort = 'showAll', cbSuccess = () => { }, cbErr = () => { }) => {
    let res = await fetch(url + `?page=${currentPage}&sort=${sort}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        }
    })
    let data = await res.json()
    if (res.status === 200) {
        if (data.tenants.length > 0) {
            cbSuccess(data)
        } else {
            cbErr()
        }
    }
}
//check what to do on err
export const editTenant = async (tenantId, name, phoneNumber, address, debt, cbSuccess, cbErr = () => { }) => {
    let res = await fetch(url, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
        body: JSON.stringify({ tenantId, name, phoneNumber, address, debt })
    })
    let data = await res.json()
    if (res.status === 200) {
        cbSuccess(data)
    }
}