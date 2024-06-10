import { Category } from 'categories/entities/category.entity';
import { RegistryDates } from './../../../common/embedded/registry-dates.embedded';
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderItem } from 'order/entities/order-item.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 6, scale: 2 })
  price: number;

  @Column(() => RegistryDates, { prefix : false })
  RegistryDates: RegistryDates;

  @OneToMany(() => OrderItem, (item) => item.product)
  items: OrderItem[]


  @ManyToMany(() => Category, (category) => category.products)
  @JoinTable({ name: "product_to_category" })
  categories: Category[];

  get orders() {
    return this.items.map(item => item.order)
  }
}
