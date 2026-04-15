import { useRequest } from "~/composables/useRequest"

// api/menu.ts
export const useMenuApi = () => {
    const { get } = useRequest()

    return {
        getMenuList: () => get<any[]>('/api')
    }
}