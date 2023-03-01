import {Interval} from 'luxon';

import {GithubPullRequest} from './GithubPullRequest';
import {GithubNodes} from './GithubNodes';
import {GithubIssuesStatistics, CountByRepository} from './GithubIssues';

export interface GithubPullRequestsStatistics extends GithubIssuesStatistics {
  merged: CountByRepository;
  reviewed: CountByRepository;
}

export class GithubPullRequests extends GithubNodes<GithubPullRequest> {
  public getStatistics(
    interval: Interval,
    login: string,
  ): GithubPullRequestsStatistics {
    const statistics: GithubPullRequestsStatistics = {
      created: {},
      inProgress: {},
      merged: {},
      closed: {},
      reviewed: {},
    };
    this.nodes.forEach((node) => {
      if (this.isCreated(node, interval, login)) {
        this.incrementCount(statistics, 'created', node.getRepository);
      }
      if (this.isInProgress(node, interval, login)) {
        this.incrementCount(statistics, 'inProgress', node.getRepository);
      }
      if (this.isMerged(node, interval, login)) {
        this.incrementCount(statistics, 'merged', node.getRepository);
      }
      if (this.isClosed(node, interval, login)) {
        this.incrementCount(statistics, 'closed', node.getRepository);
      }
      if (this.isReviewed(node, interval, login)) {
        this.incrementCount(statistics, 'reviewed', node.getRepository);
      }
    });

    return statistics;
  }

  private isCreated(
    node: GithubPullRequest,
    interval: Interval,
    author: string,
  ): boolean {
    return node.getAuthor === author && interval.contains(node.getCreatedAt);
  }

  private isInProgress(
    node: GithubPullRequest,
    interval: Interval,
    author: string,
  ): boolean {
    return (
      node.getAuthor === author &&
      node.getCreatedAt <= interval.end &&
      (node.getClosedAt === null || node.getClosedAt >= interval.end)
    );
  }

  private isClosed(
    node: GithubPullRequest,
    interval: Interval,
    author: string,
  ): boolean {
    return (
      node.getAuthor === author &&
      node.getMergedAt === null &&
      node.getClosedAt !== null &&
      interval.contains(node.getClosedAt)
    );
  }

  private isMerged(
    node: GithubPullRequest,
    interval: Interval,
    author: string,
  ): boolean {
    return (
      node.getAuthor === author &&
      node.getMergedAt !== null &&
      interval.contains(node.getMergedAt)
    );
  }

  private isReviewed(
    node: GithubPullRequest,
    interval: Interval,
    reviewer: string,
  ): boolean {
    const reviewerReviews = node.getReviews.get(reviewer);
    return Boolean(
      node.getAuthor !== reviewer &&
        reviewerReviews &&
        reviewerReviews.some((reviewDate) => interval.contains(reviewDate)),
    );
  }

  private incrementCount(
    statistics: GithubPullRequestsStatistics,
    key: keyof GithubPullRequestsStatistics,
    repository: string,
  ): void {
    if (statistics[key][repository]) {
      statistics[key][repository]++;
    } else {
      statistics[key][repository] = 1;
    }
  }
}
