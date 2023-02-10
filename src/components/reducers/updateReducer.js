export default (state, action) => {
    switch(action.type){
        case "updateData": return {
            fileData: action.payload
        };
        default:
            return state ; 
    }
};