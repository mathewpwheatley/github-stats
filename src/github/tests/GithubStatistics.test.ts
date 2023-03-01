import {GithubStatistics} from '../GithubStatistics';

describe('GithubStatistics', () => {
  describe('constructor', () => {
    it('accepts a login and organization parameters', () => {
      const result: GithubStatistics = new GithubStatistics(
        'login',
        'organization',
      );
      expect(result).toBeDefined();
    });
  });

  describe('public methods', () => {
    describe('getLogin', () => {
      const testFetch: GithubStatistics = new GithubStatistics(
        'kramer',
        'shopify',
      );
      it('returns login as a string', () => {
        expect(testFetch.getLogin).toBe('kramer');
      });
    });

    describe('getOrganization', () => {
      const testFetch: GithubStatistics = new GithubStatistics(
        'kramer',
        'shopify',
      );
      it('returns organization as a string', () => {
        expect(testFetch.getOrganization).toBe('shopify');
      });
    });

    describe('setLogin', () => {
      const testFetch: GithubStatistics = new GithubStatistics(
        'kramer',
        'shopify',
      );
      it('updates the login', () => {
        expect(testFetch.getLogin).toBe('kramer');
        testFetch.setLogin('seinfield');
        expect(testFetch.getLogin).toBe('seinfield');
      });
    });

    describe('setOrganization', () => {
      const testFetch: GithubStatistics = new GithubStatistics(
        'kramer',
        'shopify',
      );
      it('updates the organization', () => {
        expect(testFetch.getOrganization).toBe('shopify');
        testFetch.setOrganization('self-employed');
        expect(testFetch.getOrganization).toBe('self-employed');
      });
    });

    describe('fetchData', () => {
      // need to add test
    });

    describe('calculateStatistics', () => {
      // need to add test
    });
  });
});
