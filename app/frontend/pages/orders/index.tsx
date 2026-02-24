import Layout from "@/layouts/layout";
import PageHeading from "@/components/layout/PageHeading";
import type { Order } from "@/interfaces/orders";
import type { PrivateUser } from "@/interfaces/user";
import type { Item } from "@/interfaces/item";
import { router } from '@inertiajs/react'


interface Props {
  orders: Order;
  order_user: PrivateUser;
  item: Item;
}

export default function ShowOrder({ orders, order_user, item }: Props) {
    
}