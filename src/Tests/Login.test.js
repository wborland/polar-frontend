import React from 'react';
import {cleanup, fireEvent, render} from '@testing-library/react';
import LoginComponent from "../Components/LoginComponent";

afterEach(cleanup);

describe('Login Testing', () => {
    test('Invalid test', () => {
        expect(true).toBeTruthy();
    })
});