import { Request } from "../utils/Request";
import { Api } from "../utils/api";

export const MainAction = {
    /** 获取各个店铺的待采购商品数量 */
    mainData: async () => {
        const response = await Request.get({
            url: Api.main_data,
            withAuth: true
        });

        return response;
    },
};