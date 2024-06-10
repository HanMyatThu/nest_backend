import { RegistryDates } from "common/embedded/registry-dates.embedded";
import { OrderStatus } from "order/enums/order-status.enum";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "users/entities/user.entity";

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

  @ManyToOne(() => User, (customer) => customer.orders, { nullable: false })
  customer: User;

  @Column(() => RegistryDates, { prefix: false })
  registryDates: RegistryDates;
}
