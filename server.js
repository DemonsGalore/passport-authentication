const express = require('express');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const auth = require('./routes/api/auth');

const schema = require('./graphql/schema/schema');

const app = express();

// allow cross-origin
app.use(cors({
  origin: require('./config/keys').origin,
  credentials: true
}));

// express body-parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// passport config
require('./config/passport');

// passport middleware
app.use(passport.initialize());
app.use(passport.session()); // TODO: needed?

// cookie parser middleware
// TODO: research cookieSecret
app.use(cookieParser(require('./config/keys').cookieSecret));

// graphQL initialization
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

// routes
app.use('/api/auth', auth);

// db config
// MongoDB Atlas
// const db = require('./config/keys').mongoURI;
// for deployment
// const db = process.env.mongoURI;
// local db
const db_name = 'passport-authentication';
const db = 'mongodb://localhost:27017/' + db_name;

// connect to mongoDB
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useFindAndModify: false // TODO: can probably be removed in the future
  })
  .then(() => {
    console.log('MongoDB connected...');
    // start server
    const PORT = process.env.PORT || 5555;
    app.listen(PORT, () => console.log(`Server started on port ${PORT}.`));
  })
  .catch(error => console.log(error));
