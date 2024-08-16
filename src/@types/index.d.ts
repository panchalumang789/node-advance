import { USER } from '../modals/user';

declare module 'knex/types/tables' {
    interface Tables {
        users: USER;
        users_composite: Knex.CompositeTableType<User>;
    }
}