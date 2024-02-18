import { IUser } from './models';
import { v4 as uuidv4 } from 'uuid';

const users: IUser[] = [
  {
    id: '9baf251b-073f-4726-b08c-b588870c2f88',
    username: 'Mikhail',
    age: 39,
    hobbies: ['swimming', 'biking'],
  },
  {
    id: uuidv4(),
    username: 'Katy',
    age: 38,
    hobbies: ['reading', 'biking'],
  },
];

export default users;
