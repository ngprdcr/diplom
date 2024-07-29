import {gql} from '@apollo/client';
import {SETTING_FRAGMENT} from './settings.fragments';
import {Setting} from './settings.types';

export type CreateOrUpdateSettingData = { createOrUpdateSetting: Setting }

export type CreateOrUpdateSettingVars = { createOrUpdateSettingInputType: createOrUpdateSettingInputType }
export type createOrUpdateSettingInputType = {
    name: string,
    value: string,
}

export const CREATE_OR_UPDATE_SETTING_MUTATION = gql`
    ${SETTING_FRAGMENT}
    mutation CreateOrUpdateSetting($createOrUpdateSettingInputType: CreateOrUpdateSettingInputType!) {
        createOrUpdateSetting(createOrUpdateSettingInputType: $createOrUpdateSettingInputType) {
            ...SettingFragment
        }
    }
`;
