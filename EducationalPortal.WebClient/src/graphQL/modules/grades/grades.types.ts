import {getUsersType} from '../users/users.queries';

export type Grade = {
    id: string,
    name: string,
    students: getUsersType,
    createdAt: string,
    updatedAt: string,
}
