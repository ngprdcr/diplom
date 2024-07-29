import {gql} from '@apollo/client';
import {SubjectPost, SubjectPostType} from './subjectPosts.types';
import {SUBJECT_POST_FRAGMENT} from './subjectPosts.fragments';

export type CreateSubjectPostData = { createSubjectPost: SubjectPost }

export type CreateSubjectPostVars = { createSubjectPostInputType: CreateSubjectPostInputType, withHomeworks: boolean, withFiles: boolean, withStatistics: boolean }
export type CreateSubjectPostInputType = {
    title: string,
    text: string,
    type: SubjectPostType,
    subjectId: string,
}

export const CREATE_SUBJECT_POST_MUTATION = gql`
    ${SUBJECT_POST_FRAGMENT}
    mutation CreateSubjectPost($createSubjectPostInputType: CreateSubjectPostInputType!, $withHomeworks: Boolean!, $withFiles: Boolean!, $withStatistics: Boolean!) {
        createSubjectPost(createSubjectPostInputType: $createSubjectPostInputType) {
            ...SubjectPostFragment
        }
    }
`;

export type UpdateSubjectPostData = { updateSubjectPost: SubjectPost }

export type UpdateSubjectPostVars = { updateSubjectPostInputType: UpdateSubjectPostInputType, withHomeworks: boolean, withFiles: boolean, withStatistics: boolean }
export type UpdateSubjectPostInputType = Omit<CreateSubjectPostInputType & { id: string }, 'subjectId'>

export const UPDATE_SUBJECT_POST_MUTATION = gql`
    ${SUBJECT_POST_FRAGMENT}
    mutation UpdateSubjectPost($updateSubjectPostInputType: UpdateSubjectPostInputType!, $withHomeworks: Boolean!, $withFiles: Boolean!, $withStatistics: Boolean!) {
        updateSubjectPost(updateSubjectPostInputType: $updateSubjectPostInputType) {
            ...SubjectPostFragment
        }
    }

`;

export type RemoveSubjectPostData = { removeSubjectPost: boolean }
export type RemoveSubjectPostVars = { id: string }

export const REMOVE_SUBJECT_POST_MUTATION = gql`
    mutation RemoveSubjectPost($id: ID!) {
        removeSubjectPost(id: $id)
    }
`;
