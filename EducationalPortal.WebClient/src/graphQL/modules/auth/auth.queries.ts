import {gql} from '@apollo/client';
import {Auth} from './auth.types';
import {USER_FRAGMENT} from '../users/users.fragments';

export type MeData = { me: Auth }
export type MeVars = {}

export const ME_QUERY = gql`
    ${USER_FRAGMENT}
    query Me {
        me {
            user {
                ...UserFragment
            }
            token
        }
    }
`;
