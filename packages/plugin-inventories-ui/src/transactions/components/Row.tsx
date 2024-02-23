import AsyncComponent from '@saashq/ui/src/components/AsyncComponent';
import Button from '@saashq/ui/src/components/Button';
import Icon from '@saashq/ui/src/components/Icon';
import ModalTrigger from '@saashq/ui/src/components/ModalTrigger';
import moment from 'moment';
import React from 'react';
import Tip from '@saashq/ui/src/components/Tip';
import { __ } from '@saashq/ui/src/utils/core';
import { DateWrapper } from '@saashq/ui/src/styles/main';

const RowModalContent = AsyncComponent(() =>
  import(
    /* webpackChunkName: "LogModalContainer" */ '../containers/RowModalContent'
  )
);

type Props = {
  data: any;
};

const Row = (props: Props) => {
  const { data } = props;

  const content = () => <RowModalContent data={data} />;

  return (
    <tr>
      <td>{((data && data.branch) || {}).title || 'Branch'}</td>
      <td>{((data && data.department) || {}).title || 'Department'}</td>
      <td>{data && data.contentType}</td>
      <td>
        <Icon icon="calender" />{' '}
        <DateWrapper>
          {moment(data.createdAt).format('YYYY/MM/DD') || 'Created at'}
        </DateWrapper>
      </td>
      <td>
        <div>
          <ModalTrigger
            size="xl"
            title={__('Transaction')}
            trigger={
              <Button btnStyle="link">
                <Tip text="View" placement="top">
                  <Icon icon="eye" />
                </Tip>
              </Button>
            }
            content={content}
            dialogClassName="wide-modal"
          />
        </div>
      </td>
    </tr>
  );
};

export default Row;
