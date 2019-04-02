const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLSchema
} = require('graphql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const User = require('../../models/User');

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    firstname: { type: GraphQLString },
    lastname: { type: GraphQLString },
    role: { type: GraphQLString },
    // INFO: never add password here!
  })
});

const AuthDataType = new GraphQLObjectType({
  name: 'AuthData',
  fields: () => ({
    userId: { type: GraphQLID },
    token: { type: GraphQLString },
    tokenExpiration: { type: GraphQLInt },
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: {
        id: { type: GraphQLID }
      },
      resolve(parent, args) {
        return User.findById(args.id);
      }
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return User.find({});
      }
    },
  }
});

// TODO: remove all(?) user functions from GraphQL-API or add authentication
const RootMutation = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: {
    addUser: {
      type: UserType,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        firstname: { type: new GraphQLNonNull(GraphQLString) },
        lastname: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parents, args) {
        const { username, email, password, firstname, lastname } = args;

        try {
          const exisitingUser = await User.findOne({ email });
          if (exisitingUser) {
            throw new Error('User exists already.');
          }
          const hashedPassword = await bcrypt.hash(password, 12);

          const newUser = new User({
            username,
            email,
            password: hashedPassword,
            firstname,
            lastname,
          });
          const result = await newUser.save();

          return {
            ...result._doc,
            id: result._id,
            password: null,
          };
        } catch (error) {
          throw error;
        }
      }
    },
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});
