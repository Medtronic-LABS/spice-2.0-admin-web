import APPCONSTANTS, { NAMING_VARIABLES } from '../../constants/appConstants';
import { getUserPayload, getAdminPayload, formatHealthFacility } from '../formatObjectUtils';

describe('formatObjectUtils', () => {
  describe('getAdminPayload', () => {
    const mockUser = {
      firstName: ' John ',
      lastName: ' Doe ',
      gender: 'Male',
      username: 'johndoe',
      phoneNumber: '1234567890',
      countryCode: { phoneNumberCode: '+1' },
      timezone: {
        id: 1,
        name: 'UTC'
      },
      role: { id: 1 },
      roles: [
        { id: 2, groupName: APPCONSTANTS.spiceRoleGrouped.reports },
        { id: 3, name: APPCONSTANTS.ROLES.HEALTH_FACILITY_ADMIN }
      ]
    };

    it('should handle non-list payload creation with isFromList false and role as object', () => {
      const result = getAdminPayload({
        userFormData: [mockUser],
        countryId: 1,
        isFromList: false,
        appTypes: [APPCONSTANTS.appTypes.community]
      });

      expect(result[0]).toEqual(
        expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
          gender: 'Male',
          username: 'johndoe',
          phoneNumber: '1234567890',
          countryCode: '+1',
          roleIds: [2, 3],
          timezone: {
            id: 1,
            name: 'UTC'
          },
          designation: null,
          reportUserOrganizationIds: [],
          insightUserOrganizationIds: [],
          country: {
            id: 1
          }
        })
      );
    });

    it('should handle non-list payload creation with isFromList false and role as array', () => {
      const result = getAdminPayload({
        userFormData: [{ ...mockUser, role: [{ id: 1 }] }],
        countryId: 1,
        isFromList: false,
        appTypes: [APPCONSTANTS.appTypes.community]
      });

      expect(result[0]).toEqual(
        expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
          gender: 'Male',
          username: 'johndoe',
          phoneNumber: '1234567890',
          countryCode: '+1',
          roleIds: [2, 3],
          timezone: {
            id: 1,
            name: 'UTC'
          },
          designation: null,
          insightUserOrganizationIds: [],
          reportUserOrganizationIds: [],
          country: {
            id: 1
          }
        })
      );
    });

    it('should handle list payload creation', () => {
      const result = getAdminPayload({
        userFormData: [mockUser],
        countryId: 1,
        isFromList: true,
        appTypes: [APPCONSTANTS.appTypes.community]
      });

      expect(result[0].roleIds).toEqual(expect.arrayContaining([2, 3]));
    });

    it('should handle different admin roles and tenantId logic', () => {
      const testCases = [
        {
          role: APPCONSTANTS.ROLES.SUPER_ADMIN,
          expectedTenantId: null
        },
        {
          role: APPCONSTANTS.ROLES.REGION_ADMIN,
          tenantId: 123,
          expectedTenantId: 123
        },
        {
          role: APPCONSTANTS.ROLES.DISTRICT_ADMIN,
          district: { tenantId: 456 },
          expectedTenantId: 456
        },
        {
          role: APPCONSTANTS.ROLES.CHIEFDOM_ADMIN,
          chiefdom: { tenantId: 789 },
          expectedTenantId: 789
        },
        {
          role: APPCONSTANTS.ROLES.HEALTH_FACILITY_ADMIN,
          healthfacility: { tenantId: 101 },
          expectedTenantId: 101
        }
      ];

      testCases.forEach(({ role, expectedTenantId, ...additionalProps }) => {
        const userWithRole = {
          ...mockUser,
          roles: [{ name: role }],
          ...additionalProps
        };

        const result = getAdminPayload({
          userFormData: [userWithRole],
          tenantId: 999,
          appTypes: [APPCONSTANTS.appTypes.community]
        });
        if (role === APPCONSTANTS.ROLES.SUPER_ADMIN) {
          expect(result[0].tenantId).toBe(undefined);
        } else {
          expect(result[0].tenantId).toBe(expectedTenantId);
        }
      });
    });

    it('should handle district and chiefdom data correctly', () => {
      const userWithDistrict = {
        ...mockUser,
        roles: [{ name: APPCONSTANTS.ROLES.HEALTH_FACILITY_ADMIN }],
        district: { id: 1 },
        chiefdom: { id: 2 }
      };

      const result = getAdminPayload({
        userFormData: [userWithDistrict],
        isFromSummaryOrProfilePage: false,
        appTypes: [APPCONSTANTS.appTypes.community]
      });

      expect(result[0].district).toEqual({ id: 1 });
      expect(result[0].chiefdom).toEqual({ id: 2 });
    });

    it('should handle countrycode, designation,reportUserOrganization, insightUserOrganization, isRegionAdmin with tenantId and id', () => {
      const user = {
        ...mockUser,
        id: 1,
        countryCode: '+1',
        designation: { id: 1, name: 'Doctor' },
        reportUserOrganization: [{ id: 1, tenantId: 123 }],
        insightUserOrganization: [{ id: 2, tenantId: 456 }],
        roles: [{ name: APPCONSTANTS.ROLES.REGION_ADMIN }]
      };
      const result = getAdminPayload({
        userFormData: [user],
        countryId: 1,
        appTypes: [APPCONSTANTS.appTypes.community],
        tenantId: 123
      });
      expect(result[0].countryCode).toEqual('+1');
      expect(result[0].designation).toEqual({ id: 1, name: 'Doctor' });
      expect(result[0].id).toBe(1);
    });

    it('should handle hfAdmin with culture', () => {
      const user = {
        ...mockUser,
        id: 1,
        culture: 'en-US',
        roles: [{ name: APPCONSTANTS.ROLES.HEALTH_FACILITY_ADMIN }],
        tenantId: 123
      };
      const result = getAdminPayload({
        userFormData: [user],
        countryId: 1,
        appTypes: [APPCONSTANTS.appTypes.community]
      });
      expect(result[0].culture).toEqual('en-US');
      expect(result[0].tenantId).toBe(123);
      expect(result[0].id).toBe(1);
    });
  });

  describe('getUserPayload', () => {
    const mockUser = {
      firstName: ' John ',
      lastName: ' Doe ',
      gender: 'Male',
      username: 'johndoe',
      phoneNumber: '1234567890',
      countryCode: { phoneNumberCode: '+1' },
      culture: 'en-US',
      supervisor: { id: 123 },
      villages: [{ id: 1 }, { id: 2 }],
      village: { id: 3 },
      timezone: 'UTC',
      district: { id: 4 },
      chiefdom: { id: 5 }
    };

    it('should create payload for HFCreate with roles', () => {
      const userFormData = [
        {
          firstName: 'John',
          lastName: 'Doe',
          gender: 'Male',
          username: 'johndoe',
          phoneNumber: '123-456-7890',
          roles: [{ id: 1 }, { id: 2 }],
          redRisk: true,
          tenantId: 123
        }
      ];
      const result = getUserPayload({
        userFormData,
        countryId: 'US',
        isHFCreate: true,
        spiceRolesGroup: [{ name: NAMING_VARIABLES.redRisk, id: 999 }],
        appTypes: [APPCONSTANTS.appTypes.community]
      });

      expect(result).toEqual([
        expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
          roleIds: [1, 2, 999],
          redRisk: true,
          appTypes: [APPCONSTANTS.appTypes.community],
          chiefdom: undefined,
          district: undefined,
          village: undefined,
          villageIds: [],
          country: {
            id: NaN
          },
          countryCode: null,
          culture: null,
          designation: null,
          gender: 'Male',
          insightUserOrganizationIds: [],
          phoneNumber: '123-456-7890',
          reportUserOrganizationIds: [],
          supervisorId: null,
          tenantId: 123,
          timezone: null,
          username: 'johndoe'
        })
      ]);
    });

    it('should create payload for non-HFCreate with roles', () => {
      const userFormData = [
        {
          firstName: 'Jane',
          lastName: 'Smith',
          gender: 'Female',
          username: 'janesmith',
          phoneNumber: '987-654-3210',
          rolesIds: [{ id: 3, name: APPCONSTANTS.ROLES.HEALTH_FACILITY_ADMIN }],
          redRisk: false,
          tenantId: 456,
          roles: [
            { id: 3, name: APPCONSTANTS.ROLES.HEALTH_FACILITY_ADMIN, groupName: APPCONSTANTS.spiceRoleGrouped.spice }
          ]
        }
      ];
      const result = getUserPayload({
        userFormData,
        countryId: 1,
        isHFCreate: false,
        spiceRolesGroup: [{ name: NAMING_VARIABLES.redRisk, id: 999 }],
        appTypes: [APPCONSTANTS.appTypes.community]
      });

      expect(result).toEqual([
        expect.objectContaining({
          appTypes: [APPCONSTANTS.appTypes.community],
          firstName: 'Jane',
          lastName: 'Smith',
          roleIds: [3],
          tenantId: 456,
          country: { id: 1 },
          supervisorId: null,
          timezone: null,
          username: 'janesmith',
          village: undefined,
          villageIds: [],
          phoneNumber: '987-654-3210',
          countryCode: null,
          culture: null,
          district: undefined,
          chiefdom: undefined,
          designation: null,
          gender: 'Female',
          insightUserOrganizationIds: [],
          reportUserOrganizationIds: []
        })
      ]);
    });
    it('should set tenantId to null for super admin', () => {
      const userFormData = [
        {
          firstName: 'Admin',
          lastName: 'User',
          gender: 'Male',
          username: 'adminuser',
          phoneNumber: '123-456-7890',
          tenantId: 123
        }
      ];
      const result = getUserPayload({
        userFormData,
        countryId: 1,
        isHFCreate: false,
        spiceRolesGroup: [],
        appTypes: [APPCONSTANTS.appTypes.community]
      });

      expect(result).toEqual([
        expect.objectContaining({
          appTypes: [APPCONSTANTS.appTypes.community],
          designation: null,
          insightUserOrganizationIds: [],
          reportUserOrganizationIds: [],
          chiefdom: undefined,
          country: {
            id: 1
          },
          countryCode: null,
          culture: null,
          district: undefined,
          firstName: 'Admin',
          gender: 'Male',
          lastName: 'User',
          phoneNumber: '123-456-7890',
          redRisk: null,
          roleIds: [],
          supervisorId: null,
          tenantId: 123,
          timezone: null,
          username: 'adminuser',
          village: undefined,
          villageIds: []
        })
      ]);
    });

    it('should handle HF creation payload', () => {
      const user = {
        ...mockUser,
        roles: [{ id: 1 }, { id: 2 }]
      };

      const result = getUserPayload({
        userFormData: [user],
        countryId: 1,
        isHFCreate: true,
        appTypes: [APPCONSTANTS.appTypes.community]
      });

      expect(result[0]).toEqual(
        expect.objectContaining({
          roleIds: expect.arrayContaining([1, 2]),
          villageIds: [1, 2],
          supervisorId: 123
        })
      );
    });

    it('should handle redRisk role assignment', () => {
      const user = {
        ...mockUser,
        roles: [{ name: 'regular-role' }],
        redRisk: true
      };

      const result = getUserPayload({
        userFormData: [user],
        countryId: 1,
        spiceRolesGroup: [{ name: NAMING_VARIABLES.redRisk, id: 999 }],
        appTypes: [APPCONSTANTS.appTypes.community]
      });

      expect(result[0].roleIds).toContain(999);
    });

    it('should handle tenantId assignment logic', () => {
      const testCases = [
        {
          desc: 'user tenantId',
          user: { ...mockUser, tenantId: 111 },
          expectedTenantId: 111
        },
        {
          desc: 'healthfacility tenantId',
          user: { ...mockUser, healthfacility: { tenantId: 222 } },
          expectedTenantId: 222
        },
        {
          desc: 'URL tenantId',
          user: mockUser,
          tenantId: 333,
          expectedTenantId: 333
        }
      ];

      testCases.forEach(({ desc, user, tenantId, expectedTenantId }) => {
        const result = getUserPayload({
          userFormData: [user],
          countryId: 1,
          tenantId,
          appTypes: [APPCONSTANTS.appTypes.community]
        });

        expect(result[0].tenantId).toBe(expectedTenantId);
      });
    });

    it('should handle HF admin specific logic', () => {
      const user = {
        ...mockUser,
        roles: [{ name: APPCONSTANTS.ROLES.HEALTH_FACILITY_ADMIN }],
        redRisk: true
      };

      const result = getUserPayload({
        userFormData: [user],
        countryId: 1,
        appTypes: [APPCONSTANTS.appTypes.community]
      });

      expect(result[0].redRisk).toBeUndefined();
      expect(result[0].culture).toBe('en-US');
    });

    it('should handle timezone, designation, reportUserOrganization, insightUserOrganization and id', () => {
      const user = {
        ...mockUser,
        id: 1,
        timezone: { id: 1, name: 'UTC' },
        designation: { id: 1, name: 'Doctor' },
        reportUserOrganization: [{ id: 1, tenantId: 123 }],
        insightUserOrganization: [{ id: 2, tenantId: 456 }]
      };
      const result = getUserPayload({
        userFormData: [user],
        countryId: 1,
        appTypes: [APPCONSTANTS.appTypes.community]
      });
      expect(result[0].timezone).toEqual({ id: 1, name: 'UTC' });
      expect(result[0].designation).toEqual({ id: 1, name: 'Doctor' });
    });
  });

  describe('formatHealthFacility', () => {
    it('should handle health facility payload', () => {
      const mockHf = {
        id: 1,
        name: 'Test HF',
        type: { name: 'Type' },
        phuFocalPersonName: 'Test Name',
        phuFocalPersonNumber: '1234567890',
        address: 'Test Address',
        district: { id: 1 },
        chiefdom: { id: 2, tenantId: 456 },
        city: { name: 'Test City' },
        language: { name: 'Test Language' },
        country: { id: 1 },
        tenantId: 123,
        peerSupervisors: [{ id: 123 }],
        linkedVillages: [{ id: 123 }],
        customizedWorkflows: [{ id: 123 }],
        clinicalWorkflows: [{ id: 123 }]
      };
      const expected = {
        id: 1,
        appTypes: [APPCONSTANTS.appTypes.community],
        name: 'Test HF',
        type: 'Type',
        phuFocalPersonName: 'Test Name',
        phuFocalPersonNumber: '1234567890',
        address: 'Test Address',
        district: { id: 1 },
        chiefdom: { id: 2, tenantId: 456 },
        cityName: 'Test City',
        latitude: undefined,
        longitude: undefined,
        postalCode: undefined,
        country: { id: 1 },
        language: 'Test Language',
        parentTenantId: 456,
        tenantId: 123,
        linkedSupervisorIds: [123],
        linkedVillageIds: [123],
        customizedWorkflowIds: [{ id: 123 }],
        clinicalWorkflowIds: [{ id: 123 }]
      };
      const result = formatHealthFacility(mockHf, 1, [APPCONSTANTS.appTypes.community]);
      expect(result).toEqual(expected);
    });

    it('should handle health facility payload without city name, peersupervisor, linked villages, customized workflows', () => {
      const mockHf = {
        id: 1,
        name: 'Test HF',
        type: { name: 'Type' },
        phuFocalPersonName: 'Test Name',
        phuFocalPersonNumber: '1234567890',
        address: 'Test Address',
        district: { id: 1 },
        chiefdom: { id: 2, tenantId: 456 },
        language: { name: 'Test Language' },
        country: { id: 1 },
        tenantId: 123,
        clinicalWorkflows: [{ id: 123 }]
      };
      const expected = {
        id: 1,
        appTypes: [APPCONSTANTS.appTypes.community],
        name: 'Test HF',
        type: 'Type',
        phuFocalPersonName: 'Test Name',
        phuFocalPersonNumber: '1234567890',
        cityName: null,
        address: 'Test Address',
        district: { id: 1 },
        chiefdom: { id: 2, tenantId: 456 },
        latitude: undefined,
        longitude: undefined,
        postalCode: undefined,
        country: { id: 1 },
        language: 'Test Language',
        parentTenantId: 456,
        tenantId: 123,
        linkedSupervisorIds: [],
        linkedVillageIds: [],
        customizedWorkflowIds: [],
        clinicalWorkflowIds: [{ id: 123 }]
      };
      const result = formatHealthFacility(mockHf, 1, [APPCONSTANTS.appTypes.community]);
      expect(result).toEqual(expected);
    });
  });
});
