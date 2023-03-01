import {
  Card,
  TextField,
  TextContainer,
  Select,
  SelectOption,
  Button,
  Stack,
} from '@shopify/polaris';
import React, {KeyboardEvent, useState} from 'react';
import {DateTimeUnit, Interval} from 'luxon';

import {DateRangePicker} from './DateRangePicker';

const DateTimeUnitOptions: SelectOption[] = [
  {label: 'Day', value: 'day' as DateTimeUnit},
  {label: 'Week', value: 'week' as DateTimeUnit},
  {label: 'Month', value: 'month' as DateTimeUnit},
  {label: 'Year', value: 'year' as DateTimeUnit},
];

export function GithubForm(props: {
  dateTimeUnit: DateTimeUnit;
  onDateTimeUnitChange: (value: DateTimeUnit) => void;
  interval: Interval;
  defaultInterval: Interval;
  setInterval: React.Dispatch<React.SetStateAction<Interval>>;
  organization: string;
  login: string;
  loading: boolean;
  updateCredentials: (login: string, organization: string) => void;
}): JSX.Element {
  const [login, setLogin] = useState(props.login);
  const [loginError, setLoginError] = useState('');
  const [organization, setOrganization] = useState(props.organization);
  const [organizationError, setOrganizationError] = useState('');

  function validateLogin(): boolean {
    if (login.length === 0) {
      setLoginError('Field is required');
      return false;
    }
    setLoginError('');
    return true;
  }

  function validateOrganization(): boolean {
    if (organization.length === 0) {
      setOrganizationError('Required field');
      return false;
    }
    setOrganizationError('');
    return true;
  }

  function handleKeyPress(
    event: KeyboardEvent<HTMLDivElement> | undefined,
  ): void {
    const enterKeyPressed = Boolean(event?.key === 'Enter');
    if (enterKeyPressed) {
      handleFetchClick();
    }
  }

  function handleFetchClick(): void {
    if (validateLogin() && validateOrganization()) {
      props.updateCredentials(login, organization);
    }
  }

  return (
    <>
      <Card>
        <Card.Section title="Github user">
          <TextContainer>
            <TextField
              label="Organization"
              onChange={(value) => {
                setOrganization(value);
              }}
              onBlur={validateOrganization}
              autoComplete="off"
              placeholder="Shopify"
              error={organizationError}
              value={organization}
              requiredIndicator
            />
            <div onKeyDown={(event) => handleKeyPress(event)}>
              <TextField
                label="Login"
                onChange={(value) => {
                  setLogin(value);
                }}
                onBlur={validateLogin}
                autoComplete="off"
                placeholder="tobi"
                error={loginError}
                value={login}
                requiredIndicator
              />
            </div>
            <Button
              primary
              fullWidth
              onClick={handleFetchClick}
              loading={props.loading}
            >
              Fetch issues & pull requests
            </Button>
          </TextContainer>
        </Card.Section>
        <Card.Section title="Plotting date range">
          <Stack alignment="trailing" distribution="fillEvenly" spacing="loose">
            <Select
              label="Date time unit:"
              labelInline
              options={DateTimeUnitOptions}
              onChange={props.onDateTimeUnitChange}
              value={props.dateTimeUnit}
            />
            <DateRangePicker
              defaultInterval={props.defaultInterval}
              interval={props.interval}
              setInterval={props.setInterval}
            />
          </Stack>
        </Card.Section>
      </Card>
    </>
  );
}
