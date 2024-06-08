import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express, { urlencoded } from 'express';
import expressEjsLayouts from 'express-ejs-layouts';
import session from 'express-session';
import cors from 'cors';
import path from 'path';
import { errorHandlerMiddleware } from './middlewares/errorHandlerMiddleware.js';
import projectRoutes from './src/project/project.routes.js';
import userRoutes from './src/user/routes/user.routes.js';
import issueRoutes from './src/issues/issue.routes.js';

dotenv.config({ path: '.env' });

const app = express();
const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
app.use(express.static(path.resolve('public')));
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(expressEjsLayouts);
app.set('layout', 'layouts/layout');
app.set('view engine', 'ejs');
app.set('views', path.resolve('src', 'views'));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 * 7 },
  })
);

app.use((req, res, next) => {
  console.log('req session', req.method, '==>', req.url, ' ==> ');
  res.locals.user = req.session.user;
  res.locals.userId = req.session.userId;
  next();
});
// configure routes

app.use('/api/issue-tracker/user', userRoutes);
app.use('/api/issue-tracker/project', projectRoutes);
app.use('/api/issue-tracker/issues', issueRoutes);
app.get('/', (req, res) => {
  res.redirect('/api/issue-tracker/project/all-projects');
});

// errorHandlerMiddleware
app.use(errorHandlerMiddleware);

export default app;
