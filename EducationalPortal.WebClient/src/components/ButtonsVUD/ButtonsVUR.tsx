import React, {FC} from 'react';
import {Link} from 'react-router-dom';
import {Avatar, Popconfirm, Tooltip} from 'antd';
import {DeleteOutlined, EyeOutlined, FormOutlined} from '@ant-design/icons';
import s from './ButtonsVUR.module.css';

type Props = {
    viewUrlA?: string,
    viewUrl?: string,
    onView?: () => void,
    updateUrl?: string,
    updateState?: any,
    onUpdate?: () => void,
    removeUrl?: string,
    onRemove?: () => void,
}

export const ButtonsVUR: FC<Props> = ({viewUrlA, viewUrl, updateUrl, updateState, removeUrl, onView, onUpdate, onRemove}) => {
    return (
        <>
            <div className={s.buttonsVUR}>
                {onView ?
                    <Tooltip title="Переглянути">
                        <div className={s.buttonView} onClick={onView}>
                            <Avatar size={28} icon={<EyeOutlined/>}/>
                        </div>
                    </Tooltip>
                    : viewUrlA
                        ? <Tooltip title="Переглянути">
                            <a href={viewUrlA} target={'blank'} className={s.buttonView}>
                                <Avatar size={28} icon={<EyeOutlined/>}/>
                            </a>
                        </Tooltip>
                        : viewUrl &&
                        <Tooltip title="Переглянути">
                            <Link to={viewUrl} className={s.buttonView}>
                                <Avatar size={28} icon={<EyeOutlined/>}/>
                            </Link>
                        </Tooltip>
                }
                {onUpdate
                    ? <Tooltip title="Оновити">
                        <div className={s.buttonUpdate} onClick={onUpdate}>
                            <Avatar size={28} icon={<FormOutlined/>}/>
                        </div>
                    </Tooltip>
                    : updateUrl &&
                    <Tooltip title="Оновити">
                        <Link to={updateUrl} state={updateState} className={s.buttonUpdate}>
                            <Avatar size={28} icon={<FormOutlined/>}/>
                        </Link>
                    </Tooltip>
                }
                {onRemove
                    ? <Tooltip title="Видалити">
                        <Popconfirm
                            title="Ви впевнені, що бажаєте видалити?"
                            onConfirm={onRemove}
                            okText="Так"
                            cancelText="Ні"
                        >
                            <div className={s.buttonRemove}>
                                <Avatar size={28} icon={<DeleteOutlined/>}/>
                            </div>
                        </Popconfirm>
                    </Tooltip>
                    : removeUrl &&
                    <Tooltip title="Видалити">
                        <Link to={removeUrl} className={s.buttonRemove}>
                            <Avatar size={28} icon={<DeleteOutlined/>}/>
                        </Link>
                    </Tooltip>
                }
            </div>
        </>
    );
};
