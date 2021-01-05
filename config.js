const dotenv=require('dotenv').config({path: './.env'});

module.exports={
PUBLIC_KEY:process.env.PUBLIC_KEY,
PRIVATE_KEY:process.env.PRIVATE_KEY,
PORT:process.env.PORT
}