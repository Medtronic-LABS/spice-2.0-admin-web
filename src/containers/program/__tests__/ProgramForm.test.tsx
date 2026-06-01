import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';

import ProgramForm from '../ProgramForm';
import { IProgramFormValues } from '../../../store/program/types';
import { LegacyRoute as Route } from '../../../tests/routerTestUtils';

const mockStore = configureMockStore();

describe('ProgramForm', () => {
  const mockTenantId = 'mockTenantId';

  it('should render the form with the program name and site select fields', () => {
    const store = mockStore({
      site: {
        siteDropdownOptions: {
          list: [
            {
              id: '12',
              name: 'name',
              tenantId: '1'
            }
          ],
          regionTenantId: '123'
        }
      },
      user: {
        user: {
          country: { id: 1, name: 'Test', appTypes: [] },
          appTypes: []
        }
      },
      healthFacility: {
        healthFacilityList: []
      },
      common: {
        labelName: null
      }
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/region/1/1/program/create']}>
          <Route path='/region/:regionId/:tenantId/program/create'>
            <Form<{ program: IProgramFormValues }>
              onSubmit={() => {
                //
              }}
            >
              {({ handleSubmit, form }) => (
                <form onSubmit={handleSubmit}>
                  <ProgramForm form={form} tenantId={mockTenantId} />
                </form>
              )}
            </Form>
          </Route>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole('textbox', { name: 'program.name' })).toBeInTheDocument();
    expect(screen.getByText('Health Facility')).toBeInTheDocument();
  });
});
