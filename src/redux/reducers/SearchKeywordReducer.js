export const searchKeywordReducer = (prevState={search_keyword:null}, action) => {
    // console.log(action);
    let {type, payload} = action;

    switch (type) {
        case 'set_search_keyword':
            let newState = {...prevState};
            newState.search_keyword = payload;
            return newState;
        default: 
            return prevState;
    }
}