import React, {FC} from 'react';
import {ButtonsVUR} from "../ButtonsVUD/ButtonsVUR";
import {Space} from "antd";

type Props = {
    files: File[],
    onRemove: (file: File) => void,
};

export const FilesList: FC<Props> = ({files, onRemove}) => {
    return (
        <Space direction={'vertical'}>
            {files.map(file => (
                <Space>
                    <div>{file.name}</div>
                    <ButtonsVUR onRemove={() => onRemove(file)}/>
                </Space>
            ))}
        </Space>
    );
};