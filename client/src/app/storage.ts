import { ILocalStorageSaveData } from 'types/types';

const STORAGE_KEY = 'rsclone-save';

export function getLocalStorageData(): ILocalStorageSaveData {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data)
    try {
      return JSON.parse(data);
    } catch {
      return {};
    }
  return {};
}

export function setLocalStorageData(data: ILocalStorageSaveData) {
  const savedData = getLocalStorageData();
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...savedData, ...data }));
}
