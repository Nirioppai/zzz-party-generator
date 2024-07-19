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

export const teamsState = atom({
  key: 'teamsState',
  default: [],
});

export const currentTeamState = atom({
  key: 'currentTeamState',
  default: [],
});

export const numberOfTeamsState = atom({
  key: 'numberOfTeamsState',
  default: 1,
});
