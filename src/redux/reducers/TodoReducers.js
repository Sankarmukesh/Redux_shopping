const intialState = {
    todos:[],
    singleTodo:null,
    loading:false
}

export const TodoReducers = (state=intialState,actions)=>{
        switch(actions.type) {
            case "ADD":
                return state
            default:
                return state
        }
}