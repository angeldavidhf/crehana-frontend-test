import React from 'react';

import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Countries from './pages/Countries';
import CountryInfo from './pages/CountryInfo';
import Tickets from './pages/Tickets';

function App() {
    return (
        <Routes>
            <Route path="" element={<Home />}>
                <Route path="countries" element={<Countries />}>
                    <Route path=":codeId" element={<CountryInfo />} />                
                </Route>
                <Route path="tickets" element={<Tickets />} />
            </Route>
        </Routes>
    );
}

export default App;
