import { applyDecorators } from "@nestjs/common";
import { Type } from "class-transformer";
import { ValidateNested, ValidationOptions } from "class-validator";
import { IdDto } from "common/dto/id.dto";

/**
 * Checks if the value is an object id
 */
export const IsEntity = (): PropertyDecorator => 
  applyDecorators(
    ValidateNested(), 
    Type(() => IdDto),
  );