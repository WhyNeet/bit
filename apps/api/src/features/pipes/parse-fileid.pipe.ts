import { ArgumentMetadata, ParseUUIDPipe } from "@nestjs/common";

export class ParseFileIdPipe extends ParseUUIDPipe {
  async transform(value: string, metadata: ArgumentMetadata): Promise<string> {
    if (value.length < 36)
      throw this.exceptionFactory(
        `Invalid file identifier length: ${value.length}.`,
      );

    const uuid = value.slice(0, 36);
    super.transform(uuid, metadata);

    const metadataSegment = value.slice(36);
    const filenameLengthEnd = metadataSegment.indexOf(".");
    if (filenameLengthEnd < 1)
      throw this.exceptionFactory("Invalid file metadata segment.");

    const filenameLength = +metadataSegment.slice(0, filenameLengthEnd);
    if (Number.isNaN(filenameLength))
      throw this.exceptionFactory("Invalid file metadata segment.");
    if (filenameLengthEnd + filenameLength + 1 > metadataSegment.length)
      throw this.exceptionFactory("Invalid file metadata segment.");

    return value;
  }
}
