import axios from 'axios';
import { PaymentStrategy } from './payment.strategy';
import { InternalServerErrorException } from '@nestjs/common';
import * as moment from 'moment';

export class PaypalPaymentStrategy implements PaymentStrategy {
  private ttl: Date;
  private token: string;

  async generateAccessToken() {
    if (!this.token || !this.ttl || this.ttl < new Date()) {
      const response = await axios({
        url: process.env.PAYPAL_BASE_URL + '/v1/oauth2/token',
        method: 'post',
        data: 'grant_type=client_credentials',
        auth: {
          username: process.env.PAYPAL_CLIENT_ID,
          password: process.env.PAYPAL_SECRET,
        },
      });
      const expireTime = process.env.PAYPAL_TOKEN_TTL;

      const generateAccessToken = response.data.access_token;
      this.token = generateAccessToken;
      this.ttl = moment(new Date()).add(expireTime, 's').toDate();

      return generateAccessToken;
    }

    return this.token;
  }

  async processPayment(amount: number, content?: string): Promise<any> {
    //Call cache service here:

    const token = await this.generateAccessToken();

    const response = await axios({
      url: process.env.PAYPAL_BASE_URL + '/v2/checkout/orders',
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: process.env.PAYPAL_CURRENCY_CODE || 'USD', // USD là mặc định
              value: amount.toFixed(2), // Đảm bảo giá trị là dạng số thập phân
              breakdown: {
                item_total: {
                  currency_code: process.env.PAYPAL_CURRENCY_CODE || 'USD',
                  value: amount.toFixed(2),
                },
              },
            },
            items: [
              {
                name: content,
                description: `This is a bill for ${content}`,
                quantity: '1', // PayPal yêu cầu là string
                unit_amount: {
                  currency_code: process.env.PAYPAL_CURRENCY_CODE || 'USD',
                  value: amount.toFixed(2),
                },
              },
            ],
          },
        ],
        application_context: {
          return_url: process.env.PAYPAL_RETURN_URL,
          cancel_url: process.env.PAYPAL_CANCEL_URL,
          shipping_preference: 'NO_SHIPPING',
          user_action: 'PAY_NOW',
          brand_name: 'BEDU',
        },
      },
    });

    return response.data.links.find((link) => link.rel == 'approve').href;
  }

  async confirmPayment(orderId: string): Promise<string> {
    const token = await this.generateAccessToken();
    try {
      console.log(token);

      await axios({
        url:
          process.env.PAYPAL_BASE_URL +
          `/v2/checkout/orders/${orderId}/capture`,
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const detailOrder = await axios({
        url: process.env.PAYPAL_BASE_URL + `/v2/checkout/orders/${orderId}`,
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      return detailOrder.data;
    } catch (error) {
      console.error('PayPal API Error:', error.response?.data || error.message);
      throw new InternalServerErrorException(
        error.response?.data || 'Error capturing payment',
      );
    }
  }
}
