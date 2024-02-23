import _ from 'lodash';
import React from 'react';

import PeriodLockForm from '../containers/PeriodLockForm';
import { IPeriodLock } from '../types';
import { ActionButton } from '@saashq/ui/src/components/ActionButtons';
import Icon from '@saashq/ui/src/components/Icon';
import { formatValue } from '@saashq/ui/src/utils/core';
import FormControl from '@saashq/ui/src/components/form/Control';
import ModalTrigger from '@saashq/ui/src/components/ModalTrigger';

type Props = {
  periodLock: IPeriodLock;
  history: any;
  isChecked: boolean;
  toggleBulk: (periodLock: IPeriodLock, isChecked?: boolean) => void;
};

function displayValue(periodLock, name) {
  const value = _.get(periodLock, name);

  return formatValue(value);
}

function renderFormTrigger(trigger: React.ReactNode, periodLock: IPeriodLock) {
  const content = props => (
    <PeriodLockForm {...props} periodLock={periodLock} />
  );

  return (
    <ModalTrigger title="Edit periodLock" trigger={trigger} content={content} />
  );
}

function renderEditAction(periodLock: IPeriodLock) {
  const trigger = (
    <ActionButton
      style={{ cursor: 'pointer' }}
      children={<Icon icon="edit-1" />}
    />
  );

  return renderFormTrigger(trigger, periodLock);
}

function PeriodLockRow({ periodLock, history, isChecked, toggleBulk }: Props) {
  const onChange = e => {
    if (toggleBulk) {
      toggleBulk(periodLock, e.target.checked);
    }
  };

  const onClick = e => {
    e.stopPropagation();
  };

  const onTrClick = () => {
    history.push(`/saashq-plugin-loan/periodLock-details/${periodLock._id}`);
  };

  return (
    <tr onClick={onTrClick}>
      <td onClick={onClick}>
        <FormControl
          checked={isChecked}
          componentClass="checkbox"
          onChange={onChange}
        />
      </td>

      <td key={'code'}>{displayValue(periodLock, 'date')}</td>

      <td onClick={onClick}>{renderEditAction(periodLock)}</td>
    </tr>
  );
}

export default PeriodLockRow;
