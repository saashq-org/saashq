import { escapeRegExp, paginate } from '@saashq/api-utils/src/core';
import { IContext } from '../../../connectionResolver';
import {
  moduleCheckPermission,
  moduleRequireLogin,
} from '@saashq/api-utils/src/permissions';
import { MONTHS } from '../../../constants';
import { sendProductsMessage } from '../../../messageBroker';
import { IPlanValues } from '../../../models/definitions/yearPlans';
import { isNumberObject } from 'util/types';

interface IListArgs {
  page: number;
  perPage: number;
  sortField: string;
  sortDirection: number;
  _ids: string[];
  year: number;
  searchValue: string;
  filterStatus: string;
  departmentId: string;
  branchId: string;
  productId: string;
  productCategoryId: string;
  minValue: number;
  maxValue: number;
  dateType: string;
  startDate: Date;
  endDate: Date;
}

const getGenerateFilter = async (subdomain: string, params: IListArgs) => {
  const {
    _ids,
    year,
    searchValue,
    filterStatus,
    branchId,
    departmentId,
    productId,
    productCategoryId,
  } = params;

  const filter: any = {};

  if (filterStatus) {
    filter.status = filterStatus;
  }
  if (year) {
    filter.year = year;
  }

  if (branchId) {
    filter.branchId = branchId;
  }
  if (departmentId) {
    filter.departmentId = departmentId;
  }

  if (productId) {
    filter.productId = productId;
  } else {
    const productFilter: any = {};

    if (searchValue) {
      productFilter.query = {
        $or: [
          {
            name: { $regex: `.*${escapeRegExp(searchValue)}.*` },
          },
          {
            code: { $regex: `.*${escapeRegExp(searchValue)}.*` },
          },
          {
            barcodes: { $regex: `.*${escapeRegExp(searchValue)}.*` },
          },
        ],
      };
    }

    if (productCategoryId) {
      productFilter.categoryId = productCategoryId;
    }

    if (Object.keys(productFilter).length) {
      const limit = await sendProductsMessage({
        subdomain,
        action: 'count',
        data: {
          ...productFilter,
          categoryId: productCategoryId,
        },
        isRPC: true,
        defaultValue: 0,
      });

      const products = await sendProductsMessage({
        subdomain,
        action: 'find',
        data: { ...productFilter, limit, fields: { _id: 1 } },
        isRPC: true,
        defaultValue: [],
      });
      filter.productId = { $in: products.map((p) => p._id) };
    }
  }

  return filter;
};

const labelsQueries = {
  yearPlans: async (
    _root: any,
    params: IListArgs,
    { models, subdomain }: IContext,
  ) => {
    const filter = await getGenerateFilter(subdomain, params);
    return paginate(
      models.YearPlans.find(filter).sort({ year: -1 }).lean(),
      params,
    );
  },

  yearPlansCount: async (
    _root: any,
    params: IListArgs,
    { models, subdomain }: IContext,
  ) => {
    const filter = await getGenerateFilter(subdomain, params);
    return await models.YearPlans.find(filter).countDocuments();
  },

  yearPlansSum: async (
    _root: any,
    params: IListArgs,
    { models, subdomain }: IContext,
  ) => {
    const filter = await getGenerateFilter(subdomain, params);

    const plans = await models.YearPlans.find(filter, { values: 1 }).lean();

    const result: { [key: string]: number } = {};
    MONTHS.map((m) => (result[m] = 0));

    for (const plan in plans) {
      for (const month in MONTHS) {
        if (month) {
          const planVals = Number(Object(plan).values[month]);
          if (planVals !== undefined) {
            result[month] += planVals;
          }
        }
      }
    }
    return result;
  },
};

moduleRequireLogin(labelsQueries);
moduleCheckPermission(labelsQueries, 'showSalesPlans');

export default labelsQueries;
