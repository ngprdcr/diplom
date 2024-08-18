import s from './Journal.module.css';
import {Link, useParams} from "react-router-dom";
import {Button, DatePicker, Input, Select, Tag} from "antd";
import React, { useEffect, useState} from "react";
import {Mark} from "./Mark";
import {useQuery} from "@apollo/client";
import { getStudentJournal, GetStudentJournalData} from "../../../../graphQL/modules/journal/journal.queries";
import {Moment} from "moment";
import {RangePickerProps} from "antd/es/date-picker";
import Title from "antd/es/typography/Title";

export const Journal = () => {
    const params = useParams();
    const subjectId = params.id as string;

    const journalQuery = useQuery<GetStudentJournalData>(getStudentJournal, {
        variables: {subjectId},
        fetchPolicy: "no-cache",
    });

    const [defaultDates, setDefaultDates] = useState<string[]>([]);
    const [homeworkDates, setHomeworkDates] = useState<string[]>([]);
    const [dates, setDates] = useState<string[]>([]);

    useEffect(() => {
        if(!journalQuery.data?.getMyJournalMarks)
            return;

        const defaultDates = journalQuery.data?.getMyJournalMarks
            ?.filter(m => m.type == 'DEFAULT')
            ?.map(m => m.date)
            .filter((value, index, array) => array.indexOf(value) === index)

        defaultDates?.sort();
        setDefaultDates(defaultDates)

        const homeworkDates = journalQuery.data?.getMyJournalMarks
            ?.filter(m => m.type == 'HOMEWORK')
            ?.map(m => m.date)
            .filter((value, index, array) => array.indexOf(value) === index)

        homeworkDates?.sort();
        setHomeworkDates(homeworkDates)

        const newDates = [...defaultDates, ...homeworkDates].filter((value, index, array) => array.indexOf(value) === index)

        newDates?.sort();
        setDates(newDates)
    }, [journalQuery.data]);

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
           <table className={s.journalTable}>
               <tr>
                   {dates?.map(date => (
                       <>
                           {defaultDates.includes(date) && (
                               <th key={date}></th>
                           )}
                           {homeworkDates.includes(date) && (
                               <th key={date}>ДЗ</th>
                           )}
                       </>
                   ))}
               </tr>
               <tr>
                   {dates?.map(date => (
                       <>
                            {defaultDates.includes(date) && (
                               <th key={date}>{date}</th>
                            )}
                           {homeworkDates.includes(date) && (
                               <th key={date}>{date}</th>
                            )}
                       </>
                   ))}
               </tr>
              <tr>
                  {dates?.map(date => (
                     <>
                         {defaultDates.includes(date) && (
                             <td key={date + 'DEFAULT'}>
                                 <Mark
                                     type="DEFAULT"
                                     marks={journalQuery.data?.getMyJournalMarks}
                                     date={date}
                                     subjectId={subjectId}
                                 />
                             </td>
                         )}
                         {homeworkDates.includes(date) && (
                             <td key={date + 'HOMEWORK'}>
                                 <Mark
                                     type="HOMEWORK"
                                     marks={journalQuery.data?.getMyJournalMarks}
                                     date={date}
                                     subjectId={subjectId}
                                 />
                             </td>
                         )}
                     </>
                  ))}
              </tr>
           </table>
        </div>
    );
};