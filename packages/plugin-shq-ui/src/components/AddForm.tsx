import React, { useState } from 'react';

import { FormControl } from '@saashq/ui/src/components/form';
import Button from '@saashq/ui/src/components/Button';

type Props = {
  add: (variables: { name: string }) => void;
};

export default function AddForm({ add }: Props) {
  const [name, setName] = useState('');

  const onSubmit = e => {
    e.preventDefault();

    add({ name });
  };

  return (
    <form style={{ padding: 50 }} onSubmit={onSubmit}>
      <FormControl
        value={name}
        placeholder="Name"
        onChange={(e: any) => setName(e.target.value)}
      />
      <br />

      <Button style={{ float: 'right' }} type="submit">
        Add
      </Button>
    </form>
  );
}
