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
      const newUser = JSON.parse(body);

      if (!newUser.name || !newUser.age || !newUser.hobbies) {
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
        const updatedFields = JSON.parse(body);
        Object.assign(isUser, updatedFields);

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
