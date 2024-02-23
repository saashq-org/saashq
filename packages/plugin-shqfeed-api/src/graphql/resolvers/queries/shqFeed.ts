import { checkPermission, requireLogin } from '@saashq/api-utils/src';
import * as moment from 'moment';
import { sendCoreMessage } from '../../../messageBroker';
import { IContext } from '../../../connectionResolver';

const getDateRange = (filterType: string) => {
  return {
    $gte: new Date(
      moment()
        .add(filterType === 'today' ? 0 : 1, 'days')
        .format('YYYY-MM-DD'),
    ),
    $lt: new Date(
      moment()
        .add(filterType === 'today' ? 1 : 8, 'days')
        .format('YYYY-MM-DD'),
    ),
  };
};

const shqFeedQueries = {
  shqFeedDetail: async (_root, params, { models }) => {
    return models.ShqFeed.findOne({ _id: params._id });
  },

  shqFeedCeremonies: async (_root, { contentType, filterType }, { models }) => {
    const filter: {
      'ceremonyData.willDate': any;
      contentType?: string;
    } = {
      'ceremonyData.willDate': getDateRange(filterType),
    };

    if (contentType) {
      filter.contentType = contentType;
    }

    return {
      list: await models.ShqFeed.find(filter),
      totalCount: await models.ShqFeed.find(filter).countDocuments(),
    };
  },

  shqFeed: async (
    _root,
    {
      isPinned,
      title,
      contentTypes,
      limit,
      skip,
      recipientType,
      type,
      startDate,
      endDate,
      bravoType,
      category,
    },
    { models, user, subdomain },
  ) => {
    const departmentIds = user.departmentIds || [];

    const currentUser = await sendCoreMessage({
      subdomain,
      action: 'users.findOne',
      data: { _id: user._id },
      isRPC: true,
    });

    const branchIds = currentUser.branchIds || [];

    const units = await sendCoreMessage({
      subdomain,
      action: 'units.find',
      data: {
        userIds: user._id,
      },
      isRPC: true,
      defaultValue: [],
    });

    const unitIds = units.map((unit) => unit._id) || [];

    const unitCondition = [
      { unitId: { $exists: false } },
      { unitId: null },
      { unitId: '' },
    ];

    const branchCondition = [
      { branchIds: { $eq: [] } },
      { branchIds: { $size: 0 } },
    ];

    const departmentCondition = [
      { departmentIds: { $eq: [] } },
      { departmentIds: { $size: 0 } },
    ];

    const recipientCondition = [
      { recipientIds: { $eq: [] } },
      { recipientIds: { $size: 0 } },
    ];

    const filter: any = {
      $or: [
        {
          $and: [
            { branchIds: { $in: branchIds } },
            { unitId: { $in: unitIds } },
            { departmentIds: { $in: departmentIds } },
          ],
        },
        {
          $and: [
            {
              $or: [
                { branchIds: { $in: branchIds } },
                { unitId: { $in: unitIds } },
                { departmentIds: { $in: departmentIds } },
              ],
            },
          ],
        },
        {
          $and: [
            { branchIds: { $in: branchIds } },
            { unitId: { $in: unitIds } },
          ],
        },
        {
          $and: [
            { branchIds: { $in: branchIds } },
            { departmentIds: { $in: departmentIds } },
          ],
        },
        {
          $and: [
            { unitId: { $in: unitIds } },
            { departmentIds: { $in: departmentIds } },
          ],
        },
        {
          $and: [{ recipientIds: { $in: [user._id] } }],
        },
        {
          $and: [{ branchIds: { $in: branchIds } }],
        },
        {
          $and: [{ unitId: { $in: unitIds } }],
        },
        {
          $and: [{ departmentIds: { $in: departmentIds } }],
        },
        {
          $and: [
            {
              $or: branchCondition,
            },
            {
              $or: unitCondition,
            },
            {
              $or: departmentCondition,
            },
            {
              $or: recipientCondition,
            },
          ],
        },
        { createdBy: user._id },
      ],
    };

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: startDate,
        $lt: endDate,
      };
    }

    if (
      contentTypes &&
      contentTypes.includes('publicHoliday') &&
      type === 'recipient'
    ) {
      filter.createdAt = { $lt: new Date() };
    }

    if (title) {
      filter.title = new RegExp(`.*${title}.*`, 'i');
    }

    if (category) {
      filter.category = category;
    }

    if (contentTypes && contentTypes.length > 0) {
      filter.contentType = { $in: contentTypes };
    }

    if (contentTypes && contentTypes.includes('bravo')) {
      if (recipientType === 'recieved') {
        filter.recipientIds = { $in: [user._id] };
      } else if (recipientType === 'sent') {
        filter.createdBy = user._id;
      } else {
        filter.$or.push(
          { recipientIds: { $in: [user._id] } },
          { createdBy: user._id },
        );
      }
    }

    if (isPinned !== undefined) {
      if (isPinned) {
        filter.isPinned = true;
      } else {
        filter.isPinned = { $ne: true };
      }
    }

    if (bravoType) {
      filter.customFieldsData = { $elemMatch: { value: bravoType } };
    }

    if (contentTypes && contentTypes.includes('event')) {
      const currentDate = new Date();

      const events = await models.ShqFeed.find({ contentType: 'event' });

      for (const event of events) {
        if (event.eventData.endDate < currentDate) {
          const { _id } = event;

          await models.ShqFeed.updateOne(
            { _id },
            {
              $set: {
                isPinned: false,
              },
            },
          );
        }
      }

      return {
        list: await models.ShqFeed.find(filter)
          .sort({
            'ShqEventData.startDate': -1,
          })
          .skip(skip || 0)
          .limit(limit || 20),
        totalCount: await models.ShqFeed.find(filter).countDocuments(),
      };
    }

    return {
      list: await models.ShqFeed.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip || 0)
        .limit(limit || 20),
      totalCount: await models.ShqFeed.find(filter).countDocuments(),
    };
  },
  shqFeedEventsByUser: async (
    _root,
    { userId },
    { models, user, subdomain }: IContext,
  ) => {
    const getUserId = userId || user._id;

    const goingEvents = await models.ShqFeed.find({
      contentType: /event/gi,
      'eventData.goingUserIds': getUserId,
    });

    const interestedEvents = await models.ShqFeed.find({
      contentType: /event/gi,
      'eventData.interestedUserIds': getUserId,
    });

    return { goingEvents, interestedEvents };
  },
};

// checkPermission(shqFeedQueries, "shqFeedDetail", "showShqActivityFeed");
// checkPermission(shqFeedQueries, "shqFeedCeremonies", "showShqActivityFeed");
// checkPermission(shqFeedQueries, "shqFeed", "showShqActivityFeed");

export default shqFeedQueries;
