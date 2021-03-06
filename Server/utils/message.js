var moment = require('moment');

// creating a admin object so we dont have to define it everytime
let generateMessage = (from, text) => {
    return {
        from,
        text,
        //createdAt: new Date().getTime() OR
        createdAt: moment().valueOf()
    };

};
//creating a location object
let generateLocationMessage = (from, latitude, longitude) => {
    return {
        from,
        url: `https://www.google.com/maps?q=${latitude}, ${longitude}`,
        //createdAt: new Date().getTime()
        createdAt: moment().valueOf()
    };
}
module.exports = {generateMessage, generateLocationMessage};