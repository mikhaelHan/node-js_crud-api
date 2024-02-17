import http from 'http';
import users from './users';

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const { url, method } = req;

  switch (`${method}:${url}`) {
    case 'GET:/api/users':
      res.statusCode = 200;
      res.end(JSON.stringify(users));
      break;

    default:
      res.statusCode = 401;
      res.end(JSON.stringify({ error: 'Not Found !' }));
  }
});

export default server;
