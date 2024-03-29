import { mutations as companyMutations } from '@saashq/ui-contacts/src/companies/graphql';

const companiesAdd = companyMutations.companiesAdd;

const companiesEdit = companyMutations.companiesEdit;

const companiesRemove = `
  mutation companiesRemove($companyIds: [String]) {
    companiesRemove(companyIds: $companyIds)
  }
`;

const companiesMerge = `
  mutation companiesMerge($companyIds: [String], $companyFields: JSON) {
    companiesMerge(companyIds: $companyIds, companyFields: $companyFields) {
      _id
    }
  }
`;

export default {
  companiesAdd,
  companiesEdit,
  companiesRemove,
  companiesMerge
};
