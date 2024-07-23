import {Action} from 'easy-peasy';

export interface Account{
    username: string,
    password: string,
}

export default interface StoreModel{
    accounts: Account[],
    
    // action definition
    addAccount: Action<StoreModel, Account>, // push to accounts
}