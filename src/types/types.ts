export enum CategoryEnum {
    services = 'Services',
    fnb = 'F&B',
    fashion = 'Fashion',
    crafts = 'Crafts',
    experiences = 'Experiences',
}

export enum ModeEnum {
    physical = 'Physical',
    online = 'Online Order',
    both = 'Physical, Online Order',
}

export enum DeliveryOptionsEnum {
    selfpickup = 'Self pick-up',
    sameday = 'Same day delivery',
    oneday = 'One-day delivery',
    delivery = 'Standard delivery',
}

export interface Business {
    id: number
    name: string
    category: CategoryEnum
    description: string
    location: string
    mode: ModeEnum
    socialmedia: {
        facebook: string
        instagram: string
        website: string
        phone: string
    }
    products: string
    pricerange: number
    ratings?: RatingData
    images: string[]
}

export interface EmailLoginData {
    email: string
    password: string
}

export interface EmailCreateData extends EmailLoginData {
    name: string
}

export interface Category {
    name: string
    url: string
}

export interface Rating {
    name: string
    ratingscore: number
    reviewtext: string
    datetime: number
}

export interface RatingData {
    [key: string]: Rating
}

export interface FilterFields {
    price: number
    rating: string
    mode: string
}
