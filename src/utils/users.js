const users=[]

//adduser,removeuser,getuser,getusersinroom
const addUser=({id,username,room})=>{
    //clean data
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()

    //vlaidate data
    if(!username || !room){
        return{
            error:'usenrname and room are required'
        }
    }
    //checj for existing user
    const existingUser=users.find((user)=>{
        return user.room===room && user.username===username
    })

    //validate username
    if(existingUser){
        return {
            error: 'username is in use'
        }
    }

    //store user
    const user={id,username,room}
    users.push(user);
    return {user};
}

const removeUser=(id)=>{
    const index=users.findIndex((user)=>{
        return user.id===id
    })

    if(index!=-1){
        return users.splice(index,1)[0]
    }
}

const getUser=(id)=>{
    // const index=users.findIndex((user)=>{
    //     return user.id===id
    // })
    // if(index!=-1){
    //     return users[index]
    // }
    // return undefined
    return users.find((user)=> user.id===id)
}

const getUsersInRoom=(room)=>{
    // const res=[]
    // users.find((user)=>{
    //     if(user.room===room){
    //         res.push(user)
    //     }
    // })
    // return res
    return users.filter((user)=> users.room===room)
}

module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}