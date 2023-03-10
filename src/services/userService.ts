import axios from 'axios'
import { MultiFactorInfo } from 'firebase/auth'

import { useToast } from 'vue-toastification'

const toast = useToast()

export class UserService {
    baseUrl: string

    constructor() {
        this.baseUrl =
            'https://is216-bigreddot-default-rtdb.asia-southeast1.firebasedatabase.app/users'
    }

    async createUser(user: MultiFactorInfo, token: string): Promise<void> {
        const createUserUrl = this.baseUrl + '/' + user.uid + '.json'
        const tempUserEntity = {
            uid: user.uid,
            name: user.displayName,
        }
        try {
            let res = await axios.put(createUserUrl, tempUserEntity, {
                params: { auth: token },
            })
        } catch (err) {
            throw err
        }
    }

    async createUserFromEmail(
        uid: string,
        name: string,
        token: string
    ): Promise<void> {
        const createUserUrl = this.baseUrl + '/' + uid + '.json'

        const tempUserEntity = {
            uid: uid,
            name: name,
        }
        try {
            let res = await axios.put(createUserUrl, tempUserEntity, {
                params: { auth: token },
            })
        } catch (err) {
            throw err
        }
    }

    async getBookmarks(uid: string, token: string): Promise<void | number[]> {
        const getBookmarkUrl = this.baseUrl + '/' + uid + '/bookmarks.json'
        try {
            let res = await axios.get(getBookmarkUrl, {
                params: { auth: token },
            })
            let data = res.data
            return data
        } catch (err) {
            throw err
        }
    }

    async updateBookmarks(
        uid: string,
        bookmarks: number[],
        updateType: string,
        token: string
    ): Promise<void> {
        const updateBookmarkUrl = this.baseUrl + '/' + uid + '/bookmarks.json'
        try {
            let res = await axios.put(updateBookmarkUrl, bookmarks, {
                params: { auth: token },
            })
            if (res.status === 200) {
                if (updateType === 'add') {
                    toast.success('Bookmarked successfully!', { timeout: 5000 })
                } else if (updateType === 'remove') {
                    toast.success('Bookmark removed successfully!', {
                        timeout: 5000,
                    })
                }
            }
        } catch (err) {
            toast.error('Bookmark not saved, please try again later.', {
                timeout: 5000,
            })
            throw err
        }
    }
}
