import dotenv from 'dotenv';
import server from './server';

dotenv.config();
const PORT = process.env.PORT || 4300;

server.listen(PORT, () => {
  console.log('Server is running on port: ' + PORT);
});
