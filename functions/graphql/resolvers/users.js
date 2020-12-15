const { UserInputError } = require('apollo-server-express')
const encrypt = require('bcrypt')

const { db } = require('../../utility/admin')
const firebase = require('firebase')
const config = require('../../utility/config')
const { validateRegisterInput, validateLoginInput } = require('../../utility/validators')

firebase.initializeApp(config)

module.exports = {

   

    Mutation : {
      

        async registerUser(_, {registerInput: { username, email, password, confirmPassword}}){
       
            console.log(username, email, password, confirmPassword);
            
            // TODO: Cek apakah data user sudah pernah daftar ke firestore
            // TODO: Simpan data yang User input ke Firestore
            // TODO: Daftarkan user dengan data yang diinput ke Firebase Auth

            // TODO: Cek apakah user menginput data dengan benar -> Buat validator function

            // User input error checking


            const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword)

            if (!valid) throw new UserInputError('Errors', { errors })

            let newUser = {
                username,
                email,
                createdAt : new Date().toISOString(),
            }

            const hash = await encrypt.hash(password, 12)

        try {
            await db.doc(`/users/${username}`).get()
            .then(doc => {
                if (doc.exist) {
                    throw UserInputError('Username tidak tersedia', {
                        errors: { username: 'Username tidak tersedia' }
                    })
                }
                else return firebase.auth().createUserWithEmailAndPassword(email, password)
            })
            .then(data => {
                newUser.id = data.user.uid
                return data.user.getIdToken()
            })
            .then(idToken => {
                newUser.token = idToken

                const saveUserData = {
                    id : newUser.id,
                    username,
                    email,
                    createdAt : new Date().toISOString(),
                    profilePicture : 'Link ke foto profil',
                    _private : []
                }

                saveUserData._private.push({
                    hash,
                    lasUpdate : new Date().toISOString()
                })

                return db.doc(`/users/${username}`).set(saveUserData)
            })

                return newUser
        }
            catch(err){
                console.log(err);
                throw new Error(err)
            }
        }
    }
}