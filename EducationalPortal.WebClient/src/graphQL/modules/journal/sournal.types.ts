export type JournalMark = {
    id: string;
    mark: number | null;
    type: 'DEFAULT' | 'HOMEWORK';
    date: string;
    studentId: string;
}

export type Student = {
    id: string,
    firstName: string,
    lastName: string,
}