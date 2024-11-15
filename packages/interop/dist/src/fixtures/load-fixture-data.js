import loadFixture from 'aegir/fixtures';
import drain from 'it-drain';
export async function loadFixtureDataCar(controller, path) {
    const fixtureData = `src/fixtures/data/${path}`;
    const buf = loadFixture(fixtureData);
    await drain(controller.api.dag.import([buf]));
}
//# sourceMappingURL=load-fixture-data.js.map