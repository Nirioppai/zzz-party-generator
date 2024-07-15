// atoms.js
import { atom } from 'recoil';

export const charactersState = atom({
  key: 'charactersState',
  default: [],
});

export const searchTermState = atom({
  key: 'searchTermState',
  default: '',
});

export const myAgentsState = atom({
  key: 'myAgentsState',
  default: [],
});
