import 'reflect-metadata';
import http from 'http';
import { container, router, connectDB } from '../lib';
import { dbConfig } from './configurations/dbconfig';
import { UserController } from './controllers/UserController';

container.load(__dirname);

connectDB(dbConfig);

const appRouter = router();
appRouter.register(UserController);

const app = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
  appRouter(req, res, () => {
    res.statusCode = 404;
    res.end('Not found');
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});