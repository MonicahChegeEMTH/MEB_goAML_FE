export interface Account {
    id: number,
    firstame: string,
    firstName: string,
    lastName: string,
    lastname: string,
    username: string,
    mobile: string,
    email: string,
    createdOn: Date,
    modifiedBy: string,
    modifiedOn: string,
    deleteFlag: string,
    status: string,
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