export function validateFileId(
  value: string,
): { uuid: string; metadata: string } | null {
  if (value.length < 36) return null;

  const uuid = value.slice(0, 36);

  const metadataSegment = value.slice(36);
  const filenameLengthEnd = metadataSegment.indexOf(".");
  if (filenameLengthEnd < 1) return null;

  const filenameLength = +metadataSegment.slice(0, filenameLengthEnd);
  if (Number.isNaN(filenameLength)) return null;
  if (filenameLengthEnd + filenameLength + 1 > metadataSegment.length)
    return null;

  return { uuid, metadata: metadataSegment };
}
