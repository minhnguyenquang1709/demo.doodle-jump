import { createStore, action, createTypedHooks} from 'easy-peasy';
import StoreModel from './model';

// store states for the app's components to use in common
export const store = createStore<StoreModel>({
    // state
    accounts: [],

    // action
    addAccount: action((state,acc)=>{
        state.accounts.push(acc);
    }),
});

const typedHooks = createTypedHooks<StoreModel>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;