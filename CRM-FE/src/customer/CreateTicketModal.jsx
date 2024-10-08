import React, { useContext } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { ContextObj } from '../store/CRM_store';
import './CreateTicketModal.css';

const CreateTicketModal = ({ closeModal }) => {
  const { handleSubmitTicketCustomer } = useContext(ContextObj);

  return (
    <Modal show onHide={closeModal} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Create New Ticket</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmitTicketCustomer}>
          <Form.Group controlId="formTicketSubject">
            <Form.Label>Subject</Form.Label>
            <Form.Control type="text" name="subject" required placeholder="Enter ticket subject" />
          </Form.Group>
          <Form.Group controlId="formTicketDescription" className="mt-3">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" name="description" rows={3} required placeholder="Enter ticket description" />
          </Form.Group>
          <div className="mt-4 text-end">
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" className="ms-2">
              Create Ticket
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateTicketModal;
