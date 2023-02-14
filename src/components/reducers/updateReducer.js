export default (state, action) => {
    switch(action.type){
        case "updateData": return {
            ...state,
            fileData: action.payload,
        };
        case "updateToShow" : return {
            ...state,
            toShow : action.payload
        };
        case "updatePeriod" : return {
            ...state,
            toActivatePeriod: action.payload
        }; 
        case "updateIsLoading" : return {
            ...state,
            isLoading: action.payload
        };
        default:
            return state ; 
    }
};