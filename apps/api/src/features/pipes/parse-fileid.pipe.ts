import { ArgumentMetadata, ParseUUIDPipe } from "@nestjs/common";
import { validateFileId } from "common";

export class ParseFileIdPipe extends ParseUUIDPipe {
  async transform(value: string, metadata: ArgumentMetadata): Promise<string> {
    const validationResult = validateFileId(value);

    if (!validationResult || !this.isUUID(validationResult.uuid))
      throw this.exceptionFactory("Invalid file identifier.");

    return value;
  }
}
