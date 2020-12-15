const { db } = require('../../utility/admin')

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
        }
    }
}

