Act as a developer and Read the 'AGENTS.MD' strictly and update the 'progress-tracker.md' after the goal is completed and no errors

# Spec 8 Goals
- in home page add empty outlined dashbox where label is add goal
- each goal display into grid and in the end of the grid list is have box add goal
- add goals read the project overview.md
- add a mutation to handle add goals


# Out of scope 
- delete, update


# Requirements 
- complete add goals and display 


# Extra Notes 
- use the reusable components from the components shadcn
- add modal from ant d import React, { useState } from 'react';
import { Button, Modal } from 'antd';

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Open Modal
      </Button>
      <Modal
        title="Basic Modal"
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </>
  );
};

export default App; for this input amount target and select date

and progress bar to track the progress from ant d import React from 'react';
import { Flex, Progress } from 'antd';

const App: React.FC = () => (
  <Flex wrap gap="small">
    <Progress type="circle" percent={30} size={80} />
    <Progress type="circle" percent={70} size={80} status="exception" />
    <Progress type="circle" percent={100} size={80} />
  </Flex>
);

export default App; 