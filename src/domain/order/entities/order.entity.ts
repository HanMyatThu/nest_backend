import { RegistryDates } from "common/embedded/registry-dates.embedded";
import { OrderStatus } from "order/enums/order-status.enum";
import { Payment } from "payments/entities/payment.entity";
import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "users/entities/user.entity";
import { OrderItem } from "./order-item.entity";
import { Expose } from "class-transformer";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.AWAITING_PAYMENT,
  })
  status: OrderStatus;

  // relations
  @ManyToOne(() => User, (customer) => customer.orders, { nullable: false })
  customer: User;

  @OneToOne(() => Payment, (payment) => payment.order, { cascade: true })
  payment: Payment;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[]

  @Column(() => RegistryDates, { prefix: false })
  registryDates: RegistryDates;

  @Expose()
  get total() {
    return this.items?.reduce((prev, current) => prev + current.subTotal, 0); 
  }
}
