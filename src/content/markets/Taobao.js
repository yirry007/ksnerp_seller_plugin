import $ from 'jquery';
import { Api } from '../../utils/api';
import { RequestBackground } from '../RequestBackground';
import { getUrlParams, transformToJson } from '../../utils/functions';
import axios from 'axios';

export const Taobao = {
    market: 'taobao',

    /** 验证需不需要采购当前页面的商品 */
    hasMatched: (cb) => {
        const supply_code = Taobao._getSupplyCode();

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
        const supply_code = Taobao._getSupplyCode();

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

    /** 自动拾取淘宝订单列表的订单，订单商品，发货以及快递信息 */
    collectOrder: async (cb) => {
        /** 先清空数据容器 */
        Taobao._itemInfoWithDelivery = [];

        const listTr = $('.js-order-container').find('tbody:eq(1)').find('tr');
        const orderItems = [];

        $(listTr).each((k, v) => {
            if ($(v).find('a').filter(function() {
                return $(this).attr('class') && $(this).attr('class').match(/production-mod__pic___\S*/);
            }).length > 0) {
                orderItems.push(v);
            }
        });

        const result = await Taobao._getItemInfoWithDelivery(orderItems);

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

        /** 商品详细页的url验证 */
        if (currentUrl.indexOf('item.taobao.com') === -1) {
            return false;
        } else {
            return getUrlParams(currentUrl, 'id');
        }
    },

    /** 获取采购商品信息和物流信息 */
    _itemInfoWithDelivery: [],
    _getItemInfoWithDelivery: async (itemTrList) => {
        if (itemTrList.length === 0) return;

        const _itemTr = itemTrList.shift();
        const _item = {};

        _item['supply_url'] = 'https:' + $(_itemTr).find('a').eq(0).attr('href');
        _item['supply_code'] = getUrlParams(_item['supply_url'], 'id');
        _item['supply_opt'] = '';
        _item['supply_market'] = 'taobao';
        
        _item['supply_name'] = $(_itemTr).find('div').filter(function() {
            return $(this).attr('class') && $(this).attr('class').match(/ml-mod__container___\S*/);
        }).find('div:eq(2)').find('p:eq(0)').find('span').eq(1).text();

        /** 设置商品选项 */
        let supplyOptions = '';
        $(_itemTr).find('span').filter(function() {
            return $(this).attr('class') && $(this).attr('class').match(/production-mod__sku-item___\S*/);
        }).each((k, v) => {
            if (k > 0) supplyOptions += ';';

            supplyOptions += $(v).text();
        });
        _item['supply_options'] = transformToJson(supplyOptions);

        _item['supply_image'] = 'https:' + $(_itemTr).find('a').filter(function() {
            return $(this).attr('class') && $(this).attr('class').match(/production-mod__pic___\S*/);
        }).find('img').attr('src').replace('_80x80.jpg', '');

        _item['supply_price'] = $(_itemTr).find('div').filter(function() {
            return $(this).attr('class') && $(this).attr('class').match(/price-mod__price___\S*/);
        }).eq(0).find('span:last').text();

        _item['supply_order_id'] = $(_itemTr).parents('.js-order-container').find('td').filter(function() {
            return $(this).attr('class') && $(this).attr('class').match(/bought-wrapper-mod__head-info-cell___\S*/);
        }).find('span:last').text();

        /** 快递信息 */
        const result = await axios.get('https://buyertrade.taobao.com/trade/json/transit_step.do?bizOrderId=' + _item['supply_order_id']);
        const resultData = result.data;
        
        _item['supply_delivery_name'] = '';
        _item['supply_delivery_number'] = '';
        _item['supply_delivery_code'] = '';
        _item['supply_delivery_received'] = '';
        if (resultData.hasOwnProperty('expressId')) {
            _item['supply_delivery_name'] = resultData.expressName;
            _item['supply_delivery_number'] = resultData.expressId;

            const deliveryInfo = resultData.address[0];
            if (deliveryInfo.place.indexOf('签收') > -1 || deliveryInfo.place.indexOf('送货') > -1) {
                _item['supply_delivery_received'] = deliveryInfo.time + ' ' + deliveryInfo.place;
            }
        }

        Taobao._itemInfoWithDelivery.push(_item);
        await Taobao._getItemInfoWithDelivery(itemTrList);

        return Taobao._itemInfoWithDelivery;
    },
};