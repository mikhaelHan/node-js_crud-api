import { IncomingMessage, ServerResponse } from 'http';
import { validate as uuidValidate, v4 as uuidv4 } from 'uuid';
import users from './users';
import { IUser } from 'models';

// ========== checking if the user exists ========== //
const checkUser = (id: string, res: ServerResponse): boolean | IUser => {
  if (!uuidValidate(id)) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: 'Invalid user ID...' }));
    return false;
  }

  const user = users.find(el => el.id === id);

  if (!user) {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'User not found...' }));
    return false;
  }

  return user;
};

// ========== gets all users ========== //
export const getAllUsers = async (res: ServerResponse) => {
  try {
    res.statusCode = 200;
    res.end(JSON.stringify(users));
  } catch {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Server error !' }));
  }
};

// ========== gets user by ID ========== //
export const getUserById = async (id: string, res: ServerResponse) => {
  try {
    const isUser = checkUser(id, res);
    if (isUser) {
      res.statusCode = 200;
      res.end(JSON.stringify(isUser));
    }
  } catch {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Server error !' }));
  }
};

// ========== adds a new user ========== //
export const addUser = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    let body = '';
    req.on('data', chunk => (body += chunk.toString()));
    req.on('end', () => {
      const newUser: IUser = JSON.parse(body);

      const validKeys = ['username', 'age', 'hobbies'];
      const keys = Object.keys(newUser);
      const hasExtraFields = keys.some(key => !validKeys.includes(key));

      if (
        hasExtraFields ||
        !newUser.username ||
        typeof newUser.username !== 'string' ||
        !newUser.age ||
        typeof newUser.age !== 'number' ||
        !newUser.hobbies ||
        !Array.isArray(newUser.hobbies) ||
        !newUser.hobbies.every(hobby => typeof hobby === 'string')
      ) {
        res.statusCode = 400;
        res.end(
          JSON.stringify({
            error: 'Missing "name" or "age" or "hobbies" field',
          })
        );
        return;
      }

      newUser.id = uuidv4();
      users.push(newUser);

      res.statusCode = 201;
      res.end(JSON.stringify(newUser));
    });
  } catch {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Server error !' }));
  }
};

// ========== updates an existing user ========== //
export const updateUser = async (
  id: string,
  req: IncomingMessage,
  res: ServerResponse
) => {
  try {
    const isUser = checkUser(id, res);
    if (isUser) {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', () => {
        const updatedUser = JSON.parse(body);

        const validKeys = ['username', 'age', 'hobbies'];
        const keys = Object.keys(updatedUser);
        const hasExtraFields = keys.some(key => !validKeys.includes(key));

        if (
          hasExtraFields ||
          !updatedUser.username ||
          typeof updatedUser.username !== 'string' ||
          !updatedUser.age ||
          typeof updatedUser.age !== 'number' ||
          !updatedUser.hobbies ||
          !Array.isArray(updatedUser.hobbies) ||
          !updatedUser.hobbies.every(
            (hobby: unknown) => typeof hobby === 'string'
          )
        ) {
          res.statusCode = 400;
          res.end(
            JSON.stringify({
              error: 'Missing "name" or "age" or "hobbies" field',
            })
          );
          return;
        }
        Object.assign(isUser, updatedUser);

        res.statusCode = 200;
        res.end(JSON.stringify(isUser));
      });
    }
  } catch {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Server error !' }));
  }
};

// ========== deletes an existing user ========== //
export const deleteUser = async (id: string, res: ServerResponse) => {
  try {
    const isUser = checkUser(id, res);
    if (isUser) {
      const userIndex = users.findIndex(user => user.id === id);
      if (userIndex === -1) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'User not found...' }));
        return;
      }

      users.splice(userIndex, 1);
      res.statusCode = 204;
      res.end(JSON.stringify({ success: true }));
    }
  } catch {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Server error !' }));
  }
};
