// creating a admin object so we dont have to define it everytime
let generateMessage = (from, text) => {
    return {
        from,
        text,
        createdAt: new Date().getTime()
    };

};
module.exports = {generateMessage};