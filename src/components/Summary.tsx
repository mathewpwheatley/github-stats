import React from 'react';
import {
  Card,
  ColumnContentType,
  DataTable,
  TableData,
  Text,
  TextContainer,
} from '@shopify/polaris';

import {GithubIntervalStatistics} from '../github/GithubStatistics';

import {statisticTotal} from './IssuesByTime';

function convertToTableData(data: GithubIntervalStatistics): TableData[][] {
  const duration = data.interval.toDuration(data.unit).as(data.unit);
  const sums = {
    issues: {
      created: 0,
      closed: 0,
    },
    pullRequests: {
      created: 0,
      merged: 0,
      closed: 0,
      reviewed: 0,
    },
  };
  data.data.forEach((current) => {
    sums.issues.created += statisticTotal(current.issues.created);
    sums.issues.closed += statisticTotal(current.issues.closed);
    sums.pullRequests.created += statisticTotal(current.pullRequests.created);
    sums.pullRequests.merged += statisticTotal(current.pullRequests.merged);
    sums.pullRequests.closed += statisticTotal(current.pullRequests.closed);
    sums.pullRequests.reviewed += statisticTotal(current.pullRequests.reviewed);
  });

  return [
    [
      'Issues created',
      (sums.issues.created / duration).toFixed(1),
      sums.issues.created,
    ],
    [
      'Issues closed',
      (sums.issues.closed / duration).toFixed(1),
      sums.issues.closed,
    ],
    [
      'Pull requests created',
      (sums.pullRequests.created / duration).toFixed(1),
      sums.pullRequests.created,
    ],
    [
      'Pull requests merged',
      (sums.pullRequests.merged / duration).toFixed(1),
      sums.pullRequests.merged,
    ],
    [
      'Pull requests closed',
      (sums.pullRequests.closed / duration).toFixed(1),
      sums.pullRequests.closed,
    ],
    [
      'Pull requests reviewed',
      (sums.pullRequests.reviewed / duration).toFixed(1),
      sums.pullRequests.reviewed,
    ],
  ];
}

export function Summary(props: {data: GithubIntervalStatistics}): JSX.Element {
  const columnContentTypes: ColumnContentType[] = [
    'text',
    'numeric',
    'numeric',
  ];

  const headings: string[] = [
    'Type',
    `Average per ${props.data.unit}`,
    'Total',
  ];

  const title = `${props.data.interval.start.toISODate()} through ${props.data.interval.end.toISODate()}`;

  const humanDuration = props.data.interval
    .toDuration(props.data.unit)
    .toHuman();

  return (
    <Card>
      <Card.Section>
        <TextContainer>
          <Text variant="bodyMd" as="p">
            <b>Truncated date range:</b> {title}
          </Text>
          <Text variant="bodyMd" as="p">
            <b>Duration:</b> {humanDuration}
          </Text>
        </TextContainer>
      </Card.Section>
      <Card.Section fullWidth>
        <DataTable
          increasedTableDensity
          hasZebraStripingOnData
          columnContentTypes={columnContentTypes}
          headings={headings}
          rows={convertToTableData(props.data)}
        />
      </Card.Section>
    </Card>
  );
}
