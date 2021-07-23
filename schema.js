const {
  GraphQLSchema,
  GraphQLString,
  GraphQLObjectType,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull
} = require("graphql");

const { User, Post } = require("./models");

const PostType = new GraphQLObjectType({
  name: "Post",
  description: "This represents a post",
  fields: () => ({
    uuid: { type: GraphQLID },
    title: { type: GraphQLString },
    body: { type: GraphQLString },
    userId: { type: GraphQLID },
    user: {
      type: UserType,
      resolve: (post) => post.user
    }
  })
});

const UserType = new GraphQLObjectType({
  name: "User",
  description: "This represents a User",
  fields: () => ({
    uuid: { type: GraphQLID },
    role: { type: GraphQLString },
    name: { type: GraphQLString },
    username: { type: GraphQLString },
    posts: {
      type: GraphQLList(PostType),
      resolve: (user) => user.posts
    }
  })
});

// RootQuery: where all queries are defined
const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    message: {
      type: GraphQLString,
      description: "Welcome message",
      resolve: () => "Welcome"
    },
    posts: {
      type: new GraphQLList(PostType),
      description: "List of all posts",
      resolve: async () => {
        try {
          let posts = await Post.findAll({
            include: "user"
          });
          return posts;
        } catch (error) {
          return error;
        }
      }
    },
    // fetch single post
    post: {
      type: GraphQLList(PostType),
      description: "A single posts",
      args: {
        postUuid: { type: GraphQLNonNull(GraphQLString) }
      },
      resolve: async (_, { uuid }) => {
        try {
          let post = await Post.findAll({
            where: {
              uuid
            },
            include: "user"
          });
          return post;
        } catch (error) {
          console.log(error);
          return error;
        }
      }
    },

    // get all users
    users: {
      type: new GraphQLList(UserType),
      description: "List of all Users",
      resolve: async () => {
        try {
          let users = await User.findAll({
            include: "posts"
          });
          return users;
        } catch (error) {
          return error;
        }
      }
    }
  })
});

const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutation",
  fields: () => ({
    createUser: {
      type: UserType,
      description: "Create an account",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        username: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        role: { type: GraphQLNonNull(GraphQLString) }
      },
      // destructure args
      resolve: async (_, { name, email, role, username }) => {
        try {
          const newUser = await User.create({
            name,
            email,
            role,
            username
          });
          return newUser;
        } catch (error) {
          return error;
        }
      }
    },

    createPost: {
      type: PostType,
      description: "Create a post",
      args: {
        userId: { type: GraphQLNonNull(GraphQLID) },
        title: { type: GraphQLNonNull(GraphQLString) },
        body: { type: GraphQLNonNull(GraphQLString) }
      },
      resolve: async (_, args) => {
        try {
          const post = await Post.create({
            userId: args.userId,
            title: args.title,
            body: args.body
          });
          console.log(post);
          return post;
        } catch (error) {
          console.log(error);
          return error;
        }
      }
    },

    deletePost: {
      type: GraphQLString,
      description: "Delete a post",
      args: {
        id: { type: GraphQLNonNull(GraphQLID) }
      },
      resolve: (_, args) => {
        return `post with the id ${args.id} have been deleted successfully`;
      }
    },

    updatePost: {
      type: PostType,
      description: "Update a post",
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        title: { type: GraphQLNonNull(GraphQLString) },
        body: { type: GraphQLNonNull(GraphQLString) }
      },
      resolve: (_, args) => {
        let post = posts.find((post) => {
          return post.id === args.id;
        });

        post = {
          ...post,
          title: args.title,
          body: args.content
        };
        console.log(post);

        return post;
      }
    }
  })
});
const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
});

module.exports = schema;
