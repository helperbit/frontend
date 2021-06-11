export interface FileCustom {
	file: File;
	id?: string; //id refers to the id of file stored on server
}

export interface FileBase64 extends FileCustom {
	base64: string | ArrayBuffer;
}