import React, { useEffect, useState } from 'react';

import { Link, Outlet, useParams } from 'react-router-dom';
import { Input, Table, Select } from 'antd';
import { gql, useQuery } from '@apollo/client';

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

export default function Countries() {
    const { data, loading, error } = useQuery(LIST_COUNTRIES);

    const [ search, setSearch ] = useState('');
    const [ selectContinent, setSelectContinent ] = useState('');
    const [ selectCurrency, setSelectCurrency ] = useState('');
    const [ currency, setCurrency ] = useState(Array);

    const [ countries, setCountries ] = useState<any>([]);
    const { codeId } = useParams();

    useEffect(() => {
        if (!loading) {
            setCountries(data.countries || []);

            const arr: any = [];
            data.countries.forEach((item: any) => {
                (item.currency?.split(',') || []).forEach((str: string) => {
                    arr.push(str);
                })
            });

            const uniqueArr = arr.filter((element: string, index: number) => {
                return arr.indexOf(element) === index;
            });

            setCurrency(uniqueArr);
        }
    }, [loading, data, codeId]);


    useEffect(() => {
        if((search && search !== '') || (selectContinent && selectContinent !== '') || (selectCurrency && selectCurrency !== '')) {
            const result = data.countries.filter((item: any) => {

                const countryMatches = item.name.toLowerCase().includes(search.toLowerCase())
                const continentMatches = item.continent.name.includes(selectContinent || '');
                const currencyMatches = (item.currency || '').includes(selectCurrency || '');

                return countryMatches && continentMatches && currencyMatches;
            });

            setCountries(result);
        }
        else {
            setCountries(data?.countries || []);
        }
    }, [search, selectContinent, selectCurrency, data]);


    if (loading || error) {
        return <>{error ? <p>{error.message}</p> : <SpinnerComponent />}</>;
    }

    if (codeId) {
        return <Outlet />            
    }

    return (
        <>
            <h1>Paises</h1>
            <Input placeholder="Buscar país..." allowClear onChange={(e: any) => setSearch(e.target.value)} style={{ width: 400, marginBottom: 15, marginRight: 15 }} />
            <Select
                allowClear
                showSearch
                placeholder="Seleccione continente"
                style={{ width: 400, marginBottom: 15, marginRight: 15 }}
                onChange={(val) => setSelectContinent(val)}
            >
                {
                    Array.from(new Set(data.countries.map((item: any) => item.continent.name))).map((opt: any, index: number) => (
                        <Select.Option key={`continent-${index}`} value={opt}>{opt}</Select.Option>
                    ))
                }
            </Select>
            <Select
                allowClear
                showSearch
                placeholder="Seleccione moneda"
                style={{ width: 400, marginBottom: 15, marginRight: 15 }}
                onChange={(val) => setSelectCurrency(val)}
            >
                {
                    currency.map((opt: any, index: number) => (
                        <Select.Option key={`currency-${index}`} value={opt}>{opt}</Select.Option>
                    ))
                }
            </Select>            
            <Table columns={columns} dataSource={countries} rowKey="code"></Table>
            <Outlet></Outlet>
        </>
    )
}