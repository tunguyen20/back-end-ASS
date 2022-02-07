
export interface Product {
    idProduct: string
    price: number
    name: string
    img: string
}
interface Book {
    price: number
    idBookLine: string
    state: boolean
    quantity: number
    idBook: string

}
export interface Media {
    idBookLine: string
    image: string
    idImage: string
}
export interface BookLine {
    idBookLine: string
    bookTitle: string
    bookAuthor: string
    bookDescr: string
    idPublisher: string
    publicationDate: string
    idBookCategory: string
    createdAt: string
    imageBookCover:string
    buyCount: number
    updatedAt:string
    book: Book[]
    media: Media[]
}
export interface BookLineProps {
    idBookLine: string
    bookTitle: string
    bookAuthor: string
    bookDescr: string
    namePublisher: string
    idPublisher:string
    publicationDate: string
    nameCategory: string 
    idCategory:string
    createdAt: string
    buyCount: number
    imageBookCover:string
    updatedAt:string
    book: Book[]
    media: Media[]
}






