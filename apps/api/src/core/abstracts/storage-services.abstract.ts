export abstract class IStorageServices {
  abstract putFile(fileName: string, buffer: Buffer): Promise<void>;
  abstract getFile(fileName: string): Promise<Buffer>;
  abstract deleteFile(fileName: string): Promise<void>;
  abstract deleteFiles(fileNames: string[]): Promise<void>;
}
