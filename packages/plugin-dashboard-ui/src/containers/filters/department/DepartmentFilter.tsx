import gql from 'graphql-tag';
import React from 'react';
import { useQuery } from 'react-apollo';
import Spinner from '@saashq/ui/src/components/Spinner';
import { queries } from '@saashq/ui/src/team/graphql';
import Box from '@saashq/ui/src/components/Box';
import ErrorMsg from '@saashq/ui/src/components/ErrorMsg';
import { MenuFooter } from '../../../styles';
import { __ } from '@saashq/ui/src/utils/core';
import List from '../../../components/department/DepartmentFilter';

export default function DepartmentFilterContainer() {
  const listQuery = useQuery(gql(queries.departments));

  if (listQuery.loading) {
    return <Spinner />;
  }

  if (listQuery.error) {
    return (
      <Box isOpen={true} title={__('Department')} name="showDepartment">
        <MenuFooter>
          <ErrorMsg>{listQuery.error.message}</ErrorMsg>
        </MenuFooter>
      </Box>
    );
  }

  return <List listQuery={listQuery} />;
}
