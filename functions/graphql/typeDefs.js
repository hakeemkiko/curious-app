const gql = require('graphql-tag')

module.exports = gql`
type Post {
    id: ID!
    owner: String!
    text: String!
    createdAt: String!
    commentCount: Int!
    likeCount: Int!
    comments: [Comment!]
}

type User {
    id: ID!
    username: String!
    email: String!
    createdAt: String!
    profilePicture: String
    token: String!
}

type Comment {
    id: ID!
    owner: String!
    createdAt: String!
    text: String!
}

########## QUERY ##########
type Query {
    getPosts: [Post]!
    getPost ( postId: ID!) : Post!
}

########## INPUT ##########
input RegisterInput {
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
    }


type Mutation {
    # USER MUTATION
    registerUser( registerInput: RegisterInput ): User!
    login( username: String!, password: String! ): User!

    #POSTS MUTATION
    createPost( text: String! ) : Post!
    deletePost( postId: ID! ) : String!
    likePost( postId: ID! ) : Post!

    #COMMENT MUTATION
    createComment( postId: ID!, text: String! ) : Comment!
    deleteComment( postId: ID!, commentId: ID! ) : String!
}
`



