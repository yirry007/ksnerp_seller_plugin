export const itemCountChangedReducer = (prevState={item_count_changed:null}, action) => {
    /** item_count_changed 中保存随机数，根据这个随机数，重新获取订单数量并更改浮动按钮右上方的微标 */
    // console.log(action);
    let {type, payload} = action;

    switch (type) {
        case 'set_item_count_changed':
            let newState = {...prevState};
            newState.item_count_changed = payload;
            return newState;
        default: 
            return prevState;
    }
}