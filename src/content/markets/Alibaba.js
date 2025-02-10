import $ from 'jquery';
import { Api } from '../../utils/api';
import { RequestBackground } from '../RequestBackground';
import axios from 'axios';
import { transformToJson } from '../../utils/functions';

export const Alibaba = {
    market: '1688',

    /** 验证需不需要采购当前页面的商品 */
    hasMatched: (cb) => {
        const supply_code = Alibaba._getSupplyCode();

        /** 没有获取到采购商品id */
        if (!supply_code) {
            cb(false);
            return false;
        }

        RequestBackground({
            url: Api.has_matched(supply_code),
            callback: res => cb(res)
        });
    },

    /** 获取待采购商品的详细信息（选项，数量等） */
    getMatchedItem: (cb) => {
        const supply_code = Alibaba._getSupplyCode();

        /** 没有获取到采购商品id */
        if (!supply_code) {
            cb(false);
            return false;
        }

        RequestBackground({
            url: Api.get_matched_item(supply_code),
            callback: res => cb(res)
        });
    },

    /** 自动拾取1688订单列表的订单，订单商品，发货以及快递信息 */
    collectOrder: async (cb) => {
        /** 先清空数据容器 */
        Alibaba._itemInfoWithDelivery = [];

        const orderItems = $.makeArray($('.order-info').find('table:eq(0)').find('tr'));
        const result = await Alibaba._getItemInfoWithDelivery(orderItems);

        if (result.length === 0) {
            cb(false);
            return false;
        }

        RequestBackground({
            url: Api.item_match,
            method: 'post',
            datas: {supply_order_items: result},
            callback: res => cb(res)
        });
    },

    /** 获取采购商品id */
    _getSupplyCode: () => {
        const currentUrl = window.location.href;

        if (currentUrl.indexOf('detail.1688.com') === -1) {
            /** 商品详细页的url验证 */
            return false;
        } else {
            return currentUrl.split('/offer/')[1].split('.html')[0];
        }
    },

    /** 获取采购商品信息和物流信息 */
    _itemInfoWithDelivery: [],
    _getItemInfoWithDelivery: async (itemTrList) => {
        if (itemTrList.length === 0) return;

        const _itemTr = itemTrList.shift();
        const _item = {};

        _item['supply_url'] = $(_itemTr).find('.productName').attr('href');
        _item['supply_code'] = _item['supply_url'].split('/offer/')[1].split('.html')[0];
        _item['supply_opt'] = '';
        _item['supply_market'] = '1688';
        _item['supply_name'] = $(_itemTr).find('.productName').text().replace(/\s/g, '');
        _item['supply_options'] = transformToJson($(_itemTr).find('.trade-spec').text().replace(/\s/g, ''));
        _item['supply_image'] = 'https:' + $(_itemTr).find('.s1 img').attr('src').replace('80x80', '400x400');
        _item['supply_price'] = $(_itemTr).find('.s3 span').html();
        _item['supply_order_id'] = $(_itemTr).parents('.order-item').find('input.tradeId').val();

        _item['supply_delivery_name'] = '';
        _item['supply_delivery_number'] = '';
        _item['supply_delivery_code'] = '';
        _item['supply_delivery_received'] = '';
        /** 已经发货的订单 */
        if (
            $(_itemTr).parents('.order-item').find('.status-wait-buyer-action').length > 0
            || $(_itemTr).parents('.order-item').find('.status-success').length > 0
        ) {
            const result = await axios.get('https://trade.1688.com/order/new_step_order_detail.htm?orderId=' + _item['supply_order_id']);
            const deliveryPageHtml = result.data;
            const deliveryCompany = $(deliveryPageHtml).find('dl.info-item').eq(1).find('.info-item-val').html();

            _item['supply_delivery_name'] = deliveryCompany ? deliveryCompany.split('(')[0] : '';
            _item['supply_delivery_number'] = $(deliveryPageHtml).find('dl.info-item').eq(2).find('.info-item-val').text().replace(/\s/g, '');

        }

        Alibaba._itemInfoWithDelivery.push(_item);
        await Alibaba._getItemInfoWithDelivery(itemTrList);

        return Alibaba._itemInfoWithDelivery;
    },
};