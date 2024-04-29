import { S3 } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IStorageServices } from "src/core/abstracts/storage-services.abstract";

@Injectable()
export class S3StorageServices extends IStorageServices {
	private s3: S3;
	private bucket: string;

	constructor(private configService: ConfigService) {
		super();

		this.s3 = new S3({
			region: this.configService.get<string>("storage.s3.region"),
			credentials: {
				accessKeyId: this.configService.get<string>(
					"storage.s3.credentials.accessKeyId",
				),
				secretAccessKey: this.configService.get<string>(
					"storage.s3.credentials.secretAccessKey",
				),
			},
			// required by Localstack for local developement
			forcePathStyle: this.configService.get<boolean>("env.dev") ? true : false,
			endpoint: this.configService.get<string>("storage.s3.endpoint")?.length
				? this.configService.get<string>("storage.s3.endpoint")
				: undefined,
		});

		this.bucket = this.configService.get<string>("storage.s3.bucketName");
	}

	public async putFile(fileName: string, buffer: Buffer): Promise<void> {
		await this.s3.putObject({
			Bucket: this.bucket,
			Key: fileName,
			Body: buffer,
		});
	}

	public async getFile(fileName: string): Promise<Buffer> {
		const file = await this.s3.getObject({
			Bucket: this.bucket,
			Key: fileName,
		});

		return Buffer.from(await file.Body.transformToByteArray());
	}

	public async deleteFile(fileName: string): Promise<void> {
		await this.s3.deleteObject({
			Bucket: this.bucket,
			Key: fileName,
		});
	}

	public async deleteFiles(fileNames: string[]): Promise<void> {
		await this.s3.deleteObjects({
			Bucket: this.bucket,
			Delete: {
				Objects: fileNames.map((f) => ({ Key: f })),
			},
		});
	}
}
