import APPCONSTANTS, { NAMING_VARIABLES } from '../../constants/appConstants';
import {
  getUserPayload,
  getAdminPayload,
  formatHealthFacility,
  getSSUsersPayload,
  mapBranchToCreatePayload,
  mapBranchToUpdatePayload,
  ISSUserInputItem,
  ISSUserPayloadItem
} from '../formatObjectUtils';

describe('formatObjectUtils', () => {
  describe('getAdminPayload', () => {
    const mockUser = {
      firstName: ' John ',
      lastName: ' Doe ',
      gender: 'Male',
      username: 'johndoe',
      email: 'john.doe@example.com',
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
          expectedTenantId: undefined
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
          roles: [{ name: role, groupName: APPCONSTANTS.spiceRoleGrouped.spice }],
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
        roles: [{ name: APPCONSTANTS.ROLES.REGION_ADMIN, groupName: APPCONSTANTS.spiceRoleGrouped.spice }]
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
      expect(result[0].tenantId).toBe(123);
    });

    it('should handle hfAdmin with culture', () => {
      const user = {
        ...mockUser,
        id: 1,
        culture: 'en-US',
        roles: [{ name: APPCONSTANTS.ROLES.HEALTH_FACILITY_ADMIN, groupName: APPCONSTANTS.spiceRoleGrouped.spice }],
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
          roles: [
            { id: 1, groupName: APPCONSTANTS.spiceRoleGrouped.spice },
            { id: 2, groupName: APPCONSTANTS.spiceRoleGrouped.spice }
          ],
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
          tenantId: 123,
          roles: [{ id: 1, groupName: APPCONSTANTS.spiceRoleGrouped.spice }]
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
          roleIds: [1],
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
        roles: [{ id: 1 }, { id: 2 }],
        villages: [{ id: 1 }],
        existingVillages: [{ id: 2 }]
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
          user: { ...mockUser, tenantId: 111, roles: [{ id: 1, groupName: APPCONSTANTS.spiceRoleGrouped.spice }] },
          expectedTenantId: 111
        },
        {
          desc: 'healthfacility tenantId',
          user: {
            ...mockUser,
            healthfacility: { tenantId: 222 },
            roles: [{ id: 1, groupName: APPCONSTANTS.spiceRoleGrouped.spice }]
          },
          expectedTenantId: 222
        },
        {
          desc: 'URL tenantId',
          user: { ...mockUser, roles: [{ id: 1, groupName: APPCONSTANTS.spiceRoleGrouped.spice }] },
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

    it('should include branches as array of ids when user has branches', () => {
      const user = {
        ...mockUser,
        roles: [{ id: 1, groupName: APPCONSTANTS.spiceRoleGrouped.spice }],
        branches: [
          { id: 10, name: 'Branch A' },
          { id: 20, name: 'Branch B' }
        ]
      };
      const result = getUserPayload({
        userFormData: [user],
        countryId: 1,
        appTypes: [APPCONSTANTS.appTypes.community]
      });
      expect(result[0].branches).toEqual([10, 20]);
    });

    it('should normalize single branch object to array and map to id', () => {
      const user = {
        ...mockUser,
        roles: [{ id: 1, groupName: APPCONSTANTS.spiceRoleGrouped.spice }],
        branches: { id: 5, name: 'Branch Single' }
      };
      const result = getUserPayload({
        userFormData: [user],
        countryId: 1,
        appTypes: [APPCONSTANTS.appTypes.community]
      });
      expect(result[0].branches).toEqual([5]);
    });

    it('should filter out invalid branch entries (missing id or non-numeric id)', () => {
      const user = {
        ...mockUser,
        roles: [{ id: 1, groupName: APPCONSTANTS.spiceRoleGrouped.spice }],
        branches: [
          { id: 1, name: 'Valid' },
          { id: 'invalid' as any, name: 'Invalid' },
          null,
          { name: 'NoId' },
          { id: 2, name: 'Valid2' }
        ]
      };
      const result = getUserPayload({
        userFormData: [user],
        countryId: 1,
        appTypes: [APPCONSTANTS.appTypes.community]
      });
      expect(result[0].branches).toEqual([1, 2]);
    });

    it('should set branches to empty array when user has no branches', () => {
      const user = {
        ...mockUser,
        roles: [{ id: 1, groupName: APPCONSTANTS.spiceRoleGrouped.spice }]
      };
      const result = getUserPayload({
        userFormData: [user],
        countryId: 1,
        appTypes: [APPCONSTANTS.appTypes.community]
      });
      expect(result[0].branches).toEqual([]);
    });

    it('should map single districts and chiefdoms model objects to districtIds and chiefdomIds', () => {
      const user = {
        ...mockUser,
        roles: [{ id: 1, groupName: APPCONSTANTS.spiceRoleGrouped.spice }],
        districts: { id: 11, name: 'D1', tenantId: 't1' },
        chiefdoms: { id: 22, name: 'C1' }
      };
      const result = getUserPayload({
        userFormData: [user],
        countryId: 1,
        appTypes: [APPCONSTANTS.appTypes.community]
      });
      expect(result[0].districtIds).toEqual([11]);
      expect(result[0].chiefdomIds).toEqual([22]);
    });

    it('should map districts and chiefdoms arrays to districtIds and chiefdomIds', () => {
      const user = {
        ...mockUser,
        roles: [{ id: 1, groupName: APPCONSTANTS.spiceRoleGrouped.spice }],
        districts: [{ id: 1 }, { id: 2 }],
        chiefdoms: [{ id: 3 }]
      };
      const result = getUserPayload({
        userFormData: [user],
        countryId: 1,
        appTypes: [APPCONSTANTS.appTypes.community]
      });
      expect(result[0].districtIds).toEqual([1, 2]);
      expect(result[0].chiefdomIds).toEqual([3]);
    });

    it('should filter out invalid district and chiefdom entries from districtIds and chiefdomIds', () => {
      const user = {
        ...mockUser,
        roles: [{ id: 1, groupName: APPCONSTANTS.spiceRoleGrouped.spice }],
        districts: [
          { id: 1, name: 'Ok' },
          { id: 'bad' as any },
          null,
          { name: 'NoId' },
          { id: 2 }
        ],
        chiefdoms: [{ id: 10 }, { id: undefined as any }]
      };
      const result = getUserPayload({
        userFormData: [user],
        countryId: 1,
        appTypes: [APPCONSTANTS.appTypes.community]
      });
      expect(result[0].districtIds).toEqual([1, 2]);
      expect(result[0].chiefdomIds).toEqual([10]);
    });

    it('should set districtIds and chiefdomIds to empty arrays when districts and chiefdoms are absent', () => {
      const user = {
        ...mockUser,
        roles: [{ id: 1, groupName: APPCONSTANTS.spiceRoleGrouped.spice }]
      };
      const result = getUserPayload({
        userFormData: [user],
        countryId: 1,
        appTypes: [APPCONSTANTS.appTypes.community]
      });
      expect(result[0].districtIds).toEqual([]);
      expect(result[0].chiefdomIds).toEqual([]);
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

    it(`should handle health facility payload without
      city name, peersupervisor, linked villages, customized workflows`, () => {
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

  describe('getSSUsersPayload', () => {
    it('should return empty array when ssUsers is not an array', () => {
      expect(getSSUsersPayload(null as any)).toEqual([]);
      expect(getSSUsersPayload(undefined as any)).toEqual([]);
      expect(getSSUsersPayload('invalid' as any)).toEqual([]);
    });

    it('should return empty array when ssUsers is empty array', () => {
      expect(getSSUsersPayload([])).toEqual([]);
    });

    it('should map form/API shape to payload shape with ssId.name and subVillages[].id', () => {
      const ssUsers: ISSUserInputItem[] = [
        {
          ssId: { id: 1, name: 'SS01' },
          name: 'SS User One',
          phoneNumber: '+1234567890',
          subVillages: [{ id: 10 }, { id: 20 }]
        }
      ];
      const result = getSSUsersPayload(ssUsers);
      expect(result).toEqual([
        {
          name: 'SS User One',
          phoneNumber: '+1234567890',
          ssId: 'SS01',
          subVillageIds: ['10', '20'],
          isActive: true
        }
      ]);
    });

    it('should include id in payload when item has an id (edit flow)', () => {
      const ssUsers: ISSUserInputItem[] = [
        {
          id: 42,
          ssId: { id: 1, name: 'SS01' },
          name: 'Existing User',
          phoneNumber: '+9876543210',
          subVillages: [{ id: 5 }]
        }
      ];
      const result = getSSUsersPayload(ssUsers);
      expect(result).toEqual([
        {
          id: 42,
          name: 'Existing User',
          phoneNumber: '+9876543210',
          ssId: 'SS01',
          subVillageIds: ['5'],
          isActive: true
        }
      ]);
    });

    it('should not include id in payload when item has no id (create flow)', () => {
      const ssUsers: ISSUserInputItem[] = [
        {
          ssId: { id: 1, name: 'SS01' },
          name: 'New User',
          phoneNumber: '+1111111111',
          subVillages: []
        }
      ];
      const result = getSSUsersPayload(ssUsers);
      expect(result[0]).not.toHaveProperty('id');
    });

    it('should handle mixed items with and without id', () => {
      const ssUsers: ISSUserInputItem[] = [
        { id: 10, ssId: { id: 1, name: 'SS01' }, name: 'Existing', phoneNumber: '+1', subVillages: [] },
        { ssId: { id: 2, name: 'SS02' }, name: 'New', phoneNumber: '+2', subVillages: [] }
      ];
      const result = getSSUsersPayload(ssUsers);
      expect(result[0].id).toBe(10);
      expect(result[1]).not.toHaveProperty('id');
    });

    it('should handle multiple SS users', () => {
      const ssUsers: ISSUserInputItem[] = [
        { ssId: { id: 1, name: 'SS01' }, name: 'User 1', phoneNumber: '+1', subVillages: [{ id: 1 }] },
        { ssId: { id: 2, name: 'SS02' }, name: 'User 2', phoneNumber: '+2', subVillages: [{ id: 2 }, { id: 3 }] }
      ];
      const result = getSSUsersPayload(ssUsers);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        name: 'User 1',
        phoneNumber: '+1',
        ssId: 'SS01',
        subVillageIds: ['1'],
        isActive: true
      });
      expect(result[1]).toEqual({
        name: 'User 2',
        phoneNumber: '+2',
        ssId: 'SS02',
        subVillageIds: ['2', '3'],
        isActive: true
      });
    });

    it('should default missing fields to empty string or empty array', () => {
      const ssUsers: ISSUserInputItem[] = [{}];
      const result = getSSUsersPayload(ssUsers);
      expect(result).toEqual([
        {
          name: '',
          phoneNumber: '',
          ssId: '',
          subVillageIds: [],
          isActive: true
        }
      ]);
    });

    it('should handle missing ssId object (use empty string for ssId)', () => {
      const ssUsers: ISSUserInputItem[] = [
        { name: 'Test', phoneNumber: '+1', subVillages: [] }
      ];
      const result = getSSUsersPayload(ssUsers);
      expect(result[0].ssId).toBe('');
    });

    it('should handle subVillages with missing id (coerce to string)', () => {
      const ssUsers: ISSUserInputItem[] = [
        { ssId: { name: 'SS01' }, name: 'Test', phoneNumber: '', subVillages: [{ id: undefined }, {}] }
      ];
      const result = getSSUsersPayload(ssUsers);
      expect(result[0].subVillageIds).toEqual(['', '']);
    });

    it('should produce ISSUserPayloadItem shape with name, phoneNumber, ssId string, subVillageIds string[] and isActive boolean', () => {
      const ssUsers: ISSUserInputItem[] = [
        { ssId: { id: 1, name: 'SS01' }, name: 'A', phoneNumber: '1', subVillages: [{ id: 100 }] }
      ];
      const result = getSSUsersPayload(ssUsers);
      const item: ISSUserPayloadItem = result[0];
      expect(typeof item.name).toBe('string');
      expect(typeof item.phoneNumber).toBe('string');
      expect(typeof item.ssId).toBe('string');
      expect(Array.isArray(item.subVillageIds)).toBe(true);
      expect(item.subVillageIds.every((id) => typeof id === 'string')).toBe(true);
      expect(typeof item.isActive).toBe('boolean');
    });

    it('should map isActive from input when provided', () => {
      const ssUsers: ISSUserInputItem[] = [
        { ssId: { id: 1, name: 'SS01' }, name: 'A', phoneNumber: '1', subVillages: [], isActive: false }
      ];
      const result = getSSUsersPayload(ssUsers);
      expect(result[0].isActive).toBe(false);
    });
  });

  describe('mapBranchToCreatePayload', () => {
    it('should map branch to create payload with districtId and chiefdomId', () => {
      const branch = {
        id: 1,
        name: 'Branch A',
        code: 'BR001',
        currentAccountCode: 'ACC001',
        district: { id: 10, name: 'District X' },
        chiefdom: { id: 20, name: 'Chiefdom Y' },
        skPositionCount: 1,
        ssPositionCount: 2,
        poPositionCount: 0,
        foPositionCount: 0
      };
      const result = mapBranchToCreatePayload(branch as any);
      expect(result).toEqual({
        name: 'Branch A',
        code: 'BR001',
        currentAccountCode: 'ACC001',
        districtId: 10,
        chiefdomId: 20,
        skPositionCount: 1,
        ssPositionCount: 2,
        poPositionCount: 0,
        foPositionCount: 0
      });
    });

    it('should coerce string position counts to numbers and null when empty', () => {
      const branch = {
        id: 1,
        name: 'B',
        code: 'BR',
        currentAccountCode: 'ACC',
        district: { id: 1 },
        chiefdom: { id: 2 },
        skPositionCount: '1',
        ssPositionCount: '',
        poPositionCount: null,
        foPositionCount: 0
      };
      const result = mapBranchToCreatePayload(branch as any);
      expect(result.skPositionCount).toBe(1);
      expect(result.ssPositionCount).toBeNull();
      expect(result.poPositionCount).toBeNull();
      expect(result.foPositionCount).toBe(0);
    });

    it('should use 0 for missing district or chiefdom id', () => {
      const branch = {
        id: 1,
        name: 'B',
        code: 'BR',
        currentAccountCode: 'ACC',
        district: null,
        chiefdom: undefined,
        skPositionCount: 0,
        ssPositionCount: 0,
        poPositionCount: 0,
        foPositionCount: 0
      };
      const result = mapBranchToCreatePayload(branch as any);
      expect(result.districtId).toBe(0);
      expect(result.chiefdomId).toBe(0);
    });
  });

  describe('mapBranchToUpdatePayload', () => {
    it('should extend create payload with id', () => {
      const branch = {
        id: 99,
        name: 'Branch A',
        code: 'BR001',
        currentAccountCode: 'ACC001',
        district: { id: 10 },
        chiefdom: { id: 20 },
        skPositionCount: 0,
        ssPositionCount: 0,
        poPositionCount: 0,
        foPositionCount: 0
      };
      const result = mapBranchToUpdatePayload(branch as any);
      expect(result.id).toBe(99);
      expect(result.name).toBe('Branch A');
      expect(result.districtId).toBe(10);
      expect(result.chiefdomId).toBe(20);
    });
  });
});
