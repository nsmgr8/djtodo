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
});
