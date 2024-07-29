import React, {useCallback, useEffect, useState} from 'react';
import {useLazyQuery, useMutation} from '@apollo/client';
import {ColumnsType} from 'antd/es/table';
import {ButtonsVUR} from '../../../../../../components/ButtonsVUD/ButtonsVUR';
import {Avatar, Col, message, Popconfirm, Row, Space, Table, Tooltip} from 'antd';
import {ButtonCreate} from '../../../../../../components/ButtonCreate/ButtonCreate';
import {useNavigate, useSearchParams} from 'react-router-dom';
import Title from 'antd/es/typography/Title';
import Search from 'antd/es/input/Search';
import debounce from 'lodash.debounce';
import '../../../../../../styles/controls.css';
import {
    GET_BACKUPS_QUERY,
    GetBackupsData,
    GetBackupsVars
} from "../../../../../../graphQL/modules/backups/backups.queries";
import {Backup} from "../../../../../../graphQL/modules/backups/backup.types";
import s from "./BackupsIndex.module.css";
import {LoginOutlined} from "@ant-design/icons";
import {
    CREATE_BACKUP_MUTATION,
    CreateBackupData,
    CreateBackupVars,
    REMOVE_BACKUP_MUTATION,
    RemoveBackupData,
    RemoveBackupVars,
    RESTORE_BACKUP_MUTATION,
    RestoreBackupData,
    RestoreBackupVars
} from "../../../../../../graphQL/modules/backups/backups.mutations";

export const BackupsIndex = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [likeInput, setLikeInput] = useState(searchParams.get('like') || '');
    const navigate = useNavigate();
    const [getBackups, getBackupsOptions] = useLazyQuery<GetBackupsData, GetBackupsVars>(GET_BACKUPS_QUERY,
        {fetchPolicy: 'network-only'}
    );
    const [removeBackup, removeBackupOptions] = useMutation<RemoveBackupData, RemoveBackupVars>(REMOVE_BACKUP_MUTATION);
    const [createBackup, createBackupOptions] = useMutation<CreateBackupData, CreateBackupVars>(CREATE_BACKUP_MUTATION);
    const [restoreBackup, restoreBackupOptions] = useMutation<RestoreBackupData, RestoreBackupVars>(RESTORE_BACKUP_MUTATION);

    useEffect(() => {
        const page = parseInt(searchParams.get('page') || '') || 1;
        const like = searchParams.get('like') || '';
        setLikeInput(like);
        getBackups({variables: {page, like}});
    }, [searchParams]);

    const onRemove = (backupUrl: string) => {
        removeBackup({variables: {url: backupUrl}})
            .then(async (response) => {
                const page = parseInt(searchParams.get('page') || '') || 1;
                const like = searchParams.get('like') || '';
                getBackups({variables: {page, like}});
            })
            .catch(error => {
                message.error(error.message);
            });
    };

    const restoreWithBackupHandler = (backupId: string): void => {
        backupHandler()
            .then(() => {
                restoreHandler(backupId)
                    .catch(error => {
                    })
            })
            .catch(error => {
            });
    }

    const restoreHandler = (backupUrl: string): Promise<void> => {
        return restoreBackup({variables: {url: backupUrl}})
            .then(response => {
                message.success("Restore успішно виконано");
            })
            .catch(error => {
                message.error(error.message);
            });
    }

    const backupHandler = (): Promise<void> => {
        return createBackup()
            .then(response => {
                message.success("Backup успішно створено");
                const page = parseInt(searchParams.get('page') || '') || 1;
                const like = searchParams.get('like') || '';
                getBackups({variables: {page, like}});
            })
            .catch(error => {
                message.error(error.message);
                throw new Error(error.message)
            });
    }

    const columns: ColumnsType<Backup> = [
        {
            title: 'Назва',
            dataIndex: 'name',
            key: 'name',
            render: (text, backup) => <>{backup.url.split("/").pop()}</>
        },
        {
            title: 'Посилання',
            dataIndex: 'url',
            key: 'url',
        },
        {
            title: 'Дії',
            dataIndex: 'actions',
            key: 'actions',
            width: '130px',
            render: (text: string, backup) => (
                <Space>
                    <Tooltip title={`Restore`}>
                        <Popconfirm
                            title="Створити бекап для поточних данних?"
                            onConfirm={() => restoreWithBackupHandler(backup.url)}
                            onCancel={() => restoreHandler(backup.url)}
                            okText="Так"
                            cancelText="Ні"
                        >
                            <div className={s.buttonRestore}>
                                <Avatar size={28} icon={<LoginOutlined/>}/>
                            </div>
                        </Popconfirm>

                    </Tooltip>
                    <ButtonsVUR viewUrlA={`${backup.url}`} /*onRemove={() => onRemove(backup.url)}*//>
                </Space>
            ),
        },
    ];

    const debouncedSearchBackupsHandler = useCallback(debounce(like => setSearchParams({like}), 500), []);
    const searchBackupsHandler = (value: string) => {
        debouncedSearchBackupsHandler(value);
        setLikeInput(value);
    };

    return (
        <Space size={20} direction={'vertical'} style={{width: '100%'}}>
            <Title level={2}>Бекапи</Title>
            <Row justify="space-between">
                <Col onClick={backupHandler}>
                    <ButtonCreate/>
                </Col>
                <Col>
                    <Search
                        allowClear
                        value={likeInput}
                        onChange={e => searchBackupsHandler(e.target.value)}
                        placeholder="Пошук"
                        enterButton
                        loading={getBackupsOptions.loading}
                        className={'search'}
                    />
                </Col>
            </Row>
            <Table
                style={{width: '100%'}}
                rowKey={'id'}
                loading={getBackupsOptions.loading || removeBackupOptions.loading || createBackupOptions.loading || restoreBackupOptions.loading}
                dataSource={getBackupsOptions.data?.getBackups}
                columns={columns}
                pagination={false}
            />
        </Space>
    );
};
