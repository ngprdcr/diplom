import s from './Journal.module.css';
import {Link, useParams} from "react-router-dom";
import {Button, DatePicker, Tag} from "antd";
import React, { useEffect, useState} from "react";
import {Mark} from "./Mark";
import {useQuery} from "@apollo/client";
import {
    getJournal,
    GetJournalData,
} from "../../../../graphQL/modules/journal/journal.queries";
import {Moment} from "moment";
import {RangePickerProps} from "antd/es/date-picker";
import Title from "antd/es/typography/Title";

export const Journal = () => {
    const params = useParams();
    const subjectId = params.subjectId as string;

    const [newDate, setNewDate] = useState<Moment | null>(null);

    const journalQuery = useQuery<GetJournalData>(getJournal, {
        variables: {subjectId}
    });

    const [dates, setDates] = useState<string[]>([]);

    useEffect(() => {
        if(!journalQuery.data?.getJournalMarks)
            return;

        const newDates = journalQuery.data?.getJournalMarks?.map(m => m.date).filter((value, index, array) => array.indexOf(value) === index)
        newDates?.sort();
        setDates(newDates)
    }, [journalQuery.data]);


    const addDate = () => {
        if(!newDate)
            return;

        const newDates = [...dates, newDate.format('YYYY-MM-DD')].filter((value, index, array) => array.indexOf(value) === index)
        newDates?.sort();
        setDates(newDates)
    }

    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        if(!journalQuery.data)
            return true;

        if(!current)
            return false;

        const currentDate = current.format('YYYY-MM-DD');
        return dates.includes(currentDate)
            || currentDate < journalQuery.data.getSubject.educationalYear.dateStart
            || currentDate > journalQuery.data.getSubject.educationalYear.dateEnd;
    };

    console.log(dates)
    const subject= journalQuery.data?.getSubject;

    return (
        <div>
            <Title level={2}>Журнал</Title>
            <Title level={3}>{journalQuery.data?.getSubject.name}</Title>
            <table className="infoTable">
                <tbody>
                <tr>
                    <td>Вчитель предмету:</td>
                    <td>
                        <span>
                            <Link
                                to={`../../teachers/${subject?.teacherId}`}>{subject?.teacher.lastName} {subject?.teacher.firstName}</Link>
                        </span>
                    </td>
                </tr>
                <tr>
                    <td>Вчителі:</td>
                    <td>
                        {subject?.teachersHaveAccessCreatePosts?.map(teacher => (
                            <Tag key={teacher.id}>
                                <Link to={`../../teachers/${teacher.id}`}>{teacher?.lastName} {teacher.firstName}</Link>
                            </Tag>
                        ))}
                    </td>
                </tr>
                <tr>
                    <td>Навчальний рік:</td>
                    <td>
                        <span>
                            <Link
                                to={`../../educational-years/${subject?.educationalYearId}`}>{subject?.educationalYear.name}</Link>
                        </span>
                    </td>
                </tr>
                <tr>
                    <td>Посилання:</td>
                    <td>
                        <span>{subject?.link}</span>
                    </td>
                </tr>
                <tr>
                    <td>Класи:</td>
                    <td>
                        {subject?.gradesHaveAccessRead.map(grade => (
                            <Tag key={grade.id}>
                                <Link to={`../../grades/${grade.id}`}>{grade?.name}</Link>
                            </Tag>
                        ))}
                    </td>
                </tr>
                </tbody>
            </table>
           <div className={s.newDateForm}>
               <DatePicker
                   value={newDate}
                   onChange={value => setNewDate(value)}
                   disabledDate={disabledDate}
                   className={s.newDatePicker}
               />
               <Button onClick={addDate} disabled={!newDate}>Додати</Button>
           </div>
           <table className={s.journalTable}>
               <tr>
                   <th></th>
                   {dates?.map(date => (
                       <th key={date}>{date}</th>
                   ))}
               </tr>
               {journalQuery.data?.getStudents.map(student => (
                  <tr key={student.id}>
                      <td>{student.firstName} {student.lastName}</td>
                      {dates?.map(date => (
                          <td key={date}>
                              <Mark marks={journalQuery.data?.getJournalMarks} date={date} student={student} subjectId={subjectId}/>
                          </td>
                      ))}
                  </tr>
               ))}
           </table>
        </div>
    );
};