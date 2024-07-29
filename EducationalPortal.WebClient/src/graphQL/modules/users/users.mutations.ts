import {gql} from '@apollo/client';
import {USER_FRAGMENT} from './users.fragments';
import {Role, User} from './users.types';

export type CreateUserData = { createUser: User }

export type CreateUserVars = { createUserInputType: createUserInputType }
export type createUserInputType = {
    firstName: string,
    lastName: string,
    middleName: string,
    login: string,
    password: string,
    email: string,
    phoneNumber: string,
    dateOfBirth: string,
    role: Role,
    gradeId: string | undefined,
}

export const CREATE_USER_MUTATION = gql`
    ${USER_FRAGMENT}
    mutation CreateUser($createUserInputType: CreateUserInputType!) {
        createUser(createUserInputType: $createUserInputType) {
            ...UserFragment
        }
    }
`;


export type UpdateUserData = { updateUser: User }

export type UpdateUserVars = { updateUserInputType: updateUserInputType }
export type updateUserInputType = Omit<createUserInputType & { id: string }, 'password'>

export const UPDATE_USER_MUTATION = gql`
    ${USER_FRAGMENT}
    mutation UpdateUser($updateUserInputType: UpdateUserInputType!) {
        updateUser(updateUserInputType: $updateUserInputType) {
            ...UserFragment
        }
    }
`;


export type RemoveUserData = { removeUser: boolean }
export type RemoveUserVars = { id: string }

export const REMOVE_USER_MUTATION = gql`
    mutation RemoveUser($id: ID!) {
        removeUser(id: $id)
    }
`;
