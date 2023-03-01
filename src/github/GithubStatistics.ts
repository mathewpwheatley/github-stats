import {DateTime, DateTimeUnit, Interval} from 'luxon';

import {GithubFetch} from './GithubFetch';
import {GithubIssues, GithubIssuesStatistics} from './GithubIssues';
import {
  GithubPullRequests,
  GithubPullRequestsStatistics,
} from './GithubPullRequests';

export interface GithubIntervalStatistics {
  interval: Interval;
  unit: DateTimeUnit;
  data: GithubStatisticsPoint[];
}

interface GithubStatisticsPoint {
  interval: Interval;
  issues: GithubIssuesStatistics;
  pullRequests: GithubPullRequestsStatistics;
}

export class GithubStatistics {
  data: {issues: GithubIssues; pullRequests: GithubPullRequests};
  private readonly githubFetch: GithubFetch;

  constructor(githubLogin: string, githubOrganization: string) {
    this.githubFetch = new GithubFetch(githubLogin, githubOrganization);
    this.data = {
      issues: new GithubIssues(),
      pullRequests: new GithubPullRequests(),
    };
  }

  public get getLogin(): string {
    return this.githubFetch.getLogin;
  }

  public setLogin(login: string): void {
    this.githubFetch.setLogin(login);
  }

  public get getOrganization(): string {
    return this.githubFetch.getOrganization;
  }

  public setOrganization(organization: string): void {
    this.githubFetch.setOrganization(organization);
  }

  public async fetchData(): Promise<void> {
    this.data = {
      issues: await this.githubFetch.getIssues(),
      pullRequests: await this.githubFetch.getPullRequests(),
    };
  }

  public calculateStatistics(
    unit: DateTimeUnit,
    interval: Interval,
  ): GithubIntervalStatistics {
    const statistics = this.emptyStatistics(unit, interval);
    let currentStart: DateTime = statistics.interval.start;
    const intervalEnd: DateTime = statistics.interval.end;
    while (currentStart < intervalEnd) {
      const currentEnd = currentStart.plus({[statistics.unit]: 1});
      const currentInterval = Interval.fromDateTimes(currentStart, currentEnd);
      currentStart = currentEnd;
      const currentIntervalStatistics: GithubStatisticsPoint = {
        interval: currentInterval,
        issues: this.data.issues.getStatistics(
          currentInterval,
          this.githubFetch.getLogin,
        ),
        pullRequests: this.data.pullRequests.getStatistics(
          currentInterval,
          this.githubFetch.getLogin,
        ),
      };
      statistics.data.push(currentIntervalStatistics);
    }
    return statistics;
  }

  private emptyStatistics(
    unit: DateTimeUnit,
    interval: Interval,
  ): GithubIntervalStatistics {
    return {
      interval: Interval.fromDateTimes(
        this.intervalStart(unit, interval),
        this.intervalEnd(unit, interval),
      ),
      unit,
      data: [],
    };
  }

  private intervalStart(unit: DateTimeUnit, interval: Interval): DateTime {
    return interval.start.startOf(unit);
  }

  private intervalEnd(unit: DateTimeUnit, interval: Interval): DateTime {
    return interval.end.startOf(unit).plus({[unit]: 1});
  }

  // private getRepositories(
  //   statistics: GithubIssuesStatistics | GithubPullRequestsStatistics,
  // ): string[] {
  //   const repositories: Set<string> = new Set();
  //   Object.values(statistics).forEach((current: CountByRepository) => {
  //     this.addArrayToSet(Object.keys(current), repositories);
  //   });
  //   return [...repositories];
  // }

  // private addArrayToSet(array: string[], set: Set<string>): void {
  //   array.forEach((current) => {
  //     set.add(current);
  //   });
  // }
}
