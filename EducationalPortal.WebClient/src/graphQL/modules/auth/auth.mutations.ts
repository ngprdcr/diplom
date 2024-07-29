import {gql} from '@apollo/client';
import {Auth} from './auth.types';
import {USER_FRAGMENT} from '../users/users.fragments';

export type LoginData = { login: Auth }

export type LoginVars = { loginAuthInputType: loginAuthInputType }
export type loginAuthInputType = {
    login: string,
    password: string,
}

export const LOGIN_MUTATION = gql`
    ${USER_FRAGMENT}
    mutation Login($loginAuthInputType: LoginAuthInputType!) {
        login(loginAuthInputType: $loginAuthInputType) {
            user {
                ...UserFragment
            }
            token
        }
    }
`;


export type ChangePasswordData = { changePassword: boolean }

export type ChangePasswordVars = { changePasswordInputType: ChangePasswordInputType }
export type ChangePasswordInputType = {
    oldPassword: string,
    newPassword: string,
}

export const CHANGE_PASSWORD_MUTATION = gql`
    mutation ChangePassword($changePasswordInputType: ChangePasswordInputType!) {
        changePassword(changePasswordInputType: $changePasswordInputType)
    }
`;
