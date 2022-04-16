import React, { useState } from "react";
import { Button, Col } from "antd";

import './assets/styles.css';

export default function Tickets() {
    const [ money ] = useState([25, 25, 50]);
    const [ change, setChange ] = useState('');

    const changeTickets = (money: Array<number>) => {
        let x25 = 0, x50 = 0;
        
        for (let i = 0; i < money.length; i++) {
            if (money[i] === 25) {
                x25 += 1;
            }

            if (money[i] === 50) {
                x25 -= 1;
                x50 += 1;
            }

            if (money[i] === 100) {
                if(x50 === 0 && x25 >= 3) {
                    x25 -= 3;
                }
                else {
                    x25 -= 1;
                    x50 -= 1;
                }
            }

            if (x25 < 0 || x50 < 0) {
                return "NO";
            }
        }

        return "YES";
    }

    return (
        <>
            <h1>Vueltos de boletos</h1>
            <p>Tiene dinero suficiente para los vueltos? {change}</p>
            <Col className="gutter-row" span={24}>
                <Button type="primary" onClick={() => setChange(changeTickets(money))}>Lanzar Prueba</Button>
            </Col>
        </>
    )
}