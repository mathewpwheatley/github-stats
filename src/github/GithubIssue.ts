import {DateTime} from 'luxon';

export interface GithubIssueFields {
  url: string;
  number: string | number;
  title: string;
  createdAt: string;
  closedAt: string | null;
  author: string;
  assignees: string[];
  repository: string;
}

export class GithubIssue {
  private readonly url: string;
  private readonly number: string;
  private readonly title: string;
  private readonly createdAt: DateTime;
  private readonly closedAt: DateTime | null;
  private readonly author: string;
  private readonly assignees: Set<string>;
  private readonly repository: string;

  constructor(fields: GithubIssueFields) {
    this.url = fields.url;
    this.number = fields.number.toString();
    this.title = fields.title;
    this.createdAt = this.parseDate(fields.createdAt);
    this.closedAt = this.parseOptionalDate(fields.closedAt);
    this.author = fields.author;
    this.assignees = new Set(fields.assignees);
    this.repository = fields.repository;
  }

  public get getUrl(): string {
    return this.url;
  }

  public get getNumber(): string {
    return this.number;
  }

  public get getTitle(): string {
    return this.title;
  }

  public get getCreatedAt(): DateTime {
    return this.createdAt;
  }

  public get getClosedAt(): DateTime | null {
    return this.closedAt;
  }

  public get getAuthor(): string {
    return this.author;
  }

  public get getAssignees(): Set<string> {
    return this.assignees;
  }

  public get getRepository(): string {
    return this.repository;
  }

  protected parseOptionalDate(date: string | null): DateTime | null {
    return date === null || date.length === 0 ? null : this.parseDate(date);
  }

  protected parseDate(date: string): DateTime {
    const parsedDate = DateTime.fromISO(date);
    if (parsedDate.invalidExplanation !== null) {
      throw new Error(parsedDate.invalidExplanation);
    }
    return parsedDate;
  }
}
