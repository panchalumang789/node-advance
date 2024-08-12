import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("users").del();

    // Inserts seed entries
    await knex("users").insert([
        {
            id: 1,
            first_name: "rowValue1",
            last_name: "rowValue1"
        },
        {
            id: 2,
            first_name: "rowValue2",
            last_name: "rowValue2"
        },
        {
            id: 3,
            first_name: "rowValue3",
            last_name: "rowValue3"
        }
    ]);
};
