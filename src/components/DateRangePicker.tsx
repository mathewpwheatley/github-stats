import React, {useCallback, useEffect, useState} from 'react';
import {DateTime, Interval} from 'luxon';
import {
  DatePicker,
  Modal,
  TextContainer,
  TextField,
  Stack,
  Button,
} from '@shopify/polaris';
import {ResetMinor} from '@shopify/polaris-icons';

export function DateRangePicker(props: {
  interval: Interval;
  setInterval: React.Dispatch<React.SetStateAction<Interval>>;
  defaultInterval: Interval;
}): JSX.Element {
  const [active, setActive] = useState(false);

  const toggleActive = useCallback(() => setActive(!active), [active]);

  // eslint-disable-next-line @typescript-eslint/no-extra-parens
  const activator: JSX.Element = (
    <Button onClick={toggleActive} fullWidth>
      Select date range
    </Button>
  );

  const [{month, year}, setDate] = useState({
    month: props.interval.start.month - 1,
    year: props.interval.start.year,
  });

  const [selectedDates, setSelectedDates] = useState({
    start: props.interval.start.toJSDate(),
    end: props.interval.end.toJSDate(),
  });

  const [textStartDate, setTextStartDate] = useState(
    props.interval.start.toISODate(),
  );
  const [textStartError, setTextStartError] = useState('');

  const [textEndDate, setTextEndDate] = useState(
    props.interval.end.toISODate(),
  );
  const [textEndError, setTextEndError] = useState('');

  const handleMonthChange = useCallback(
    (month: number, year: number) => setDate({month, year}),
    [],
  );

  useEffect(() => {
    setTextStartDate(DateTime.fromJSDate(selectedDates.start).toISODate());
    setTextStartError('');
    setTextEndDate(DateTime.fromJSDate(selectedDates.end).toISODate());
    setTextEndError('');
  }, [selectedDates]);

  function validateTextStartDate(): boolean {
    const current = DateTime.fromISO(textStartDate);
    if (!current.isValid) {
      setTextStartError('Invalid format, expected YYYY-MM-DD');
      return false;
    } else if (DateTime.fromISO(textEndDate) < current) {
      setTextEndError('Start date cannot be after end date');
      return false;
    }
    setTextStartError('');
    setSelectedDates({
      start: current.toJSDate(),
      end: selectedDates.end,
    });
    return true;
  }

  function validateTextEndDate(): boolean {
    const current = DateTime.fromISO(textEndDate);
    if (!current.isValid) {
      setTextEndError('Invalid format, expected YYYY-MM-DD');
      return false;
    } else if (current > DateTime.now()) {
      setTextEndError('End date cannot be in the future');
      return false;
    } else if (DateTime.fromISO(textStartDate) > current) {
      setTextEndError('End date cannot be before start date');
      return false;
    }
    setTextEndError('');
    setSelectedDates({
      start: selectedDates.start,
      end: current.toJSDate(),
    });
    return true;
  }

  function handleClose(): void {
    toggleActive();
    setDate({
      month: props.interval.start.month - 1,
      year: props.interval.start.year,
    });
    setSelectedDates({
      start: props.interval.start.toJSDate(),
      end: props.interval.end.toJSDate(),
    });
    setTextStartDate(props.interval.start.toISODate());
    setTextEndDate(props.interval.end.toISODate());
  }

  function handleAccept(): void {
    if (!validateTextStartDate() || !validateTextEndDate()) {
      return;
    }
    toggleActive();
    props.setInterval(
      Interval.fromDateTimes(selectedDates.start, selectedDates.end),
    );
  }

  function handleReset(): void {
    toggleActive();
    props.setInterval(props.defaultInterval);
    setDate({
      month: props.defaultInterval.start.month - 1,
      year: props.defaultInterval.start.year,
    });
    setSelectedDates({
      start: props.defaultInterval.start.toJSDate(),
      end: props.defaultInterval.end.toJSDate(),
    });
    setTextStartDate(props.defaultInterval.start.toISODate());
    setTextEndDate(props.defaultInterval.end.toISODate());
  }

  return (
    <Modal
      open={active}
      activator={activator}
      onClose={handleClose}
      title="Pick date range"
      primaryAction={{
        content: 'Accept',
        onAction: handleAccept,
      }}
      secondaryActions={[
        {
          content: 'Reset date range',
          onAction: handleReset,
          icon: ResetMinor,
        },
      ]}
      sectioned
    >
      <DatePicker
        month={month}
        year={year}
        onChange={setSelectedDates}
        onMonthChange={handleMonthChange}
        selected={selectedDates}
        multiMonth
        allowRange
        disableDatesAfter={DateTime.now().toJSDate()}
        weekStartsOn={1}
      />
      <TextContainer>
        <Stack alignment="trailing" distribution="fillEvenly" spacing="loose">
          <TextField
            label="Start date"
            autoComplete="false"
            error={textStartError}
            value={textStartDate}
            onChange={(start) => {
              setTextStartDate(start);
            }}
            onBlur={validateTextStartDate}
          />
          <TextField
            label="End date"
            autoComplete="false"
            error={textEndError}
            value={textEndDate}
            onChange={(end) => {
              setTextEndDate(end);
            }}
            onBlur={validateTextEndDate}
          />
        </Stack>
      </TextContainer>
    </Modal>
  );
}
