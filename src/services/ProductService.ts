import { json } from 'stream/consumers';
import { QueryResult } from "pg";
import { pool } from "../controller/connectdatabase/Pool";
import { BookLine, BookLineProps, Product } from "../model/Product";

class ProductService {

    getListProductWithPagination = async (search: string, page: number, pageSize: number) => {

        let resultCountPage: QueryResult = await pool.query(`SELECT bl2."idBookLine" 
        FROM
       book_line bl2  where bl2."bookTitle" ilike '%${search}%' 
        group by bl2."idBookLine"`
        );

        const pageCount: number = resultCountPage.rowCount
        let resultBookLine: QueryResult = await pool.query(`SELECT * FROM book_line bl join book b on b."idBookLine" =bl."idBookLine" join media m on m."idBookLine" = bl."idBookLine" join publisher p on p."idPublisher" =bl."idPublisher" join category c on c."idCategory"  = bl."idBookCategory" where  bl."idBookLine" in 
        (SELECT bl2."idBookLine" 
                    FROM
                   book_line bl2 where bl2."bookTitle" ilike '%${search}%' 
                    group by bl2."idBookLine"   limit ${pageSize} offset (${pageSize * (page - 1)})
                    
            )  ORDER BY bl."createdAt" desc  ;`
        );


        const listOrderRows = resultBookLine.rows
        let arrListIdOrder: [][] = []
        let temp = []
        for (let i = 0; i < resultBookLine.rows.length; i++) {
            temp.push(resultBookLine.rows[i].idBookLine)
        }
        arrListIdOrder = Array.from(new Set(temp))

        const listBook: BookLineProps[] = []

        arrListIdOrder.map(item => {
            const bookLine: BookLineProps = {
                idBookLine: "",
                bookTitle: "",
                bookAuthor: "",
                bookDescr: "",
                nameCategory: "",
                idCategory: "",
                namePublisher: "",
                idPublisher: "",
                publicationDate: "",
                createdAt: "",
                imageBookCover: "",
                buyCount: 0,
                updatedAt: "",
                book: [],
                media: []
            }
            listOrderRows.map((item1, index) => {
                if (item1.idBookLine == item) {
                    bookLine.idBookLine = item1.idBookLine
                    bookLine.bookTitle = item1.bookTitle
                    bookLine.bookAuthor = item1.bookAuthor
                    bookLine.bookDescr = item1.bookDescr
                    bookLine.idPublisher = item1.idPublisher
                    bookLine.idCategory = item1.idBookCategory
                    bookLine.nameCategory = item1.nameCategory
                    bookLine.namePublisher = item1.namePublisher
                    bookLine.publicationDate = item1.publicationDate
                    bookLine.imageBookCover = item1.imageBookCover
                    bookLine.createdAt = item1.createdAt
                    bookLine.buyCount = Number(item1.buyCount)
                    bookLine.updatedAt = item1.updatedAt

                    if (bookLine.book.length == 0) {
                        bookLine.book.push({
                            idBookLine: item1.idBookLine,
                            price: item1.price,
                            idBook: item1.idBook,
                            quantity: item1.quantity,
                            state: item1.state
                        })

                    }
                    else {
                        let dem = -1
                        bookLine.book.map((item4, index) => {
                            if (item4.idBook == item1.idBook) {
                                dem = 1
                                bookLine.book[index] = {
                                    idBookLine: item1.idBookLine,
                                    price: item1.price,
                                    idBook: item1.idBook,
                                    quantity: item1.quantity,
                                    state: item1.state
                                }

                            }

                        })
                        if (dem == -1) {
                            bookLine.book.push({
                                idBookLine: item1.idBookLine,
                                price: item1.price,
                                idBook: item1.idBook,
                                quantity: item1.quantity,
                                state: item1.state
                            })
                        }

                    }

                    if (bookLine.media.length == 0) {
                        bookLine.media.push({
                            idBookLine: item1.idBookLine,
                            idImage: item1.idImage,
                            image: item1.image
                        })

                    }
                    else {
                        let dem = -1
                        bookLine.media.map((item4, index) => {
                            if (item4.idImage == item1.idImage) {
                                dem = 1
                                bookLine.media[index] = {
                                    idBookLine: item1.idBookLine,
                                    idImage: item1.idImage,
                                    image: item1.image
                                }

                            }
                        })
                        if (dem == -1) {
                            bookLine.media.push({
                                idBookLine: item1.idBookLine,
                                idImage: item1.idImage,
                                image: item1.image
                            })
                        }

                    }


                }

            })
            listBook.push(bookLine)

            // listOrder.push()
        })
        // const result = await pool.query(`select*FROM public.book_line bl join book b on bl."idBookLine" = b."idBookLine" ;`)


        return { listBook, pageCount }
    }
    getListProductSearchWithPagination = async (search: string, idCategory: string, stringSortBy: string, minPrice: number, maxPrice: number, page: number, pageSize: number) => {

        let stringFilterCategory = ""
        if (idCategory != "") {
            stringFilterCategory = ` and bl2."idBookCategory" ='${idCategory}'`
        }
     
        let resultCountBook: QueryResult = await pool.query(`(SELECT bl2."idBookLine"  FROM
                           book_line bl2 
                           join book b on bl2."idBookLine" = b."idBookLine" 
                           where  
                           bl2."bookTitle" ilike '%${search}%' 
                           and b.price between ${minPrice} and ${maxPrice} 
                            ${stringFilterCategory}
                             group by bl2."idBookLine" 
                    )    ;`
        );

        const bookCount: number = resultCountBook.rowCount
        let resultBookLine: QueryResult = await pool.query(`SELECT * FROM book_line bl join book b on b."idBookLine" =bl."idBookLine" join media m on m."idBookLine" = bl."idBookLine" 
        join publisher p on p."idPublisher" =bl."idPublisher" join category c on c."idCategory"  = bl."idBookCategory"
        where  bl."idBookLine" in 
                (SELECT bl2."idBookLine"  FROM
                           book_line bl2 
                           join book b on bl2."idBookLine" = b."idBookLine" 
                           where  
                           bl2."bookTitle" ilike '%${search}%' 
                           and b.price between ${minPrice} and ${maxPrice} 
                            ${stringFilterCategory}
                             group by bl2."idBookLine"  limit ${pageSize} offset (${pageSize * (page - 1)})
                    )   ${stringSortBy}  ;`
        );
        const listOrderRows = resultBookLine.rows
        let arrListIdOrder: [][] = []
        let temp = []
        for (let i = 0; i < resultBookLine.rows.length; i++) {
            temp.push(resultBookLine.rows[i].idBookLine)
        }
        arrListIdOrder = Array.from(new Set(temp))

        const listBook: BookLineProps[] = []

        arrListIdOrder.map(item => {
            const bookLine: BookLineProps = {
                idBookLine: "",
                bookTitle: "",
                bookAuthor: "",
                bookDescr: "",
                nameCategory: "",
                idCategory: "",
                namePublisher: "",
                idPublisher: "",
                publicationDate: "",
                createdAt: "",
                imageBookCover: "",
                buyCount: 0,
                updatedAt: "",
                book: [],
                media: []
            }
            listOrderRows.map((item1, index) => {
                if (item1.idBookLine == item) {
                    bookLine.idBookLine = item1.idBookLine
                    bookLine.bookTitle = item1.bookTitle
                    bookLine.bookAuthor = item1.bookAuthor
                    bookLine.bookDescr = item1.bookDescr
                    bookLine.idPublisher = item1.idPublisher
                    bookLine.idCategory = item1.idBookCategory
                    bookLine.nameCategory = item1.nameCategory
                    bookLine.namePublisher = item1.namePublisher
                    bookLine.publicationDate = item1.publicationDate
                    bookLine.imageBookCover = item1.imageBookCover
                    bookLine.createdAt = item1.createdAt
                    bookLine.buyCount = Number(item1.buyCount)
                    bookLine.updatedAt = item1.updatedAt

                    if (bookLine.book.length == 0) {
                        bookLine.book.push({
                            idBookLine: item1.idBookLine,
                            price: item1.price,
                            idBook: item1.idBook,
                            quantity: item1.quantity,
                            state: item1.state
                        })

                    }
                    else {
                        let dem = -1
                        bookLine.book.map((item4, index) => {
                            if (item4.idBook == item1.idBook) {
                                dem = 1
                                bookLine.book[index] = {
                                    idBookLine: item1.idBookLine,
                                    price: item1.price,
                                    idBook: item1.idBook,
                                    quantity: item1.quantity,
                                    state: item1.state
                                }

                            }

                        })
                        if (dem == -1) {
                            bookLine.book.push({
                                idBookLine: item1.idBookLine,
                                price: item1.price,
                                idBook: item1.idBook,
                                quantity: item1.quantity,
                                state: item1.state
                            })
                        }

                    }

                    if (bookLine.media.length == 0) {
                        bookLine.media.push({
                            idBookLine: item1.idBookLine,
                            idImage: item1.idImage,
                            image: item1.image
                        })

                    }
                    else {
                        let dem = -1
                        bookLine.media.map((item4, index) => {
                            if (item4.idImage == item1.idImage) {
                                dem = 1
                                bookLine.media[index] = {
                                    idBookLine: item1.idBookLine,
                                    idImage: item1.idImage,
                                    image: item1.image
                                }

                            }
                        })
                        if (dem == -1) {
                            bookLine.media.push({
                                idBookLine: item1.idBookLine,
                                idImage: item1.idImage,
                                image: item1.image
                            })
                        }

                    }


                }

            })
            listBook.push(bookLine)

            // listOrder.push()
        })
        // const result = await pool.query(`select*FROM public.book_line bl join book b on bl."idBookLine" = b."idBookLine" ;`)


        return { listBook, bookCount }
    }

    AddProduct = async (bookLine: BookLine) => {
        let queryUpdateBook = ""
        let queryInsertBook = ""
        let queryUpdateImg = ""
        let queryInsertImg = ""
        bookLine.book.map((item, index) => {
            if (item.state == false) {
                queryUpdateBook += `  UPDATE public.book SET price=${item.price}, quantity=${item.quantity} where public.book."idBook" ='${item.idBook}';`
            } else {
                queryUpdateBook += `  UPDATE public.book SET price=${item.price}, quantity=${item.quantity} where public.book."idBook" ='${item.idBook}';`
            }

        })
        bookLine.book.map((item, index) => {
            if (item.state == false) {
                queryInsertBook += `  INSERT INTO public.book (price, "idBookLine", state, quantity, "idBook") VALUES(${item.price}, '${item.idBookLine}', ${item.state}, ${item.quantity}, '${item.idBook}');`
            } else {
                queryInsertBook += `  INSERT INTO public.book (price, "idBookLine", state, quantity, "idBook") VALUES(${item.price}, '${item.idBookLine}', ${item.state}, ${item.quantity}, '${item.idBook}');`
            }

        })
        bookLine.media.map((item, index) => {
            queryUpdateImg += `UPDATE public.media SET "idBookLine"='${item.idBookLine}', image='${item.image}' where "idImage"='${item.idImage}';`
        })
        bookLine.media.map((item, index) => {
            queryInsertImg += `INSERT INTO public.media ("idBookLine", image, "idImage") VALUES('${item.idBookLine}', '${item.image}', '${item.idImage}');`
        })
        await pool.query(`DO $$ DECLARE
        BEGIN
        IF exists(select*FROM public.book_line where "idBookLine"='${bookLine.idBookLine}') then
       UPDATE public.book_line SET  "bookTitle"='${bookLine.bookTitle}', "bookAuthor"='${bookLine.bookAuthor}',
      "bookDescr"='${bookLine.bookDescr}', "idPublisher"='${bookLine.idPublisher}', "publicationDate"='${bookLine.publicationDate}', "idBookCategory"='${bookLine.idBookCategory}' , "createdAt"='${bookLine.createdAt}', "buyCount"=${bookLine.buyCount}, "updatedAt"='${bookLine.updatedAt}' ,"imageBookCover"='${bookLine.imageBookCover}' where  public.book_line."idBookLine" ='${bookLine.idBookLine}';

      DELETE FROM public.media   WHERE "idBookLine"='${bookLine.idBookLine}';        
       ${queryUpdateBook}
       ${queryInsertImg}
        else INSERT INTO public.book_line ("idBookLine", "bookTitle", "bookAuthor", "bookDescr", "idPublisher", "publicationDate", "idBookCategory", "createdAt", "buyCount","updatedAt", "imageBookCover") 
        VALUES('${bookLine.idBookLine}', '${bookLine.bookTitle}', '${bookLine.bookAuthor}', '${bookLine.bookDescr}', '${bookLine.idPublisher}', '${bookLine.publicationDate}', '${bookLine.idBookCategory}','${bookLine.createdAt}',${bookLine.buyCount},'${bookLine.updatedAt}','${bookLine.imageBookCover}');
           
        ${queryInsertBook}
        ${queryInsertImg}

        
        END IF;
        END $$;`);


    }

    getListCategory = async () => {
        const category = await pool.query(`SELECT "idCategory", "nameCategory" FROM public.category;`);
        return category.rows
    }
    getListPublisher = async () => {
        const publisher = await pool.query(`SELECT "idPublisher", "namePublisher" FROM public.publisher;`);
        return publisher.rows
    }
    DeleteBook = async (id: string) => {
        await pool.query(`DELETE FROM public.book_line
        WHERE "idBookLine" = '${id}';
        DELETE FROM public.book
        WHERE "idBookLine" ='${id}';
        DELETE FROM public.media
        WHERE "idBookLine" ='${id}';`);
    }
    getBookDetail = async (idBookLine: string) => {
        let bookResult: QueryResult = await pool.query(`SELECT * FROM book_line bl join book b on b."idBookLine" =bl."idBookLine" join media m on m."idBookLine" = bl."idBookLine" 
        join publisher p on p."idPublisher" =bl."idPublisher" 
        join category c on c."idCategory"  = bl."idBookCategory" 
        where 
        bl."idBookLine" ='${idBookLine}'`);
        let book = bookResult.rows
        const bookLine: BookLineProps = {
            idBookLine: "",
            bookTitle: "",
            bookAuthor: "",
            bookDescr: "",
            nameCategory: "",
            idCategory: "",
            namePublisher: "",
            idPublisher: "",
            publicationDate: "",
            createdAt: "",
            imageBookCover: "",
            buyCount: 0,
            updatedAt: "",
            book: [],
            media: []
        }
        book.map((item1, index) => {

            bookLine.idBookLine = item1.idBookLine
            bookLine.bookTitle = item1.bookTitle
            bookLine.bookAuthor = item1.bookAuthor
            bookLine.bookDescr = item1.bookDescr
            bookLine.idPublisher = item1.idPublisher
            bookLine.idCategory = item1.idBookCategory
            bookLine.nameCategory = item1.nameCategory
            bookLine.namePublisher = item1.namePublisher
            bookLine.publicationDate = item1.publicationDate
            bookLine.imageBookCover = item1.imageBookCover
            bookLine.createdAt = item1.createdAt
            bookLine.buyCount = Number(item1.buyCount)
            bookLine.updatedAt = item1.updatedAt

            if (bookLine.book.length == 0) {
                if (item1.quantity > 0) {
                    bookLine.book.push({
                        idBookLine: item1.idBookLine,
                        price: item1.price,
                        idBook: item1.idBook,
                        quantity: item1.quantity,
                        state: item1.state
                    })
                }


            }
            else {
                let dem = -1
                bookLine.book.map((item4, index) => {

                    if (item4.idBook == item1.idBook) {
                        dem = 1
                        bookLine.book[index] = {
                            idBookLine: item1.idBookLine,
                            price: item1.price,
                            idBook: item1.idBook,
                            quantity: item1.quantity,
                            state: item1.state
                        }

                    }

                })
                if (dem == -1) {
                    if (item1.quantity > 0) {
                        bookLine.book.push({
                            idBookLine: item1.idBookLine,
                            price: item1.price,
                            idBook: item1.idBook,
                            quantity: item1.quantity,
                            state: item1.state
                        })
                    }

                }

            }

            if (bookLine.media.length == 0) {
                if (item1.image != "") {
                    bookLine.media.push({
                        idBookLine: item1.idBookLine,
                        idImage: item1.idImage,
                        image: item1.image
                    })
                }


            }
            else {
                let dem = -1
                bookLine.media.map((item4, index) => {
                    if (item4.idImage == item1.idImage) {
                        dem = 1
                        bookLine.media[index] = {
                            idBookLine: item1.idBookLine,
                            idImage: item1.idImage,
                            image: item1.image
                        }
                    }

                })
                if (dem == -1) {
                    if (item1.image != "") {
                        bookLine.media.push({
                            idBookLine: item1.idBookLine,
                            idImage: item1.idImage,
                            image: item1.image
                        })
                    }

                }

            }

        })
        return (bookLine)
    }

}

export const productService = new ProductService()

