import {GithubFetch} from '../GithubFetch';

describe('GithubFetch', () => {
  describe('constructor', () => {
    it('accepts a login and organization parameters', () => {
      const result: GithubFetch = new GithubFetch('login', 'organization');
      expect(result).toBeDefined();
    });

    it('accepts a login, organization, and optional authToken parameters', () => {
      const result: GithubFetch = new GithubFetch(
        'login',
        'organization',
        'authToken',
      );
      expect(result).toBeDefined();
    });
  });

  describe('public methods', () => {
    describe('getLogin', () => {
      const testFetch: GithubFetch = new GithubFetch('kramer', 'shopify');
      it('returns login as a string', () => {
        expect(testFetch.getLogin).toBe('kramer');
      });
    });

    describe('getOrganization', () => {
      const testFetch: GithubFetch = new GithubFetch('kramer', 'shopify');
      it('returns organization as a string', () => {
        expect(testFetch.getOrganization).toBe('shopify');
      });
    });

    describe('setLogin', () => {
      const testFetch: GithubFetch = new GithubFetch('kramer', 'shopify');
      it('updates the login', () => {
        expect(testFetch.getLogin).toBe('kramer');
        testFetch.setLogin('seinfield');
        expect(testFetch.getLogin).toBe('seinfield');
      });
    });

    describe('setOrganization', () => {
      const testFetch: GithubFetch = new GithubFetch('kramer', 'shopify');
      it('updates the organization', () => {
        expect(testFetch.getOrganization).toBe('shopify');
        testFetch.setOrganization('self-employed');
        expect(testFetch.getOrganization).toBe('self-employed');
      });
    });

    describe('getIssues', () => {
      // need to add test
    });

    describe('getPullRequests', () => {
      // need to add test
    });
  });
});
