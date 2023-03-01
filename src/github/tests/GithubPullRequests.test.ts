import {DateTime, Interval} from 'luxon';

import {CountByRepository} from '../GithubIssues';
import {GithubPullRequest} from '../GithubPullRequest';
import {GithubPullRequests} from '../GithubPullRequests';

describe('GithubPullRequests', () => {
  const testGithubPullRequest1: GithubPullRequest = new GithubPullRequest({
    url: 'www.fake_1.com',
    number: '1',
    title: 'fake 1',
    createdAt: '2022-11-25',
    mergedAt: null,
    closedAt: null,
    author: 'mat',
    assignees: [],
    reviews: [],
    repository: 'repository1',
  });
  const testGithubPullRequest2: GithubPullRequest = new GithubPullRequest({
    url: 'www.fake_2.com',
    number: '2',
    title: 'fake 2',
    createdAt: '2022-12-03',
    mergedAt: null,
    closedAt: '2024-01-12',
    author: 'susan',
    assignees: [],
    reviews: [
      {author: 'bob', createdAt: '2022-12-11'},
      {author: 'mat', createdAt: '2022-12-11'},
    ],
    repository: 'repository1',
  });
  const testGithubPullRequest3: GithubPullRequest = new GithubPullRequest({
    url: 'www.fake_3.com',
    number: '3',
    title: 'fake 3',
    createdAt: '2022-12-20',
    mergedAt: null,
    closedAt: '2023-01-05',
    author: 'mat',
    assignees: [],
    reviews: [{author: 'susan', createdAt: '2023-01-01'}],
    repository: 'repository1',
  });
  const testGithubPullRequest4: GithubPullRequest = new GithubPullRequest({
    url: 'www.fake_4.com',
    number: '4',
    title: 'fake 4',
    createdAt: '2022-12-10',
    closedAt: '2023-01-12',
    mergedAt: '2023-01-12',
    author: 'mat',
    assignees: [],
    reviews: [{author: 'susan', createdAt: '2023-01-01'}],
    repository: 'repository1',
  });
  const testGithubPullRequest5: GithubPullRequest = new GithubPullRequest({
    url: 'www.fake_5.com',
    number: '5',
    title: 'fake 5',
    createdAt: '2022-12-05',
    closedAt: null,
    mergedAt: null,
    author: 'bob',
    assignees: [],
    reviews: [{author: 'mat', createdAt: '2022-12-06'}],
    repository: 'repository2',
  });

  describe('constructor', () => {
    it('accepts an array of GithubPullRequest nodes', () => {
      const pullRequests: GithubPullRequests = new GithubPullRequests([
        testGithubPullRequest1,
        testGithubPullRequest2,
        testGithubPullRequest3,
      ]);
      expect(pullRequests).toBeDefined();
    });

    it('accepts an empty', () => {
      const pullRequests: GithubPullRequests = new GithubPullRequests();
      expect(pullRequests).toBeDefined();
    });
  });

  describe('public methods', () => {
    describe('add', () => {
      it('appends the provided node', () => {
        const pullRequests: GithubPullRequests = new GithubPullRequests();
        expect(pullRequests.size).toStrictEqual(0);
        pullRequests.add(testGithubPullRequest1);
        expect(pullRequests.size).toStrictEqual(1);
        pullRequests.add(testGithubPullRequest2);
        expect(pullRequests.size).toStrictEqual(2);
      });

      it('does not append duplicated nodes', () => {
        const pullRequests: GithubPullRequests = new GithubPullRequests([
          testGithubPullRequest1,
        ]);
        expect(pullRequests.size).toStrictEqual(1);
        pullRequests.add(testGithubPullRequest1);
        expect(pullRequests.size).toStrictEqual(1);
      });
    });

    describe('clear', () => {
      it('removes all nodes', () => {
        const pullRequests: GithubPullRequests = new GithubPullRequests([
          testGithubPullRequest1,
          testGithubPullRequest2,
          testGithubPullRequest3,
        ]);
        expect(pullRequests.size).toStrictEqual(3);
        pullRequests.clear();
        expect(pullRequests.size).toStrictEqual(0);
      });
    });

    describe('size', () => {
      it('returns the current node count', () => {
        const pullRequests: GithubPullRequests = new GithubPullRequests();
        expect(pullRequests.size).toStrictEqual(0);
        pullRequests.add(testGithubPullRequest1);
        expect(pullRequests.size).toStrictEqual(1);
        pullRequests.add(testGithubPullRequest2);
        expect(pullRequests.size).toStrictEqual(2);
        pullRequests.clear();
        expect(pullRequests.size).toStrictEqual(0);
      });
    });

    describe('getStatistics', () => {
      const pullRequests: GithubPullRequests = new GithubPullRequests([
        testGithubPullRequest1,
        testGithubPullRequest2,
        testGithubPullRequest3,
        testGithubPullRequest4,
        testGithubPullRequest5,
      ]);
      it('counts pull requests created by login during interval', () => {
        const interval = Interval.fromDateTimes(
          DateTime.fromISO('2022-12-01'),
          DateTime.fromISO('2022-12-25'),
        );
        const login = 'mat';
        const expected: CountByRepository = {repository1: 2};

        const result = pullRequests.getStatistics(interval, login);
        expect(result.created).toStrictEqual(expected);
      });

      it('counts pull requests in progress by login during interval', () => {
        const interval = Interval.fromDateTimes(
          DateTime.fromISO('2022-12-01'),
          DateTime.fromISO('2022-12-06'),
        );
        const login = 'mat';
        const expected: CountByRepository = {repository1: 1};

        const result = pullRequests.getStatistics(interval, login);
        expect(result.inProgress).toStrictEqual(expected);
      });

      it('counts pull requests closed by login during interval', () => {
        const interval = Interval.fromDateTimes(
          DateTime.fromISO('2022-12-01'),
          DateTime.fromISO('2023-01-07'),
        );
        const login = 'mat';
        const expected: CountByRepository = {repository1: 1};

        const result = pullRequests.getStatistics(interval, login);
        expect(result.closed).toStrictEqual(expected);
      });

      it('counts pull requests merged by login during interval', () => {
        const interval = Interval.fromDateTimes(
          DateTime.fromISO('2022-01-10'),
          DateTime.fromISO('2023-01-13'),
        );
        const login = 'mat';
        const expected: CountByRepository = {repository1: 1};

        const result = pullRequests.getStatistics(interval, login);
        expect(result.merged).toStrictEqual(expected);
      });

      it('counts pull requests reviewed by login during interval', () => {
        const interval = Interval.fromDateTimes(
          DateTime.fromISO('2022-12-01'),
          DateTime.fromISO('2022-12-11'),
        );
        const login = 'mat';
        const expected: CountByRepository = {repository2: 1};

        const result = pullRequests.getStatistics(interval, login);
        expect(result.reviewed).toStrictEqual(expected);
      });
    });
  });
});
