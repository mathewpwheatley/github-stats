import React, {useState} from 'react';
import {ChartData} from 'chart.js';
import {Bar} from 'react-chartjs-2';
import {Card, Checkbox, Stack, Text} from '@shopify/polaris';

import {GithubIntervalStatistics} from '../github/GithubStatistics';
import {CountByRepository} from '../github/GithubIssues';
import {
  barChartOptions,
  chartColors,
  registerBarChart,
} from '../utilities/chartSettings';

registerBarChart();

interface Totals {
  created: CountByRepository;
  closed: CountByRepository;
}

function addToTotals(
  totals: Totals,
  key: keyof Totals,
  repository: string,
  count: number,
): void {
  if (totals[key][repository]) {
    totals[key][repository] += count;
  } else {
    totals[key][repository] = count;
  }
}

function labelsFromTotals(totals: Totals): string[] {
  return [
    ...new Set([...Object.keys(totals.created), ...Object.keys(totals.closed)]),
  ];
}

function dataFromTotals(totals: Totals, key: keyof Totals, labels: string[]) {
  return labels.map((label) => {
    if (totals[key][label]) {
      return totals[key][label];
    } else {
      return 0;
    }
  });
}

function toChartData(
  statistics: GithubIntervalStatistics,
): ChartData<'bar', number[]> {
  const totals: Totals = {
    created: {},
    closed: {},
  };

  statistics.data.forEach((statistic) => {
    Object.entries(statistic.issues.created).forEach(([repository, count]) => {
      addToTotals(totals, 'created', repository, count);
    });

    Object.entries(statistic.issues.closed).forEach(([repository, count]) => {
      addToTotals(totals, 'closed', repository, count);
    });
  });

  const labels = labelsFromTotals(totals);

  return {
    labels,
    datasets: [
      {
        label: 'Created',
        data: dataFromTotals(totals, 'created', labels),
        backgroundColor: chartColors.opaque[0],
        borderRadius: 5,
      },
      {
        label: 'Closed',
        data: dataFromTotals(totals, 'closed', labels),
        backgroundColor: chartColors.opaque[1],
        borderRadius: 5,
      },
    ],
  };
}

export function IssuesByRepository(props: {
  data: GithubIntervalStatistics;
}): JSX.Element {
  const [options, setOptions] = useState(barChartOptions);

  function handleCheckedToggle(): void {
    const current = {...options};
    current.scales.y.stacked = !options.scales.y.stacked;
    current.scales.x.stacked = !options.scales.x.stacked;
    setOptions(current);
  }

  // eslint-disable-next-line @typescript-eslint/no-extra-parens
  const header = (
    <Stack>
      <Stack.Item fill>
        <Text variant="headingMd" as="h6">
          {'Issue by repository'}
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
      <Bar data={toChartData(props.data)} options={options} />
    </Card>
  );
}
