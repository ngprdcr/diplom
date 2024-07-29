import {gql} from '@apollo/client';
import {EDUCATIONAL_YEAR_FRAGMENT, EDUCATIONAL_YEAR_WITH_SUBJECTS_FRAGMENT} from './educationalYears.fragments';
import {EducationalYear} from './educationalYears.types';

export type GetEducationalYearsData = { getEducationalYears: getEducationalYearsType }
export type getEducationalYearsType = { entities: EducationalYear[], total: number, pageSize: number }

export type GetEducationalYearsVars = { page: number, like: string }

export const GET_EDUCATIONAL_YEARS_QUERY = gql`
    ${EDUCATIONAL_YEAR_FRAGMENT}
    query GetEducationalYears($page: Int!, $like: String!) {
        getEducationalYears(page: $page, like: $like) {
            entities {
                ...EducationalYearFragment
            }
            total
            pageSize
        }
    }
`;

export type GetEducationalYearData = { getEducationalYear: EducationalYear }
export type GetEducationalYearVars = { id: string }

export const GET_EDUCATIONAL_YEAR_QUERY = gql`
    ${EDUCATIONAL_YEAR_FRAGMENT}
    query GetEducationalYear($id: ID!) {
        getEducationalYear(id: $id) {
            ...EducationalYearFragment
        }
    }
`;

export type GetEducationalYearWithSubjectsData = { getEducationalYear: EducationalYear }
export type GetEducationalYearWithSubjectsVars = GetEducationalYearVars & { subjectsPage: number }

export const GET_EDUCATIONAL_YEAR_WITH_SUBJECTS_QUERY = gql`
    ${EDUCATIONAL_YEAR_WITH_SUBJECTS_FRAGMENT}
    query GetEducationalYear($id: ID!, $subjectsPage: Int!) {
        getEducationalYear(id: $id) {
            ...EducationalYearWithSubjectsFragment
        }
    }
`;
