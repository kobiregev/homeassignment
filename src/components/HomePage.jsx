import React, { useEffect, useState } from 'react'
import Select from 'react-select'

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
    // const [sort, setSort] = useState(options[0])
    // const [nextPage, setNextPage] = useState('')

    const getTenants = async (page = nextPage) => {
        let res = await fetch(url + `?page=${page || 1}&sort=${sort || 'showAll'}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': user.token
            }
        }, [tenants])
        let data = await res.json()
        if (res.status === 200) {
            setTenants(data);
            setPages({ currentPage: data.currentPage, totalPages: data.totalPages })
        }
    }
    useEffect(() => {
        getTenants()
        return () => {
            setTenants([]);
        }

    }, [])
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
    return (

        <div>
            {tenants && tenants?.tenants?.length > 0 ? <>
                <div className="search_container">
                    <input className='search' type='text' name="search" placeholder="Search.." />
                    <Select className='select' options={options} onChange={handleSelect} />
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
                                <tr className='tenats' key={tenant._id}>
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
                </div></> : <img className='loader' src={process.env.PUBLIC_URL + '/loading.gif'}/>  }
        </div>

    )
}
