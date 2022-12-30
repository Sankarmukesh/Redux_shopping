const intialState = {
    products:[],
    singleProduct:{},
    loading:false,
    cart:[],
    orders:[]
}

export const ShoppingReducers = (state=intialState,actions)=>{
        switch(actions.type) {
            case "ADD":
                return {...state,products:actions.payload}
            case 'SingleProduct':
                
                return {...state,singleProduct:actions.payload}

            
            
            case "CARTALL":
                return {...state,cart:actions.payload}


            case 'ORDERSALL':
                return {...state,orders:actions.payload}

            case 'CARTDELETE':
                return {...state,cart:state.cart.filter(c=>{return +c.id !== +actions.payload.id})}
            default:
                return state
        }
}