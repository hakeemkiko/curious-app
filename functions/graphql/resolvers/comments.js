const { UserInputError, AuthenticationError } = require('apollo-server-express')
const { db } = require('../../utility/admin')
const FBAuthContext = require('../../utility/FBAuthContext')

module.exports = {
    Mutation : {
        async createComment (_, { postId, text }, context) {
            const { username } = await FBAuthContext(context)

            const postDocument = db.doc(`/posts/${postId}`)
            const commentDocument = db.collection(`/posts/${postId}/comments`)

            if (text.trim() === '') {
                throw new UserInputError('Kamu tidak bisa membuat comment tanpa text', { errors: {text : 'Kamu tidak bisa membuat comment tanpa text'}})
            }

         try {
            const newComment = {
                owner: username,
                createdAt: new Date().toISOString(),
                text
            }

            await postDocument.get()
                .then(doc => {
                    if (!doc.exists) {
                        throw new UserInputError('Postingan tidak ditemukan/sudah dihapus')
                    }
                    else {
                    doc.update({ commentCount: doc.data().commentCount + 1 })
                    return commentDocument.add(newComment)
                    } 
                })
                .then(doc => {
                    newComment.id = doc.id
                    doc.update({ id: doc.id })

                })

            return newComment
         }
         catch(err) {
            console.log(err);
            throw new Error(err)
         }
        },


        async deleteComment (_, {postId, commentId}, context){
            const { username } = await FBAuthContext(context)
            
           const postDocument = db.doc(`/posts/${postId}`)
           const commentDocument = db.doc(`'posts/${postId}/comments/${commentId}`)

            try {
                await postDocument.get()
                    .then(doc => {
                        if (!doc.exists) {
                            throw new UserInputError('Postingan tidak ditemukan/sudah dihapus')
                        }
                        else {
                            return commentDocument.get()
                        }
                    })
                    .then(doc => {
                        if (!doc.exists) {
                            throw new UserInputError('Comment tidak ditemukan/sudah dihapus')
                        }
                        if (doc.data().owner !== username) {
                            throw new UserInputError('Unauthorized')
                        }
                        else {
                            commentDocument.delete()
                            postDocument.update({ commentCount: doc.data().commentCount - 1 })

                        }
                    })
                    return 'Comment telah dihapus'
        }
        catch(err){
            console.log(err);
            throw new Error(err)
        }
        }
    }
}