const express = require("express");
const {graphqlHTTP} = require("express-graphql");
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
} = require("graphql");
const app = express();

const tasters = [
  {id: 1, name: "Jide"},
  {id: 2, name: "Segun"},
  {id: 3, name: "Fred"},
];
const foods = [
  {id: 1, name: "semo", tasterId: 1},
  {id: 2, name: "Wakkye", tasterId: 3},
  {id: 3, name: "Kontomire", tasterId: 2},
];

const comments = [
  {id: 1, comment: "Jesus!, what is this trash?", tasterId: 1},
  {id: 2, comment: "This is new, lol", tasterId: 2},
  {id: 3, comment: "it is beautiful", tasterId: 3},
];

const TasterType = new GraphQLObjectType({
  name: "Taster",
  description: "Represents all tasters",
  fields: () => ({
    id: {type: GraphQLNonNull(GraphQLInt)},
    name: {type: GraphQLNonNull(GraphQLString)},
    foods: {
      type: new GraphQLList(FoodType),
      resolve: (taster) => {
        return foods.filter((food) => food.tasterId === taster.id);
      },
    },
  }),
});

const FoodType = new GraphQLObjectType({
  name: "Foods",
  description: "Represents all Available foods",
  fields: () => ({
    id: {type: GraphQLNonNull(GraphQLInt)},
    name: {type: GraphQLNonNull(GraphQLString)},
    tasters: {
      type: new GraphQLList(TasterType),
      resolve: (food) => {
        return tasters.filter((taster) => taster.id === food.tasterId);
      },
    },
  }),
});

const CommentType = new GraphQLObjectType({
  name: "Comments",
  description: "Comments for the foods",
  fields: () => ({
    id: {type: GraphQLNonNull(GraphQLInt)},
    comment: {type: GraphQLNonNull(GraphQLString)},
    tasters: {
      type: new GraphQLList(TasterType),
      resolve: (comment) => {
        return tasters.filter((taster) => taster.id === comment.tasterId);
      },
    },
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    tasters: {
      type: new GraphQLList(TasterType),
      description: "List of Tasters",
      resolve: () => tasters,
    },
    foods: {
      type: new GraphQLList(FoodType),
      description: "List of Foods",
      resolve: () => foods,
    },
    comments: {
      type: new GraphQLList(CommentType),
      description: "List of all Comments",
      resolve: () => comments,
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
});
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);
app.listen(3000, () => console.log("⚡ Server running"));
