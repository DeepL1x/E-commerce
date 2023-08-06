import { Request, Response } from "express"
import Stripe from "stripe"
import { ItemOrder, PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
})

export const createCheckoutSession = async (req: Request, res: Response) => {
  const order = req.body as ItemOrder[]
  const line_items = []
  for (const orderItem of order) {
    const item = await prisma.item.findUnique({
      where: { itemId: orderItem.itemId },
    })
    line_items.push({
      price_data: {
        currency: item.currency,
        product_data: {
          name: item.name,
          images: [item.coverImg],
          metadata: {
            itemId: item.itemId,
          },
        },
        unit_amount: Number(item.price) * 100,
      },
      quantity: orderItem.amount,
    })
  }
  const session = await stripe.checkout.sessions.create({
    shipping_address_collection: {
      allowed_countries: ["US", "CA", "UA"],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 0,
            currency: "usd",
          },
          display_name: "Free shipping",
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 5,
            },
            maximum: {
              unit: "business_day",
              value: 7,
            },
          },
        },
      },
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 1500,
            currency: "usd",
          },
          display_name: "Next day air",
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 1,
            },
            maximum: {
              unit: "business_day",
              value: 1,
            },
          },
        },
      },
    ],
    line_items,
    metadata: {
      type: "single",
    },
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/checkout/success`,
    cancel_url: `${process.env.CLIENT_URL}`,
  })

  return res.send({ url: session.url })
}

export const checkoutCart = async (req: Request, res: Response) => {
  const cart = (
    await prisma.user.findUnique({
      where: { userId: res.locals.user.userId },
      include: { cart: true },
    })
  ).cart

  const line_items = [] as Stripe.Checkout.SessionCreateParams.LineItem[]
  for (const orderItem of cart) {
    const item = await prisma.item.findUnique({
      where: { itemId: orderItem.itemId },
    })
    line_items.push({
      price_data: {
        currency: item.currency,
        product_data: {
          name: item.name,
          images: [item.coverImg],
          metadata: {
            itemId: item.itemId,
          },
        },
        unit_amount: Number(item.price) * 100,
      },
      quantity: orderItem.amount,
    })
  }
  const session = await stripe.checkout.sessions.create({
    shipping_address_collection: {
      allowed_countries: ["US", "CA", "UA"],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 0,
            currency: "usd",
          },
          display_name: "Free shipping",
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 5,
            },
            maximum: {
              unit: "business_day",
              value: 7,
            },
          },
        },
      },
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 1500,
            currency: "usd",
          },
          display_name: "Next day air",
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 1,
            },
            maximum: {
              unit: "business_day",
              value: 1,
            },
          },
        },
      },
    ],
    phone_number_collection: {
      enabled: true,
    },
    line_items,
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/user/cart`,
    cancel_url: `${process.env.CLIENT_URL}`,
  })

  return res.send({ url: session.url })
}

export const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"]
  let event

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.log(`⚠：Webhook Error: ${err.message}`)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }
  let result
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const line_items = await stripe.checkout.sessions.listLineItems(
      session.id,
      {
        expand: ["data.price.product"],
      }
    )

    result = await prisma.order.create({
      data: {
        userEmail: session.customer_details.email,
        status: "SUCCEEDED",
      },
    })
    const user = await prisma.user.findUnique({
      where: { email: session.customer_details.email },
      include: { cart: true },
    })
    if (user && session.metadata.type !== "single") {
      for (const item of user.cart) {
        if (
         line_items.data.find((sessionItem) => {
            return (
              Number(
                (sessionItem.price.product as Stripe.Product).metadata.itemId
              ) === item.itemId
            )
          })
        ) {
          await prisma.itemOrder.update({
            where: { itemOrderId: item.itemOrderId },
            data: {
              userId: null,
              orderId: result.orderId,
            },
          })
        }
      }
    } else {
      for (const item of line_items.data) {
        await prisma.itemOrder.create({
          //@ts-ignore
          data: {
            orderId: result.orderId,
            itemId: Number(
              (item.price.product as Stripe.Product).metadata.itemId
            ),
          },
        })
      }
    }
  }

  res.json(result).end()
}

export const getConfig = async (req: Request, res: Response) => {
  return res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY })
}
