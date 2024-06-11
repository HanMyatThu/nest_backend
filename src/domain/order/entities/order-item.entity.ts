import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Order } from "./order.entity";
import { Product } from "products/entities/product.entity";
import { Expose } from "class-transformer";

@Entity()
export class OrderItem {

  @PrimaryColumn()
  orderId: number;

  @PrimaryColumn()
  productId: number;

  @ManyToOne(() => Product, product => product.items, { onDelete: 'CASCADE' })
  order: Order;

  @ManyToOne(() => Product, product => product.items)
  product: Product;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 6, scale: 2 })
  price: number;

  @Expose()
  get subTotal() {
    return this.quantity * this.price;
  }
}
