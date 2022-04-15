import React, { useEffect, useState } from 'react';

import { Link, Outlet, useParams } from 'react-router-dom';
import { Input, Table } from 'antd';
import { gql, useLazyQuery, useQuery } from '@apollo/client';

import SpinnerComponent from '../../components/SpinnerComponent';

import './assets/styles.css';

const LIST_COUNTRIES = gql`
    query {
        countries {
            code
            name
            native
            phone
            continent {
                code
                name
            }
            capital
            currency
            languages {
                code
                name
                native
                rtl
            }
            emoji
            emojiU
            states {
                code
                name
            }
        }
    }
`;

const SEARCH_COUNTRY = gql`
    query ($code: ID!){
        country(code: $code) {
            code
            name
            native
            phone
            continent {
                code
                name
            }
            capital
            currency
            languages {
                code
                name
                native
                rtl
            }
            emoji
            emojiU
            states {
                code
                name
            }
        }
    }
`;

const columns: any = [
    {
        title: '',
        key: 'emoji',    
        dataIndex: 'emoji'
    },
    {
        title: 'Nombre',
        key: 'name',
        dataIndex: 'name',
        sorter: (a: any, b: any) => a.name.localeCompare(b.name),
        render: (root: any, row: any) => <Link to={row.code} state={row}>{root}</Link>
    },
    {
        title: 'Capital',
        key: 'capital',
        dataIndex: 'capital',
        sorter: (a: any, b: any) => (a.capital || "").localeCompare(b.capital || "")
    },
    {
        title: 'Moneda',
        key: 'currency',
        dataIndex: 'currency',
        sorter: (a: any, b: any) => (a.currency || "").localeCompare(b.currency || "")
    },
    {
        title: 'Continente',
        key: 'continent',
        dataIndex: 'continent',
        sorter: (a: any, b: any) => a.continent.name.localeCompare(b.continent.name),
        render: (root: any, row: any) => root.name
    }
];

export default function Countries({ history, ...props }: any) {
    const { data, loading, error } = useQuery(LIST_COUNTRIES);
    const [ getCountry, { data: dataSearch, loading: loadingSearch, error: errorSearch } ] = useLazyQuery(SEARCH_COUNTRY);
    
    const [search, setSearch] = useState('');
    const [countries, setCountries] = useState<any>([]);
    const { codeId } = useParams();

    useEffect(() => {
        if (!loading) {
            setCountries(data.countries || []);
        }
    }, [loading, data, codeId]);

    useEffect(() => {
        if (!loadingSearch) {
            if (dataSearch?.country) {
                setCountries([dataSearch?.country])
            }
            else {
                setCountries(data?.countries || []);
            }
        }
    }, [loadingSearch, dataSearch, codeId]);

    useEffect(() => {
        showCountry(search);
    }, [search])

    const showCountry = (code: string) => {
        getCountry({ variables: { code } });
    }

    if (loading || error) {
        return <>{error ? <p>{error.message}</p> : <SpinnerComponent />}</>;
    }

    if (codeId) {
        return <Outlet />            
    }

    return (
        <>
            <h1>Paises</h1>
            <Input placeholder="Buscar por código..." allowClear onChange={(e) => setSearch(e.target.value.toUpperCase())} style={{ width: 400, marginBottom: 15 }} value={search}/>
            <Table columns={columns} dataSource={countries} rowKey="code"></Table>
            <Outlet></Outlet>
        </>
    )
}