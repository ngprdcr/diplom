import styles from './Journal.module.css';
import React from "react";
import {JournalMark, Student} from "../../../../graphQL/modules/journal/sournal.types";

type Props = {
    type: 'DEFAULT' | 'HOMEWORK';
    marks: JournalMark[] | undefined;
    date: string;
    student: Student;
}

export const Mark = ({type, marks, date, student}: Props) => {
    const journalMark = marks?.find(m => m.date === date && m.studentId === student.id && m.type === type);

    return (
        <div className={styles.mark}>{journalMark?.mark}</div>
    )
}