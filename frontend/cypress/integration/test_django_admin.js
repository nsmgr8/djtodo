const url = (path) => `http://localhost:8000/${path}/`;

describe('django admin UI tests', function() {
    beforeEach('login', function() {
        cy.visit(url('admin'));

        cy.get('#id_username')
            .type('admin');

        cy.get('#id_password')
            .type('password');

        cy.get('input[type="submit"]')
            .click();

        cy.get('[href="/admin/logout/"]')
            .should('have.text', 'Log out');
    });

    it('can create task', function() {
        cy.get('.model-task .addlink').click();

        cy.get('#id_name')
            .type('Task 1');

        cy.get('#id_description')
            .type('Task 1 description');

        cy.get('input.default').click();

        cy.get('.success').should(
            'contains.text',
            'The task "Task 1" was added successfully.'
        );
    });

    it('can mark done', function() {
        cy.get('.model-task .changelink').click();

        cy.get(':nth-child(1) > .field-name > a').click();

        cy.get('#id_name').type(' Done');

        cy.get('#id_status').select('Done');

        cy.get('input.default').click();

        cy.get('.success').should(
            'contains.text',
            'The task "Task 1 Done" was changed successfully.'
        );
    });

    it('can delete task', function() {
        cy.get('.model-task .changelink').click();

        cy.get(':nth-child(1) > .field-name > a').click();

        cy.get('.deletelink').click();

        cy.get('[type="submit"]').click();

        cy.get('.success').should(
            'contains.text',
            'The task "Task 1 Done" was deleted successfully.'
        );
    });
});
