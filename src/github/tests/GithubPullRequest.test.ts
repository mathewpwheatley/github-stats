import {DateTime} from 'luxon';

import {GithubPullRequest, GithubPullRequestFields} from '../GithubPullRequest';

describe('GithubPullRequest', () => {
  const testFields: GithubPullRequestFields = {
    url: 'www.fake.com',
    number: '1',
    title: 'fake',
    createdAt: '2022-12-03',
    closedAt: '2024-01-12',
    mergedAt: '2024-01-13',
    author: 'mat',
    assignees: ['bob', 'susan'],
    reviews: [{author: 'bob', createdAt: '2023-05-23'}],
    repository: 'Jabberwocky',
  };

  describe('constructor', () => {
    it('accepts a object which meets interface GithubPullRequestFields', () => {
      const result: GithubPullRequest = new GithubPullRequest(testFields);
      expect(result).toBeDefined();
    });

    it('Also accepts number field if its of type number', () => {
      const currentTestFields = {...testFields};
      currentTestFields.number = 10;
      const result = new GithubPullRequest(currentTestFields);
      expect(result).toBeDefined();
    });

    it('throws an error if createdAt date is not in ISO 8601 form', () => {
      const currentTestFields = {...testFields};
      currentTestFields.createdAt = '12-03-2022';
      const result = (): GithubPullRequest => {
        return new GithubPullRequest(currentTestFields);
      };
      expect(result).toThrow('12-03-2022');
    });

    it('throws an error if closedAt date is not in ISO 8601 form', () => {
      const currentTestFields = {...testFields};
      currentTestFields.closedAt = '01-12-2024';
      const result = (): GithubPullRequest => {
        return new GithubPullRequest(currentTestFields);
      };
      expect(result).toThrow('01-12-2024');
    });

    it('throws an error if mergedAt date is not in ISO 8601 form', () => {
      const currentTestFields = {...testFields};
      currentTestFields.closedAt = '01-13-2024';
      const result = (): GithubPullRequest => {
        return new GithubPullRequest(currentTestFields);
      };
      expect(result).toThrow('01-13-2024');
    });
  });

  describe('public methods', () => {
    const testPullRequest: GithubPullRequest = new GithubPullRequest(
      testFields,
    );

    describe('getUrl', () => {
      it('returns pull request URL as string', () => {
        expect(testPullRequest.getUrl).toBe('www.fake.com');
      });
    });

    describe('getNumber', () => {
      it('returns pull request number as string', () => {
        expect(testPullRequest.getNumber).toBe('1');
      });
    });

    describe('getTitle', () => {
      it('returns pull request title as string', () => {
        expect(testPullRequest.getTitle).toBe('fake');
      });
    });

    describe('getCreatedAt', () => {
      it('returns pull request created date as DateTime', () => {
        expect(testPullRequest.getCreatedAt).toStrictEqual(
          DateTime.fromISO('2022-12-03'),
        );
      });
    });

    describe('getClosedAt', () => {
      it('returns pull request closed date as DateTime', () => {
        expect(testPullRequest.getClosedAt).toStrictEqual(
          DateTime.fromISO('2024-01-12'),
        );
      });

      it('returns null if pull request closed date was set to an empty string', () => {
        const currentTestFields = {...testFields};
        currentTestFields.closedAt = '';
        const testPullRequest: GithubPullRequest = new GithubPullRequest(
          currentTestFields,
        );
        expect(testPullRequest.getClosedAt).toBeNull();
      });

      it('returns null if pull request closed date was set to null', () => {
        const currentTestFields = {...testFields};
        currentTestFields.closedAt = null;
        const testPullRequest: GithubPullRequest = new GithubPullRequest(
          currentTestFields,
        );
        expect(testPullRequest.getClosedAt).toBeNull();
      });
    });

    describe('getMergedAt', () => {
      it('returns pull request merged date as DateTime', () => {
        expect(testPullRequest.getMergedAt).toStrictEqual(
          DateTime.fromISO('2024-01-13'),
        );
      });

      it('returns null if pull request closed date was set to an empty string', () => {
        const currentTestFields = {...testFields};
        currentTestFields.mergedAt = '';
        const testPullRequest: GithubPullRequest = new GithubPullRequest(
          currentTestFields,
        );
        expect(testPullRequest.getMergedAt).toBeNull();
      });

      it('returns null if pull request closed date was set to null', () => {
        const currentTestFields = {...testFields};
        currentTestFields.mergedAt = null;
        const testPullRequest: GithubPullRequest = new GithubPullRequest(
          currentTestFields,
        );
        expect(testPullRequest.getMergedAt).toBeNull();
      });
    });

    describe('getAuthor', () => {
      it('returns pull request author as string', () => {
        expect(testPullRequest.getAuthor).toBe('mat');
      });
    });

    describe('getAssignees', () => {
      it('returns pull request assignees as set of string', () => {
        expect(testPullRequest.getAssignees).toStrictEqual(
          new Set(['bob', 'susan']),
        );
      });
    });

    describe('getReviews', () => {
      it("returns pull request reviews as map with the key being the reviewer's login and the value being an array of review DateTime", () => {
        expect(testPullRequest.getReviews).toStrictEqual(
          new Map([['bob', [DateTime.fromISO('2023-05-23')]]]),
        );
      });
    });

    describe('getRepository', () => {
      it("returns pull request's repository as a string", () => {
        expect(testPullRequest.getRepository).toStrictEqual('Jabberwocky');
      });
    });
  });
});
