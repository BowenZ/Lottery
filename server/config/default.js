module.exports = {
  port: 3000,
  session: {
    secret: 'lottery',
    key: 'lottery',
    maxAge: 2592000000
  },
  mongodb: 'mongodb://localhost:27017/lottery'
};