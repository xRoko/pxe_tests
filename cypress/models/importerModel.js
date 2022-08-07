export class Importer {
    visitAndLogIn() {
        cy.visit('https://parc4u.cz/')
        cy.contains(/^ Přihlásit $/).click()
        cy.get('.form-control.form-control--light.ng-untouched.ng-pristine.ng-valid').first().type(Cypress.env('email'))
        cy.get('.form-control-wrapper').get('#password').click().type(Cypress.env('password'))
        cy.get('.btn.btn-gradient-primary.btn-public.btn--icon-right.w-100').click()
    }

    addApplication() {
        cy.contains(/^ Přidat žádost $/).click()
    }

    fillComodity(energyType = ' Elektřina ', customer = ' Domácnost ', supplier = false) {
        energyType !== ' Elektřina ' ? cy.contains(new RegExp("^" + energyType + "$")).click() : {}
        customer !== ' Domácnost ' ? cy.contains(new RegExp("^" + customer + "$")).click() : {}
        supplier ?
            cy.get(':nth-child(1) > .form-container > lnd-select > .ng-select-custom > .input-group > .ng-select > .ng-select-container > .ng-value-container > .ng-input')
            .click()
            .then(() => { cy.get('.ng-option.ng-option-marked').first().click() }) :
            cy.contains(new RegExp(/^ Bez současného dodavatele $/)).click()
    }

    fillIdentificationAndAddress(name, address = 'Hostinského 1533/4, Praha, 15500') {
        cy.get('#name').type(name)
        cy.get('#ean').type(this.generateEIC())
            //Implementacia ngInputBox je cela zle, neda sa selectnut inputbox len cez xy tried
        cy.get('.is-started-searching > .form-group > .input-group > .ng-select > .ng-select-container > .ng-value-container > .ng-input').click().type(address)
        cy.get('.ng-option.ng-option-marked').first().click()
    }

    //Implementacia ngInputBox je cela zle, neda sa selectnut inputbox len cez xy tried
    fillParametersOfElectricityConsumption() {
        cy.get('[label="Distribuční sazba"] > .form-group > .input-group > .ng-select > .ng-select-container > .ng-value-container > .ng-input').click()
        cy.get('.ng-option.ng-option-marked').first().click()
        cy.get('#phasesId > .form-group > .input-group > .ng-select > .ng-select-container > .ng-value-container > .ng-input').click()
        cy.get('.ng-option.ng-option-marked').first().click()
        cy.get('#circuitBreakerId > .form-group > .input-group > .ng-select > .ng-select-container > .ng-value-container > .ng-input').click()
        cy.get('.ng-option.ng-option-marked').first().click()
        cy.get('#annualConsumptionVT').type('850')
        cy.get('.btn.btn-primary').click()
    }

    generateRandomInteger(min, max) {
        return Math.floor(min + Math.random() * (max - min + 1));
    }

    generateEIC() {
        let chars = `0123456789abcdefghijklmnopqrstuvwxyzž`;
        let map = chars
            .split(``)
            .map((i, index) => ({
                [i]: index
            }))
            .reduce((a, b) => ({...a, ...b }), {});
        let keys = Object.keys(map);
        let values = Object.values(map);
        let Arr = [16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
        let prefix = `27zg700z`;
        let lastChar = ''
        let adept = ''
        let c1 = this.generateRandomInteger(10000, 99999);
        let c2 = this.generateRandomInteger(10, 99);
        let unknownMethod = () => {
            let core = `${c1}${c2}`;
            adept = `${prefix}${core}`;
            let adeptInts = adept.split(/(?!^)/).map((el, i) => {
                let adeptInt = map[el];
                let con = Arr[i];
                let controlInt = adeptInt * con;
                return controlInt;
            });
            let sum = adeptInts.reduce((a, b) => a + b, 0) - 1;
            let zvysok = 36 - (sum % 37);
            let temp = values.findIndex((value) => value === zvysok);
            lastChar = keys[temp];
        }
        unknownMethod()
        if (lastChar === 'ž') {
            c1 += 1;
            unknownMethod();
        }
        return `${adept}${lastChar}`;
    }
}