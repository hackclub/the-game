import Layout from "@/layouts/layout";
import { Order } from "@/interfaces/orders";


interface Props {
    orders: Order[];
  }
  

export default function showOrder({ orders }: Props) {
    return (
    <Layout>
        <h1> Orders </h1>
       
    </Layout>
)

}
