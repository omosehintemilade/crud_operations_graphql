const express = require("express");

const app = express();
const { graphqlHTTP } = require("express-graphql");

const schema = require("./schema");

const { sequelize, User, Post } = require("./models");

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true
  })
);
app.use(express.json());

app.post("/user", async (req, res) => {
  const { name, email, role } = req.body;
  const newUser = await User.create({
    name,
    email,
    role
  });
  res.status(200).json(newUser);
});

app.get("/user", async (req, res) => {
  const user = await User.findAll({});
  res.status(200).json(user);
});

app.get("/user/:uuid", async (req, res) => {
  const { uuid } = req.params;

  const user = await User.findOne({
    where: {
      uuid
    },
    include: "posts"
  });
  res.status(200).json(user);
});

app.post("/post", async (req, res) => {
  const { userUuid, body, title } = req.body;

  const user = await User.findOne({
    where: {
      uuid: userUuid
    }
  });
  const post = await Post.create({
    userId: user.id,
    body,
    title
  });
  res.status(200).json(post);
});

app.get("/post", async (req, res) => {
  const posts = await Post.findAll({ include: "user" });
  console.log(posts);
  res.status(200).json(posts);
});

app.delete("/post/:uuid", async (req, res) => {
  const { uuid } = req.params;

  const post = await Post.findOne({
    where: {
      uuid
    }
  });
  await post.destroy();

  res.status(200).json({ msg: "post Deleted!" });
});

app.patch("/post/:uuid", async (req, res) => {
  const { uuid } = req.params;
  const { body, title } = req.body;
  const post = await Post.findOne({
    where: {
      uuid
    }
  });
  const updatedPost = {
    ...post,
    body: body || post.body,
    title: title || post.title
  };

  res.status(200).json({ updatedPost });
});
app.listen(8000, async () => {
  console.log("server running on port 8000");
  console.log("Database Connected");
  await sequelize.authenticate();
});
