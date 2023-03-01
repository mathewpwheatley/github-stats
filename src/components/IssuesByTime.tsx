import React, {useState} from 'react';
import {Card, Checkbox, Stack, Text} from '@shopify/polaris';
import {ChartData} from 'chart.js';
import {Line} from 'react-chartjs-2';

import {GithubIntervalStatistics} from '../github/GithubStatistics';
import {CountByRepository} from '../github/GithubIssues';
import {
  chartColors,
  lineChartOptions,
  registerLineChart,
} from '../utilities/chartSettings';

export function statisticTotal(statistic: CountByRepository): number {
  return Object.values(statistic).reduce((sum, current) => sum + current, 0);
}

registerLineChart();

function toChartData(
  statistics: GithubIntervalStatistics,
): ChartData<'line', number[]> {
  const intervals: string[] = [];
  const created: number[] = [];
  const closed: number[] = [];

  statistics.data.forEach((statistic) => {
    intervals.push(statistic.interval.start.toISODate());
    created.push(statisticTotal(statistic.issues.created));
    closed.push(statisticTotal(statistic.issues.closed));
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
        label: 'Closed',
        data: closed,
        borderColor: chartColors.opaque[1],
        borderWidth: 2,
        backgroundColor: chartColors.transparent[1],
        fill: true,
      },
    ],
  };
}

export function IssuesByTime(props: {
  data: GithubIntervalStatistics;
}): JSX.Element {
  const [options, setOptions] = useState(lineChartOptions);

  function handleCheckedToggle(): void {
    const currentOptions = {...options};
    currentOptions.scales.y.stacked = !options.scales.y.stacked;
    setOptions(currentOptions);
  }

  // eslint-disable-next-line @typescript-eslint/no-extra-parens
  const header = (
    <Stack>
      <Stack.Item fill>
        <Text variant="headingMd" as="h6">
          {`Issues by ${props.data.unit}`}
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
