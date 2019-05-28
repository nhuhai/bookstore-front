import React from 'react';
import { Table, Input, Button, Popconfirm, Form } from 'antd';

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = e => {
    const { record, handleSave, rowIndex } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values }, rowIndex);
    });
  };

  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title} is required.`,
            },
          ],
          initialValue: record[dataIndex],
        })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={this.toggleEdit}
      >
        {children}
      </div>
    );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      rowIndex,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}

export default class SubInvoiceTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: 'Tên',
        dataIndex: 'name',
        width: '30%',
        editable: true,
      },
      {
        title: 'Đơn Giá',
        dataIndex: 'price',
        editable: true,
      },
      {
        title: 'Số Lượng',
        dataIndex: 'quantity',
        editable: true,
      },
      {
        title: 'Tổng Cộng',
        dataIndex: 'subTotal',
        editable: false,
      },
      {
        title: 'operation',
        dataIndex: 'operation',
        render: (text, record) => {
          const { subInvoice } = this.props;
          const { entries = [] } = subInvoice;

          return entries.length >= 1 ? (
            <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
              <a href="javascript:;">Delete</a>
            </Popconfirm>
          ) : null;
        }
      },
    ];
  }

  handleDelete = key => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  };

  handleSave = (row, rowIndex) => {
    const { subInvoiceIndex, onSaveSubInvoiceRow } = this.props;

    onSaveSubInvoiceRow(subInvoiceIndex, row, rowIndex);
  };

  handleAdd = () => {
    const { subInvoiceIndex, onAddNewRowToSubInvoice } = this.props;
    const newRow = { name: 'New item', price: 0, quantity: 0 };

    onAddNewRowToSubInvoice(subInvoiceIndex, newRow);
  };

  render() {
    const { subInvoice } = this.props;
    const { entries = [], discountPercent } = subInvoice;

    const computedDataSource = entries.map((item, index)  => {
      return {
        ...item,
        subTotal: item.quantity * item.price,
        key: index,
      };
    });

    const totalBeforeDiscount = computedDataSource.reduce((total, currentValue) => {
      return total + currentValue.subTotal;
    }, 0)

    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record, rowIndex) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
          rowIndex,
        }),
      };
    });
    return (
      <div>
        <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
          Add a row
        </Button>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={computedDataSource}
          columns={columns}
          footer={() => (
            <div>
              <div>{`Total Before Discount: ${totalBeforeDiscount}`}</div>
              <div>{`Discount: ${discountPercent}%`}</div>
              <div>{`Total After Discount: ${totalBeforeDiscount * (1 - discountPercent/100)}`}</div>
            </div>
          )}
        />
      </div>
    );
  }
}
