import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('users').del();

  // Inserts seed entries
  await knex('users').insert([
    {
      id: '1',
      name: 'Umang Panchal',
      email: 'umang@gmail.com',
    },
    {
      id: '2',
      name: 'Umang 1 Panchal',
      email: 'umang1@gmail.com',
    },
    {
      id: '3',
      name: 'Umang 2 Panchal',
      email: 'umang2@gmail.com',
    },
  ]);
}
