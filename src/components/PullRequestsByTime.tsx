import React, {useState} from 'react';
import {Card, Checkbox, Stack, Text} from '@shopify/polaris';
import {ChartData} from 'chart.js';
import {Line} from 'react-chartjs-2';

import {GithubIntervalStatistics} from '../github/GithubStatistics';
import {
  chartColors,
  lineChartOptions,
  registerLineChart,
} from '../utilities/chartSettings';

import {statisticTotal} from './IssuesByTime';

registerLineChart();

function toChartData(
  statistics: GithubIntervalStatistics,
): ChartData<'line', number[]> {
  const created: number[] = [];
  const merged: number[] = [];
  const closed: number[] = [];
  const reviewed: number[] = [];
  const intervals: string[] = [];

  statistics.data.forEach((statistic) => {
    intervals.push(statistic.interval.start.toISODate());
    created.push(statisticTotal(statistic.pullRequests.created));
    merged.push(statisticTotal(statistic.pullRequests.merged));
    closed.push(statisticTotal(statistic.pullRequests.closed));
    reviewed.push(statisticTotal(statistic.pullRequests.reviewed));
  });
  return {
    labels: intervals,
    datasets: [
      {
        label: 'Created',
        data: created,
        borderColor: chartColors.opaque[0],
        borderWidth: 2,
        backgroundColor: chartColors.transparent[0],
        fill: true,
      },
      {
        label: 'Merged',
        data: merged,
        borderColor: chartColors.opaque[1],
        borderWidth: 2,
        backgroundColor: chartColors.transparent[1],
        fill: true,
      },
      {
        label: 'Closed',
        data: closed,
        borderColor: chartColors.opaque[2],
        borderWidth: 2,
        backgroundColor: chartColors.transparent[2],
        fill: true,
      },
      {
        label: 'Reviewed',
        data: reviewed,
        borderColor: chartColors.opaque[3],
        borderWidth: 2,
        backgroundColor: chartColors.transparent[3],
        fill: true,
      },
    ],
  };
}

export function PullRequestsByTime(props: {
  data: GithubIntervalStatistics;
}): JSX.Element {
  const [options, setOptions] = useState(lineChartOptions);

  function handleCheckedToggle(): void {
    const current = {...options};
    current.scales.y.stacked = !options.scales.y.stacked;
    setOptions(current);
  }

  // eslint-disable-next-line @typescript-eslint/no-extra-parens
  const header = (
    <Stack>
      <Stack.Item fill>
        <Text variant="headingMd" as="h6">
          {`Pull requests by ${props.data.unit}`}
        </Text>
      </Stack.Item>
      <Stack.Item>
        <Checkbox
          label="Stacked"
          checked={options.scales.y.stacked}
          onChange={handleCheckedToggle}
        />
      </Stack.Item>
    </Stack>
  );

  return (
    <Card sectioned title={header}>
      <Line data={toChartData(props.data)} options={options} />
    </Card>
  );
}
