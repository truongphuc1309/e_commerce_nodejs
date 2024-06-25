const app = require ('./src/app')

const Port = process.env.PORT|| 8080 

const server = app.listen(Port, () => {
  console.log('Server is running on PORT', Port)
})
