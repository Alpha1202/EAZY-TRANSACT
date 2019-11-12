import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import config from './db/config/config';
import router from './routes';
import swagger from 'swagger-ui-express';
import swaggerConfig from '../swagger.json'

const { port } = config

// Create global app object
const app = express();

app.use(cors());

// Normal express config defaults
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api-docs', swagger.serve, swagger.setup(swaggerConfig));

// default home route
app.get('/', (req, res) => {
    res.status(200).json({
      status: 200,
      message: "Welcome to eazy transact",
    });
  });

// makes use of the routes defined in the routes folder
app.use(router);

  const server = app.listen(port, () => {
    console.log(`Listening on port ${server.address().port}`);
  });
