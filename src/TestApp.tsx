import React from 'react';
import { Container, Title, Button, Text } from '@mantine/core';

function TestApp(): React.JSX.Element {
  return (
    <Container size='md' py='xl'>
      <Title order={1} c='blue'>
        🎓 School Planner Test
      </Title>
      <Text>If you can see this, Mantine is working correctly!</Text>
      <Button mt='md'>Test Button</Button>
    </Container>
  );
}

export default TestApp;
