import {gql} from '@apollo/client';
import {EDUCATIONAL_YEAR_FRAGMENT} from './educationalYears.fragments';
import {EducationalYear} from './educationalYears.types';

export type CreateEducationalYearData = { createEducationalYear: EducationalYear }

export type CreateEducationalYearVars = { createEducationalYearInputType: createEducationalYearInputType }
export type createEducationalYearInputType = {
    name: string,
    dateStart: string,
    dateEnd: string
}

export const CREATE_EDUCATIONAL_YEAR_MUTATION = gql`
    ${EDUCATIONAL_YEAR_FRAGMENT}
    mutation CreateEducationalYear($createEducationalYearInputType: CreateEducationalYearInputType!) {
        createEducationalYear(createEducationalYearInputType: $createEducationalYearInputType) {
            ...EducationalYearFragment
        }
    }

`;

export type UpdateEducationalYearData = { updateEducationalYear: EducationalYear }

export type UpdateEducationalYearVars = { updateEducationalYearInputType: updateEducationalYearInputType }
export type updateEducationalYearInputType = createEducationalYearInputType & { id: string, isCurrent: boolean }

export const UPDATE_EDUCATIONAL_YEAR_MUTATION = gql`
    ${EDUCATIONAL_YEAR_FRAGMENT}
    mutation UpdateEducationalYear($updateEducationalYearInputType: UpdateEducationalYearInputType!) {
        updateEducationalYear(updateEducationalYearInputType: $updateEducationalYearInputType) {
            ...EducationalYearFragment
        }
    }
`;

export type RemoveEducationalYearData = { removeEducationalYear: boolean }
export type RemoveEducationalYearVars = { id: string }

export const REMOVE_EDUCATIONAL_YEAR_MUTATION = gql`
    mutation RemoveEducationalYear($id: ID!) {
        removeEducationalYear(id: $id)
    }
`;
