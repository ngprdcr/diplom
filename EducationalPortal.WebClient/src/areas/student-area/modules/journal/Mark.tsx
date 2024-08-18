import styles from './Journal.module.css';
import React from "react";
import {JournalMark} from "../../../../graphQL/modules/journal/sournal.types";

type Props = {
    type: 'DEFAULT' | 'HOMEWORK';
    marks: JournalMark[] | undefined;
    date: string;
    subjectId: string;
}

export const Mark = ({type, marks, date, subjectId}: Props) => {
    const journalMark = marks?.find(m => m.date === date && m.type === type);

    return (
        <span className={styles.mark}>{journalMark?.mark}</span>
    )
}