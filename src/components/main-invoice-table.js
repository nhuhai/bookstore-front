import React from 'react';
import { Table } from 'antd';

export default class MainInvoiceTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: 'Tên',
        dataIndex: 'name',
        width: '30%',
      },
      {
        title: 'Trước Chiết Khấu',
        dataIndex: 'totalBeforeDiscount',
      },
      {
        title: 'Chiết Khấu',
        dataIndex: 'discountPercent',
      },
      {
        title: 'Sau Chiết Khấu',
        dataIndex: 'totalAfterDiscount',
      },
    ];
  }

  render() {
    const { currentInvoice } = this.props;
    const { subInvoices = [] } = currentInvoice;

    const dataSource = subInvoices.map((subInvoice, index) => {
      const { name, discountPercent, entries = [] } = subInvoice;
      const totalBeforeDiscount = entries.reduce((total, { quantity, price }) => {
        return total + quantity * price;
      }, 0);

      const totalAfterDiscount = totalBeforeDiscount * (1 - discountPercent/100);

      return {
        name: `${name} (${discountPercent}%)`,
        totalBeforeDiscount,
        discountPercent: `${discountPercent}%`,
        totalAfterDiscount,
        key: index,
      };
    })

    const finalTotal = dataSource.reduce((total, currentValue) => {
      return total + currentValue.totalAfterDiscount;
    }, 0)

    return (
      <div>
        <Table
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={this.columns}
          footer={() => (
            <div>
              <div>{`Final Total: ${finalTotal}`}</div>
            </div>
          )}
        />
      </div>
    );
  }
}
