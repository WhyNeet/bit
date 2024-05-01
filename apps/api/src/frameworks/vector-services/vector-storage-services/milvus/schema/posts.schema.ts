import { DataType, FieldType, RowData } from "@zilliz/milvus2-sdk-node";

export const PostsSchema: FieldType[] = [
	{
		name: "id",
		description: "ID from the database",
		data_type: DataType.VarChar,
		is_primary_key: true,
	},
	{
		name: "title",
		description: "Post title",
		data_type: DataType.VarChar,
	},
	{
		name: "vector",
		description: "Title vector embedding",
		data_type: DataType.FloatVector,
		dim: 1024,
	},
	{
		name: "author",
		description: "Author ID from the database",
		data_type: DataType.VarChar,
	},
	{
		name: "collection",
		description: "Collection ID from the database",
		data_type: DataType.VarChar,
	},
];
