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

        it('create a task', () => {
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
                expect(xhr.responseBody.pk > 0).to.be.true;
            });
            cy.url().should('contain', '/tasks');
        });

        it('creating task requires task name', () => {
            cy.route('POST', '/api/tasks/').as('tasks');

            cy.visit(url('create'));

            cy.get('#id_description').type('task 1 description');
            cy.get('button[type="submit"]').click();

            cy.wait('@tasks').then(xhr => {
                expect(xhr.status).to.equal(400);
                expect(xhr.responseBody.name.length).to.equal(1);
            });
            cy.url().should('contain', '/create');

            cy.get('.toast').contains('ERROR');
        });

        it('lists tasks', () => {
            cy.get('tbody td').its('length').should('be.gt', 0);
            cy.get('tbody td a').should('have.attr', 'href').then(link => {
                expect(link).to.match(/^\/task\/\d+$/);
            });
        });

        it('can edit task', () => {
            cy.get('tbody td a').should('have.attr', 'href').then(link => {
                cy.visit(url(link));
                cy.get('a:contains("Edit")').should('have.attr', 'href').then(edit => {
                    cy.visit(url(edit));

                    cy.get('#id_status').not('have.checked');
                    cy.get('#id_name').clear();
                    cy.get('#id_name').type('Task edited');
                    cy.get('button[type="submit"]').click();

                    cy.visit(url(edit));
                    cy.get('#id_name').should('have.value', 'Task edited');
                    cy.get('#id_status').click();
                    cy.get('button[type="submit"]').click();

                    cy.visit(url(edit));
                    cy.get('#id_status').should('have.checked');
                    cy.get('#id_status').click();
                    cy.get('button[type="submit"]').click();
                });
            });
        });

        it('can delete task', () => {
            cy.get('tbody td a').should('have.attr', 'href').then(link => {
                cy.visit(url(link));
                cy.get('button:contains("Delete")').click();
            });
        });
    });
});
