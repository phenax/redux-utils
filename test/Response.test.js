import { Response } from '../src';

describe('Response map', () => {
  it('should map over the success data', () => {
    Response.Success(5)
      .map(x => x + 20)
      .map(x => x - 3)
      .cata({ Success: x => expect(x).toBe(22) });

    Response.Failure(new Error('a'))
      .map(x => x + 20)
      .map(x => x - 3)
      .cata({ Failure: e => expect(e.message).toBe('a') });
  });

  it('should map over the failure error', () => {
    const resp = Response.Failure(new Error('Wow')).map(x => x + 20);

    resp
      .cata({ Failure: e => expect(e.message).toBe('Wow') });
  
    resp
      .mapFailure(() => new Error('Wow + 1'))
      .cata({ Failure: e => expect(e.message).toBe('Wow + 1') });
  });
});
