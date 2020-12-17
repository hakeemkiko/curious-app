const { UserInputError, AuthenticationError } = require('apollo-server-express')
const { db } = require('../../utility/admin')
const FBAuthContext = require('../../utility/FBAuthContext')

module.exports = {
    Query : {
        async getPosts(){
            const posts = []
            try{
                await db.collection('posts').get()
                    .then(data => {
                        data.forEach(doc => {
                            console.log(doc.data())
                            posts.push({
                                id: doc.data().id,
                                text: doc.data().text,
                                owner: doc.data().owner,
                                createdAt: doc.data().createdAt,
                                likeCount: doc.data().likeCount,
                                commentCount: doc.data().commentCount
                            })
                        })
                    })
                    return posts
            }
            catch(err){
                console.log(err)
                throw new Error(err)
            }
        },

        
        async getPost(_, {postId}) {
        const { username } = await FBAuthContext(context)

        const postDocument = db.doc(`/posts/${postId}`)
        const commentCollection = db.collection(`/posts/${postId}/comments`)

        if (username) {
            try {
                let post;

                await postDocument.get()
                    .then(doc => {
                        if (!doc.exists) throw new UserInputError('Postingan tidak ditemukan')
                        else {
                            post = doc.data()
                            post.comments = []
                            return commentCollection.orderBy('createdAt', 'asc').get()
                        }
                    })
                    .then(docs => {
                        docs.forEach(doc => {
                            post.comments.push( doc.data() )
                        })
                    })
                return post
            }
            catch (err) {
                console.log(err);
                throw new Error(err)
            }
        }
    }
},

 

    Mutation : {
        async createPost(_, { text }, context){
            const { username } = await FBAuthContext(context)

            if (username) {
             
                try{
                    const newPost = {
                        owner: username,
                        text: text,
                        createdAt: new Date().toISOString(),
                        likeCount: 0,
                        commentCount: 0,
                    }
    
                    await db.collection(`/posts`).add(newPost)
                        .then(doc => {
                            newPost.id = doc.id
                            doc.update({ id: doc.id })
                        })
    
                    return newPost
                }
                catch(err){
                    console.log(err);
                    throw new Error(err)
                }
            }
        },

        async deletePost(_, { postId }, context){
            const {username} = await FBAuthContext(context);
            const document = db.doc(`/posts/${postId}`)
            
            try {
                await document.get()
                    .then(doc => {
                        if (!doc.exists) {
                            throw new UserInputError('Postingan tidak ditemukan')
                        }
                        if (doc.data().owner !== username) {
                            throw new AuthenticationError('Unauthorized!')
                        } else {
                            document.delete()
                        }
                    })
                    return 'Postingan sudah dihapus'
            }
            catch(err){
                console.log(err);
                throw new Error(err)
            }
        }
    }
}

