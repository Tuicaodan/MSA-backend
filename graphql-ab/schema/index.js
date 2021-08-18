const { buildSchema } = require("graphql");

module.exports = buildSchema(`
type User {
    id: ID!
    username: String!
    avatar_url: String!
    posts:[Post]!
}

type Post {
    id: ID!
    title: String!
    description: String!
    youtube_url: String!
    createdAt: String!
    author: User!
    comments: [Comment]
}

type Comment {
    id: ID!
    comment: String!
    createdAt: String!
    user: User!
    post: Post!
}

type AuthData {
    jwt_token: String!
    id: ID!
    username: String!
    avatar_url: String!
}


type RootQuery {
    posts: [Post!]!
    post(id: ID!): Post
    user(id: ID!): User
}

type RootMutation {
    addPost(title: String!, description: String!, youtube_url: String!): Post
    userLogin(code: String!): AuthData!
    addComment(postId: String! comment: String!): Comment
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);
