/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("short_urls").del();

  // Inserts seed entries
  await knex("short_urls").insert([
    {
      id: 1,
      short_code: "abc123",
      full_url: "https://www.example.com/some/long/path",
      created_at: new Date().toISOString(), // Current timestamp
      click_count: 0,
    },
    {
      id: 2,
      short_code: "xyz789",
      full_url: "https://www.anotherexample.com/blog/post",
      created_at: new Date().toISOString(),
      click_count: 0,
    },
    {
      id: 3,
      short_code: "hello1",
      full_url: "https://www.somethingelse.com/",
      created_at: new Date().toISOString(),
      click_count: 0,
    },
  ]);
};
