describe('load-inputs module test suite', () => {
  let loadInputs;
  beforeEach(() => {
    loadInputs = require('../load-inputs');
    process.env = {};
  });
  describe('loadInputs', () => {
    test('Required variables in env, should return valid inputs', () => {
      // Given
      process.env = {
        INPUT_OC_VERSION: 'v1.33.7'
      };
      // When
      const result = loadInputs();
      // Then
      expect(result).toEqual({
        ocVersion: 'v1.33.7'
      });
    });
    test('Required variables NOT in env, should throw error', () => {
      // Given
      process.env = {};
      // When - Then
      expect(loadInputs).toThrow('Input required and not supplied: oc version');
    });
  });
});
