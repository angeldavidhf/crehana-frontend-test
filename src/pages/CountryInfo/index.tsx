import React, { useEffect, useState } from "react";
import { Row, Col, Image, Descriptions, Tag, Button } from 'antd';
import { useNavigate, useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";

import SpinnerComponent from "../../components/SpinnerComponent";

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

interface ILanguage {
    code: string;
    name: string;
    native: string;
    rtl: boolean;
}

interface IState {
    code: String;
    name: String;
}

interface IContinent {
    code: string;
    name: string;
}

interface ICountry {
    code: string;
    name: string;
    native: string;
    phone: string;
    continent: IContinent;
    capital: string
    currency: string
    languages: [ILanguage];
    emoji: string;
    emojiU: string;
    states: [IState];
}

export default function CountryInfo() {
    const { codeId } = useParams();
    const navigate = useNavigate();
    const { data, loading, error } = useQuery(SEARCH_COUNTRY, {
        variables: {code: codeId?.toUpperCase()}
    });

    const [country, setCountry] = useState<ICountry>({
        code: "",
        name: "",
        native: "",
        phone: "",
        continent: {
            code: "",
            name: ""
        },
        capital: "",
        currency: "",
        languages: [{
            name: "",
            code: "",
            native: "",
            rtl: false
        }],
        emoji: "",
        emojiU: "",
        states: [{
            code: "",
            name: ""
        }],
    });

    useEffect(() => {
        if (!loading) {
            setCountry(data.country || {});
        }
    }, [data]);

    if (loading || error) {
        return <>{error ? <p>{error.message}</p> : <SpinnerComponent />}</>;
    }

    return (
        <>
            <Button style={{ marginBottom: 15 }} onClick={() => navigate(-1)}>Volver</Button>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col className="gutter-row" span={6}>
                    <Image
                        src={`https://raw.githubusercontent.com/hampusborgos/country-flags/main/png1000px/${country.code.toLowerCase()}.png`}
                        placeholder={
                        <Image
                            preview={false}
                            src={`https://raw.githubusercontent.com/hampusborgos/country-flags/main/png1000px/${country.code.toLowerCase()}.png`}
                            width={200}
                        />
                        }
                    />
                </Col>
                <Col className="gutter-row" span={18}>
                    <Descriptions title={`${country.emoji} ${country.name} (${country.code})`} bordered>
                        <Descriptions.Item label="Nombre">{country.name} ({country.code})</Descriptions.Item>
                        <Descriptions.Item label="Nativo">{country.native}</Descriptions.Item>
                        <Descriptions.Item label="Teléfono">{country.phone}</Descriptions.Item>
                        <Descriptions.Item label="Capital">{country.capital}</Descriptions.Item>
                        <Descriptions.Item label="Moneda">{country.currency}</Descriptions.Item>
                        <Descriptions.Item label="Continente">{country.continent.name} ({country.continent.code})</Descriptions.Item>
                        <Descriptions.Item label="Lenguas" span={3}>
                            {country.languages.map((item: any, index: number) => (
                                <Tag key={index} color="cyan" style={{ margin: 5 }} >{item.name} ({item.code})</Tag>
                            ))}
                        </Descriptions.Item>
                        <Descriptions.Item label="Estados" span={3}>
                            {country.states.map((item: any, index: number) => (
                                <Tag key={index} color="geekblue" style={{ margin: 5 }} >{item.name} ({item.code})</Tag>
                            ))}
                        </Descriptions.Item>
                    </Descriptions>
                </Col>
            </Row>
        </>
    )
}