// Main data interface
export interface IUser {
    class: string;
    dealerName: string;
    displayName: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    roles: Roles;
    username: string;
    status: string;
    loading?:    boolean;
    error?:      string;
}

export interface Roles {
    admin: boolean;
    nickels: boolean;
    reader: boolean;
    writer: boolean;
}

export class User {
    constructor(public id: string, public displayName: string) {}
}
