import s from './Journal.module.css';
import {Link, useParams} from "react-router-dom";
import {Button, DatePicker, Select, Tag} from "antd";
import React, { useEffect, useState} from "react";
import {Mark} from "./Mark";
import {useQuery} from "@apollo/client";
import {
    getJournal,
    GetJournalData,
} from "../../../../graphQL/modules/journal/journal.queries";
import moment, {Moment} from "moment";
import {RangePickerProps} from "antd/es/date-picker";
import Title from "antd/es/typography/Title";

export const Journal = () => {
    const params = useParams();
    const subjectId = params.subjectId as string;

    const date = new Date();
    const currentMonthFirstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const currentMonthLastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const [showRange, setShowRange] = useState<[Moment | null, Moment | null] | null>([moment(currentMonthFirstDay), moment(currentMonthLastDay)]);
    const [newDate, setNewDate] = useState<Moment | null>(null);
    const [newType, setNewType] = useState<'DEFAULT' | 'HOMEWORK'>('DEFAULT');

    const journalQuery = useQuery<GetJournalData>(getJournal, {
        variables: {subjectId},
        fetchPolicy: "no-cache",
    });

    const [defaultDates, setDefaultDates] = useState<string[]>([]);
    const [homeworkDates, setHomeworkDates] = useState<string[]>([]);
    const [dates, setDates] = useState<string[]>([]);

    useEffect(() => {
        if(!journalQuery.data?.getJournalMarks)
            return;

        const defaultDates = journalQuery.data?.getJournalMarks
            ?.filter(m =>  m.type == 'DEFAULT' && (!showRange?.[0] || !showRange?.[1] || (moment(m.date) >= showRange[0]! && moment(m.date) <= showRange[1]!)))
            ?.map(m => m.date)
            .filter((value, index, array) => array.indexOf(value) === index)

        defaultDates?.sort();
        setDefaultDates(defaultDates)

        const homeworkDates = journalQuery.data?.getJournalMarks
            ?.filter(m => m.type == 'HOMEWORK' && (!showRange?.[0] || !showRange?.[1] || (moment(m.date) >= showRange[0]! && moment(m.date) <= showRange[1]!)))
            ?.map(m => m.date)
            .filter((value, index, array) => array.indexOf(value) === index)

        homeworkDates?.sort();
        setHomeworkDates(homeworkDates)

        const newDates = [...defaultDates, ...homeworkDates].filter((value, index, array) => array.indexOf(value) === index)

        newDates?.sort();
        setDates(newDates)
    }, [journalQuery.data, showRange]);


    const addDate = () => {
        if(!newDate)
            return;

        const formattedDate =  newDate.format('YYYY-MM-DD');

        if(newType === 'DEFAULT'){
            const newDefaultDates = [...defaultDates, formattedDate].filter((value, index, array) => array.indexOf(value) === index)
            newDefaultDates?.sort();
            setDefaultDates(newDefaultDates)
        }
        else{
            const newHomeworkDates = [...homeworkDates, formattedDate].filter((value, index, array) => array.indexOf(value) === index)
            newHomeworkDates?.sort();
            setHomeworkDates(newHomeworkDates)
        }

        const newDates = [...dates, formattedDate].filter((value, index, array) => array.indexOf(value) === index)
        newDates?.sort();
        setDates(newDates)
    }

    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        if(!journalQuery.data)
            return true;

        if(!current)
            return false;

        const currentDate = current.format('YYYY-MM-DD');

        const containsDate = newType === 'DEFAULT'
            ? defaultDates.includes(currentDate)
            : homeworkDates.includes(currentDate)

        return containsDate
            || currentDate < journalQuery.data.getSubject.educationalYear.dateStart
            || currentDate > journalQuery.data.getSubject.educationalYear.dateEnd;
    };

    console.log({dates, defaultDates, homeworkDates})
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
            <DatePicker.RangePicker
                value={showRange}
                className={s.rangePicker}
                onChange={values => setShowRange([values?.[0]?.startOf('day') ?? null, values?.[1]?.startOf('day') ?? null])}
            />
           <table className={s.journalTable}>
               <tr>
                   <th></th>
                   {dates?.map(date => (
                       <>
                           {defaultDates.includes(date) && (
                               <th key={date + 'DEFAULT'}></th>
                           )}
                           {homeworkDates.includes(date) && (
                               <th key={date + 'HOMEWORK'}>ДЗ</th>
                           )}
                       </>
                   ))}
               </tr>
               <tr>
                   <th></th>
                   {dates?.map(date => (
                       <>
                            {defaultDates.includes(date) && (
                               <th key={date + 'DEFAULT'}>{date}</th>
                            )}
                           {homeworkDates.includes(date) && (
                               <th key={date + 'HOMEWORK'}>{date}</th>
                            )}
                       </>
                   ))}
               </tr>
               {journalQuery.data?.getStudents.map(student => (
                  <tr key={student.id}>
                      <td>{student.firstName} {student.lastName}</td>
                      {dates?.map(date => (
                         <>
                             {defaultDates.includes(date) && (
                                 <td key={date + 'DEFAULT'}>
                                     <Mark
                                         type="DEFAULT"
                                         marks={journalQuery.data?.getJournalMarks}
                                         date={date}
                                         student={student}
                                         subjectId={subjectId}
                                     />
                                 </td>
                             )}
                             {homeworkDates.includes(date) && (
                                 <td key={date + 'HOMEWORK'}>
                                     <Mark
                                         type="HOMEWORK"
                                         marks={journalQuery.data?.getJournalMarks}
                                         date={date}
                                         student={student}
                                         subjectId={subjectId}
                                     />
                                 </td>
                             )}
                         </>
                      ))}
                  </tr>
               ))}
           </table>
            <div className={s.newDateForm}>
                <DatePicker
                    value={newDate}
                    onChange={value => setNewDate(value)}
                    disabledDate={disabledDate}
                    className={s.newDatePicker}
                />
                <Select value={newType} onChange={setNewType}>
                    <Select.Option value="DEFAULT">Робота у класі</Select.Option>
                    <Select.Option value="HOMEWORK">Домашнє завдання</Select.Option>
                </Select>
                <Button onClick={addDate} disabled={!newDate}>Додати</Button>
            </div>
        </div>
    );
};