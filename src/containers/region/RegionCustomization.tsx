import { useHistory, useParams } from 'react-router-dom';
import CustomTable from '../../components/customTable/CustomTable';
import DetailCard from '../../components/detailCard/DetailCard';
import APPCONSTANTS from '../../constants/appConstants';
import { PROTECTED_ROUTES } from '../../constants/route';

interface IMatchParams {
  regionId?: string;
  tenantId: string;
}

export const FormTypes = {
  Screening: 'screening',
  Enrollment: 'enrollment',
  Assessment: 'assessment'
};

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

const RegionCustomization = (): React.ReactElement => {
  const history = useHistory();
  const { regionId, tenantId } = useParams<IMatchParams>();

  const handleRowEdit = ({ index }: { index: number }) => {
    const formType = findCurrentFormType(index);
    history.push(
      PROTECTED_ROUTES.accordianViewRegionCustomizationForm
        .replace(':tenantId', tenantId)
        .replace(':regionId', regionId as string)
        .replace(':form', formType)
    );
  };

  return (
    <>
      <div className='col-12'>
        <DetailCard header='Region Customization' isSearch={false}>
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
