import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import createSagaMiddleware from 'redux-saga';
import MyProfile from '../MyProfile';
import { fetchUserByIdReq } from '../../../store/user/actions';
import { act } from 'react-dom/test-utils';

// Create the mock store with saga middleware
const sagaMiddleware = createSagaMiddleware();
const mockStore = configureStore([sagaMiddleware]);

describe('MyProfile', () => {
  let store: any;
  let component: any;

  beforeEach(() => {
    // Initialize mock store with state that matches the expected structure
    const initialState = {
      user: {
        user: {
          role: 'SUPER_ADMIN',
          userId: '123',
          userData: {
            country: {
              id: '1',
              countryCode: '+1',
              phoneNumberCode: '+1'
            }
          }
        }
      },
      healthFacility: {
        healthFacilityList: [],
        countryList: [],
        peerSupervisorList: { list: [], hfTenantIds: null },
        villagesFromHFList: { list: [], hfTenantIds: null }
      }
    };
    store = mockStore(initialState);
    // Render the MyProfile component with the mock store
    component = mount(
      <Provider store={store}>
        <MyProfile />
      </Provider>
    );
  });

  it('should dispatch fetchUserByIdReq action on mount', () => {
    // Check if the fetchUserByIdReq action was dispatched
    const actions = store.getActions();
    expect(actions).toContainEqual(
      fetchUserByIdReq({
        payload: { id: '123' },
        successCb: expect.any(Function),
        failureCb: expect.any(Function)
      })
    );
  });

  it('should show edit modal when edit button is clicked', () => {
    // Simulate the edit button click
    act(() => {
      component.find('DetailCard').prop('onButtonClick')();
    });
    component.update();
    // Check if the edit modal is now shown
    expect(component.find('Memo()').prop('show')).toBe(true);
  });

  it('should dispatch updateUserRequest action on form submit', () => {
    // Prepare the form data to submit
    const formData = {
      users: [
        {
          id: '123',
          gender: 'Male',
          firstName: 'John',
          lastName: 'Doe',
          countryCode: '+1',
          phoneNumber: '1234567890',
          country: { phoneNumberCode: '+1' }
        }
      ]
    };
    // Simulate form submission
    act(() => {
      component.find('Memo()').prop('handleFormSubmit')(formData);
    });
    // Check if the updateUserRequest action was dispatched
    const actions = store.getActions();
    expect(actions[1]).toEqual(
      expect.objectContaining({
        type: 'UPDATE_USER_REQUEST',
        payload: {
          id: '123',
          gender: 'Male',
          firstName: 'John',
          lastName: 'Doe',
          countryCode: '+1',
          phoneNumber: '1234567890'
        },
        successCb: expect.any(Function),
        failureCb: expect.any(Function)
      })
    );
  });
});
