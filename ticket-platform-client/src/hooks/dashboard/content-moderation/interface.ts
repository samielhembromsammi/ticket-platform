export interface ICategoryOption {
    _id: string;
    content: string;
}

export interface ICategory {
    _id: string;
    category: string;
    icon: string;
    options: ICategoryOption[];
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

export interface IMeta {
    totalResult: number;
    currentPage: number;
    limit: number;
    totalPages: number;
}

export interface ICategoryResponse {
    meta: IMeta;
    results: ICategory[];
}

export interface IApiResponse<T> {
    data: T;
}
