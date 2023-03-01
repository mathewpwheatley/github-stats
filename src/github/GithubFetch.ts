import {Octokit} from '@octokit/core';

import {GithubIssue} from './GithubIssue';
import {GithubIssues} from './GithubIssues';
import {GithubPullRequest} from './GithubPullRequest';
import {GithubPullRequests} from './GithubPullRequests';
import {githubPersonalAccessToken} from './secrets';

interface FetchResponse {
  search: {
    pageInfo: {
      endCursor: string;
      hasNextPage: boolean;
    };
    nodes: FetchedNodes;
  };
}

type FetchedNodes = (FetchedIssue | FetchedPullRequest)[];

interface FetchedNode {
  __typename: 'PullRequest' | 'Issue';
  url: string;
  number: number;
  title: string;
  createdAt: string;
  closedAt: string;
  author: {login: string};
  assignees: {nodes: {login: string}[]};
  repository: {name: string};
}

interface FetchedIssue extends FetchedNode {
  __typename: 'Issue';
}

interface FetchedPullRequest extends FetchedNode {
  __typename: 'PullRequest';
  mergedAt: string;
  reviews: {nodes: FetchedPullRequestReview[]};
}

interface FetchedPullRequestReview {
  author: {login: string};
  createdAt: string;
}

export class GithubFetch {
  private login: string;
  private org: string;
  private readonly octokit: Octokit;

  constructor(
    githubLogin: string,
    githubOrganization: string,
    authToken?: string,
  ) {
    this.login = githubLogin;
    this.org = githubOrganization;
    this.octokit = new Octokit({
      auth: authToken ?? githubPersonalAccessToken,
    });
  }

  public get getLogin(): string {
    return this.login;
  }

  public setLogin(login: string): void {
    this.login = login;
  }

  public get getOrganization(): string {
    return this.org;
  }

  public setOrganization(organization: string): void {
    this.org = organization;
  }

  public async getIssues(): Promise<GithubIssues> {
    const authoredIssues = await this.getAuthoredIssues();
    const assignedIssues = await this.getAssignedIssues();
    return this.convertIssueNodes(authoredIssues.concat(assignedIssues));
  }

  public async getPullRequests(): Promise<GithubPullRequests> {
    const authoredPullRequests = await this.getAuthoredPullRequests();
    const reviewedPullRequests = await this.getReviewedPullRequests();
    return this.convertPullRequestNodes(
      authoredPullRequests.concat(reviewedPullRequests),
    );
  }

  private async getAuthoredIssues(): Promise<FetchedNodes> {
    const authoredIssues = `author:${this.login} org:${this.org} is:issue archived:false sort:created-desc`;
    const response = await this.fetchGraphqlSearchQuery(authoredIssues);
    return response;
  }

  private async getAssignedIssues(): Promise<FetchedNodes> {
    const assignedIssues = `assignee:${this.login} org:${this.org} is:issue archived:false sort:created-desc`;
    const response = await this.fetchGraphqlSearchQuery(assignedIssues);
    return response;
  }

  private async getAuthoredPullRequests(): Promise<FetchedNodes> {
    const authoredPullRequests = `author:${this.login} org:${this.org} is:pr archived:false sort:created-desc`;
    const response = await this.fetchGraphqlSearchQuery(authoredPullRequests);
    return response;
  }

  private async getReviewedPullRequests(): Promise<FetchedNodes> {
    const reviewedPullRequests = `reviewed-by:${this.login} org:${this.org} is:pr archived:false sort:created-desc`;
    const response = await this.fetchGraphqlSearchQuery(reviewedPullRequests);
    return response;
  }

  private convertIssueNodes(fetchNodes: FetchedNodes): GithubIssues {
    const issues = new GithubIssues();
    fetchNodes.forEach((node) => {
      if (node.__typename !== 'Issue') {
        throw new Error('Unknown node type fetched from Github');
      }
      issues.add(
        new GithubIssue({
          url: node.url,
          number: node.number,
          title: node.title,
          createdAt: node.createdAt,
          closedAt: node.closedAt,
          author: node.author.login,
          assignees: node.assignees.nodes.map(
            (assignee: {login: string}) => assignee.login,
          ),
          repository: node.repository.name,
        }),
      );
    });
    return issues;
  }

  private convertPullRequestNodes(
    fetchNodes: FetchedNodes,
  ): GithubPullRequests {
    const pullRequests = new GithubPullRequests();
    fetchNodes.forEach((node) => {
      if (node.__typename !== 'PullRequest') {
        throw new Error('Unknown node type fetched from Github');
      }
      pullRequests.add(
        new GithubPullRequest({
          url: node.url,
          number: node.number,
          title: node.title,
          createdAt: node.createdAt,
          closedAt: node.closedAt,
          mergedAt: node.mergedAt,
          author: node.author.login,
          assignees: node.assignees.nodes.map(
            (assignee: {login: string}) => assignee.login,
          ),
          repository: node.repository.name,
          reviews: node.reviews.nodes.map(
            (review: FetchedPullRequestReview) => {
              return {
                author: review.author.login,
                createdAt: review.createdAt,
              };
            },
          ),
        }),
      );
    });
    return pullRequests;
  }

  private async fetchGraphqlSearchQuery(
    searchQuery: string,
  ): Promise<FetchedNodes> {
    let startCursor: string | undefined;
    let hasNextPage = true;
    const nodes: FetchedNodes = [];
    while (hasNextPage) {
      const response: FetchResponse = await this.octokit.graphql(
        this.graphqlSearchQuery(searchQuery, startCursor),
      );
      startCursor = response.search.pageInfo.endCursor;
      hasNextPage = response.search.pageInfo.hasNextPage;
      nodes.push(...response.search.nodes);
    }
    return nodes;
  }

  private graphqlSearchQuery(search: string, startCursor?: string): string {
    const cursor: string = startCursor ? `after: "${startCursor}"` : '';
    return `
      query {
        search(
          query: "${search}"
          type: ISSUE 
          first: 100
          ${cursor}
        ) {
          pageInfo {
            endCursor
            hasNextPage
          }
          nodes {
            ... on Issue {
              __typename
              url
              number
              title
              createdAt
              closedAt
              author {
                login
              }
              assignees (first: 10) {
                nodes {
                  login
                }
              }
              repository {
                name
              }
            }
            ... on PullRequest {
              __typename
              url
              number
              title
              createdAt
              closedAt
              mergedAt
              author {
                login
              }
              assignees (first: 10) {
                nodes {
                  login
                }
              }
              reviews (first: 50) {
                nodes {
                  author {
                    login
                  }
                  createdAt
                }
              }
              repository {
                name
              }
            }
          }
        }
      }
    `;
  }
}
