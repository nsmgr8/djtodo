const base_url = 'http://localhost:4200'
const url = (path) => path ? `${base_url}/${path}` : base_url;

describe('angular UI tests', () => {
    it('cannot view without login', () => {
        const visit = path => {
            cy.server();
            cy.route('/api/whoami/').as('whoami');
            cy.route('/api/is_authenticated/').as('is_authenticated');

            cy.visit(url(''));
            cy.url().should('contain', '/login');

            cy.get('@whoami').then(xhr => {
                expect(xhr.status).to.equal(200);
                expect(Object.keys(xhr.responseBody).length).to.equal(0);
            });
            cy.get('@is_authenticated').then(xhr => {
                expect(xhr.status).to.equal(401);
            });
        };

        ['', 'task', 'create'].forEach(path => visit(path));
    });

    it('shows back to tasks when visiting unknown path', () => {
        cy.visit(url('foo-bar'));
        cy.get('app-no-content').contains('page does not exist');
    });

    describe('authenticated acces', () => {
        beforeEach(() => {
            cy.server();
            cy.route('/api/whoami/').as('whoami');
            cy.route('/api/is_authenticated/').as('is_authenticated');
            cy.route('POST', '/api/login/').as('login');

            cy.visit(url(''));
            cy.get('#id_username').type('admin');
            cy.get('#id_password').type('password{enter}');

            cy.get('@whoami').then(xhr => {
                expect(xhr.status).to.equal(200);
                expect(Object.keys(xhr.responseBody).length).to.equal(0);
            });
            cy.get('@is_authenticated').then(xhr => {
                expect(xhr.status).to.equal(401);
            });
            cy.wait('@login').then(xhr => {
                expect(xhr.status).to.equal(200);
            });
        });

        it.only('create a task', () => {
            cy.server();
            cy.route('/api/whoami/').as('whoami');
            cy.route('POST', '/api/tasks/').as('tasks');

            cy.visit(url('create'));

            cy.get('@whoami').then(xhr => {
                expect(xhr.status).to.equal(200);
                expect(xhr.responseBody.username).to.equal('admin');
            });

            cy.get('#id_name').type('Task 1');
            cy.get('#id_description').type('task 1 description');
            cy.get('button[type="submit"]').click();

            cy.wait('@tasks').then(xhr => {
                expect(xhr.status).to.equal(201);
            });
            cy.url().should('contain', '/tasks');
        });
    });
});
