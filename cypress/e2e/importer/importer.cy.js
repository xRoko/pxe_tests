import {Importer} from '../../models/importerModel'

const importer = new Importer();

describe('Importer test suite', () => {
    it('Log in', () => {
        importer.visitAndLogIn()
        importer.addApplication()
        importer.fillComodity(' Elektřina ',' Domácnost ', true)
        importer.fillIdentificationAndAddress('mojNazov')
        importer.fillParametersOfElectricityConsumption()
    });
})