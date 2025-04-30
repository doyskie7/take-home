/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  if (!(await knex.schema.hasTable("short_urls"))) {
    await knex.schema.createTable("short_urls", (t) => {
      t.increments("id").primary(); // Auto increment ID
      t.string("short_code", 10).notNullable().unique();
      t.text("full_url").notNullable();
      t.integer("click_count").defaultTo(0);
      t.timestamp("created_at").defaultTo(knex.fn.now());
      t.timestamp("expires_at"); // optional expiration
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  if (await knex.schema.hasTable("short_urls")) {
    await knex.schema.dropTable("short_urls");
  }
};
