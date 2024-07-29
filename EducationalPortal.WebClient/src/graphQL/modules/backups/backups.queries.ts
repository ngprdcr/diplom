import {gql} from '@apollo/client';
import {BACKUP_FRAGMENT} from "./backups.fragments";
import {Backup} from "./backup.types";

export type GetBackupsData = { getBackups: Backup[] }
export type getBackupsType = { entities: Backup[], total: number, pageSize: number }

export type GetBackupsVars = { page: number, like: string }

export const GET_BACKUPS_QUERY = gql`
    ${BACKUP_FRAGMENT}
    query GetBackups($page: Int!, $like: String!) {
        getBackups(page: $page, like: $like){
            ...BackupFragment
        }
    }
`;
