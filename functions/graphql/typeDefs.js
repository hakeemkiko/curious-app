const gql = require('graphql-tag')

module.exports = gql`
type Post {
    id: ID!
    owner: String!
    text: String!
    createdAt: String!
    commentCount: Int!
    likeCount: Int!
}

type User {
    id: ID!
    username: String!
    email: String!
    createdAt: String!
    profilePicture: String
    token: String!
}

type Query {
    getPosts: [Post]!
}

input RegisterInput {
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
    }


type Mutation {
    registerUser( registerInput: RegisterInput ): User!
    login( username: String!, password: String! ): User!
}
`
