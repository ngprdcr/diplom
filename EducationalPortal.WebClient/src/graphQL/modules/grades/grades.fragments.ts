import {gql} from '@apollo/client';

export const GRADE_FRAGMENT = gql`
    fragment GradeFragment on GradeType {
        id
        name
        createdAt
        updatedAt
    }
`;
