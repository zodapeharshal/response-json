export default (state, action) => {
    switch(action.type){
        case "updateData": return {
            ...state,
            fileData: action.payload
        };
        case "updateToShow" : return {
            ...state,
            toShow : action.payload
        };
        default:
            return state ; 
    }
};