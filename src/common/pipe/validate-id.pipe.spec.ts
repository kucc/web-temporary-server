import { ValidateIdPipe } from './validate-id.pipe';

describe('Validate Id', () => {
  it('should be defined', () => {
    expect(new ValidateIdPipe()).toBeDefined();
  });
});
