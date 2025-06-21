import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Loader from '../../components/loader/Loader';
import CHWHouseholdChart from '../../components/chwHouseholdChart/CHWHouseholdChart';
import {
  selectHouseholdRegistrationData,
  selectHouseholdRegistrationLoading,
  selectHouseholdRegistrationError,
  selectOverallAchievement
} from '../../store/chwHouseholdRegistration/selectors';
import { fetchHouseholdRegistrationRequest } from '../../store/chwHouseholdRegistration/actions';

const CHWHouseholdRegistrationDashboard: React.FC = () => {
  const dispatch = useDispatch();

  const householdData = useSelector(selectHouseholdRegistrationData);
  const loading = useSelector(selectHouseholdRegistrationLoading);
  const error = useSelector(selectHouseholdRegistrationError);
  const overallAchievement = useSelector(selectOverallAchievement);

  const fetchData = useCallback(() => {
    dispatch(fetchHouseholdRegistrationRequest({
      successCb: () => {
      },
      failureCb: () => {
      }
    }));
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className='py-1dot5'>
        <div className='row'>
          <div className='col-12'>
            <div className='alert alert-danger' role='alert'>
              Error loading household registration data: {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='py-1dot5'>
      <div className='row'>
        <div className='col-12 mb-1dot25'>
          <h4 className='page-title mb-0'>CHW Household Registration Dashboard</h4>
        </div>
      </div>

      <div className='row'>
        <div className='col-12'>
          <div className='card'>
            <div className='card-body'>
              {householdData.length > 0 ? (
                <CHWHouseholdChart
                  data={householdData}
                  overallAchievement={overallAchievement}
                />
              ) : (
                <div className='text-center py-5'>
                  <p className='text-muted'>No household registration data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CHWHouseholdRegistrationDashboard;
