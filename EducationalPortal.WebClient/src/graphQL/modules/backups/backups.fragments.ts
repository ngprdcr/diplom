import {gql} from '@apollo/client';

export const BACKUP_FRAGMENT = gql`
    fragment BackupFragment on BackupType {
        url
    }
`;
