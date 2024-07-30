import {gql} from '@apollo/client';
import {SUBJECT_FRAGMENT, SUBJECT_WITH_POSTS_FRAGMENT} from './subjects.fragments';
import {Subject} from './subjects.types';

export type GetSubjectData = { getSubject: Subject }
export type GetSubjectVars = { id: string }

export const GET_SUBJECT_QUERY = gql`
    ${SUBJECT_FRAGMENT}
    query GetSubject($id: Guid!) {
        getSubject(id: $id) {
            ...SubjectFragment
        }
    }
`;


export type GetSubjectsData = { getSubjects: getSubjectsType }
export type getSubjectsType = { entities: Subject[], total: number, pageSize: number }

export type GetSubjectsVars = { page: number, like: string }

export const GET_SUBJECTS_QUERY = gql`
    ${SUBJECT_FRAGMENT}
    query GetSubjects($page: Int!, $like: String!) {
        getSubjects(page: $page, like: $like) {
            entities {
                ...SubjectFragment
            }
            total
            pageSize
        }
    }
`;


export type GetSubjectWithPostsData = { getSubject: Subject }
export type GetSubjectWithPostsVars = { id: string, postsPage: number, withHomeworks: boolean, withFiles: boolean, withStatistics: boolean }

export const GET_SUBJECT_WITH_POSTS_QUERY = gql`
    ${SUBJECT_WITH_POSTS_FRAGMENT}
    query GetSubject($id: Guid!, $postsPage: Int!, $withHomeworks: Boolean!, $withFiles: Boolean!, $withStatistics: Boolean!) {
        getSubject(id: $id) {
            ...SubjectWithPostsFragment
        }
    }
`;


export type GetMySubjectsData = { getMySubjects: getMySubjectsType }
export type getMySubjectsType = { entities: Subject[], total: number, pageSize: number }

export type GetMySubjectsVars = { page: number, like: string }

export const GET_MY_SUBJECTS_QUERY = gql`
    ${SUBJECT_FRAGMENT}
    query GetMySubjects($page: Int!, $like: String!) {
        getMySubjects(page: $page, like: $like) {
            entities {
                ...SubjectFragment
            }
            total
            pageSize
        }
    }
`;
