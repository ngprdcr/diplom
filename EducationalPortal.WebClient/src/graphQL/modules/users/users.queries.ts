import {gql} from '@apollo/client';
import {Role, User} from './users.types';
import {USER_FRAGMENT, USER_WITH_GRADE_FRAGMENT} from './users.fragments';

export type GetUserWithGradeData = { getUser: User }
export type GetUserWithGradeVars = { id: string }

export const GET_USER_WITH_GRADE_QUERY = gql`
    ${USER_WITH_GRADE_FRAGMENT}
    query GetUser($id: ID!) {
        getUser(id: $id) {
            ...UserWithGradeFragment
        }
    }
`;

export type GetUserData = { getUser: User }
export type GetUserVars = { id: string }

export const GET_USER_QUERY = gql`
    ${USER_FRAGMENT}
    query GetUser($id: ID!) {
        getUser(id: $id) {
            ...UserFragment
        }
    }
`;

export type GetUsersData = { getUsers: getUsersType }
export type getUsersType = { entities: User[], total: number, pageSize: number }

export type GetUsersVars = { page: number, roles: Role[], like: string }

export const GET_USERS_QUERY = gql`
    ${USER_FRAGMENT}
    query GetUsers($page: Int!, $roles: [UserRoleEnum], $like: String!) {
        getUsers(page: $page, roles: $roles, like: $like) {
            entities {
                ...UserFragment
            }
            total
            pageSize
        }
    }
`;

export type GetUsersWithGradeData = { getUsers: getUsersWithGradeType }
export type getUsersWithGradeType = { entities: User[], total: number, pageSize: number }

export type GetUsersWithGradeVars = { page: number, roles: Role[], like: string }

export const GET_USERS_WITH_GRADE_QUERY = gql`
    ${USER_WITH_GRADE_FRAGMENT}
    query GetUsers($page: Int!, $roles: [UserRoleEnum], $like: String!) {
        getUsers(page: $page, roles: $roles, like: $like) {
            entities {
                ...UserWithGradeFragment
            }
            total
            pageSize
        }
    }
`;
