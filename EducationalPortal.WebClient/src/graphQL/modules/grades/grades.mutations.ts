import {gql} from '@apollo/client';
import {Grade} from './grades.types';
import {GRADE_FRAGMENT} from './grades.fragments';

export type CreateGradeData = { createGrade: Grade }

export type CreateGradeVars = { createGradeInputType: createGradeInputType }
export type createGradeInputType = {
    name: string,
}

export const CREATE_GRADE_MUTATION = gql`
    ${GRADE_FRAGMENT}
    mutation CreateGrade($createGradeInputType: CreateGradeInputType!) {
        createGrade(createGradeInputType: $createGradeInputType) {
            ...GradeFragment
        }
    }
`;

export type UpdateGradeData = { updateGrade: Grade }

export type UpdateGradeVars = { updateGradeInputType: updateGradeInputType }
export type updateGradeInputType = createGradeInputType & { id: string }

export const UPDATE_GRADE_MUTATION = gql`
    ${GRADE_FRAGMENT}
    mutation UpdateGrade($updateGradeInputType: UpdateGradeInputType!) {
        updateGrade(updateGradeInputType: $updateGradeInputType) {
            ...GradeFragment
        }
    }
`;

export type RemoveGradeData = { removeGrade: boolean }
export type RemoveGradeVars = { id: string }

export const REMOVE_GRADE_MUTATION = gql`
    mutation RemoveGrade($id: ID!) {
        removeGrade(id: $id)
    }
`;
