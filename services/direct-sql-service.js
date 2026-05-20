class DirectSqlService {
    #selectAll = "select * from all_backup_tables.books ;"
    #selectByPrice = "select * from all_backup_tables.books where price >= ?;"
    #selectById = "select * from all_backup_tables.books where bid = ?;"
    #insert = "insert into all_backup_tables.books(title,price,sale) values(?,?,?) ;"
    #update = "update all_backup_tables.books set title = ? , price = ? , sale = ? where bid = ? ;"
    #delete = "delete from all_backup_tables.books where bid = ? ;"
    get selectAll() {
        return this.#selectAll;
    }
    get selectByPrice() {
        return this.#selectByPrice;
    }
    get insert() {
        return this.#insert;
    }
    get update() {
        return this.#update;
    }
    get selectById() {
        return this.#selectById;
    }
    get delete() {
        return this.#delete;
    }
}

module.exports = DirectSqlService