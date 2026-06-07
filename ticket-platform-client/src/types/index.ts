
export enum UserStatus {
    Active = 'Active',
    Inactive = 'Inactive',
    Unverified = 'Unverified',
    Delete = 'Delete',
    Blocked = 'Blocked',
    Banned = 'Banned',
}

export const statusColors: Record<UserStatus, string> = {
    Active: "green",
    Inactive: "orange",
    Unverified: "blue",
    Delete: "red",
    Blocked: "volcano",
    Banned: "magenta",
};
