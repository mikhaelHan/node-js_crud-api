import http, { IncomingMessage, ServerResponse } from 'http';
import {
  addUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from './requestHandlers';

const server = http.createServer(
  async (req: IncomingMessage, res: ServerResponse) => {
    res.setHeader('Content-Type', 'application/json');
    const { url, method } = req;

    switch (true) {
      case method === 'GET' && url && url.startsWith('/api/users/'):
        const idGet = url.split('/')[3];
        await getUserById(idGet || 'id', res);
        break;

      case `${method}:${url}` === 'GET:/api/users':
        await getAllUsers(res);
        break;

      case `${method}:${url}` === 'POST:/api/users':
        await addUser(req, res);
        break;

      case method === 'PUT' && url && url.startsWith('/api/users/'):
        const idPut = url.split('/')[3];
        await updateUser(idPut || 'id', req, res);
        break;

      case method === 'DELETE' && url && url.startsWith('/api/users/'):
        const idDelete = url.split('/')[3];
        await deleteUser(idDelete || 'id', res);
        break;

      default:
        res.statusCode = 401;
        res.end(JSON.stringify({ error: 'Not Found !' }));
    }
  }
);

export default server;
