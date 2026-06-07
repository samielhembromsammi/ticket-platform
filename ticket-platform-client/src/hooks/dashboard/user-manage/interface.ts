
export interface IUser {
    _id: string;
    fullName: string;
    email: string;
    role: string;
    dateOfBirth: string;
    profilePhoto: string;
    isDeleted: boolean;
    status: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface IMeta {
    totalResult: number;
    currentPage: number;
    limit: number;
    totalPages: number;
}

export interface IUserResponse {
    meta: IMeta;
    results: IUser[];
}

export interface IServiceResponse<T> {
    data: T;
}