import { IUser } from './models';
import { v4 as uuidv4 } from 'uuid';

const users: IUser[] = [
  {
    id: uuidv4(),
    name: 'Mikhail',
    age: 39,
    hobbies: ['swimming', 'biking'],
  },
  {
    id: uuidv4(),
    name: 'Katy',
    age: 38,
    hobbies: ['reading', 'biking'],
  },
];

export default users;
