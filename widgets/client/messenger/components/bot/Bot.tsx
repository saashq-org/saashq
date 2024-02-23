import * as React from 'react';
import { chatbot } from '../../../icons/Icons';
import { readFile } from '../../../utils';

function Bot() {
  return (
    <div className="saashq-avatar top">
      <img src={readFile(chatbot)} alt="avatar" />
    </div>
  );
}

export default Bot;
