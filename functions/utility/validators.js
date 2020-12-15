module.exports.validateRegisterInput = (
    username,
    email,
    password,
    confirmPassword
) => {
    const errors = {};
    if (username.trim() === " ") {
        errors.username = 'Username tidak boleh kosong'
    }
    if (email.trim() === "") {
        errors.email = 'Email tidak boleh kosong'
    } else {
        const regEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!email.match(regEx)) {
            errors.email = 'Format email tidak valid';
        }
    }
    if (password === '') {
        errors.password = 'Password tidak boleh kosong';
    } else if (password !== confirmPassword){
        errors.confirmPassword = 'Password tidak sesuai';
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    };
};

module.exports.validateLoginInput = (username, password) => {
    const errors = {};
    
    if (username.trim() === '') {
        errors.username = 'Username tidak boleh kosong';
    }
    if (password.trim() === '') {
        errors.password = 'Password tidak boleh kosong'
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}