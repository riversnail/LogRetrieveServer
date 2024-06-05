import express from 'express';
import { PORT } from './constants';
import router from './router';

const app = express();
app.use('/', router);

app.listen(PORT, () => {
  console.log('The application is listening on port ' + PORT);
});
