import {gql} from '@apollo/client';
import {SUBJECT_POST_FRAGMENT} from "./subjectPosts.fragments";
import {SubjectPost} from "./subjectPosts.types";

export type GetSubjectPostData = { getSubjectPost: SubjectPost }
export type GetSubjectPostVars = { id: string, withHomeworks: boolean, withStatistics: boolean, withFiles: boolean }

export const GET_SUBJECT_POST_QUERY = gql`
    ${SUBJECT_POST_FRAGMENT}
    query GetSubjectPost($id: ID!, $withHomeworks: Boolean!, $withStatistics: Boolean!, $withFiles: Boolean!) {
        getSubjectPost(id: $id) {
            ...SubjectPostFragment
        }
    }
`;
