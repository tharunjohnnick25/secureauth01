import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: NextRequest) {
  try {
    const { amount, planId } = await req.json();

    const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy_key';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_dummy_secret';

    const options = {
      amount: amount * 100, // amount in smallest currency unit
      currency: "USD",
      receipt: `receipt_order_${Math.floor(Math.random() * 10000)}`,
      notes: {
        planId,
      }
    };

    if (keyId === 'rzp_test_dummy_key') {
      // Return a mock order for demo purposes if no real key is provided
      return NextResponse.json({
        id: `order_mock_${Math.floor(Math.random() * 1000000)}`,
        entity: "order",
        amount: options.amount,
        amount_paid: 0,
        amount_due: options.amount,
        currency: "USD",
        receipt: options.receipt,
        status: "created",
        attempts: 0,
        created_at: Math.floor(Date.now() / 1000)
      });
    }

    const instance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const order = await instance.orders.create(options);
    
    return NextResponse.json(order);
  } catch (error) {
    console.error("Error creating razorpay order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
