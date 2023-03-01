import {Interval} from 'luxon';

import {GithubIssue} from './GithubIssue';
import {GithubNodes} from './GithubNodes';

export interface CountByRepository {
  [key: string]: number;
}

export interface GithubIssuesStatistics {
  created: CountByRepository;
  inProgress: CountByRepository;
  closed: CountByRepository;
}

export class GithubIssues extends GithubNodes<GithubIssue> {
  public getStatistics(
    interval: Interval,
    login: string,
  ): GithubIssuesStatistics {
    const statistics: GithubIssuesStatistics = {
      created: {},
      inProgress: {},
      closed: {},
    };
    this.nodes.forEach((node) => {
      if (this.isCreated(node, interval, login)) {
        this.incrementCount(statistics, 'created', node.getRepository);
      }
      if (this.isInProgress(node, interval, login)) {
        this.incrementCount(statistics, 'inProgress', node.getRepository);
      }
      if (this.isClosed(node, interval, login)) {
        this.incrementCount(statistics, 'closed', node.getRepository);
      }
    });

    return statistics;
  }

  private isCreated(
    node: GithubIssue,
    interval: Interval,
    author: string,
  ): boolean {
    return node.getAuthor === author && interval.contains(node.getCreatedAt);
  }

  private isInProgress(
    node: GithubIssue,
    interval: Interval,
    assignee: string,
  ): boolean {
    return (
      node.getAssignees.has(assignee) &&
      node.getCreatedAt <= interval.end &&
      (node.getClosedAt === null || node.getClosedAt >= interval.end)
    );
  }

  private isClosed(
    node: GithubIssue,
    interval: Interval,
    assignee: string,
  ): boolean {
    return (
      node.getAssignees.has(assignee) &&
      node.getClosedAt !== null &&
      interval.contains(node.getClosedAt)
    );
  }

  private incrementCount(
    statistics: GithubIssuesStatistics,
    key: keyof GithubIssuesStatistics,
    repository: string,
  ): void {
    if (statistics[key][repository]) {
      statistics[key][repository]++;
    } else {
      statistics[key][repository] = 1;
    }
  }
}
