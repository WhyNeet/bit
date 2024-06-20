import { Types } from "mongoose";

// biome-ignore lint/complexity/noStaticOnlyClass: grouping
export class RelationDtoHelper {
  /**
   *
   * @param field The populated field.
   * @param createDto A function to create a DTO
   * @returns A function to either create a DTO or a string
   */
  public static createFromRelation<T, D>(
    field: Types.ObjectId | T,
    createDto: (field: T) => D,
  ): D | string {
    if (field instanceof Types.ObjectId) return field.toString();

    return createDto(field);
  }
}
