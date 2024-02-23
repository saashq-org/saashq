import { checkPermission } from '@saashq/api-utils/src/permissions';
import { paginate } from '@saashq/api-utils/src';
import { IContext } from '../../connectionResolver';
import { sendCommonMessage } from '../../messageBroker';
import { getService, getServices } from '@saashq/api-utils/src/serviceDiscovery';


interface IListParams {
  limit: number;
  contentType: string;
  subType?: string;
  page: number;
  perPage: number;
  searchValue: string;
}

const generateFilter = (args: IListParams) => {
  const { searchValue, contentType, subType } = args;

  const filter: any = {};

  if (contentType) {
    filter.contentType = contentType;
  }

  if (subType) {
    filter.$or = [
      { subType },
      { subType: { $exists: false } },
      { subType: { $in: ['', null, undefined] } }
    ];
  }

  if (searchValue) {
    filter.name = new RegExp(`.*${searchValue}.*`, 'i');
  }

  return filter;
};

const documentQueries = {
  documents(_root, args: IListParams, { models }: IContext) {
    const sort = { date: -1 };

    const selector = generateFilter(args);

    if (args.limit) {
      return models.Documents.find(selector)
        .sort(sort)
        .limit(args.limit);
    }

    return paginate(models.Documents.find(selector).sort(sort), args);
  },

  documentsDetail(_root, { _id }, { models }: IContext) {
    return models.Documents.findOne({ _id });
  },

  async documentsGetContentTypes(_root, args, { models }: IContext) {
    const services = await getServices();
    const fieldTypes: Array<{
      label: string;
      contentType: string;
      subTypes?: string[];
    }> = [
      {
        label: 'Team members',
        contentType: 'core:user'
      }
    ];

    for (const serviceName of services) {
      const service = await getService(serviceName);
      const meta = service.config.meta || {};
      if (meta && meta.documents) {
        const types = meta.documents.types || [];

        for (const type of types) {
          fieldTypes.push({
            label: type.label,
            contentType: `${type.type}`,
            subTypes: type.subTypes
          });
        }
      }
    }

    return fieldTypes;
  },

  async documentsGetEditorAttributes(
    _root,
    { contentType },
    { subdomain }: IContext
  ) {
    if (contentType === 'core:user') {
      const fields = await sendCommonMessage({
        subdomain,
        serviceName: 'forms',
        action: 'fields.fieldsCombinedByContentType',
        isRPC: true,
        data: {
          contentType
        }
      });

      return fields.map(f => ({ value: f.name, name: f.label }));
    }

    let data: any = {};

    if (contentType.match(new RegExp('contacts:'))) {
      data.contentType = contentType;
      contentType = 'contacts';
    }

    return sendCommonMessage({
      subdomain,
      serviceName: contentType,
      action: 'documents.editorAttributes',
      isRPC: true,
      data
    });
  },

  documentsTotalCount(_root, args: IListParams, { models }: IContext) {
    const selector = generateFilter(args);

    return models.Documents.find(selector).countDocuments();
  }
};

checkPermission(documentQueries, 'documents', 'showDocuments', []);

export default documentQueries;
