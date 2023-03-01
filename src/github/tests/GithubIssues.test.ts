import {DateTime, Interval} from 'luxon';

import {GithubIssue} from '../GithubIssue';
import {CountByRepository, GithubIssues} from '../GithubIssues';

describe('GithubIssues', () => {
  const testGithubIssue1: GithubIssue = new GithubIssue({
    url: 'www.fake_1.com',
    number: '1',
    title: 'fake 1',
    createdAt: '2022-12-03',
    closedAt: null,
    author: 'mat',
    assignees: ['bob', 'susan'],
    repository: 'repository1',
  });
  const testGithubIssue2: GithubIssue = new GithubIssue({
    url: 'www.fake_2.com',
    number: '2',
    title: 'fake 2',
    createdAt: '2022-12-03',
    closedAt: '2022-12-05',
    author: 'bob',
    assignees: ['bob', 'mat'],
    repository: 'repository1',
  });
  const testGithubIssue3: GithubIssue = new GithubIssue({
    url: 'www.fake_3.com',
    number: '3',
    title: 'fake 3',
    createdAt: '2022-12-04',
    closedAt: '2023-01-12',
    author: 'mat',
    assignees: ['bob', 'mat'],
    repository: 'repository1',
  });
  const testGithubIssue4: GithubIssue = new GithubIssue({
    url: 'www.fake_4.com',
    number: '4',
    title: 'fake 4',
    createdAt: '2022-12-10',
    closedAt: '2023-01-12',
    author: 'mat',
    assignees: ['bob', 'susan'],
    repository: 'repository1',
  });
  const testGithubIssue5: GithubIssue = new GithubIssue({
    url: 'www.fake_5.com',
    number: '5',
    title: 'fake 5',
    createdAt: '2022-12-05',
    closedAt: null,
    author: 'mat',
    assignees: ['mat'],
    repository: 'repository2',
  });

  describe('constructor', () => {
    it('accepts an array of GithubIssue nodes', () => {
      const issues: GithubIssues = new GithubIssues([
        testGithubIssue1,
        testGithubIssue2,
        testGithubIssue3,
      ]);
      expect(issues).toBeDefined();
    });

    it('accepts an empty', () => {
      const issues: GithubIssues = new GithubIssues();
      expect(issues).toBeDefined();
    });
  });

  describe('public methods', () => {
    describe('add', () => {
      it('appends the provided node', () => {
        const issues: GithubIssues = new GithubIssues();
        expect(issues.size).toStrictEqual(0);
        issues.add(testGithubIssue1);
        expect(issues.size).toStrictEqual(1);
        issues.add(testGithubIssue2);
        expect(issues.size).toStrictEqual(2);
      });

      it('does not append duplicated nodes', () => {
        const issues: GithubIssues = new GithubIssues([testGithubIssue1]);
        expect(issues.size).toStrictEqual(1);
        issues.add(testGithubIssue1);
        expect(issues.size).toStrictEqual(1);
      });
    });

    describe('clear', () => {
      it('removes all nodes', () => {
        const issues: GithubIssues = new GithubIssues([
          testGithubIssue1,
          testGithubIssue2,
          testGithubIssue3,
        ]);
        expect(issues.size).toStrictEqual(3);
        issues.clear();
        expect(issues.size).toStrictEqual(0);
      });
    });

    describe('size', () => {
      it('returns the current node count', () => {
        const issues: GithubIssues = new GithubIssues();
        expect(issues.size).toStrictEqual(0);
        issues.add(testGithubIssue1);
        expect(issues.size).toStrictEqual(1);
        issues.add(testGithubIssue2);
        expect(issues.size).toStrictEqual(2);
        issues.clear();
        expect(issues.size).toStrictEqual(0);
      });
    });

    describe('getStatistics', () => {
      const issues: GithubIssues = new GithubIssues([
        testGithubIssue1,
        testGithubIssue2,
        testGithubIssue3,
        testGithubIssue4,
        testGithubIssue5,
      ]);

      it('counts issues created by login during interval', () => {
        const interval = Interval.fromDateTimes(
          DateTime.fromISO('2022-12-01'),
          DateTime.fromISO('2022-12-05'),
        );
        const login = 'mat';
        const expected: CountByRepository = {repository1: 2};

        const result = issues.getStatistics(interval, login);
        expect(result.created).toStrictEqual(expected);
      });

      it('counts issues in progress by login during interval', () => {
        const interval = Interval.fromDateTimes(
          DateTime.fromISO('2022-12-10'),
          DateTime.fromISO('2022-12-11'),
        );
        const login = 'mat';
        const expected: CountByRepository = {repository1: 1, repository2: 1};

        const result = issues.getStatistics(interval, login);
        expect(result.inProgress).toStrictEqual(expected);
      });

      it('counts issues closed by login during interval', () => {
        const interval = Interval.fromDateTimes(
          DateTime.fromISO('2022-12-01'),
          DateTime.fromISO('2022-12-06'),
        );
        const login = 'mat';
        const expected: CountByRepository = {repository1: 1};

        const result = issues.getStatistics(interval, login);
        expect(result.closed).toStrictEqual(expected);
      });
    });
  });
});
