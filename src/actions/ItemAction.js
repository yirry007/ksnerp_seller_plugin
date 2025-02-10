import { message } from "antd";
import { Request } from "../utils/Request";
import { Api } from "../utils/api";

export const ItemAction = {
    /** 待采购商品列表 */
    itemList: async (params) => {
        const response = await Request.get({
            url: Api.item_list,
            datas: params,
            withAuth: true
        });

        if (response.code !== '') {
            message.error(response.message);
            return false;
        }

        return response;
    },

    /** 待采购商品详细信息 */
    itemInfo: async (params) => {
        const response = await Request.get({
            url: Api.item_info,
            datas: params,
            withAuth: true
        });

        if (response.code !== '') {
            message.error(response.message);
            return false;
        }

        return response;
    },
};