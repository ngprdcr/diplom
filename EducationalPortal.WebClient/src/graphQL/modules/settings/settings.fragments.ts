import {gql} from '@apollo/client';

export const SETTING_FRAGMENT = gql`
    fragment SettingFragment on SettingType {
        id
        name
        value
        createdAt
        updatedAt
    }
`;
