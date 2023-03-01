import {DateTime} from 'luxon';

import {GithubIssue, GithubIssueFields} from '../GithubIssue';

describe('GithubIssue', () => {
  const testFields: GithubIssueFields = {
    url: 'www.fake.com',
    number: '1',
    title: 'fake',
    createdAt: '2022-12-03',
    closedAt: '2024-01-12',
    author: 'mat',
    assignees: ['bob', 'susan'],
    repository: 'Jabberwocky',
  };

  describe('constructor', () => {
    it('accepts a url, number, title, createdAt, closedAt, author, and assignees parameters', () => {
      const result: GithubIssue = new GithubIssue(testFields);
      expect(result).toBeDefined();
    });

    it('Also accepts number field if its of type number', () => {
      const currentTestFields = {...testFields};
      currentTestFields.number = 10;
      const result = new GithubIssue(currentTestFields);
      expect(result).toBeDefined();
    });

    it('throws an error if createdAt date is not in ISO 8601 form', () => {
      const currentTestFields = {...testFields};
      currentTestFields.createdAt = '12-03-2022';
      const result = (): GithubIssue => {
        return new GithubIssue(currentTestFields);
      };
      expect(result).toThrow('12-03-2022');
    });

    it('throws an error if closedAt date is not in ISO 8601 form', () => {
      const currentTestFields = {...testFields};
      currentTestFields.closedAt = '01-12-2024';
      const result = (): GithubIssue => {
        return new GithubIssue(currentTestFields);
      };
      expect(result).toThrow('01-12-2024');
    });
  });

  describe('public methods', () => {
    const testIssue: GithubIssue = new GithubIssue(testFields);

    describe('getUrl', () => {
      it('returns issue URL as string', () => {
        expect(testIssue.getUrl).toBe('www.fake.com');
      });
    });

    describe('getNumber', () => {
      it('returns issue number as string', () => {
        expect(testIssue.getNumber).toBe('1');
      });
    });

    describe('getTitle', () => {
      it('returns issue title as string', () => {
        expect(testIssue.getTitle).toBe('fake');
      });
    });

    describe('getCreatedAt', () => {
      it('returns issue created date as DateTime', () => {
        expect(testIssue.getCreatedAt).toStrictEqual(
          DateTime.fromISO('2022-12-03'),
        );
      });
    });

    describe('getClosedAt', () => {
      it('returns issue closed date as DateTime', () => {
        expect(testIssue.getClosedAt).toStrictEqual(
          DateTime.fromISO('2024-01-12'),
        );
      });

      it('returns null if issue closed date was set to en empty string', () => {
        const currentTestFields = {...testFields};
        currentTestFields.closedAt = '';
        const testIssue: GithubIssue = new GithubIssue(currentTestFields);
        expect(testIssue.getClosedAt).toBeNull();
      });

      it('returns null if issue closed date was set to null', () => {
        const currentTestFields = {...testFields};
        currentTestFields.closedAt = null;
        const testIssue: GithubIssue = new GithubIssue(currentTestFields);
        expect(testIssue.getClosedAt).toBeNull();
      });
    });

    describe('getAuthor', () => {
      it('returns issue author as string', () => {
        expect(testIssue.getAuthor).toBe('mat');
      });
    });

    describe('getRepository', () => {
      it("returns issue's repository as a string", () => {
        expect(testIssue.getRepository).toStrictEqual('Jabberwocky');
      });
    });
  });
});
