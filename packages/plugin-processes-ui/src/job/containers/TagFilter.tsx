import * as compose from 'lodash.flowright';

import { CountByTagsQueryResponse } from '../types';
import CountsByTag from '@saashq/ui/src/components/CountsByTag';
import React from 'react';
import { TAG_TYPES } from '@saashq/ui-tags/src/constants';
import { TagsQueryResponse } from '@saashq/ui-tags/src/types';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';
import { isEnabled } from '@saashq/ui/src/utils/core';
import { queries } from '../graphql';
import { queries as tagQueries } from '@saashq/ui-tags/src/graphql';

const TagFilterContainer = (props: {
  countByTagsQuery: CountByTagsQueryResponse;
  tagsQuery?: TagsQueryResponse;
}) => {
  const { countByTagsQuery, tagsQuery } = props;

  const counts = countByTagsQuery.productCountByTags || {};

  return (
    <CountsByTag
      tags={(tagsQuery ? tagsQuery.tags : null) || []}
      counts={counts}
      manageUrl="/tags/product"
      loading={(tagsQuery ? tagsQuery.loading : null) || false}
    />
  );
};

export default compose(
  graphql<{}, CountByTagsQueryResponse, {}>(gql(queries.productCountByTags), {
    name: 'countByTagsQuery'
  }),
  graphql<{}, TagsQueryResponse, { type: string }>(gql(tagQueries.tags), {
    name: 'tagsQuery',
    options: () => ({
      variables: {
        type: TAG_TYPES.PRODUCT
      }
    }),
    skip: !isEnabled('tags') ? true : false
  })
)(TagFilterContainer);
