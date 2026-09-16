import { useState } from 'react';
import { Button, Modal, TextInput, Checkbox, Select, Card, Badge, Tabs } from './index';

export default function App() {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-8">
      <h1 className="text-2xl font-bold">@aaru/ui-kit demo</h1>

      <Card title="Sign up" subtitle="Quick local preview of the components">
        <div className="flex flex-col gap-4">
          <TextInput label="Name" placeholder="Aarica Raj" />
          <Select
            label="Track"
            placeholder="Choose a track"
            options={[
              { value: 'ml', label: 'Machine Learning' },
              { value: 'web', label: 'Web Development' },
            ]}
          />
          <Checkbox label="I agree to the terms" />
          <div className="flex gap-2">
            <Badge tone="brand">New</Badge>
            <Badge tone="success">Active</Badge>
          </div>
          <Tabs
            tabs={[
              { id: 'a', label: 'Overview', content: 'Overview content' },
              { id: 'b', label: 'Details', content: 'Details content' },
            ]}
          />
          <Button onClick={() => setModalOpen(true)}>Open modal</Button>
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Confirm signup"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setModalOpen(false)}>Confirm</Button>
          </>
        }
      >
        This is a preview of the Modal component with a footer.
      </Modal>
    </div>
  );
}
