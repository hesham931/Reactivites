import ActivityStore from './activityStore'
import CommonStore from './CommonStore';
import { createContext, useContext } from 'react'
import UserStore from './userStore';
import ModalStore from './modalStore';
interface Store{
    activityStore: ActivityStore;
    commonStore: CommonStore;
    userStore: UserStore;
    modalStore: ModalStore;
}

export const store: Store = {
    activityStore: new ActivityStore(),
    commonStore: new CommonStore(),
    userStore: new UserStore(),
    modalStore: new ModalStore()
}
export const storeContext = createContext(store);

export function useStore() {
    return useContext(storeContext);
}