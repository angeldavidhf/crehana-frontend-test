import '@testing-library/jest-dom/extend-expect';

import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { prettyDOM } from '@testing-library/react';

import Tickets from ".";

test('render content', () => {
    const view = render(<Tickets />);
    screen.getByText('Vueltos de boletos');

    const p = view.container.querySelector('p');
    screen.getByText('Tiene dinero suficiente para los vueltos?');

    expect(screen.getByText('Tiene dinero suficiente para los vueltos?'));
});

test('clicking the button calls event handle once', () => {
    const view = render(<Tickets />);
    const button = screen.getByText('Lanzar Prueba');
    fireEvent.click(button);
    
    expect(screen.getByText('Tiene dinero suficiente para los vueltos? YES'));
});
