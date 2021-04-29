import { Knex } from 'knex';

export async function seed(knex: Knex) {
    await knex('items').insert([
        {
            title: "Papéis e papelão",
            image: "papel.svg"
        },
        {
            title: "Vidros e lâmpadas",
            image: "vidro.svg"
        },
        {
            title: "Óleo de cozinha",
            image: "oleo.svg"
        },
        {
            title: "Resíduos orgânicos",
            image: "organico.svg"
        },
        {
            title: "Baterias e pilhas",
            image: "bateria.svg"
        },
        {
            title: "Eletrônicos",
            image: "eletronico.svg"
        },
    ]);
}