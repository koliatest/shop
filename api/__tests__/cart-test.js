import { expect } from 'chai';
import mongoose from 'mongoose';
import config from '../../src/config';
import {
  checkQuantity
} from '../actions/cart';

const mLab = config.database;

beforeEach(function(done) {
  if (mongoose.connection.db) return done();
  mongoose.connect(mLab, done);
});

after(function(done) {
  mongoose.connection.close(function() {
    done();
  });
});

describe('text', function() {
  it('text', async() => {
    const result = await checkQuantity({user: { _id: '58593f3993e05a1a9eac2352' }});
    expect(result).to.be.instanceof(Object);
    expect(result).to.have.property('outOfStock');
    // expect(result.length).to.be.above(2);
  });
});