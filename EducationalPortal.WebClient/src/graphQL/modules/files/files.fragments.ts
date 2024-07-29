import {gql} from '@apollo/client';

export const FILE_FRAGMENT = gql`
    fragment FileFragment on FileType {
        id
        name
        path
        createdAt
        updatedAt
    }
`;
