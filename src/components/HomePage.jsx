import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import Modal from './Modal';

let sort;
let nextPage;

export default function HomePage({ user }) {
    const url = 'http://localhost:1000/tenants/'

    const options = [
        { value: 'showAll', label: 'Show all' },
        { value: 'noDebt', label: 'Without debt' },
        { value: 'debt', label: 'With debt' },
    ];

    const [tenants, setTenants] = useState([])
    const [pages, setPages] = useState({})
    const [status, setStatus] = useState(false);
    const [modalMode, setModalMode] = useState('edit');
    const [searchName, setSearchName] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [addressList, setAddressList] = useState([{}]);

    // form state
    const [name, setName] = useState('');
    const [tenantId, setTenantId] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [debt, setDebt] = useState(0);


    const getTenants = async (page = nextPage) => {
        let res = await fetch(url + `?page=${page || 1}&sort=${sort || 'showAll'}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
        let data = await res.json()
        if (res.status === 200) {
            if (data.tenants.length > 0) {
                setTenants(data);
                setPages({ currentPage: data.currentPage, totalPages: data.totalPages })
            } else {
                setErrorMsg("No Result.")
                setTimeout(() => {
                    setErrorMsg('')
                }, 1500)
            }
        }
    }
    const handleSelect = e => {
        sort = (e.value)
        nextPage = 1
        getTenants()
    }
    
    const handlePagination = (e) => {
        let clonePages = { ...pages }
        nextPage = e.target.innerText === 'Next' ? clonePages.currentPage += 1 : clonePages.currentPage -= 1
        getTenants(clonePages.currentPage)
    }

    const handleModal = (mode = 'edit', tenant = '') => {
        setStatus(true)
        if (mode === 'edit') {
            setName(tenant.name)
            setTenantId(tenant._id)
            setPhoneNumber(tenant.phoneNumber)
            setAddress(tenant.address._id)
            setDebt(tenant.debt)
            setModalMode('edit')
        } else {
            setName('')
            setPhoneNumber('')
            setAddress('')
            setDebt('')
            setModalMode('newTenant')
        }
    }

    const handleSaveTenant = async () => {
        console.log(address)
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
            setStatus(false)
            setTenants(data);
            setPages({ currentPage: data.currentPage, totalPages: data.totalPages })
        }
    }
    const handleNameSearch = async () => {
        let res = await fetch(url + `namesearch/?name=${searchName}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            },
        })
        let data = await res.json()
        if (res.status === 200) {
            if (data.tenants.length > 0) {
                setTenants(data);
                setPages({ currentPage: data.currentPage, totalPages: data.totalPages })
            } else {
                setErrorMsg("No such Tenat.")
                setTimeout(() => {
                    setErrorMsg('')
                }, 1500)
            }
        }
    }
    const handleDeleteTenant = async () => {
        let res = await fetch(url, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            },
            body: JSON.stringify({ tenantId })
        })
        let data = await res.json()
        if (res.status === 200) {
            setTenants(data);
            setPages({ currentPage: data.currentPage, totalPages: data.totalPages })
            setStatus(false)
        }
    }
    //check it
    const handleCreateTenant = async () => {
        let res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            },
            body: JSON.stringify({ name, phoneNumber, address, debt })
        })
        let data = await res.json()
        if (res.status === 200) {
            setTenants(data);
            setPages({ currentPage: data.currentPage, totalPages: data.totalPages })
            setStatus(false)
        }
    }
    const getAddresses = async () => {
        let res = await fetch(url + 'addresses', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
        let data = await res.json()
        if (res.status === 200) {
            setAddressList(data.map(address => ({ value: address._id, label: address.address })))
        }
    }

    useEffect(() => {
        getTenants()
        getAddresses()
        return () => {
            setTenants([]);
        }

    }, [])
    return (
        <div>
            {tenants && tenants?.tenants?.length > 0 ? <>
                <div className="search_container">
                    <input className='search' type='text' name="search" placeholder="Search.." onChange={e => setSearchName(e.target.value)} />
                    <Select className='select' options={options} onChange={handleSelect} />
                    <div >
                        <button className="primary-btn btn filter_btn" onClick={handleNameSearch}>Search</button>
                        <button className="primary-btn btn filter_btn" onClick={() => handleModal('newTenant')}>Create New Tenant</button>
                    </div>
                </div>
                <span className="error">{errorMsg}</span>
                <div>
                    {status && (<Modal closeModal={() => setStatus(false)}>
                        <div className="modal_container">
                            Name:
                            <input className="input" defaultValue={name} type="text" name="Name" placeholder="Name" onChange={e => setName(e.target.value)} />
                                Phone Number:
                            <input className="input" defaultValue={phoneNumber} type="text" name="phoneNumber" placeholder="Phone Number" onChange={e => setPhoneNumber(e.target.value)} />
                                Address:
                            <Select options={addressList} onChange={e=>setAddress(e.value)} />
                                Debt:
                            <input className="input" defaultValue={debt} type="number" name="Debt" placeholder="Debt" min='0' onChange={e => setDebt(e.target.value)} />
                            <div className="modal_button_container">
                                {modalMode === 'edit' ?
                                    <>
                                        <button className="primary-btn btn" onClick={handleDeleteTenant}>Delete Tenant</button>
                                        <button className="primary-btn btn" onClick={handleSaveTenant}>Save</button>

                                    </> : <button disabled={name.length > 0 && phoneNumber.length > 0 && address && debt >= 0 ? false : true} className="primary-btn btn" onClick={handleCreateTenant}>Create Tenant</button>}
                            </div>
                        </div>
                    </Modal>)}
                </div>
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Phone Number</th>
                                <th>Address</th>
                                <th>Debt</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tenants?.tenants?.length > 0 && tenants.tenants.map(tenant =>
                                <tr onClick={() => handleModal('edit', tenant)} className='tenats' key={tenant._id}>
                                    <td>{tenant.name}</td>
                                    <td>{tenant.phoneNumber}</td>
                                    <td>{tenant.address.address}</td>
                                    <td>{tenant.debt}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className='footer'>
                    <button className='primary-btn btn footer_btn' onClick={handlePagination} disabled={pages.currentPage === 1}>Prev</button>
                    <span>{pages.currentPage}</span>
                    <button className='primary-btn btn footer_btn' onClick={handlePagination} disabled={pages.currentPage === pages.totalPages || tenants.tenants?.length === 0}>Next</button>
                </div></> : <img className='loader' src={process.env.PUBLIC_URL + '/loading.gif'} />
            }
        </div >

    )
}
