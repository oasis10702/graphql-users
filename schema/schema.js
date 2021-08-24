const graphql = require('graphql');
const axios = require('axios');
const _ = require('lodash');
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLNonNull, GraphQLList } = graphql;

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`).then(res => res.data);
      }
    }
  })
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`).then(res => res.data);
      }
    }
  })
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

const CompanyQuery = {
  type: CompanyType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve(parentValue, args) {
    return axios.get(`http://localhost:3000/companies/${args.id}`).then(resp => resp.data);
  }
};

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: UserQuery,
    company: CompanyQuery
  }
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        firstName: { type: GraphQLString },
        age: { type: GraphQLString },
        companyId: { type: GraphQLString }
      },
      resolve() {}
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
