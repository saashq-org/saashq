import AvatarUpload from '@saashq/ui/src/components/AvatarUpload';
import CollapseContent from '@saashq/ui/src/components/CollapseContent';
import FormControl from '@saashq/ui/src/components/form/Control';
import FormGroup from '@saashq/ui/src/components/form/Group';
import ControlLabel from '@saashq/ui/src/components/form/Label';
import timezones from '@saashq/ui/src/constants/timezones';
import { FormColumn, FormWrapper } from '@saashq/ui/src/styles/main';
import { IFormProps } from '@saashq/ui/src/types';
import { __, getConstantFromStore } from '@saashq/ui/src/utils';
import React from 'react';
import dayjs from 'dayjs';
import { IUser } from '@saashq/ui/src/auth/types';

type Props = {
  user: IUser;
  onAvatarUpload: (url: string) => void;
  formProps?: IFormProps;
};

class UserCommonInfos extends React.PureComponent<Props> {
  renderLink(link) {
    const { user, formProps } = this.props;
    const links = user.links || {};

    return (
      <FormGroup key={link.value}>
        <ControlLabel>{link.label}</ControlLabel>
        <FormControl
          type="url"
          name={link.value}
          defaultValue={links[link.value] || ''}
          {...formProps}
        />
      </FormGroup>
    );
  }

  render() {
    const { user, onAvatarUpload, formProps } = this.props;
    const details = user.details || {};

    return (
      <>
        <CollapseContent
          title={__('General Information')}
          open={true}
          compact={true}
        >
          <AvatarUpload
            avatar={details.avatar}
            onAvatarUpload={onAvatarUpload}
          />
          <FormWrapper>
            <FormColumn>
              <FormGroup>
                <ControlLabel>First name</ControlLabel>
                <FormControl
                  type="text"
                  name="firstName"
                  defaultValue={details.firstName || ''}
                  {...formProps}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Last name</ControlLabel>
                <FormControl
                  type="text"
                  name="lastName"
                  defaultValue={details.lastName || ''}
                  {...formProps}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel required={true}>Email</ControlLabel>
                <FormControl
                  type="email"
                  name="email"
                  defaultValue={user.email}
                  {...formProps}
                  required={true}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Description</ControlLabel>
                <FormControl
                  type="text"
                  name="description"
                  max={250}
                  componentClass="textarea"
                  defaultValue={details.description || ''}
                  {...formProps}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Position</ControlLabel>
                <FormControl
                  type="text"
                  name="position"
                  defaultValue={details.position}
                  {...formProps}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Join date</ControlLabel>
                <FormControl
                  type="date"
                  name="workStartedDate"
                  defaultValue={dayjs(
                    details.workStartedDate || new Date()
                  ).format('YYYY-MM-DD')}
                  {...formProps}
                />
              </FormGroup>
            </FormColumn>
            <FormColumn>
              <FormGroup>
                <ControlLabel>Middle name</ControlLabel>
                <FormControl
                  type="text"
                  name="middleName"
                  defaultValue={details.middleName || ''}
                  {...formProps}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Short name</ControlLabel>
                <FormControl
                  type="text"
                  name="shortName"
                  defaultValue={details.shortName || ''}
                  {...formProps}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel required={true}>Username</ControlLabel>
                <FormControl
                  type="text"
                  name="username"
                  defaultValue={user.username}
                  required={true}
                  {...formProps}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Employee Id</ControlLabel>
                <FormControl
                  type="number"
                  min={0}
                  name="employeeId"
                  defaultValue={user.employeeId}
                  {...formProps}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Birthdate</ControlLabel>
                <FormControl
                  type="date"
                  name="birthDate"
                  defaultValue={dayjs(details.birthDate || new Date()).format(
                    'YYYY-MM-DD'
                  )}
                  {...formProps}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Phone (operator)</ControlLabel>
                <FormControl
                  type="text"
                  name="operatorPhone"
                  defaultValue={details.operatorPhone || ''}
                  {...formProps}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Location</ControlLabel>
                <FormControl
                  componentClass="select"
                  defaultValue={details.location}
                  name="location"
                  options={timezones}
                  {...formProps}
                />
              </FormGroup>
            </FormColumn>
          </FormWrapper>
        </CollapseContent>

        <CollapseContent title={__('Links')} compact={true}>
          <FormWrapper>
            <FormColumn>
              {getConstantFromStore('social_links').map(link =>
                this.renderLink(link)
              )}
            </FormColumn>
          </FormWrapper>
        </CollapseContent>
      </>
    );
  }
}

export default UserCommonInfos;
