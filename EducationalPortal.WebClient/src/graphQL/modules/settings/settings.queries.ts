import {gql} from '@apollo/client';
import {SETTING_FRAGMENT} from './settings.fragments';
import {Setting} from './settings.types';

export type GetSettingsData = { getSettings: Setting[] }
export type GetSettingsVars = { }

export const GET_SETTINGS_QUERY = gql`
    ${SETTING_FRAGMENT}
    query GetSettings {
        getSettings {
            ...SettingFragment
        }
    }
`;
