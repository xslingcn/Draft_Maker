import express from "express";
// import morgan from 'morgan';
import { Env } from "./env";
import logger from "./logging/loggerFactory";
import draftsRoutes from "./routes/drafts.route";
import draftRoutes from "./routes/draft.route";

logger.info("Initializing server...");

// Configure and start the HTTP server.
const app = express();
app.use(express.json());   // using integrated body-parser
// app.use(Env.DEBUG ?      // enable access log
//     morgan(':method :url : :status - :response-time ms') :
//     morgan('combined', {
//         skip: function (_: express.Request, res: express.Response) { return res.statusCode < 400 }
//     }));

app.use('/api/drafts', draftsRoutes);
app.use('/api/draft', draftRoutes);


app.listen(Env.PORT, () => logger.info(`Server listening on ${Env.PORT}`));