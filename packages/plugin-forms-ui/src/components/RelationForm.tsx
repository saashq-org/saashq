import ControlLabel from '@saashq/ui/src/components/form/Label';
import FormGroup from '@saashq/ui/src/components/form/Group';
import { IField } from '@saashq/ui/src/types';
import Info from '@saashq/ui/src/components/Info';
import React from 'react';
import { __ } from '@saashq/ui/src/utils';
import { loadDynamicComponent } from '@saashq/ui/src/utils/core';

type Props = {
  contentType: string;
  fields: IField[];
  onChange: (ids: string[], relationType: string) => void;
};

const RelationForm = (props: Props) => {
  const fields = props.fields;

  return (
    <>
      {fields.map(field => (
        <FormGroup key={field._id}>
          <ControlLabel>{`Select ${field.text}`}</ControlLabel>
          {loadDynamicComponent(
            'selectRelation',
            {
              ...props,
              field
            },
            true
          )}
        </FormGroup>
      ))}

      <Info>
        <a
          target="_blank"
          href={`/settings/properties?type=${props.contentType}`}
          rel="noopener noreferrer"
        >
          {__(
            'You can configure basic property and relations in properties settings'
          )}
        </a>
      </Info>
    </>
  );
};

export default RelationForm;
