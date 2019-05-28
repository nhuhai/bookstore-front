import React from 'react';
import { Modal, Form, Input } from 'antd';

const { Item } = Form;

class InvoiceForm extends React.Component {
  render() {
    const { visible, onCancel, onCreate, form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Modal
        visible={visible}
        title={'New Invoice'}
        okText={'Create'}
        cancelText={'Cancel'}
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form layout="vertical">
          <Item label="Name">
            {getFieldDecorator('name', {
              rules: [{
                required: true,
                message: 'Please input the name of the customer!',
              }]
            })(<Input />)}
          </Item>

          <Item label="Address">
            {getFieldDecorator('address')(<Input />)}
          </Item>

          <Item label="Phone">
            {getFieldDecorator('phone')(<Input />)}
          </Item>

          <Item label="Created By">
            {getFieldDecorator('createdBy', {
              rules: [{
                required: true,
              }]
            })(<Input />)}
          </Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: 'new_invoice_modal_form' })(InvoiceForm)
