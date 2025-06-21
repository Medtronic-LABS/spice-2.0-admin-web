import { createSelector } from 'reselect';
import { AppState } from '../rootReducer';

const selectCHWHouseholdRegistrationState = (state: AppState) => state.chwHouseholdRegistration;

export const selectHouseholdRegistrationData = createSelector(
  [selectCHWHouseholdRegistrationState],
  (state) => state.householdRegistrationData
);

export const selectHouseholdRegistrationLoading = createSelector(
  [selectCHWHouseholdRegistrationState],
  (state) => state.loading
);

export const selectHouseholdRegistrationError = createSelector(
  [selectCHWHouseholdRegistrationState],
  (state) => state.error
);

export const selectOverallAchievement = createSelector(
  [selectHouseholdRegistrationData],
  (data) => {
    if (!data.length) {
      return 0;
    }

    const totalRegistered = data.reduce((sum, item) => sum + item.registered, 0);
    const totalTarget = data.reduce((sum, item) => sum + item.target, 0);

    return totalTarget > 0 ? Math.round((totalRegistered / totalTarget) * 100) : 0;
  }
);
