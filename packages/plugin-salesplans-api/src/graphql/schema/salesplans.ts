import {
  attachmentType,
  attachmentInput
} from '@saashq/api-utils/src/commonTypeDefs';

export const types = () => `
  ${attachmentType}
  ${attachmentInput}

  extend type Branch @key(fields: "_id") {
    _id: String! @external
  }

  extend type Department @key(fields: "_id") {
    _id: String! @external
  }

  extend type Product @key(fields: "_id") {
    _id: String! @external
  }

  extend type ProductCategory @key(fields: "_id") {
    _id: String! @external
  }

  extend type Uom @key(fields: "_id") {
    _id: String! @external
  }

  extend type User @key(fields: "_id") {
    _id: String! @external
  }
`;
