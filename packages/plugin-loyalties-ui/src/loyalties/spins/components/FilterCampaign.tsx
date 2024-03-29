import { ControlLabel, FormControl, FormGroup } from '@saashq/ui/src';
import { Icon, Tip } from '@saashq/ui/src/components';
import { Sidebar, Wrapper } from '@saashq/ui/src/layout';
import { __, router } from '@saashq/ui/src/utils';

import React from 'react';
import SelectCampaigns from '../../containers/SelectCampaigns';
import SelectCustomers from '@saashq/ui-contacts/src/customers/containers/SelectCustomers';
import SelectTeamMembers from '@saashq/ui/src/team/containers/SelectTeamMembers';
import { SidebarFilters } from '../../common/styles';
import { queries as voucherCampaignQueries } from '../../../configs/voucherCampaign/graphql';

const { Section } = Wrapper.Sidebar;

interface IProps {
  history: any;
  queryParams: any;
}

class FilterCampaign extends React.Component<IProps> {
  clearCategoryFilter = () => {
    router.setParams(this.props.history, {
      ownerId: null,
      ownerType: null,
      status: null,
      voucherCampaignId: null
    });
  };

  setFilter = (name, value) => {
    router.setParams(this.props.history, { [name]: value });
  };

  render() {
    const { queryParams } = this.props;
    return (
      <Sidebar>
        <Section maxHeight={188} collapsible={false}>
          <Section.Title>
            {__('Addition filters')}
            <Section.QuickButtons>
              {(router.getParam(this.props.history, 'status') ||
                router.getParam(this.props.history, 'ownerType') ||
                router.getParam(this.props.history, 'ownerID') ||
                router.getParam(this.props.history, 'voucherCampaignId')) && (
                <a
                  href="#cancel"
                  tabIndex={0}
                  onClick={this.clearCategoryFilter}
                >
                  <Tip text={__('Clear filter')} placement="bottom">
                    <Icon icon="cancel-1" />
                  </Tip>
                </a>
              )}
            </Section.QuickButtons>
          </Section.Title>
          <SidebarFilters>
            <FormGroup>
              <ControlLabel>Voucher Campaign</ControlLabel>
              <SelectCampaigns
                queryName="voucherCampaigns"
                customQuery={voucherCampaignQueries.voucherCampaigns}
                label="Choose voucher campaign"
                name="campaignId"
                onSelect={voucherCampaignId =>
                  this.setFilter('voucherCampaignId', voucherCampaignId)
                }
                initialValue={queryParams.voucherCampaignId}
                filterParams={{ voucherType: 'spin' }}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Status</ControlLabel>
              <FormControl
                name="status"
                componentClass="select"
                defaultValue={queryParams.status}
                required={false}
                onChange={e =>
                  this.setFilter(
                    'status',
                    (e.currentTarget as HTMLInputElement).value
                  )
                }
              >
                <option key={''} value={''}>
                  {' '}
                  {'All status'}{' '}
                </option>
                <option key={'new'} value={'new'}>
                  {' '}
                  {'new'}{' '}
                </option>
                <option key={'used'} value={'used'}>
                  {' '}
                  {'used'}{' '}
                </option>
              </FormControl>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Owner type</ControlLabel>
              <FormControl
                name="ownerType"
                componentClass="select"
                defaultValue={queryParams.ownerType}
                required={false}
                onChange={e =>
                  this.setFilter(
                    'ownerType',
                    (e.currentTarget as HTMLInputElement).value
                  )
                }
              >
                <option key={''} value={''}>
                  {' '}
                  {'All types'}{' '}
                </option>
                <option key={'customer'} value={'customer'}>
                  {' '}
                  {'customer'}{' '}
                </option>
                <option key={'user'} value={'user'}>
                  {' '}
                  {'user'}{' '}
                </option>
                <option key={'company'} value={'company'}>
                  {' '}
                  {'company'}{' '}
                </option>
              </FormControl>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Customer</ControlLabel>
              <SelectCustomers
                customOption={{
                  value: '',
                  label: 'All customers'
                }}
                label="Customer"
                name="ownerId"
                multi={false}
                initialValue={queryParams.ownerId}
                onSelect={customerId => this.setFilter('ownerId', customerId)}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Team member</ControlLabel>
              <SelectTeamMembers
                customOption={{
                  value: '',
                  label: 'All team members'
                }}
                label="Team member"
                name="ownerId"
                multi={false}
                initialValue={queryParams.ownerId}
                onSelect={userId => this.setFilter('ownerId', userId)}
              />
            </FormGroup>
          </SidebarFilters>
        </Section>
      </Sidebar>
    );
  }
}

export default FilterCampaign;
