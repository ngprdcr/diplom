import {gql} from '@apollo/client';
import {SUBJECT_FRAGMENT} from './subjects.fragments';
import {Subject} from './subjects.types';

export type CreateSubjectData = { createSubject: Subject }

export type CreateSubjectVars = { createSubjectInputType: createSubjectInputType }
export type createSubjectInputType = {
    name: string,
    gradesHaveAccessReadIds: string[],
    teachersHaveAccessCreatePostsIds: string[],
}

export const CREATE_SUBJECT_MUTATION = gql`
    ${SUBJECT_FRAGMENT}
    mutation CreateSubject($createSubjectInputType: CreateSubjectInputType!) {
        createSubject(createSubjectInputType: $createSubjectInputType) {
            ...SubjectFragment
        }
    }
`;

export type UpdateSubjectData = { updateSubject: Subject }

export type UpdateSubjectVars = { updateSubjectInputType: updateSubjectInputType }
export type updateSubjectInputType = createSubjectInputType & { id: string, link: string }

export const UPDATE_SUBJECT_MUTATION = gql`
    ${SUBJECT_FRAGMENT}
    mutation UpdateSubject($updateSubjectInputType: UpdateSubjectInputType!) {
        updateSubject(updateSubjectInputType: $updateSubjectInputType) {
            ...SubjectFragment
        }
    }

`;

export type RemoveSubjectData = { removeSubject: boolean }
export type RemoveSubjectVars = { id: string }

export const REMOVE_SUBJECT_MUTATION = gql`
    mutation RemoveSubject($id: ID!) {
        removeSubject(id: $id)
    }
`;
