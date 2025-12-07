import express from 'express'
import cors from 'cors'
import { v4 as uuidv4 } from 'uuid'
const app = express()
const port =  3001
app.use(express.json())
app.use(cors())  //qualquer pessoa tem acesso a essa API

const users =[]


const checkUserId = (request,response,next) => {
    const {id} = request.params

    const index = users.findIndex(user => user.id === id )

    if(index < 0){
        return response.status(404).json({message: "User not found"})
    }
    request.userIndex = index
    request.userId = id
    next()
}



app.get('/users', (request,response) => {
    return response.json(users)
})


app.post('/users', (request, response) => {
  try {
    const { name, age } = request.body

    if (age < 18) throw new Error("Only allowed users over 18 years old")

    const user = { id: uuidv4(), name, age }
    users.push(user)

    return response.status(201).json(user)

  } catch (err) {
    return response.status(400).json({ error: err.message })
  } finally {
    console.log("Terminou tudo")
  }
})

app.put('/users/:id',checkUserId,  (request,response) => {
    const {name,age} = request.body
    const index = request.userIndex
    const id = request.userId

    const updateUser = {id,name,age}
    
    users[index] = updateUser

    return response.json(updateUser)
})

app.delete('/users/:id',checkUserId, (request,response) => {
    const index= request.userIndex

    users.splice(index,1)
    return response.status(204).json("")
})

app.listen(port, ()=>{
    console.log(`🌅 Server started on ${port}`)
})
