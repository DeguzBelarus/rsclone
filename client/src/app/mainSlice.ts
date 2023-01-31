import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { WritableDraft } from 'immer/dist/internal';

import { CurrentLanguageType, RequestStatus } from 'types/types';

interface MainState {
  currentLanguage: CurrentLanguageType;
  userRequestStatus: RequestStatus;
}

const initialState: MainState = {
  currentLanguage: 'en',
  userRequestStatus: 'idle',
};

export const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    setCurrentLanguage(
      state: WritableDraft<MainState>,
      { payload }: PayloadAction<CurrentLanguageType>
    ) {
      state.currentLanguage = payload;
    },
  },
});

export const {
  actions: { setCurrentLanguage },
} = mainSlice;

export const getCurrentLanguage = ({ main: { currentLanguage } }: RootState) => currentLanguage;

export const { reducer } = mainSlice;
