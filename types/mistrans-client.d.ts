/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "midtrans-client" {
  export class Snap {
    constructor(options: {
      isProduction: boolean;
      serverKey: string;
      clientKey: string;
    });

    createTransaction(parameter: {
      transaction_details: {
        order_id: string;
        gross_amount: number;
      };
      item_details?: Array<{
        id: string;
        price: number;
        quantity: number;
        name: string;
      }>;
      customer_details?: {
        first_name?: string;
        last_name?: string;
        email?: string;
        phone?: string;
      };
      enabled_payments?: string[];
      [key: string]: any;
    }): Promise<{
      token: string;
      redirect_url: string;
    }>;
  }

  export class CoreApi {
    constructor(options: {
      isProduction: boolean;
      serverKey: string;
      clientKey: string;
    });

    transaction: {
      notification(notificationJson: any): Promise<{
        transaction_time: string;
        transaction_status: string;
        transaction_id: string;
        status_message: string;
        status_code: string;
        signature_key: string;
        payment_type: string;
        order_id: string;
        merchant_id: string;
        gross_amount: string;
        fraud_status: string;
        currency: string;
        [key: string]: any;
      }>;
      status(orderId: string): Promise<any>;
    };
  }
}
