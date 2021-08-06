const graphql = require('graphql');
const axios = require('axios');
const _ = require('lodash');
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLNonNull } = graphql;

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString }
  }
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`).then(res => res.data);
      }
    }
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

const CompanyQuery = {};

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: UserQuery,
    company: CompanyQuery
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
