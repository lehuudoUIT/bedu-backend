import axios from 'axios';
import * as CryptoJS from 'crypto-js';
import { PaymentStrategy } from './payment.strategy';
import { v4 as uuidv4 } from 'uuid';
import * as moment from 'moment';
import { BadRequestException } from '@nestjs/common';

export class ZaloPaymentStrategy implements PaymentStrategy {
  private readonly config;

  constructor() {
    const config = {
      appid: process.env.ZALO_APPID,
      key1: process.env.ZALO_KEY01,
      key2: process.env.ZALO_KEY02,
      endpoint: process.env.ZALO_ENDPOINT,
    };
    this.config = config;
  }

  async processPayment(amount: number, content?: string): Promise<any> {
    const embeddata = {
      merchantinfo: 'embeddata123',
      redirecturl: process.env.ZALO_REDIRECT_URL,
    };

    const items = [
      {
        itemid: 'knb',
        itemname: 'kim nguyen bao',
        itemprice: 198400,
        itemquantity: 1,
      },
    ];

    const callback_url = process.env.ZALO_CONFIRM_URL;

    console.log('callback_url: ' + callback_url);

    const order = {
      appid: this.config.appid,
      apptransid: `${moment().format('YYMMDD')}_${uuidv4()}`, // mã giao dich có định dạng yyMMdd_xxxx
      appuser: 'demo',
      apptime: Date.now(), // miliseconds
      item: JSON.stringify(items),
      embeddata: JSON.stringify(embeddata),
      amount,
      description: content || 'ZaloPay Integration Demo',
      bankcode: 'zalopayapp',
      callback_url,
    };

    // appid|apptransid|appuser|amount|apptime|embeddata|item
    const data =
      this.config.appid +
      '|' +
      order.apptransid +
      '|' +
      order.appuser +
      '|' +
      order.amount +
      '|' +
      order.apptime +
      '|' +
      order.embeddata +
      '|' +
      order.item;
    const key = await CryptoJS.HmacSHA256(data, this.config.key1).toString();
    order['mac'] = key;

    try {
      const result = await axios.post(this.config.endpoint, null, {
        params: order,
      });

      return {
        ...result.data,
        redirectUrl: result.data?.orderurl,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async confirmPayment(payload: any) {
    const dataStr: string = payload.data;
    const reqMac: string = payload.mac;
    let result: { returncode: number; returnmessage: string };

    try {
      let mac = CryptoJS.HmacSHA256(dataStr, this.config.key2).toString();
      console.log('mac =', mac);

      // kiểm tra callback hợp lệ (đến từ ZaloPay server)
      if (reqMac !== mac) {
        // callback không hợp lệ
        result.returncode = -1;
        result.returnmessage = 'mac not equal';
      } else {
        // thanh toán thành công
        // merchant cập nhật trạng thái cho đơn hàng
        let dataJson = JSON.parse(dataStr, this.config.key2);
        console.log(
          "update order's status = success where apptransid =",
          dataJson['apptransid'],
        );

        result.returncode = 1;
        result.returnmessage = 'success';
      }
    } catch (ex) {
      result.returncode = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
      result.returnmessage = ex.message;
    }

    return result;
  }
}
