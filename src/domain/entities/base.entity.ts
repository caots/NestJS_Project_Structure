import { AggregateRoot } from "@nestjs/cqrs";
import { BaseEvent } from "src/domain/events/base-event";
import { PrimaryGeneratedColumn } from "typeorm";

export class BaseEntity extends AggregateRoot {
  @PrimaryGeneratedColumn()
  id: number;

  domainEvents: BaseEvent[] = [];
}