import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("users").del();

    // Inserts seed entries
    await knex("users").insert([
        {
            id: "1",
            first_name: "Umang",
            last_name: "Panchal"
        },
        {
            id: "2",
            first_name: "Umang 1",
            last_name: "Panchal"
        },
        {
            id: "3",
            first_name: "Umang 2",
            last_name: "Panchal"
        }
    ]);
};
