import { useHistory, useParams } from 'react-router-dom';
import CustomTable from '../../components/customTable/CustomTable';
import DetailCard from '../../components/detailCard/DetailCard';
import APPCONSTANTS from '../../constants/appConstants';
import { PROTECTED_ROUTES } from '../../constants/route';
import useAppTypeConfigs from '../../hooks/appTypeBasedConfigs';

/**
 * Interface for route parameters
 */
interface IMatchParams {
  regionId?: string;
  tenantId: string;
}

export const FormTypes = {
  Screening: 'screening',
  Enrollment: 'enrollment',
  Assessment: 'assessment'
};

/**
 * Finds the current form type based on the index
 * @param {number} index - The index of the form type
 * @returns {string} The form type
 */
export const findCurrentFormType = (index: number) => {
  switch (index) {
    case 0:
      return FormTypes.Screening;
    case 1:
      return FormTypes.Enrollment;
    case 2:
      return FormTypes.Assessment;
    default:
      return '';
  }
};

/**
 * RegionCustomization component for managing region-specific customizations
 * @returns {React.ReactElement} The rendered component
 */
const RegionCustomization = (): React.ReactElement => {
  const history = useHistory();
  const { regionId, tenantId } = useParams<IMatchParams>();

  /**
   * Handles row edit action
   * @param {Object} param0 - The row edit parameters
   * @param {number} param0.index - The index of the edited row
   */
  const handleRowEdit = ({ index }: { index: number }) => {
    const formType = findCurrentFormType(index);
    history.push(
      PROTECTED_ROUTES.accordianViewRegionCustomizationForm
        .replace(':tenantId', tenantId)
        .replace(':regionId', regionId as string)
        .replace(':form', formType)
    );
  };

  const {
    region: { s: regionSName }
  } = useAppTypeConfigs();

  return (
    <>
      <div className='col-12'>
        <DetailCard header={`${regionSName} Customization`} isSearch={false}>
          <CustomTable
            rowData={APPCONSTANTS.REGION_CUSTOMIZATION_SCREENS}
            columnsDef={[
              {
                id: 1,
                name: 'name',
                label: 'Name',
                width: '200px'
              }
            ]}
            isEdit={true}
            isDelete={false}
            onRowEdit={handleRowEdit}
          />
        </DetailCard>
      </div>
    </>
  );
};

export default RegionCustomization;
