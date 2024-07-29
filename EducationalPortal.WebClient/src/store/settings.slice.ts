import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Setting} from '../graphQL/modules/settings/settings.types';

const initialState = {
    settings: [] as Setting[],
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setSettings: (state, action: PayloadAction<Setting[]>) => {
            const settings: Setting[] = [];
            for (let setting of action.payload)
                settings.push({...setting, value: setting.value || JSON.parse(setting.value)});
            state.settings = settings;
        },
        setSetting: (state, action: PayloadAction<Setting>) => {
            const foundSetting = state.settings.find(setting => setting.name === action.payload.name);
            if (foundSetting)
                foundSetting.value = action.payload.value;
            else
                state.settings.push(action.payload);
        },
    },
});

export const settingsActions = settingsSlice.actions;
export const settingsReducer = settingsSlice.reducer;

export const AppName = 'APP_NAME';
export type AppNameType = Omit<Setting, 'value'> & { value: string };
