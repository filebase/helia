/* eslint-env mocha */
import { expect } from 'aegir/chai';
import Sinon from 'sinon';
import { stubInterface } from 'sinon-ts';
import { createHelia } from './fixtures/create-helia.js';
describe('helia', () => {
    let helia;
    let routing;
    beforeEach(async () => {
        routing = stubInterface({
            start: Sinon.stub(),
            stop: Sinon.stub()
        });
        helia = await createHelia({
            start: false,
            routers: [
                routing
            ],
            metrics: stubInterface()
        });
    });
    afterEach(async () => {
        if (helia != null) {
            await helia.stop();
        }
    });
    it('stops and starts', async () => {
        expect(routing).to.have.nested.property('start.called', false);
        await helia.start();
        expect(routing).to.have.nested.property('start.called', true);
        expect(routing).to.have.nested.property('stop.called', false);
        await helia.stop();
        expect(routing).to.have.nested.property('stop.called', true);
    });
    it('should have a blockstore', async () => {
        expect(helia).to.have.property('blockstore').that.is.ok();
    });
    it('should have a datastore', async () => {
        expect(helia).to.have.property('datastore').that.is.ok();
    });
    it('supports metrics', async () => {
        expect(helia).to.have.property('metrics').that.is.ok();
    });
});
//# sourceMappingURL=index.spec.js.map