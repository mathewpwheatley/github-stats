import {DateTime} from 'luxon';

import {GithubIssue, GithubIssueFields} from './GithubIssue';

export interface GithubPullRequestFields extends GithubIssueFields {
  mergedAt: string | null;
  reviews: GithubPullRequestReviewsField;
}

type GithubPullRequestReviewsField = {
  author: string;
  createdAt: string;
}[];
type GithubPullRequestReviews = Map<string, DateTime[]>;

export class GithubPullRequest extends GithubIssue {
  private readonly mergedAt: DateTime | null;
  private readonly reviews: GithubPullRequestReviews;

  constructor(fields: GithubPullRequestFields) {
    super(fields);
    this.mergedAt = this.parseOptionalDate(fields.mergedAt);
    this.reviews = this.parseReviews(fields.reviews);
  }

  public get getMergedAt(): DateTime | null {
    return this.mergedAt;
  }

  public get getReviews(): GithubPullRequestReviews {
    return this.reviews;
  }

  private parseReviews(
    reviews: GithubPullRequestReviewsField,
  ): GithubPullRequestReviews {
    const parsedReviews: GithubPullRequestReviews = new Map();
    reviews.forEach((review) => {
      const reviewerReviews = parsedReviews.get(review.author);
      if (reviewerReviews) {
        reviewerReviews.push(this.parseDate(review.createdAt));
      } else {
        parsedReviews.set(review.author, [this.parseDate(review.createdAt)]);
      }
    });
    return parsedReviews;
  }
}
