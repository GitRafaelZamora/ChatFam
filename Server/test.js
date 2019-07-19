const isEmpty = (string) => {
    return (string.trim() === '') ? true : false;
}

const isEmail = (string) => {
    const emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return (string.match(emailRegEx)) ? true : false;
}


function test(email) {
    console.log(isEmail(email), isEmpty(email));
};
console.log("RUNNING ");
test("");