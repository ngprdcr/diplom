import {gql} from '@apollo/client';

export type CreateBackupData = { createBackup: boolean }

export type CreateBackupVars = {}

export const CREATE_BACKUP_MUTATION = gql`
    mutation CreateBackup {
        createBackup
    }
`;

export type RestoreBackupData = { restoreBackup: boolean }
export type RestoreBackupVars = { url: string }

export const RESTORE_BACKUP_MUTATION = gql`
    mutation RestoreBackup($url: String!) {
        restoreBackup(url: $url)
    }
`;

export type RemoveBackupData = { removeBackup: boolean }
export type RemoveBackupVars = { url: string }

export const REMOVE_BACKUP_MUTATION = gql`
    mutation RemoveBackup($url: String!) {
        removeBackup(url: $url)
    }
`;