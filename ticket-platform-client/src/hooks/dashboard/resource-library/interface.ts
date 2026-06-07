export interface IResourceFile {
    url: string;
    fileType: string;
    mimeType: string;
}
export interface IResourceItem {
    _id: string;
    category: string;
    title: string;
    files: IResourceFile;
    description: string;
    expertTips?: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}
export interface IResourceMeta {
    totalResult: number;
    currentPage: number;
    limit: number;
    totalPages: number;
}
export interface IResourceLibraryData {
    meta: IResourceMeta;
    results: IResourceItem[];
}
export interface IApiResponse<T> {
    data: T;
}

export type ResourceLibraryResponse = IApiResponse<IResourceLibraryData>;
