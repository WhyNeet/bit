import { DataType, FieldType, RowData } from "@zilliz/milvus2-sdk-node";

export const PostsSchema: FieldType[] = [
	{
		name: "id",
		description: "ID from the database",
		data_type: DataType.VarChar,
		is_primary_key: true,
		max_length: 24,
	},
	{
		name: "title",
		description: "Post title",
		data_type: DataType.VarChar,
		max_length: 300,
	},
	{
		name: "vector",
		description: "Title vector embedding",
		data_type: DataType.FloatVector,
		dim: 384,
	},
	{
		name: "author",
		description: "Author ID from the database",
		data_type: DataType.VarChar,
		max_length: 24,
	},
	{
		name: "collection",
		description: "Collection ID from the database",
		data_type: DataType.VarChar,
		max_length: 24,
	},
];
