const graphql = require('graphql');
const axios = require('axios');
const _ = require('lodash');
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLNonNull } = graphql;

const users = [
  { id: '1', firstName: 'Bill', age: 20 },
  { id: '2', firstName: 'Samantha', age: 21 }
];

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt }
  }
});

const UserQuery = {
  type: UserType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve(parentValue, args) {
    return axios.get(`http://localhost:3000/users/${args.id}`).then(resp => resp.data);
  }
};

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: UserQuery
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
