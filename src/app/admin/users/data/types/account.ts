export interface Account {
    id: number,
    firstname: string,
    firstName: string,
    employeeNumber: string;
    lastName: string,
    lastname: string,
    username: string,
    mobile: string,
    phone: string;
    email: string,
    createdOn: Date,
    modifiedBy: string,
    modifiedOn: string,
    deleteFlag: string,
    status: string,
    role: string;
    roles: [
        {
            id: number,
            name: string
        }
    ],
    acctActive: boolean,
    acctLocked: boolean,
    loggedIn: boolean
}