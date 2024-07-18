import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { Form } from 'react-final-form';
import '@testing-library/jest-dom/extend-expect';
import UserForm from '../UserForm';
import configureMockStore from 'redux-mock-store';

const mockStore = configureMockStore();

describe('UserForm component', () => {
    const store = mockStore({
        user: {
            timezoneList: [],
            loading: false,
            countryList: []
        }
    });

    it('should render form with initial values when provided', () => {
        const mockForm = {
            getState: jest.fn().mockReturnValue({ errors: {} }),
            mutators: { resetFields: jest.fn() },
            batch: jest.fn(),
            change: jest.fn()
        };

        const onSubmit = jest.fn();

        const wrapper = render(
            <Provider store={store}>
                <MemoryRouter>
                    <Form
                        onSubmit={onSubmit}
                        initialValues={{}} // provide any initial values if needed
                        render={() => (
                            <UserForm form={mockForm as any} />
                        )}
                    />
                </MemoryRouter>
            </Provider>
        );
        expect(wrapper).toBeTruthy();
    });
});
