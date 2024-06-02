/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('books').del();
    await knex('members').del();

    // Inserts seed entries for books
    await knex('books').insert([
        { code: "JK-45", title: "Harry Potter", author: "J.K Rowling", stock: 1 },
        { code: "SHR-1", title: "A Study in Scarlet", author: "Arthur Conan Doyle", stock: 1 },
        { code: "TW-11", title: "Twilight", author: "Stephenie Meyer", stock: 1 },
        { code: "HOB-83", title: "The Hobbit, or There and Back Again", author: "J.R.R. Tolkien", stock: 1 },
        { code: "NRN-7", title: "The Lion, the Witch and the Wardrobe", author: "C.S. Lewis", stock: 1 }
    ]);

    // Inserts seed entries for members
    await knex('members').insert([
        { code: "M001", name: "Angga" },
        { code: "M002", name: "Ferry" },
        { code: "M003", name: "Putri" }
    ]);
};
