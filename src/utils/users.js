const users = [];
// adduser, removeuser, getuser, getuserinroom

const addUser = ({id, username, room}) => {
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    if (!username || !room){
        return{
            error: "Username and room are required !!!"
        }
    } else{
        const existingUser = users.find((user) =>{
            return user.room === room && user.username === username;
        });

        if (existingUser){
            return {
                error: "Username has been taken !!!"
            }
        } else {
            const user = {
                id, username, room
            }
            users.push(user);
            return {user};
        }
    }
};

const removeUser = ({id}) => {
    const position = users.findIndex((user) => {
        return user.id === id;
    });

    if (position !== -1){
        return users.splice(position, 1)[0];
    } else {
        return undefined;
    }   
};

const getUser = ({id}) => {
    const position = users.findIndex((user) => {
        return user.id === id;
    });

    if (position !== -1){
        return users[position]
    } else {
        return undefined;
    }
};

const getUsersInRoom = ({room}) => {
    let usersInRoom = [];
    users.forEach(user => {
        if (user.room === room) {
            usersInRoom.push(user);
        }
    });
    return usersInRoom;
};

module.exports = {
    addUser: addUser,
    removeUser: removeUser,
    getUser: getUser,
    getUsersInRoom: getUsersInRoom,
}