import React from 'react';
import { Modal, Form, Input } from 'antd';

const { Item } = Form;

export default Form.create({
  name: 'new_sub_invoice_modal_form'
})(
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;

      return (
        <Modal
          visible={visible}
          title={'New Sub Invoice'}
          okText={'Create'}
          cancelText={'Cancel'}
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <Item label="Tên">
              {getFieldDecorator('name', {
                rules: [{
                  required: true,
                  message: 'Please input the name of the sub invoice!',
                }]
              })(<Input />)}
            </Item>

            <Item label="Chiết Khấu">
              {getFieldDecorator('discountPercent', {
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
)
