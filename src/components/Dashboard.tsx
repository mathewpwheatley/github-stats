import React, {useCallback, useState, useEffect} from 'react';
import {DateTime, DateTimeUnit, Interval} from 'luxon';
import {Page, Layout} from '@shopify/polaris';

import {
  GithubIntervalStatistics,
  GithubStatistics,
} from '../github/GithubStatistics';

import {PullRequestsByTime} from './PullRequestsByTime';
import {PullRequestsByRepository} from './PullRequestsByRepository';
import {IssuesByTime} from './IssuesByTime';
import {IssuesByRepository} from './IssuesByRepository';
import {Summary} from './Summary';
import {GithubForm} from './GithubForm';
import {DataDescriptions} from './DataDescriptions';

const githubStatistics = new GithubStatistics('', 'Shopify');

const defaultEnd = DateTime.now();
const defaultInterval = Interval.fromDateTimes(
  defaultEnd.minus({months: 3}),
  defaultEnd,
);
const defaultDateTimeUnit: DateTimeUnit = 'month';
const defaultStatistics: GithubIntervalStatistics = {
  interval: defaultInterval,
  unit: defaultDateTimeUnit,
  data: [],
};

export function Dashboard(): JSX.Element {
  const [interval, setInterval] = useState(defaultInterval);
  const [dateTimeUnit, setDateTimeUnit] = useState(defaultDateTimeUnit);
  const [statistics, setStatistics] = useState(defaultStatistics);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    setStatistics(githubStatistics.calculateStatistics(dateTimeUnit, interval));
  }, [dateTimeUnit, interval]);

  function updateCredentials(login: string, organization: string) {
    githubStatistics.setLogin(login);
    githubStatistics.setOrganization(organization);
    fetchData();
  }

  async function fetchData(): Promise<void> {
    setLoadingData(true);
    await githubStatistics.fetchData();
    setStatistics(githubStatistics.calculateStatistics(dateTimeUnit, interval));
    setLoadingData(false);
  }

  const handleDateTimeUnitChange = useCallback(
    (value: DateTimeUnit) => setDateTimeUnit(value),
    [],
  );

  return (
    <Page title={'Github Statistics'} primaryAction={<DataDescriptions />}>
      <Layout>
        <Layout.Section oneHalf>
          <GithubForm
            dateTimeUnit={dateTimeUnit}
            onDateTimeUnitChange={handleDateTimeUnitChange}
            interval={interval}
            defaultInterval={defaultInterval}
            setInterval={setInterval}
            organization={githubStatistics.getOrganization}
            login={githubStatistics.getLogin}
            updateCredentials={updateCredentials}
            loading={loadingData}
          />
        </Layout.Section>
        <Layout.Section oneHalf>
          <Summary data={statistics} />
        </Layout.Section>
        <Layout.Section>
          <IssuesByTime data={statistics} />
        </Layout.Section>
        <Layout.Section>
          <PullRequestsByTime data={statistics} />
        </Layout.Section>
        <Layout.Section>
          <IssuesByRepository data={statistics} />
        </Layout.Section>
        <Layout.Section>
          <PullRequestsByRepository data={statistics} />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
