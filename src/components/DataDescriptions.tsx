import {Button, Modal, Text, TextContainer} from '@shopify/polaris';
import React, {useState, useCallback} from 'react';

export function DataDescriptions() {
  const [active, setActive] = useState(false);

  const handleChange = useCallback(() => setActive(!active), [active]);

  const activator = <Button onClick={handleChange}>Data descriptions</Button>;

  interface Description {
    title: React.ReactNode;
    description: React.ReactNode;
  }

  const descriptions: Description[] = [
    {
      title: 'Issues created',
      description:
        "Issue's author is the user login and the creation date is in the selected date range.",
    },
    {
      title: 'Issues closed',
      description:
        "Issue's assignees includes the user login and the closed date is in the selected date range.",
    },
    {
      title: 'Pull request created',
      description:
        "Pull request's author is the user login and the creation date is in the selected date range.",
    },
    {
      title: 'Pull request merged',
      description:
        "Pull request's author is the user login and the merged date is in the selected date range.",
    },
    {
      title: 'Pull request closed',
      description:
        "Pull request's author is the user login, the closed date is in the selected date range, and the merged date is null.",
    },
    {
      title: 'Pull request reviewed',
      description:
        "Pull request's author is not user login, the author of a review is the user login, and that review date is in the selected date range.",
    },
  ];

  return (
    <Modal
      activator={activator}
      open={active}
      onClose={handleChange}
      title="Data descriptions"
    >
      <Modal.Section>
        <TextContainer>
          {descriptions.map((description) => {
            return (
              <>
                <Text variant="headingMd" as="h3">
                  {description.title}
                </Text>
                <p>{description.description}</p>
                <br />
              </>
            );
          })}
        </TextContainer>
      </Modal.Section>
    </Modal>
  );
}
