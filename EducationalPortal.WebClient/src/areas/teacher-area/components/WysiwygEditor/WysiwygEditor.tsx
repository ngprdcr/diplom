import React, {FC} from 'react';
// @ts-ignore
import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

type Props = {
    text: string,
    setText: (text: string) => void,
}

export const WysiwygEditor: FC<Props> = ({text, setText}) => {
    return (
        <CKEditor
            editor={ClassicEditor}
            data={text}
            onChange={(event: any, editor: any) => {
                setText(editor.getData());
            }}
        />
    );
};
